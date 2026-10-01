import { FLOORS, roomPolygon } from '../data/house.js';
import { collides, floorAt, walkMove, contains } from './architecture.js';
import { furnishRoom, openKitchenParts } from './furnishing.js';

// Broad furniture volumes share the rendered descriptors. Small fittings, rugs,
// overhead cabinets and transparent shower screens do not snag the controller.
const obstacles = FLOORS.flatMap(f => f.rooms.flatMap(r => furnishRoom(r)
  .filter(b => b.w > .65 && b.d > .65 && b.h > .35 && b.y-b.h/2 < 1.5 && b.y+b.h/2 > .6)
  .map(b => ({...b, elevation:f.elevation}))));
obstacles.push(...openKitchenParts().filter(b=>b.h>.35&&b.w>.65&&b.d>.65).map(b=>({...b,elevation:FLOORS.find(f=>f.id==='first').elevation})));
export function furnitureCollides(x,z,y,radius=.4) {
  return obstacles.some(b => {
    if (Math.abs(y-b.elevation)>.4) return false;
    const c=Math.cos(b.rotation||0),s=Math.sin(b.rotation||0);
    const dx=x-b.x,dz=z-b.z,lx=dx*c-dz*s,lz=dx*s+dz*c;
    const ex=Math.max(Math.abs(lx)-b.w/2,0),ez=Math.max(Math.abs(lz)-b.d/2,0);
    return ex*ex+ez*ez < radius*radius;
  });
}
export function furnishedMove(pos,dx,dz,doorsOpen,enabled=true) {
  if(!enabled) return walkMove(pos,dx,dz,doorsOpen);
  let result=pos;
  for(const [mx,mz] of [[dx,0],[0,dz]]) {
    const next=walkMove(result,mx,mz,doorsOpen);
    if(!furnitureCollides(next[0],next[2],next[1])) result=next;
  }
  return result;
}
export function roomArrival(room,floor,enabled=true) {
  const center=[room.x+room.w/2,room.z+room.d/2];
  const points=[center];
  for(let x=room.x+.9;x<room.x+room.w-.8;x+=.6)
    for(let z=room.z+.9;z<room.z+room.d-.8;z+=.6) points.push([x,z]);
  points.sort((a,b)=>Math.hypot(a[0]-center[0],a[1]-center[1])-Math.hypot(b[0]-center[0],b[1]-center[1]));
  return points.find(([x,z])=>contains([x,z],roomPolygon(room))&&floorAt(x,z,floor.elevation)!==null&&!collides(x,z,floor.elevation,true)&&(!enabled||!furnitureCollides(x,z,floor.elevation))) || null;
}
