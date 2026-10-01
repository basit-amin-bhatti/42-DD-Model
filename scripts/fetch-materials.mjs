import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../public/materials/', import.meta.url);
await mkdir(root, {recursive:true});
const fetchJSON = async url => { const r=await fetch(url); if(!r.ok)throw Error(`${r.status}: ${url}`); return r.json(); };
const inventory=await fetchJSON('https://api.polyhaven.com/assets?t=textures');
console.log('Available plaster:',Object.keys(inventory).filter(k=>/plaster/.test(k)).slice(0,8).join(', '));
console.log('Available grass:',Object.keys(inventory).filter(k=>/grass/.test(k)).slice(0,8).join(', '));
const assets=['wood_floor','marble_01','fabric_pattern_07'];
const plaster=Object.keys(inventory).find(k=>k==='plastered_wall_02')||Object.keys(inventory).find(k=>/plastered_wall/.test(k));
const grass=Object.keys(inventory).find(k=>k==='aerial_grass_rock')||Object.keys(inventory).find(k=>/^grass$/.test(k));
if(plaster)assets.push(plaster);if(grass)assets.push(grass);
const manifest={license:'CC0',provider:'Poly Haven',assets:[],environment:null};
const urls=j=>{const out=[];const visit=v=>{if(!v||typeof v!=='object')return;if(v.url)out.push(v);Object.values(v).forEach(visit);};visit(j);return [...new Map(out.map(v=>[v.url,v])).values()];};
const save=async(info,name)=>{
  try {const old=await readFile(new URL(name,root));if(info.md5&&createHash('md5').update(old).digest('hex')===info.md5){console.log(`${name}: already verified`);return {file:name,url:info.url,bytes:old.length,md5:info.md5};}}catch{}
  const r=await fetch(info.url);if(!r.ok)throw Error(`Download ${r.status}: ${info.url}`);
  const bytes=Buffer.from(await r.arrayBuffer());
  if(info.md5&&createHash('md5').update(bytes).digest('hex')!==info.md5)throw Error(`Checksum mismatch ${name}`);
  await writeFile(new URL(name,root),bytes);console.log(`${name}: ${(bytes.length/1048576).toFixed(2)} MB`);
  return {file:name,url:info.url,bytes:bytes.length,md5:info.md5};
};
for(const asset of assets){
  const j=await fetchJSON(`https://api.polyhaven.com/files/${asset}`),list=urls(j),maps={};
  for(const map of ['diff','rough','nor_gl']){
    const suffix=map==='diff'&&asset==='fabric_pattern_07'?'col_1':map;
    const info=list.find(v=>v.url.endsWith(`_${suffix}_1k.jpg`))||list.find(v=>v.url.endsWith(`_${suffix}_1k.png`));
    if(!info)throw Error(`Missing ${map} map for ${asset}`);
    const ext=info.url.split('.').at(-1);maps[map]=await save(info,`${asset}-${map}.${ext}`);
  }
  manifest.assets.push({id:asset,name:inventory[asset]?.name||asset,source:`https://polyhaven.com/a/${asset}`,maps});
}
const envFiles=urls(await fetchJSON('https://api.polyhaven.com/files/modern_buildings_2'));
const hdr=envFiles.find(v=>v.url.endsWith('_2k.hdr'));
if(!hdr)throw Error('Missing 2K environment');
manifest.environment={source:'https://polyhaven.com/a/modern_buildings_2',...await save(hdr,'daylight-2k.hdr')};
await writeFile(new URL('manifest.json',root),JSON.stringify(manifest,null,2));
await writeFile(new URL('../src/data/material-assets.json',import.meta.url),JSON.stringify(manifest,null,2));
