import test from 'node:test';
import assert from 'node:assert/strict';
import { FLOORS, LEVEL_HEIGHT } from '../src/data/house.js';
import { furnishRoom } from '../src/lib/furnishing.js';
import { furnitureCollides, furnishedMove, roomArrival } from '../src/lib/furniture-collision.js';
test('decorative furniture has valid geometry and safe room arrivals on all levels',()=>{
  for(const f of FLOORS) for(const r of f.rooms){
    const parts=furnishRoom(r);
    for(const b of parts){for(const k of ['x','y','z','w','h','d'])assert.ok(Number.isFinite(b[k]),`${r.id}/${k}`);assert.ok(b.w>0&&b.h>0&&b.d>0,r.id);}
    if(parts.length&&r.type!=='outdoor'){
      const p=roomArrival(r,f);
      assert.ok(p,`No furnished arrival in ${r.id}`);
      assert.equal(furnitureCollides(p[0],p[1],f.elevation),false,r.id);
    }
  }
});
test('furnished movement cannot tunnel into a sofa and preserves floor support',()=>{
  const f=FLOORS.find(f=>f.id==='ground'),r=f.rooms.find(r=>r.furniture==='drawing');
  const p=roomArrival(r,f);let pos=[p[0],f.elevation,p[1]];
  for(let i=0;i<220;i++) {pos=furnishedMove(pos,.08,0,true);assert.equal(furnitureCollides(pos[0],pos[2],pos[1]),false);}
  assert.equal(pos[1],f.elevation);
});
test('furnishing preserves safe landings and stair ascent/descent',()=>{
  for(const f of FLOORS)assert.equal(furnitureCollides(f.spawn[0],f.spawn[1],f.elevation),false,f.id);
  const follow=(pos,[x,z])=>{const n=Math.ceil(Math.hypot(x-pos[0],z-pos[2])/.12),dx=(x-pos[0])/n,dz=(z-pos[2])/n;for(let i=0;i<n;i++)pos=furnishedMove(pos,dx,dz,true);assert.ok(Math.hypot(pos[0]-x,pos[2]-z)<.25);return pos;};
  for(const y of [-LEVEL_HEIGHT,0]){
    let p=[21,y,49.875];p=follow(p,[33,49.875]);p=follow(p,[33,40.3]);p=follow(p,[20,40.3]);assert.ok(Math.abs(p[1]-y-LEVEL_HEIGHT)<.01);
    p=follow(p,[33,40.3]);p=follow(p,[33,49.875]);p=follow(p,[21,49.875]);assert.ok(Math.abs(p[1]-y)<.01);
  }
});
