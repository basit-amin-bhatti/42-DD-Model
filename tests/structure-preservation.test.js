import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// These hashes were captured before the appearance upgrade. They protect every
// approved room, wall/opening, slab void, stair coordinate and collision boundary.
const baseline = {
  'src/data/house.js': '4a9aebaf83d082653c558bceb5e99e2949efe42c9535b6dc4fd8b92d72ab8e9e',
  'src/lib/architecture.js': '20c1dc66e7145539c9476600c358b7b86c266a58ecfc99f0465201e83cb364ea',
};
test('appearance upgrade preserves the approved architectural source byte-for-byte', () => {
  for (const [file, expected] of Object.entries(baseline)) {
    assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), expected, file);
  }
});
