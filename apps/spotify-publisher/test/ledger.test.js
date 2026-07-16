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
