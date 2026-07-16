import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLedger } from '../src/ledger.js';

const valid = `# Ledger

| # | Artist | Track | Spotify URI | Structural role |
|---:|---|---|---|---|
| 1 | Artist A | Track A | spotify:track:1234567890123456789012 | Opening |
| 2 | Artist B | Track B | spotify:track:abcdefghijklmnopqrstuv | Groove |
`;

test('parses ledger in row order', () => {
  const rows = parseLedger(valid);
  assert.deepEqual(rows.map((row) => row.position), [1, 2]);
  assert.deepEqual(rows.map((row) => row.uri), [
    'spotify:track:1234567890123456789012',
    'spotify:track:abcdefghijklmnopqrstuv',
  ]);
});

test('rejects missing Spotify URI column', () => {
  assert.throws(() => parseLedger('| # | Artist | Track |\n|---|---|---|'), /Spotify URI/);
});

test('rejects non-consecutive positions', () => {
  assert.throws(() => parseLedger(valid.replace('| 2 |', '| 3 |')), /consecutive/);
});

test('rejects duplicate URIs', () => {
  const duplicate = valid.replace(
    'spotify:track:abcdefghijklmnopqrstuv',
    'spotify:track:1234567890123456789012'
  );
  assert.throws(() => parseLedger(duplicate), /Duplicate Spotify URI/);
});

test('rejects empty ledger by default', () => {
  const empty = `| # | Artist | Track | Spotify URI |\n|---:|---|---|---|\n`;
  assert.throws(() => parseLedger(empty), /Ledger is empty/);
  assert.deepEqual(parseLedger(empty, { allowEmpty: true }), []);
});

test('parses escaped pipes inside cells without splitting them', () => {
  const escaped = `| # | Artist | Track | Spotify URI |
|---:|---|---|---|
| 1 | Artist A | Track A \\| Reprise | spotify:track:1234567890123456789012 |
`;
  const rows = parseLedger(escaped);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].track, 'Track A | Reprise');
  assert.equal(rows[0].uri, 'spotify:track:1234567890123456789012');
});

test('parses BPM column values to numbers', () => {
  const withBpm = `| # | Artist | Track | Spotify URI | BPM |
|---:|---|---|---|---:|
| 1 | Artist A | Track A | spotify:track:1234567890123456789012 | 122 |
| 2 | Artist B | Track B | spotify:track:abcdefghijklmnopqrstuv | 98.5 |
`;
  const rows = parseLedger(withBpm);
  assert.deepEqual(rows.map((row) => row.bpm), [122, 98.5]);
});

test('rejects invalid BPM values', () => {
  const invalid = `| # | Artist | Track | Spotify URI | BPM |
|---:|---|---|---|---:|
| 1 | Artist A | Track A | spotify:track:1234567890123456789012 | fast |
`;
  assert.throws(() => parseLedger(invalid), /Invalid BPM on row 3/);
});

test('missing BPM cell or column yields null', () => {
  const withEmptyBpm = `| # | Artist | Track | Spotify URI | BPM |
|---:|---|---|---|---:|
| 1 | Artist A | Track A | spotify:track:1234567890123456789012 | |
`;
  assert.equal(parseLedger(withEmptyBpm)[0].bpm, null);
  assert.equal(parseLedger(valid)[0].bpm, null);
});

test('detects header despite irregular spacing', () => {
  const irregular = `|  #  |Artist|   Track |  Spotify URI|
|---:|---|---|---|
| 1 | Artist A | Track A | spotify:track:1234567890123456789012 |
`;
  const rows = parseLedger(irregular);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].uri, 'spotify:track:1234567890123456789012');
});
