import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { validateProposedPlacements, validateRequest } from './index.js';

export async function validateDraftFiles(requestPath, ledgerPath) {
  const [requestText, ledgerText] = await Promise.all([
    fs.readFile(requestPath, 'utf8'),
    fs.readFile(ledgerPath, 'utf8'),
  ]);
  const request = JSON.parse(requestText);

  validateRequest(request, { requireCurrentSchema: true });
  validateProposedPlacements(request, ledgerText);

  return {
    runId: request.runId,
    leadCount: request.leads.length,
    placementCount: request.leads.reduce(
      (count, lead) => count + lead.proposedPlacements.length,
      0,
    ),
  };
}

export async function main(argv = process.argv.slice(2)) {
  const [requestPath, ledgerPath, ...extra] = argv;
  if (!requestPath || !ledgerPath || extra.length > 0) {
    throw new Error(
      'Usage: node apps/spotify-scout/src/validate-proposed-placements.js <draft-request.json> <ledger.md>',
    );
  }

  const result = await validateDraftFiles(requestPath, ledgerPath);
  console.log(
    `Validated ${result.placementCount} proposed placements across ${result.leadCount} leads for ${result.runId}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
