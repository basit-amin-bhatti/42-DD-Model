import { FLOORS } from '../src/data/house.js';
import { floorAt,collides } from '../src/lib/architecture.js';
export function audit(f) {
  const size=.5,minX=-5,minZ=-4,maxX=44,maxZ=85;
  const key=(x,z)=>`${x},${z}`;
  const valid=(x,z)=>{
    if(x<minX||x>maxX||z<minZ||z>maxZ)return false;
    const y=floorAt(x,z,f.elevation);
    return y!==null&&Math.abs(y-f.elevation)<.6&&!collides(x,z,f.elevation,true,.55);
  };
  const seen=new Set(),queue=[[Math.round(f.spawn[0]*2)/2,Math.round(f.spawn[1]*2)/2]];
  seen.add(key(...queue[0]));
  for(let i=0;i<queue.length;i++){
    const [x,z]=queue[i];
    for(const [dx,dz] of [[size,0],[-size,0],[0,size],[0,-size]]){
      const nx=x+dx,nz=z+dz,k=key(nx,nz);
      if(!seen.has(k)&&valid(nx,nz)){seen.add(k);queue.push([nx,nz]);}
    }
  }
  const unreachable=f.rooms.filter(r=>!queue.some(([x,z])=>x>r.x+.8&&x<r.x+r.w-.8&&z>r.z+.8&&z<r.z+r.d-.8)).map(r=>r.id);
  return {floor:f.id,cells:queue.length,unreachable};
}
if(process.argv[1]?.endsWith('connectivity-audit.js'))console.log(JSON.stringify(FLOORS.map(audit),null,2));
