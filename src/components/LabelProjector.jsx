import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Vector3 } from 'three';
import { FT, getFloor } from '../data/house.js';

// Labels live in the main React DOM root. Projecting into it avoids a second
// React root for every room and keeps floor changes free of Html unmount races.
export default function LabelProjector({floorId,options,mode,onProject}){
  const {camera,size}=useThree();
  const points=useMemo(()=>{
    const f=getFloor(floorId),lift=options.explode?(f.elevation<0?-12:f.elevation>0?12:0):0;
    return f.rooms.filter(r=>r.type!=='circulation').map(r=>({id:r.id,p:new Vector3((r.x+r.w/2)*FT,(f.elevation+lift+.25)*FT,(r.z+r.d/2)*FT)}));
  },[floorId,options.explode]);
  useFrame(()=>{
    if(!options.labels||mode==='walk'||!onProject)return;
    onProject(points.map(({id,p})=>{
      const v=p.clone().project(camera),distance=camera.position.distanceTo(p);
      return {id,x:(v.x+1)*size.width/2,y:(1-v.y)*size.height/2,visible:v.z<1&&v.z>-1,scale:Math.min(1,Math.max(.7,32/distance))};
    }));
  });return null;
}
