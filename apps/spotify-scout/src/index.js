import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const API_BASE = 'https://api.spotify.com/v1';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const REQUEST = 'playlists/groove-over-noise/scout-request.json';
const OUTPUT = 'playlists/groove-over-noise/scout-data.json';
const CURRENT_SCHEMA_VERSION = 2;
const SPOTIFY_TRACK_ID = /^[A-Za-z0-9]{22}$/;
const SOURCE_PATHS = [
  'playlists/groove-over-noise/ledger.md',
  'playlists/groove-over-noise/rejected.md',
  'playlists/groove-over-noise/revisit.md',
  'playlists/groove-over-noise/discoveries.md',
];

export class SpotifyApiError extends Error {
  constructor(path, status, body) {
    super(`Spotify ${path} failed: ${status} ${JSON.stringify(body)}`);
    this.name = 'SpotifyApiError';
    this.path = path;
    this.status = status;
    this.body = body;
  }
}

export function identityLookupMiss(error, entity, id) {
  if (error instanceof SpotifyApiError && [400, 404].includes(error.status)) {
    return `supplied Spotify ${entity} ID was not found in market SE (${id})`;
  }
  throw error;
}

export function directTrackRelinkResult(track, requestedId) {
  if (track?.id === requestedId) return { warning: null };
  if (track?.linked_from?.id === requestedId) {
    return { warning: `Spotify relinked supplied track ID ${requestedId} to playable market-SE ID ${track.id}` };
  }
  return { error: `direct Spotify track ID substituted unexpectedly (${requestedId} → ${track?.id ?? 'unknown'})` };
}

export function persistentIdentityError(excluded, ...ids) {
  return ids.some((id) => id && excluded.has(id)) ? 'already present in persistent state' : null;
}

function idsFromText(text) {
  return new Set([...text.matchAll(/spotify:track:([A-Za-z0-9]{22})/g)].map((match) => match[1]));
}

export function persistentExclusions(mode, sourceTexts) {
  const paths = mode === 'REPAIR' ? [SOURCE_PATHS[0]] : SOURCE_PATHS;
  const excluded = new Set();

  for (const path of paths) {
    for (const id of idsFromText(sourceTexts[path] ?? '')) excluded.add(id);
  }

  return excluded;
}

export function normalized(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function requestFingerprint(request) {
  return createHash('sha256').update(canonicalJson(request)).digest('hex');
}

export function requestIdentity(requested) {
  return canonicalJson({
    artist: normalized(requested.artist),
    track: normalized(requested.track),
    album: normalized(requested.album),
    releaseDate: requested.releaseDate ?? null,
    spotifyTrackId: requested.spotifyTrackId ?? null,
    spotifyAlbumId: requested.spotifyAlbumId ?? null,
    bpm: requested.bpm ?? null,
    bpmSource: requested.bpmSource ?? null,
    discoverySource: requested.discoverySource ?? null,
    searchIntent: requested.searchIntent ?? null,
    proposedPlacements: requested.proposedPlacements ?? null,
    fitHypothesis: requested.fitHypothesis ?? null,
    evidence: requested.evidence ?? null,
  });
}

export function requestEntries(request) {
  return request.schemaVersion === CURRENT_SCHEMA_VERSION ? request.leads : request.candidates;
}

async function readJsonIfPresent(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function snapshotMatchesRequest(existing, request) {
  const requested = requestEntries(request);
  if (existing.schemaVersion !== (request.schemaVersion ?? 1)) return false;
  if (existing.requestFingerprint !== requestFingerprint(request)) return false;
  if ((existing.mode ?? 'REPAIR') !== (request.mode ?? 'REPAIR')) return false;
  if (JSON.stringify(existing.target ?? null) !== JSON.stringify(request.target ?? null)) return false;
  if (JSON.stringify(existing.explorationReceipt ?? null) !== JSON.stringify(request.explorationReceipt ?? null)) return false;
  if (!terminalSnapshotIsValid(existing, request)) return false;

  if (Array.isArray(existing.outcomes)) {
    if (existing.outcomes.length !== requested.length) return false;
    return requested.every((entry, index) => {
      const stored = existing.outcomes[index]?.requestedIdentity;
      return stored && requestIdentity(stored) === requestIdentity(entry);
    });
  }

  if (!Array.isArray(existing.candidates) || existing.candidates.length !== requested.length) return false;
  if (existing.resolvedCount !== requested.length) return false;

  return requested.every((entry, index) => {
    const stored = existing.candidates[index]?.requestedIdentity;
    return stored && requestIdentity(stored) === requestIdentity(entry);
  });
}

export function terminalSnapshotIsValid(existing, request) {
  const requested = requestEntries(request);
  if (!existing || !Array.isArray(requested)) return false;
  if (!['COMPLETE', 'PARTIAL', 'NONE'].includes(existing.resolutionStatus)) return false;
  if (!Array.isArray(existing.outcomes) || !Array.isArray(existing.unresolved)) return false;
  if (!Array.isArray(existing.candidates) || !Array.isArray(existing.resolvedAlternates)) return false;
  if (existing.requestedCount !== requested.length || existing.outcomes.length !== requested.length) return false;
  if (!Number.isInteger(existing.resolvedCount) || !Number.isInteger(existing.candidateCount)) return false;
  if (existing.candidateCount !== existing.candidates.length || existing.candidateCount > 3) return false;
  if (existing.resolvedCount !== existing.candidates.length + existing.resolvedAlternates.length) return false;
  if (existing.candidateCount !== Math.min(3, existing.resolvedCount)) return false;
  if (existing.unresolved.length !== existing.requestedCount - existing.resolvedCount) return false;

  const resolvedOutcomes = existing.outcomes.filter((outcome) => outcome?.status === 'RESOLVED');
  const unresolvedOutcomes = existing.outcomes.filter((outcome) => outcome?.status === 'UNRESOLVED');
  if (resolvedOutcomes.length !== existing.resolvedCount) return false;
  if (unresolvedOutcomes.length !== existing.unresolved.length) return false;
  if (resolvedOutcomes.some((outcome) => typeof outcome.selected !== 'boolean' || !outcome.spotifyTrackId)) return false;
  if (unresolvedOutcomes.some((outcome) => typeof outcome.error !== 'string' || outcome.error.length === 0)) return false;

  const candidateIds = existing.candidates.map((candidate) => candidate?.id);
  const alternateIds = existing.resolvedAlternates.map((candidate) => candidate?.id);
  const allResolvedIds = [...candidateIds, ...alternateIds];
  if (allResolvedIds.some((id) => typeof id !== 'string' || id.length === 0)) return false;
  if (new Set(allResolvedIds).size !== allResolvedIds.length) return false;

  const selectedOutcomes = resolvedOutcomes.filter((outcome) => outcome.selected);
  const alternateOutcomes = resolvedOutcomes.filter((outcome) => !outcome.selected);
  const selectedOutcomeIds = selectedOutcomes.map((outcome) => outcome.spotifyTrackId);
  const alternateOutcomeIds = alternateOutcomes.map((outcome) => outcome.spotifyTrackId);
  if (canonicalJson(selectedOutcomeIds) !== canonicalJson(candidateIds)) return false;
  if (canonicalJson(alternateOutcomeIds) !== canonicalJson(alternateIds)) return false;
  if (existing.candidates.some((candidate, index) => requestIdentity(candidate?.requestedIdentity ?? {}) !== requestIdentity(selectedOutcomes[index]?.requestedIdentity ?? {}))) return false;
  if (existing.resolvedAlternates.some((candidate, index) => requestIdentity(candidate?.requestedIdentity ?? {}) !== requestIdentity(alternateOutcomes[index]?.requestedIdentity ?? {}))) return false;
  if (existing.unresolved.some((failure, index) => failure?.error !== unresolvedOutcomes[index]?.error
    || requestIdentity(failure?.requestedIdentity ?? {}) !== requestIdentity(unresolvedOutcomes[index]?.requestedIdentity ?? {}))) return false;

  if (existing.resolutionStatus === 'NONE' && existing.resolvedCount !== 0) return false;
  if (existing.resolutionStatus === 'PARTIAL' && !(existing.resolvedCount > 0 && existing.resolvedCount < existing.requestedCount)) return false;
  if (existing.resolutionStatus === 'COMPLETE' && existing.resolvedCount !== existing.requestedCount) return false;
  return true;
}

export function snapshotStateForRequest(existing, request) {
  if (!existing || !request.runId || existing.runId !== request.runId) return 'ABSENT';
  return snapshotMatchesRequest(existing, request) ? 'MATCH' : 'CONFLICT';
}

export function validateRequest(request, { requireCurrentSchema = false } = {}) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new Error('scout-request.json must contain a JSON object');
  }
  if (typeof request.runId !== 'string' || request.runId.trim() === '') {
    throw new Error('scout-request.json must contain a non-empty runId');
  }

  const mode = request.mode ?? 'REPAIR';
  if (!['REPAIR', 'EXPLORE'].includes(mode)) {
    throw new Error('scout-request.json mode must be REPAIR or EXPLORE');
  }
  if (mode === 'EXPLORE' && (!request.explorationReceipt || typeof request.explorationReceipt !== 'object')) {
    throw new Error('EXPLORE scout-request.json must contain explorationReceipt');
  }
  if (request.schemaVersion !== undefined && request.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(`Unsupported scout-request.json schemaVersion ${request.schemaVersion}`);
  }
  if (requireCurrentSchema && request.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(`New scout requests must use schemaVersion ${CURRENT_SCHEMA_VERSION}`);
  }

  if (request.schemaVersion === CURRENT_SCHEMA_VERSION) {
    if (!Array.isArray(request.leads) || request.leads.length < 1 || request.leads.length > 9) {
      throw new Error('schemaVersion 2 scout-request.json must contain one to nine ranked leads');
    }
    if (!/^[0-9a-f]{40}$/.test(request.sourceCommit ?? '')) {
      throw new Error('schemaVersion 2 scout-request.json must contain a 40-character sourceCommit');
    }
    if (request.candidates !== undefined) {
      throw new Error('schemaVersion 2 uses leads; candidates are created only in scout-data.json');
    }
    if ((request.recoveryOfRunId !== undefined || request.recoveryReason !== undefined)
      && (typeof request.recoveryOfRunId !== 'string' || request.recoveryOfRunId.trim() === ''
        || request.recoveryOfRunId === request.runId
        || typeof request.recoveryReason !== 'string' || request.recoveryReason.trim() === '')) {
      throw new Error('A recovery request must name a different recoveryOfRunId and a non-empty recoveryReason');
    }
    if (request.legacySalvage !== undefined) {
      if (!request.recoveryOfRunId || !request.legacySalvage || typeof request.legacySalvage !== 'object'
        || typeof request.legacySalvage.reason !== 'string' || request.legacySalvage.reason.trim() === ''
        || !Array.isArray(request.legacySalvage.sourceCommits)
        || request.legacySalvage.sourceCommits.length < 2
        || request.legacySalvage.sourceCommits.some((commit) => !/^[0-9a-f]{40}$/.test(commit))
        || new Set(request.legacySalvage.sourceCommits).size !== request.legacySalvage.sourceCommits.length) {
        throw new Error('legacySalvage requires a recovery, a reason, and at least two unique 40-character sourceCommits');
      }
    }
    request.leads.forEach((lead, index) => {
      if (typeof lead?.artist !== 'string' || lead.artist.trim() === '') {
        throw new Error(`Lead ${index + 1} must contain an artist`);
      }
      if (typeof lead?.track !== 'string' || lead.track.trim() === '') {
        throw new Error(`Lead ${index + 1} must contain a track`);
      }
      if (typeof lead?.discoverySource !== 'string' || lead.discoverySource.trim() === '') {
        throw new Error(`Lead ${index + 1} must contain a discoverySource`);
      }
      if (!['BELONGING', 'NEIGHBOUR', 'BOTH'].includes(lead?.searchIntent)) {
        throw new Error(`Lead ${index + 1} searchIntent must be BELONGING, NEIGHBOUR, or BOTH`);
      }
      if (!Array.isArray(lead?.proposedPlacements) || lead.proposedPlacements.length < 1
        || lead.proposedPlacements.some((placement) => typeof placement?.position !== 'string' || placement.position.trim() === '')) {
        throw new Error(`Lead ${index + 1} must contain at least one concrete proposed placement`);
      }
      if (typeof lead?.fitHypothesis !== 'string' || lead.fitHypothesis.trim() === '') {
        throw new Error(`Lead ${index + 1} must contain a fitHypothesis`);
      }
      if (!lead?.evidence || typeof lead.evidence !== 'object' || Array.isArray(lead.evidence)
        || !Array.isArray(lead.evidence.measured)
        || !Object.hasOwn(lead.evidence, 'attributedDescription')
        || !Object.hasOwn(lead.evidence, 'listenerEvidence')
        || !Object.hasOwn(lead.evidence, 'lawfulAudioEvidence')) {
        throw new Error(`Lead ${index + 1} must preserve separated evidence fields`);
      }
      if (lead.spotifyTrackId != null && !SPOTIFY_TRACK_ID.test(lead.spotifyTrackId)) {
        throw new Error(`Lead ${index + 1} spotifyTrackId must contain exactly 22 base62 characters`);
      }
      if (lead.spotifyAlbumId != null && !SPOTIFY_TRACK_ID.test(lead.spotifyAlbumId)) {
        throw new Error(`Lead ${index + 1} spotifyAlbumId must contain exactly 22 base62 characters`);
      }
    });
  } else if (!Array.isArray(request.candidates) || request.candidates.length < 1 || request.candidates.length > 3) {
    throw new Error('Legacy scout-request.json must contain one to three candidates');
  }

  return { mode, schemaVersion: request.schemaVersion ?? 1 };
}

async function refreshToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
      client_id: process.env.SPOTIFY_CLIENT_ID,
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.access_token) {
    throw new Error(`Spotify token refresh failed: ${response.status} ${JSON.stringify(body)}`);
  }
  return body.access_token;
}

async function spotifyGet(token, path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!response.ok) throw new SpotifyApiError(path, response.status, body);
  return body;
}

export function identityMatches(item, request) {
  const wantedTrack = normalized(request.track);
  const wantedArtist = normalized(request.artist);
  const title = normalized(item?.name);
  const titleMatch = title === wantedTrack;
  const artistMatch = (item?.artists ?? []).some((artist) => normalized(artist.name) === wantedArtist);
  return Boolean(item?.id && titleMatch && artistMatch);
}

export function releaseMatches(item, request) {
  if (request.album && normalized(item?.album?.name) !== normalized(request.album)) return false;
  if (request.releaseDate && item?.album?.release_date !== request.releaseDate) return false;
  return true;
}

export function releaseMismatchWarning(item, request) {
  const mismatches = [];
  if (request.album && normalized(item?.album?.name) !== normalized(request.album)) {
    mismatches.push(`album requested "${request.album}" but Spotify returned "${item?.album?.name ?? 'unknown'}"`);
  }
  if (request.releaseDate && item?.album?.release_date !== request.releaseDate) {
    mismatches.push(`release date requested "${request.releaseDate}" but Spotify returned "${item?.album?.release_date ?? 'unknown'}"`);
  }
  return mismatches.length > 0 ? `Exact title/artist matched with release metadata variance: ${mismatches.join('; ')}` : null;
}

function candidateRecord(track, requested, album = null) {
  return {
    id: track.id,
    uri: track.uri ?? `spotify:track:${track.id}`,
    name: track.name,
    artists: (track.artists ?? []).map((artist) => artist.name),
    album: track.album?.name ?? album?.name ?? requested.album ?? null,
    releaseDate: track.album?.release_date ?? album?.release_date ?? null,
    durationMs: track.duration_ms ?? null,
    spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
    bpm: requested.bpm,
    tempoSource: requested.bpmSource,
    discoverySource: requested.discoverySource,
    searchIntent: requested.searchIntent ?? null,
    proposedPlacements: requested.proposedPlacements ?? [],
    fitHypothesis: requested.fitHypothesis ?? null,
    evidence: requested.evidence ?? null,
    requestedIdentity: requested,
  };
}

async function searchSpotifyTracks(token, query) {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    market: 'SE',
    limit: '10',
  });
  const result = await spotifyGet(token, `/search?${params.toString()}`);
  return result?.tracks?.items ?? [];
}

async function searchExactTrack(token, requested) {
  const queries = [
    `track:"${requested.track}" artist:"${requested.artist}"`,
    `${requested.track} ${requested.artist}`,
    `track:${requested.track} artist:${requested.artist}`,
  ];
  const identityMatchesOnly = [];
  for (const query of queries) {
    const items = await searchSpotifyTracks(token, query);
    identityMatchesOnly.push(...items.filter((item) => identityMatches(item, requested)));
  }
  const unique = [...new Map(identityMatchesOnly.map((item) => [item.id, item])).values()];
  if (unique.length === 0) return { error: 'no exact Spotify title/artist search match in market SE' };

  const releaseMatched = unique.filter((item) => releaseMatches(item, requested));
  if (releaseMatched.length === 1) return { track: releaseMatched[0] };
  if (releaseMatched.length > 1) {
    return { error: `ambiguous exact Spotify release match (${releaseMatched.map((item) => item.id).join(', ')})` };
  }

  if (unique.length === 1) {
    return { track: unique[0], warning: releaseMismatchWarning(unique[0], requested) };
  }

  return {
    error: `ambiguous exact Spotify title/artist match; requested release metadata did not disambiguate (${unique.map((item) => item.id).join(', ')})`,
  };
}

async function resolveRequestedTrack(token, requested, excluded) {
  if (requested.spotifyTrackId) {
    const id = requested.spotifyTrackId;
    const existingIdentityError = persistentIdentityError(excluded, id);
    if (existingIdentityError) return { error: existingIdentityError };
    try {
      const track = await spotifyGet(token, `/tracks/${id}?market=SE`);
      if (!identityMatches(track, requested)) {
        return { error: 'direct Spotify track identity mismatch' };
      }
      const warnings = [];
      const relink = directTrackRelinkResult(track, id);
      if (relink.error) return { error: relink.error };
      if (relink.warning) warnings.push(relink.warning);
      const relinkedIdentityError = persistentIdentityError(excluded, track.id);
      if (relinkedIdentityError) return { error: relinkedIdentityError };
      const releaseWarning = releaseMismatchWarning(track, requested);
      if (releaseWarning) warnings.push(releaseWarning);
      return { track: candidateRecord(track, requested), warning: warnings.length > 0 ? warnings.join('; ') : null };
    } catch (error) {
      return { error: identityLookupMiss(error, 'track', id) };
    }
  }

  if (requested.spotifyAlbumId) {
    try {
      const album = await spotifyGet(token, `/albums/${requested.spotifyAlbumId}?market=SE`);
      const track = (album?.tracks?.items ?? []).find((item) => identityMatches(item, requested));
      if (!track) return { error: 'exact track not found on supplied Spotify album' };
      const existingIdentityError = persistentIdentityError(excluded, track.id);
      if (existingIdentityError) return { error: existingIdentityError };
      const releaseItem = { ...track, album };
      return {
        track: candidateRecord(track, requested, album),
        warning: releaseMismatchWarning(releaseItem, requested),
      };
    } catch (error) {
      return { error: identityLookupMiss(error, 'album', requested.spotifyAlbumId) };
    }
  }

  const result = await searchExactTrack(token, requested);
  if (!result.track) return { error: result.error };
  const existingIdentityError = persistentIdentityError(excluded, result.track.id);
  if (existingIdentityError) return { error: existingIdentityError };
  return { track: candidateRecord(result.track, requested), warning: result.warning };
}

export function recordResolution({ requested, result, resolved, resolvedIds, unresolved, warnings, outcomes }) {
  if (result.track && resolvedIds.has(result.track.id)) {
    const error = `duplicate Spotify identity already resolved from a higher-ranked lead (${result.track.id})`;
    const failure = { artist: requested.artist, track: requested.track, error, requestedIdentity: requested };
    unresolved.push(failure);
    outcomes.push({ status: 'UNRESOLVED', requestedIdentity: requested, error });
  } else if (result.track) {
    resolvedIds.add(result.track.id);
    resolved.push(result.track);
    outcomes.push({ status: 'RESOLVED', requestedIdentity: requested, spotifyTrackId: result.track.id });
  } else {
    const failure = { artist: requested.artist, track: requested.track, error: result.error, requestedIdentity: requested };
    unresolved.push(failure);
    outcomes.push({ status: 'UNRESOLVED', requestedIdentity: requested, error: result.error });
  }

  if (result.warning) warnings.push({ artist: requested.artist, track: requested.track, warning: result.warning });
}

export function buildSnapshot({ request, mode, candidates, resolvedAlternates, unresolved, warnings, outcomes }) {
  const requested = requestEntries(request);
  const resolvedCount = candidates.length + resolvedAlternates.length;
  const resolutionStatus = candidates.length === 0
    ? 'NONE'
    : resolvedCount === requested.length
      ? 'COMPLETE'
      : 'PARTIAL';

  return {
    schemaVersion: request.schemaVersion ?? 1,
    requestFingerprint: requestFingerprint(request),
    generatedAt: new Date().toISOString(),
    runId: request.runId,
    sourceCommit: request.sourceCommit ?? null,
    mode,
    target: request.target,
    explorationReceipt: request.explorationReceipt ?? null,
    source: request.schemaVersion === CURRENT_SCHEMA_VERSION
      ? 'Exact Spotify identity verified from a supplied public track ID or one unambiguous exact Spotify search match; BPM from the declared external source.'
      : 'Legacy request: exact Spotify identity from supplied public IDs, album metadata, or one unambiguous exact Spotify search match; BPM from the declared external source.',
    requestedCount: requested.length,
    resolvedCount,
    candidateCount: candidates.length,
    resolutionStatus,
    unresolved,
    warnings,
    outcomes,
    candidates,
    resolvedAlternates,
  };
}

export async function main() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Missing Spotify credentials');
  }

  const request = JSON.parse(await fs.readFile(REQUEST, 'utf8'));
  const { mode } = validateRequest(request);
  const requestedEntries = requestEntries(request);

  const existing = await readJsonIfPresent(OUTPUT);
  const snapshotState = snapshotStateForRequest(existing, request);
  if (snapshotState === 'MATCH') {
    console.log(`Preserving terminal ${existing.resolutionStatus} ${existing.candidateCount ?? existing.resolvedCount}/${requestedEntries.length} scout snapshot for run ${request.runId}`);
    return;
  }
  if (snapshotState === 'CONFLICT') {
    throw new Error(`runId ${request.runId} already has a different immutable terminal snapshot; create a new runId`);
  }

  const sourceEntries = await Promise.all(SOURCE_PATHS.map(async (filePath) => (
    [filePath, await fs.readFile(filePath, 'utf8')]
  )));
  const excluded = persistentExclusions(mode, Object.fromEntries(sourceEntries));

  const token = await refreshToken();
  const resolved = [];
  const resolvedIds = new Set();
  const unresolved = [];
  const warnings = [];
  const outcomes = [];

  for (const requested of requestedEntries) {
    const result = await resolveRequestedTrack(token, requested, excluded);
    recordResolution({ requested, result, resolved, resolvedIds, unresolved, warnings, outcomes });
  }

  const candidates = resolved.slice(0, 3);
  const resolvedAlternates = resolved.slice(3);
  const selectedIds = new Set(candidates.map((candidate) => candidate.id));
  for (const outcome of outcomes) {
    if (outcome.status === 'RESOLVED') outcome.selected = selectedIds.has(outcome.spotifyTrackId);
  }

  const output = buildSnapshot({ request, mode, candidates, resolvedAlternates, unresolved, warnings, outcomes });

  await fs.writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`${output.resolutionStatus}: selected ${candidates.length} exact candidates from ${requestedEntries.length} ranked leads (${resolved.length} resolved)`);
  if (output.resolutionStatus === 'NONE') {
    console.log(`Terminal unresolved identities: ${JSON.stringify(unresolved)}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
