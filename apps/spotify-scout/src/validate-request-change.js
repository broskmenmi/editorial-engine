import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { canonicalJson, validateRequest } from './index.js';

export function validateRequestChange(previous, current) {
  if (previous && previous.runId === current.runId) {
    const previousContent = canonicalJson(previous);
    const currentContent = canonicalJson(current);
    if (previousContent !== currentContent) {
      throw new Error(`Immutable scout runId ${current.runId} was reused with changed content; create a new runId`);
    }
  }

  validateRequest(current, { requireCurrentSchema: true });
}

async function main() {
  const [previousPath, currentPath] = process.argv.slice(2);
  if (!currentPath) {
    throw new Error('Usage: node validate-request-change.js <previous-json-or-> <current-json>');
  }

  const previous = previousPath === '-'
    ? null
    : JSON.parse(await fs.readFile(previousPath, 'utf8'));
  const current = JSON.parse(await fs.readFile(currentPath, 'utf8'));
  validateRequestChange(previous, current);
  console.log(`Validated immutable schemaVersion ${current.schemaVersion} scout request ${current.runId}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
