import { FLOORS, EXTRA_WALLS, FT, LEVEL_HEIGHT, WALL_HEIGHT, STAIR, roomPolygon } from '../data/house.js';

export function contains(point, polygon) {
  let inside = false;
  for (let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const [xi,zi]=polygon[i], [xj,zj]=polygon[j];
    if (((zi>point[1])!==(zj>point[1])) && point[0]<(xj-xi)*(point[1]-zi)/(zj-zi)+xi) inside=!inside;
  }
  return inside;
}

// Merge shared walls and their openings, so a doorway is never blocked by the
// neighbouring room's duplicate partition. All openings are real geometry gaps.
export function buildWalls(floor) {
  const raw=[];
  floor.rooms.filter(r=>!r.noWalls).forEach(r=>{
    const x=r.x-.25,z=r.z-.25,w=r.w+.5,d=r.d+.5;
    [['n',[x,z],[x+w,z]],['s',[x,z+d],[x+w,z+d]],['w',[x,z],[x,z+d]],['e',[x+w,z],[x+w,z+d]]].forEach(([side,a,b])=>{
      if(r.omit?.includes(side)) return;
      raw.push({a,b,thickness:.5,openings:r.openings.filter(o=>o.side===side).map(o=>({...o,at:o.at+.25}))});
    });
  });
  raw.push(...(EXTRA_WALLS[floor.id]||[]).map(w=>({thickness:.5,...w})));
  const groups=new Map();
  raw.forEach(w=>{
    const horizontal=Math.abs(w.a[1]-w.b[1])<.01, axis=horizontal?0:1, fixed=w.a[1-axis];
    const key=`${axis}:${fixed.toFixed(3)}:${w.height||WALL_HEIGHT}`;
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push({...w,axis,fixed,start:Math.min(w.a[axis],w.b[axis]),end:Math.max(w.a[axis],w.b[axis]),openings:(w.openings||[]).map(o=>({...o,start:w.a[axis]+o.at,end:w.a[axis]+o.at+o.width}))});
  });
  const walls=[];
  for(const list of groups.values()) {
    list.sort((a,b)=>a.start-b.start);
    let current;
    for(const w of list) {
      if(current && w.start<=current.end+.02){current.end=Math.max(current.end,w.end); current.openings.push(...w.openings);}
      else {current={...w,openings:[...w.openings]};walls.push(current);}
    }
  }
  walls.forEach((w,i)=>{
    w.id=`${floor.id}-wall-${i}`;
    // Duplicate door definitions are coalesced before lintels are generated.
    const unique=[];
    w.openings.sort((a,b)=>a.start-b.start).forEach(o=>{
      o.start=Math.max(o.start,w.start);o.end=Math.min(o.end,w.end);
      const prev=unique.at(-1);
      if(prev&&o.start<prev.end+.02&&prev.kind===o.kind){prev.end=Math.max(prev.end,o.end);prev.sill=Math.min(prev.sill,o.sill);prev.head=Math.max(prev.head,o.head);}
      else unique.push({...o});
    });w.openings=unique;
    // Outside skin thickness. The dimensions stay at the nominal internal datum.
    if(w.fixed<.6 || (w.axis===1 && w.fixed>38))w.thickness=.75;
  });
  return walls;
}

export const WALLS=Object.fromEntries(FLOORS.map(f=>[f.id,buildWalls(f)]));
export function wallPieces(w, cutHeight=WALL_HEIGHT) {
  const length=w.end-w.start;
  const cuts=[w.start,w.end,...w.openings.flatMap(o=>[o.start,o.end])].sort((a,b)=>a-b);
  const pieces=[];
  for(let i=1;i<cuts.length;i++){
    const a=cuts[i-1],b=cuts[i];if(b-a<.005)continue;
    const mid=(a+b)/2, active=w.openings.filter(o=>mid>o.start-.001&&mid<o.end+.001);
    if(!active.length)pieces.push({a,b,bottom:0,top:cutHeight});
    else {
      const sill=Math.min(...active.map(o=>o.sill)), head=Math.max(...active.map(o=>o.head));
      if(sill>0)pieces.push({a,b,bottom:0,top:Math.min(sill,cutHeight)});
      if(head<cutHeight)pieces.push({a,b,bottom:head,top:cutHeight});
    }
  }
  return pieces.filter(p=>p.top>p.bottom&&length>0);
}

export function stairSteps(base) {
  const steps=[]; const rise=LEVEL_HEIGHT/22;
  for(let i=0;i<12;i++)steps.push({x:22.25+i*.75,z:48.125,w:.75,d:3.5,y:base+(i+1)*rise,base});
  steps.push({x:31.25,z:48.125,w:3.5,d:3.5,y:base+12*rise,base,landing:true});
  for(let i=0;i<10;i++)steps.push({x:31.25,z:48.125-(i+1)*.775,w:3.5,d:.775,y:base+(13+i)*rise,base});
  return steps;
}
export const STAIRS=[...stairSteps(-LEVEL_HEIGHT),...stairSteps(0)];
// External court access uses an actual second flight from basement to ground.
export const EXTERNAL_STEPS=Array.from({length:22},(_,i)=>({x:38.875,z:46.875-(i+1)*.75,w:3.25,d:.75,y:-LEVEL_HEIGHT+(i+1)*LEVEL_HEIGHT/22,base:-LEVEL_HEIGHT,external:true}));
export const REAR_STEPS=Array.from({length:22},(_,i)=>({x:15.5-(i+1)*.55,z:-1.75,w:.55,d:2.5,y:-LEVEL_HEIGHT+(i+1)*LEVEL_HEIGHT/22,base:-LEVEL_HEIGHT,external:true}));

export function floorAt(x,z,currentY) {
  const candidates=[];
  for(const f of FLOORS) {
    if(contains([x,z],f.footprint)&&!f.holes.some(h=>contains([x,z],h)))candidates.push(f.elevation);
    for(const r of [...f.rooms.filter(r=>r.noWalls),...f.courts]) {
      if(r.type==='court'&&f.id!=='basement')continue;
      if(contains([x,z],roomPolygon(r))&&!f.holes.some(h=>contains([x,z],h)))candidates.push(f.elevation);
    }
  }
  if(x>-5.875&&x<44.125&&z>-5.375&&z<84.625 && (z>67.5||x<-4.5||x>42.5||z<-2))candidates.push(-.15);
  if(x>=24.5&&x<=44.125&&z>=52.125&&z<=67.5)candidates.push(0);
  for(const s of [...STAIRS,...EXTERNAL_STEPS,...REAR_STEPS])if(x>=s.x&&x<=s.x+s.w&&z>=s.z&&z<=s.z+s.d)candidates.push(s.y);
  // Stair stepping is bounded: no teleport through a slab or down a void.
  const possible=candidates.filter(y=>y<=currentY+.85&&y>=currentY-1.35);
  return possible.length?Math.max(...possible):null;
}

export function collides(x,z,y,doorsOpen=true,radius=.62) {
  for(const f of FLOORS){
    if(y<f.elevation-.5||y>f.elevation+WALL_HEIGHT-.5)continue;
    for(const w of WALLS[f.id]){
      const along=w.axis===0?x:z,across=w.axis===0?z:x;
      if(Math.abs(across-w.fixed)>w.thickness/2+radius||along<w.start-radius||along>w.end+radius)continue;
      const localY=y-f.elevation;
      const passage=w.openings.some(o=>o.sill<=localY+.05&&o.head>=localY+5.7&&along>=o.start+radius&&along<=o.end-radius&&(o.kind==='opening'||o.kind==='door'&&doorsOpen));
      if(!passage)return true;
    }
  }
  return false;
}

export function walkMove(pos,dx,dz,doorsOpen) {
  let [x,y,z]=pos;
  for(const axis of [0,1]) {
    const cx=x+(axis===0?dx:0),cz=z+(axis===1?dz:0);
    const h=floorAt(cx,cz,y);
    if(h!==null&&!collides(cx,cz,h,doorsOpen)){x=cx;z=cz;y=h;}
  }
  return [x,y,z];
}
export const metres = value => value*FT;
