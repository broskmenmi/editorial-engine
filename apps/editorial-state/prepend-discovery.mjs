import fs from 'node:fs/promises';

const discoveriesPath = 'playlists/groove-over-noise/discoveries.md';
const pendingPath = 'playlists/groove-over-noise/pending-discovery.md';

const pending = (await fs.readFile(pendingPath, 'utf8')).trim();
const discoveries = await fs.readFile(discoveriesPath, 'utf8');

const heading = pending.split('\n').find((line) => line.startsWith('## '));
if (!heading) throw new Error('Pending discovery entry needs a level-two heading');

if (!discoveries.includes(heading)) {
  const firstRun = discoveries.search(/^## 20\d\d-/m);
  if (firstRun < 0) throw new Error('Could not locate the first dated discovery entry');
  const updated = `${discoveries.slice(0, firstRun)}${pending}\n\n---\n\n${discoveries.slice(firstRun)}`;
  await fs.writeFile(discoveriesPath, updated);
}

await fs.unlink(pendingPath);
