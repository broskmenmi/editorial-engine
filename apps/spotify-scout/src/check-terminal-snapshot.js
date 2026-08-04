import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { snapshotStateForRequest, validateRequest } from './index.js';

async function main() {
  const [requestPath, snapshotPath] = process.argv.slice(2);
  if (!requestPath || !snapshotPath) {
    throw new Error('Usage: node check-terminal-snapshot.js <request-json> <snapshot-json>');
  }

  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  let snapshot = null;
  try {
    snapshot = JSON.parse(await fs.readFile(snapshotPath, 'utf8'));
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  validateRequest(request);
  const state = snapshotStateForRequest(snapshot, request);
  console.log(state);
  if (state === 'MATCH') return;
  process.exitCode = state === 'ABSENT' ? 1 : 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 2;
  });
}
