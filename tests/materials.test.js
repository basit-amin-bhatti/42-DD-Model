import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root=new URL('../public/materials/',import.meta.url);
test('all local PBR maps and HDR match their downloaded source checksums',()=>{
  const manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
  const files=[...manifest.assets.flatMap(a=>Object.values(a.maps)),manifest.environment];
  for(const asset of files){const data=readFileSync(new URL(asset.file,root));assert.equal(data.byteLength,asset.bytes,asset.file);assert.equal(createHash('md5').update(data).digest('hex'),asset.md5,asset.file);}
});
