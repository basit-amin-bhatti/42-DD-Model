import test from 'node:test';
import assert from 'node:assert/strict';
import { FLOORS, LEVEL_HEIGHT } from '../src/data/house.js';
import { WALLS, wallPieces, floorAt, collides, walkMove, stairSteps, contains } from '../src/lib/architecture.js';
import { audit } from './connectivity-audit.js';

test('clear principal room dimensions are authored in source feet',()=>{
  const rooms=FLOORS.flatMap(f=>f.rooms);
  for(const [id,w,d] of [['g-master',22,17],['g-drawing',15,27],['g-kitchen',15,14],['g-lounge',17,20.625],['f-master',14,19],['f-child',13,14],['f-guest',15,15],['b-master',19,14],['b-child',16,13],['b-guest',15,17]]){
    const r=rooms.find(r=>r.id===id);assert.equal(r.w,w,id);assert.equal(r.d,d,id);
  }
});
test('floor datums and shared stair core align exactly',()=>{
  assert.deepEqual(FLOORS.map(f=>f.elevation),[-LEVEL_HEIGHT,0,LEVEL_HEIGHT]);
  const lower=stairSteps(-LEVEL_HEIGHT),upper=stairSteps(0);
  lower.forEach((s,i)=>{assert.equal(s.x,upper[i].x);assert.equal(s.z,upper[i].z);assert.ok(Math.abs(s.y+LEVEL_HEIGHT-upper[i].y)<1e-8);});
  assert.equal(lower.at(-1).y,0);assert.equal(upper.at(-1).y,LEVEL_HEIGHT);
});
test('first-floor stairwell and entrance voids remain unsupported',()=>{
  for(const [x,z] of [[20,45],[20,58],[20,65]])assert.equal(floorAt(x,z,LEVEL_HEIGHT),null,`void at ${x},${z}`);
  assert.equal(floorAt(20,54,LEVEL_HEIGHT),LEVEL_HEIGHT,'bridge remains walkable');
});
test('wall gaps allow passage only through open doorways',()=>{
  assert.equal(collides(17.9,18,0,true),false,'master south door is open');
  assert.equal(collides(17.9,18,0,false),true,'closed door blocks passage');
  assert.equal(collides(26,18,0,true),true,'solid master/living partition');
  assert.equal(collides(38.25,10,0,true),true,'window sill blocks walking through glass');
});
test('stair path is continuously walkable in both directions across all storeys',()=>{
  const follow=(pos,target)=>{
    const n=Math.ceil(Math.hypot(target[0]-pos[0],target[1]-pos[2])/.12);
    const dx=(target[0]-pos[0])/n,dz=(target[1]-pos[2])/n;
    for(let i=0;i<n;i++)pos=walkMove(pos,dx,dz,true);
    assert.ok(Math.hypot(pos[0]-target[0],pos[2]-target[1])<.25,`blocked at ${pos}, wanted ${target}`);
    return pos;
  };
  for(const base of [-LEVEL_HEIGHT,0]){
    let p=[21,base,49.875];
    p=follow(p,[33,49.875]);p=follow(p,[33,40.3]);p=follow(p,[20,40.3]);
    assert.ok(Math.abs(p[1]-(base+LEVEL_HEIGHT))<.01,`top elevation ${p}`);
    p=follow(p,[33,40.3]);p=follow(p,[33,49.875]);p=follow(p,[21,49.875]);
    assert.ok(Math.abs(p[1]-base)<.01,`bottom elevation ${p}`);
  }
});
test('all generated wall pieces have finite, positive dimensions',()=>{
  for(const f of FLOORS)for(const w of WALLS[f.id])for(const p of wallPieces(w)){
    assert.ok([p.a,p.b,p.bottom,p.top].every(Number.isFinite));assert.ok(p.b>p.a);assert.ok(p.top>p.bottom);
  }
});
test('every floor spawns on a supported, unobstructed landing',()=>{
  for(const f of FLOORS){const [x,z]=f.spawn;assert.equal(floorAt(x,z,f.elevation),f.elevation,f.id);assert.equal(collides(x,z,f.elevation),false,f.id);}
});
test('all principal rooms connect to their floor landing; staff suite has separate rear access',()=>{
  for(const f of FLOORS){
    const result=audit(f);
    assert.deepEqual(result.unreachable,f.id==='basement'?['b-staff','b-veranda','b-toilet']:[],f.id);
  }
  const rear=audit({...FLOORS[0],spawn:[18,4]});
  for(const id of ['b-staff','b-veranda','b-toilet'])assert.ok(!rear.unreachable.includes(id),id);
});
