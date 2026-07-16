import fs from 'node:fs/promises';

const TRACK_URI = /^spotify:track:[A-Za-z0-9]{22}$/;

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map((value) => value.trim().replaceAll('\\|', '|'));
}

export function parseLedger(markdown, { allowEmpty = false } = {}) {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => {
    if (!line.trim().startsWith('|')) return false;
    const cells = splitRow(line);
    return cells.includes('#') && cells.includes('Spotify URI');
  });

  if (headerIndex < 0) {
    throw new Error('Ledger table must include a Spotify URI column.');
  }

  const headers = splitRow(lines[headerIndex]);
  const separator = lines[headerIndex + 1] ?? '';
  if (!separator.includes('---')) {
    throw new Error('Ledger table separator is missing.');
  }

  const indexes = {
    position: headers.indexOf('#'),
    artist: headers.indexOf('Artist'),
    track: headers.indexOf('Track'),
    uri: headers.indexOf('Spotify URI'),
  };

  for (const [name, index] of Object.entries(indexes)) {
    if (index < 0) throw new Error(`Ledger column is missing: ${name}`);
  }

  const bpmIndex = headers.indexOf('BPM');

  const rows = [];
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim().startsWith('|')) break;

    const cells = splitRow(line);
    const position = Number.parseInt(cells[indexes.position], 10);
    const artist = cells[indexes.artist];
    const track = cells[indexes.track];
    const uri = cells[indexes.uri];

    if (!Number.isInteger(position) || position < 1) {
      throw new Error(`Invalid ledger position on row ${index + 1}.`);
    }
    if (!artist || !track) {
      throw new Error(`Artist and track are required on row ${index + 1}.`);
    }
    if (!TRACK_URI.test(uri)) {
      throw new Error(`Invalid Spotify track URI on row ${index + 1}: ${uri || '(empty)'}`);
    }

    let bpm = null;
    if (bpmIndex >= 0) {
      const bpmCell = cells[bpmIndex] ?? '';
      if (bpmCell !== '') {
        bpm = Number(bpmCell);
        if (!Number.isFinite(bpm) || bpm <= 0) {
          throw new Error(`Invalid BPM on row ${index + 1}: ${bpmCell}`);
        }
      }
    }

    rows.push({ position, artist, track, uri, bpm });
  }

  if (rows.length === 0 && !allowEmpty) {
    throw new Error('Ledger is empty. Pass --allow-empty to publish an empty playlist intentionally.');
  }

  const uriSet = new Set();
  rows.forEach((row, index) => {
    const expected = index + 1;
    if (row.position !== expected) {
      throw new Error(`Ledger positions must be consecutive. Expected ${expected}, found ${row.position}.`);
    }
    if (uriSet.has(row.uri)) {
      throw new Error(`Duplicate Spotify URI in ledger: ${row.uri}`);
    }
    uriSet.add(row.uri);
  });

  return rows;
}

export async function readLedger(path, options) {
  const markdown = await fs.readFile(path, 'utf8');
  return parseLedger(markdown, options);
}
