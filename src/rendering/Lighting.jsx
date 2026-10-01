import { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { FLOORS, FT, getFloor } from '../data/house.js';
RectAreaLightUniformsLib.init();
export default function Lighting({floorId,options,mode,position}){
  const evening=options.lighting==='evening';
  const current=mode==='walk'&&position?FLOORS.reduce((a,b)=>Math.abs(b.elevation-position[1])<Math.abs(a.elevation-position[1])?b:a):getFloor(floorId);
  const rooms=useMemo(()=>{
    const eligible=current.rooms.filter(r=>['living','bedroom','kitchen','bath','office','circulation'].includes(r.type)&&!r.id.includes('stair'));
    if(mode==='walk'&&position)eligible.sort((a,b)=>Math.hypot(a.x+a.w/2-position[0],a.z+a.d/2-position[2])-Math.hypot(b.x+b.w/2-position[0],b.z+b.d/2-position[2]));
    return eligible.slice(0,options.quality==='high'?10:6);
  },[current,mode,options.quality,position]);
  const lift=options.explode?(current.elevation<0?-12:current.elevation>0?12:0):0;
  return <>
    <Environment files="/materials/daylight-2k.hdr" background={false} environmentIntensity={evening?.16:.65} environmentRotation={[0,.8,0]}/>
    <hemisphereLight args={[evening?'#839dbf':'#e5efff','#d2bda1',evening?.13:.28]}/>
    <ambientLight intensity={evening?.04:.065}/>
    <directionalLight position={evening?[-20,8,-10]:[-18,27,5]} color={evening?'#ffb86a':'#fff2df'} intensity={evening?.45:3} castShadow shadow-mapSize={[options.quality==='high'?2048:1024,options.quality==='high'?2048:1024]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={27} shadow-camera-bottom={-27} shadow-camera-near={1} shadow-camera-far={90} shadow-bias={-.00015} shadow-normalBias={.025} shadow-radius={3}/>
    {options.indoorLights!==false&&rooms.map(r=><rectAreaLight key={r.id} position={[(r.x+r.w*.5)*FT,(current.elevation+lift+9.6)*FT,(r.z+r.d*.5)*FT]} rotation={[-Math.PI/2,0,0]} width={Math.min(r.w*.5,6)*FT} height={Math.min(r.d*.4,6)*FT} intensity={evening?5:2.4} color="#ffe6c6"/>)}
    {options.indoorLights!==false&&<pointLight position={[(current.spawn[0])*FT,(current.elevation+lift+8)*FT,(current.spawn[1])*FT]} color="#ffe6c8" intensity={evening?14:7} decay={2} distance={8}/>}
  </>;
}
