import test from 'node:test';
import assert from 'node:assert/strict';
import { publicationTargets } from '../src/publication-policy.js';
const enabled = { automaticPublishingEnabled: true };
const disabled = { automaticPublishingEnabled: false };
test('enabled publication routes only changed playlist inputs and deduplicates', () => {
  assert.deepEqual(publicationTargets({ config: enabled, eventName: 'push', changedPaths: [
    'playlists/strange-gait/ledger.md', 'playlists/strange-gait/spotify.json',
    'playlists/groove-over-noise/revisit.md', 'playlists/strange-gait/scout-request.json'
  ] }), ['playlists/strange-gait']);
});
test('disabled flag suppresses automatic publication even with ledger changes', () => {
  assert.deepEqual(publicationTargets({ config: disabled, eventName: 'push',
    changedPaths: ['playlists/strange-gait/ledger.md'] }), []);
});
test('explicit manual publication remains scoped and available while disabled', () => {
  assert.deepEqual(publicationTargets({ config: disabled, eventName: 'workflow_dispatch',
    manualTarget: 'playlists/groove-over-noise' }), ['playlists/groove-over-noise']);
});
test('two changed playlists each get one isolated target', () => {
  assert.deepEqual(publicationTargets({ config: enabled, eventName: 'push', changedPaths: [
    'playlists/strange-gait/ledger.md', 'playlists/groove-over-noise/cover.jpg.base64'
  ] }), ['playlists/groove-over-noise', 'playlists/strange-gait']);
});
test('flag, runtime, status, map and discovery changes do not republish music', () => {
  assert.deepEqual(publicationTargets({ config: enabled, eventName: 'push', changedPaths: [
    'publication.json', 'apps/spotify-publisher/src/index.js',
    'playlists/strange-gait/spotify-status.json', 'playlists/strange-gait/journey-map.json',
    'playlists/strange-gait/discoveries.md'
  ] }), []);
});
test('invalid flags and unsafe targets fail closed', () => {
  for (const config of [{}, { automaticPublishingEnabled: 'false' }, { automaticPublishingEnabled: null }])
    assert.throws(() => publicationTargets({ config, eventName: 'push' }), /boolean/);
  for (const manualTarget of [undefined, '../other', 'playlists/../other', 'playlists/strange-gait;echo bad'])
    assert.throws(() => publicationTargets({ config: enabled, eventName: 'workflow_dispatch', manualTarget }), /Invalid/);
});
