import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { canonicalJson, validateRequest } from './index.js';

function normalizedRecoveryReceipt(receipt) {
  if (!receipt || typeof receipt !== 'object') return receipt;
  const normalized = structuredClone(receipt);
  if (normalized.shortlist !== undefined && normalized.rankedResolutionLeads === undefined) {
    normalized.rankedResolutionLeads = normalized.shortlist;
  }
  delete normalized.shortlist;
  return normalized;
}

function normalizedRecoveryLeads(request) {
  return (request.leads ?? request.candidates ?? []).map((entry) => {
    const normalized = structuredClone(entry);
    if (normalized.searchIntent === 'BELONGING_THEN_EXACT_NEIGHBOURS') normalized.searchIntent = 'BOTH';
    return normalized;
  });
}

export function validateRequestHistory(current, historicalRequests) {
  validateRequest(current, { requireCurrentSchema: true });
  const currentContent = canonicalJson(current);
  const entries = historicalRequests.map((historical) => (
    historical?.request ? historical : { commit: null, request: historical }
  ));
  let leftCurrentRun = false;

  for (const { request: historical } of entries) {
    if (historical.runId === current.runId && canonicalJson(historical) !== currentContent) {
      throw new Error(`Immutable scout runId ${current.runId} has conflicting content in repository history; create a new runId`);
    }
    if (historical.runId === current.runId && leftCurrentRun) {
      throw new Error(`Immutable scout runId ${current.runId} was reintroduced after another run; create a new runId`);
    }
    if (historical.runId !== current.runId) leftCurrentRun = true;
  }

  if (current.recoveryOfRunId) {
    const recovered = entries.find(({ request: historical }) => historical.runId === current.recoveryOfRunId);
    if (!recovered) {
      throw new Error(`Recovery source runId ${current.recoveryOfRunId} does not exist in scout-request history`);
    }
    if (recovered.commit && current.sourceCommit !== recovered.commit) {
      throw new Error(`Recovery sourceCommit must be the commit containing ${current.recoveryOfRunId}`);
    }
    const sameMode = (recovered.request.mode ?? 'REPAIR') === (current.mode ?? 'REPAIR');
    const sameTarget = canonicalJson(recovered.request.target ?? null) === canonicalJson(current.target ?? null);
    const sameReceipt = canonicalJson(normalizedRecoveryReceipt(recovered.request.explorationReceipt ?? null))
      === canonicalJson(normalizedRecoveryReceipt(current.explorationReceipt ?? null));
    const sameLeads = canonicalJson(normalizedRecoveryLeads(recovered.request))
      === canonicalJson(normalizedRecoveryLeads(current));
    if (!sameMode || !sameTarget || !sameReceipt || !sameLeads) {
      throw new Error('Recovery request must preserve the source run mode, target, receipt, and ranked leads exactly');
    }
  }
}

async function main() {
  const [requestPath] = process.argv.slice(2);
  if (!requestPath) throw new Error('Usage: node validate-request-history.js <current-request-json>');

  const current = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  const commits = execFileSync('git', ['log', '--format=%H', '--', requestPath], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
  const historicalRequests = [];

  for (const commit of commits) {
    try {
      const content = execFileSync('git', ['show', `${commit}:${requestPath}`], { encoding: 'utf8' });
      historicalRequests.push({ commit, request: JSON.parse(content) });
    } catch (error) {
      throw new Error(`Could not inspect scout request history at ${commit}: ${String(error)}`);
    }
  }

  validateRequestHistory(current, historicalRequests);
  console.log(`Validated schemaVersion ${current.schemaVersion} request history for ${current.runId}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
