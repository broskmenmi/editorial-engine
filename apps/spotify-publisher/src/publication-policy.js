import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function publicationTargets({ config, eventName, changedPaths = [], manualTarget }) {
  if (typeof config?.automaticPublishingEnabled !== 'boolean') {
    throw new Error('publication.json automaticPublishingEnabled must be a boolean');
  }
  const validTarget = /^playlists\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (eventName === 'workflow_dispatch') {
    if (!validTarget.test(manualTarget ?? '')) throw new Error('Invalid publication target');
    return [manualTarget];
  }
  if (eventName !== 'push') throw new Error('Unsupported publication event');
  if (!config.automaticPublishingEnabled) return [];
  const targets = changedPaths.flatMap(file => {
    const match = /^(playlists\/[a-z0-9]+(?:-[a-z0-9]+)*)\/(?:ledger\.md|spotify\.json|cover\.jpg\.base64)$/.exec(file);
    return match ? [match[1]] : [];
  });
  return [...new Set(targets)].sort();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const eventName = process.env.GITHUB_EVENT_NAME;
  const config = JSON.parse(fs.readFileSync('publication.json', 'utf8'));
  let changedPaths = [];
  if (eventName === 'push') {
    const before = process.env.PUSH_BEFORE;
    const after = process.env.GITHUB_SHA;
    if (!/^[a-f0-9]{40}$/.test(before ?? '') || /^0+$/.test(before)
      || !/^[a-f0-9]{40}$/.test(after ?? '')) throw new Error('Invalid push commit range');
    changedPaths = execFileSync('git', ['diff', '--name-only', '-z', before, after], { encoding: 'utf8' }).split('\0').filter(Boolean);
  }
  const targets = publicationTargets({ config, eventName, changedPaths, manualTarget: process.env.REQUESTED_PLAYLIST_DIR });
  for (const dir of targets) {
    for (const file of ['ledger.md', 'spotify.json']) {
      if (!fs.existsSync(dir + '/' + file)) throw new Error('Missing publication input: ' + dir + '/' + file);
    }
  }
  fs.appendFileSync(process.env.GITHUB_OUTPUT, 'targets=' + JSON.stringify(targets) + '\nhas_targets=' + (targets.length > 0) + '\n');
  console.log(JSON.stringify({ automaticPublishingEnabled: config.automaticPublishingEnabled, targets }));
}
