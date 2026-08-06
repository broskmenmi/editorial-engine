import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildSnapshot,
  directTrackRelinkResult,
  identityMatches,
  identityLookupMiss,
  persistentExclusions,
  persistentIdentityError,
  releaseMismatchWarning,
  recordResolution,
  snapshotStateForRequest,
  SpotifyApiError,
  validateRequest,
} from '../src/index.js';
import { validateRequestChange } from '../src/validate-request-change.js';
import { validateRequestHistory } from '../src/validate-request-history.js';

function lead(overrides = {}) {
  return {
    artist: 'Example Artist',
    track: 'Example Track',
    discoverySource: 'https://example.com/release',
    searchIntent: 'BELONGING',
    proposedPlacements: [{ position: 'after Example One and before Example Two' }],
    fitHypothesis: 'A sourced hypothesis.',
    evidence: {
      measured: [],
      attributedDescription: null,
      listenerEvidence: null,
      lawfulAudioEvidence: null,
    },
    ...overrides,
  };
}

function request(overrides = {}) {
  return {
    schemaVersion: 2,
    runId: '2026-08-04T12:00:00Z-explore',
    sourceCommit: '973338f33568c99176a4c75fa09617b9bbd27e61',
    mode: 'EXPLORE',
    target: { purpose: 'test' },
    explorationReceipt: { timestamp: '2026-08-04T12:00:00Z' },
    leads: [lead()],
    ...overrides,
  };
}

test('schemaVersion 2 distinguishes ranked leads from resolved candidates', () => {
  assert.doesNotThrow(() => validateRequest(request(), { requireCurrentSchema: true }));
  assert.throws(
    () => validateRequest(request({ leads: undefined, candidates: [lead()] }), { requireCurrentSchema: true }),
    /ranked leads/,
  );
});

test('optional direct Spotify IDs must be exact base62 track IDs', () => {
  assert.doesNotThrow(() => validateRequest(request({ leads: [lead({ spotifyTrackId: '0lbeEcQXDMou9NkShtfz9w' })] })));
  assert.throws(() => validateRequest(request({ leads: [lead({ spotifyTrackId: 'too-short' })] })), /22 base62/);
});

test('identity matching does not silently substitute a remix or alternate version', () => {
  const requested = lead();
  const exact = { id: '123', name: 'Example Track', artists: [{ name: 'Example Artist' }] };
  const remix = { id: '456', name: 'Example Track - Remix', artists: [{ name: 'Example Artist' }] };
  assert.equal(identityMatches(exact, requested), true);
  assert.equal(identityMatches(remix, requested), false);
});

test('release metadata variance is preserved as a warning after exact identity match', () => {
  const warning = releaseMismatchWarning(
    { album: { name: 'Hermanas, Pt. 4', release_date: '2026-07-31' } },
    { album: 'Lady Tazz presents Hermanas (Part Four)', releaseDate: '2026-07-31' },
  );
  assert.match(warning, /release metadata variance/);
  assert.match(warning, /album requested/);
});

test('operational Spotify errors propagate instead of becoming identity misses', () => {
  const notFound = new SpotifyApiError('/tracks/missing', 404, { error: 'not found' });
  assert.match(identityLookupMiss(notFound, 'track', 'missing'), /was not found/);
  const rateLimited = new SpotifyApiError('/search', 429, { error: 'rate limited' });
  assert.throws(() => identityLookupMiss(rateLimited, 'track', 'x'), /429/);
  const unavailable = new SpotifyApiError('/search', 503, { error: 'unavailable' });
  assert.throws(() => identityLookupMiss(unavailable, 'track', 'x'), /503/);
});

test('Spotify market relinking is explicit and unrelated substitution is rejected', () => {
  assert.match(
    directTrackRelinkResult({ id: 'new', linked_from: { id: 'old' } }, 'old').warning,
    /relinked/,
  );
  assert.match(directTrackRelinkResult({ id: 'other' }, 'old').error, /substituted unexpectedly/);
  assert.equal(persistentIdentityError(new Set(['new']), 'new'), 'already present in persistent state');
});

test('REPAIR may reopen non-ledger persistent identities while EXPLORE may not', () => {
  const sources = {
    'playlists/groove-over-noise/ledger.md': 'spotify:track:1111111111111111111111',
    'playlists/groove-over-noise/rejected.md': 'spotify:track:2222222222222222222222',
    'playlists/groove-over-noise/revisit.md': 'spotify:track:3333333333333333333333',
    'playlists/groove-over-noise/discoveries.md': 'spotify:track:4444444444444444444444',
  };

  const repair = persistentExclusions('REPAIR', sources);
  assert.equal(persistentIdentityError(repair, '1111111111111111111111'), 'already present in persistent state');
  assert.equal(persistentIdentityError(repair, '2222222222222222222222'), null);
  assert.equal(persistentIdentityError(repair, '3333333333333333333333'), null);
  assert.equal(persistentIdentityError(repair, '4444444444444444444444'), null);

  const explore = persistentExclusions('EXPLORE', sources);
  assert.equal(persistentIdentityError(explore, '1111111111111111111111'), 'already present in persistent state');
  assert.equal(persistentIdentityError(explore, '2222222222222222222222'), 'already present in persistent state');
  assert.equal(persistentIdentityError(explore, '3333333333333333333333'), 'already present in persistent state');
  assert.equal(persistentIdentityError(explore, '4444444444444444444444'), 'already present in persistent state');
});

test('duplicate resolved identities cannot occupy multiple candidate slots', () => {
  const resolved = [];
  const resolvedIds = new Set();
  const unresolved = [];
  const warnings = [];
  const outcomes = [];
  const first = lead({ track: 'First spelling' });
  const duplicate = lead({ track: 'Second spelling' });
  const track = { id: 'same-id' };

  recordResolution({ requested: first, result: { track }, resolved, resolvedIds, unresolved, warnings, outcomes });
  recordResolution({ requested: duplicate, result: { track }, resolved, resolvedIds, unresolved, warnings, outcomes });

  assert.equal(resolved.length, 1);
  assert.equal(unresolved.length, 1);
  assert.match(unresolved[0].error, /higher-ranked lead/);
});

test('zero resolved leads produce a matching terminal NONE snapshot', () => {
  const current = request();
  const unresolved = [{
    artist: 'Example Artist',
    track: 'Example Track',
    error: 'no exact Spotify search match',
    requestedIdentity: current.leads[0],
  }];
  const outcomes = [{ status: 'UNRESOLVED', requestedIdentity: current.leads[0], error: unresolved[0].error }];
  const snapshot = buildSnapshot({
    request: current,
    mode: 'EXPLORE',
    candidates: [],
    resolvedAlternates: [],
    unresolved,
    warnings: [],
    outcomes,
  });

  assert.equal(snapshot.resolutionStatus, 'NONE');
  assert.equal(snapshot.candidateCount, 0);
  assert.deepEqual(snapshot.candidates, []);
  assert.equal(snapshotStateForRequest(snapshot, current), 'MATCH');
});

test('resolved lead pools select at most three candidates and preserve alternates', () => {
  const current = request({
    leads: [lead({ track: 'One' }), lead({ track: 'Two' }), lead({ track: 'Three' }), lead({ track: 'Four' })],
  });
  const candidates = current.leads.slice(0, 3).map((entry, index) => ({ id: `candidate-${index}`, requestedIdentity: entry }));
  const resolvedAlternates = [{ id: 'alternate-3', requestedIdentity: current.leads[3] }];
  const outcomes = current.leads.map((entry, index) => ({
    status: 'RESOLVED',
    selected: index < 3,
    spotifyTrackId: index < 3 ? `candidate-${index}` : 'alternate-3',
    requestedIdentity: entry,
  }));
  const snapshot = buildSnapshot({
    request: current,
    mode: 'EXPLORE',
    candidates,
    resolvedAlternates,
    unresolved: [],
    warnings: [],
    outcomes,
  });

  assert.equal(snapshot.resolutionStatus, 'COMPLETE');
  assert.equal(snapshot.resolvedCount, 4);
  assert.equal(snapshot.candidateCount, 3);
  assert.equal(snapshot.resolvedAlternates.length, 1);
  assert.equal(snapshotStateForRequest(snapshot, current), 'MATCH');
});

test('a partial snapshot preserves a selected candidate and unresolved lead', () => {
  const current = request({ leads: [lead({ track: 'Resolved' }), lead({ track: 'Missing' })] });
  const snapshot = buildSnapshot({
    request: current,
    mode: 'EXPLORE',
    candidates: [{ id: 'resolved', requestedIdentity: current.leads[0] }],
    resolvedAlternates: [],
    unresolved: [{
      artist: 'Example Artist',
      track: 'Missing',
      error: 'no exact Spotify search match',
      requestedIdentity: current.leads[1],
    }],
    warnings: [],
    outcomes: [
      { status: 'RESOLVED', selected: true, spotifyTrackId: 'resolved', requestedIdentity: current.leads[0] },
      { status: 'UNRESOLVED', requestedIdentity: current.leads[1], error: 'no exact Spotify search match' },
    ],
  });

  assert.equal(snapshot.resolutionStatus, 'PARTIAL');
  assert.equal(snapshot.candidateCount, 1);
  assert.equal(snapshot.unresolved.length, 1);
  assert.equal(snapshotStateForRequest(snapshot, current), 'MATCH');
});

test('a changed request cannot reuse an immutable runId', () => {
  const previous = request();
  const changed = request({ target: { purpose: 'changed' } });
  assert.throws(() => validateRequestChange(previous, changed), /Immutable scout runId/);
  assert.equal(snapshotStateForRequest(
    buildSnapshot({
      request: previous,
      mode: 'EXPLORE',
      candidates: [],
      resolvedAlternates: [],
      unresolved: [{
        artist: previous.leads[0].artist,
        track: previous.leads[0].track,
        error: 'x',
        requestedIdentity: previous.leads[0],
      }],
      warnings: [],
      outcomes: [{ status: 'UNRESOLVED', requestedIdentity: previous.leads[0], error: 'x' }],
    }),
    changed,
  ), 'CONFLICT');
});

test('property-order-only changes preserve immutable request semantics', () => {
  const previous = request();
  const reordered = {
    leads: previous.leads.map((entry) => ({ track: entry.track, artist: entry.artist, ...entry })),
    explorationReceipt: previous.explorationReceipt,
    target: previous.target,
    mode: previous.mode,
    sourceCommit: previous.sourceCommit,
    runId: previous.runId,
    schemaVersion: previous.schemaVersion,
  };
  assert.doesNotThrow(() => validateRequestChange(previous, reordered));
});

test('historical non-adjacent runId mutation is rejected', () => {
  const current = request();
  const historical = request({ target: { purpose: 'older conflicting purpose' } });
  assert.throws(() => validateRequestHistory(current, [historical]), /conflicting content in repository history/);
});

test('an identical historical runId cannot be reintroduced after another run', () => {
  const current = request();
  const intervening = request({ runId: '2026-08-04T12:30:00Z-explore' });
  assert.throws(
    () => validateRequestHistory(current, [current, intervening, current]),
    /reintroduced after another run/,
  );
});

test('a recovery request preserves the failed run and cites its exact commit', () => {
  const failed = request({ runId: '2026-08-04T11:00:00Z-explore' });
  const recovery = request({
    runId: '2026-08-04T12:00:00Z-explore-recovery',
    recoveryOfRunId: failed.runId,
    recoveryReason: 'Complete identity resolution without claiming another scan.',
  });
  assert.doesNotThrow(() => validateRequestHistory(recovery, [{ commit: recovery.sourceCommit, request: failed }]));
  assert.throws(
    () => validateRequestHistory({ ...recovery, target: { purpose: 'changed' } }, [{ commit: recovery.sourceCommit, request: failed }]),
    /preserve the source run/,
  );
});

test('recovery from a mutated source requires an exhaustive legacy salvage record', () => {
  const newestCommit = '973338f33568c99176a4c75fa09617b9bbd27e61';
  const olderCommit = 'a25c567b1f2fd8d85c8eae95dfd859379348a384';
  const failed = request({ runId: '2026-08-04T11:00:00Z-explore', sourceCommit: newestCommit });
  const older = { ...failed, target: { purpose: 'older purpose' } };
  const recovery = request({
    runId: '2026-08-04T12:00:00Z-explore-recovery',
    sourceCommit: newestCommit,
    recoveryOfRunId: failed.runId,
    recoveryReason: 'Complete identity resolution without claiming another scan.',
  });
  const history = [
    { commit: newestCommit, request: failed },
    { commit: olderCommit, request: older },
  ];

  assert.throws(() => validateRequestHistory(recovery, history), /legacySalvage must enumerate/);
  assert.doesNotThrow(() => validateRequestHistory({
    ...recovery,
    legacySalvage: {
      reason: 'Explicitly account for the pre-enforcement mutation.',
      sourceCommits: [olderCommit, newestCommit],
    },
  }, history, { isLegacyCommitAllowed: () => true }));
  assert.throws(() => validateRequestHistory({
    ...recovery,
    legacySalvage: {
      reason: 'Attempt to salvage a post-enforcement mutation.',
      sourceCommits: [olderCommit, newestCommit],
    },
  }, history), /restricted to source commits/);
});

test('malformed terminal snapshots are rejected even when request identities match', () => {
  const current = request();
  const valid = buildSnapshot({
    request: current,
    mode: 'EXPLORE',
    candidates: [],
    resolvedAlternates: [],
    unresolved: [{ artist: 'Example Artist', track: 'Example Track', error: 'missing', requestedIdentity: current.leads[0] }],
    warnings: [],
    outcomes: [{ status: 'UNRESOLVED', requestedIdentity: current.leads[0], error: 'missing' }],
  });
  const corrupt = { ...valid, resolutionStatus: 'COMPLETE', resolvedCount: 99, candidateCount: 99 };
  assert.equal(snapshotStateForRequest(corrupt, current), 'CONFLICT');

  const resolvedOnlyAsAlternate = buildSnapshot({
    request: current,
    mode: 'EXPLORE',
    candidates: [],
    resolvedAlternates: [{ id: 'hidden-alternate', requestedIdentity: current.leads[0] }],
    unresolved: [],
    warnings: [],
    outcomes: [{
      status: 'RESOLVED',
      selected: false,
      spotifyTrackId: 'hidden-alternate',
      requestedIdentity: current.leads[0],
    }],
  });
  assert.equal(snapshotStateForRequest(resolvedOnlyAsAlternate, current), 'CONFLICT');
});
