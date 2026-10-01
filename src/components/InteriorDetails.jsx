import { useEffect, useMemo } from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { FT, roomPolygon } from '../data/house.js';
import { contains } from '../lib/architecture.js';
import { Blocks, Surface, block } from './Primitives.jsx';
import { useMaterials } from '../rendering/Materials.jsx';
import { plantParts } from '../lib/furnishing.js';

function Curtain({x,z,width,rotation}){
  const library=useMaterials();
  const geometry=useMemo(()=>{
    const g=new THREE.PlaneGeometry(width*FT,8.05*FT,36,8),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const u=p.getX(i)/(width*FT)+.5,v=p.getY(i)/(8.05*FT)+.5;p.setZ(i,Math.sin(u*Math.PI*14)*.043*(.8+.2*v));p.setY(i,p.getY(i)+Math.sin(u*Math.PI*14)*.008*(1-v));}
    p.needsUpdate=true;g.computeVertexNormals();return g;
  },[width]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} material={library.get('linen')} position={[x*FT,4.2*FT,z*FT]} rotation={[0,rotation,0]} castShadow receiveShadow/>;
}
function Dressings({rooms}){
  const panels=useMemo(()=>rooms.filter(r=>!['bath','outdoor','service'].includes(r.type)).flatMap(r=>r.openings.filter(o=>o.kind==='window'&&o.sill<4).flatMap(o=>{
    const pw=Math.min(1.45,o.width*.22),axis=['n','s'].includes(o.side)?0:1;
    const fixed=axis===0?(o.side==='n'?r.z+.18:r.z+r.d-.18):(o.side==='w'?r.x+.18:r.x+r.w-.18);
    const rotation=o.side==='n'?0:o.side==='s'?Math.PI:o.side==='w'?Math.PI/2:-Math.PI/2;
    return [0,1].map(end=>{const along=(axis===0?r.x:r.z)+o.at+(end?o.width-pw/2:pw/2);return {x:axis===0?along:fixed,z:axis===0?fixed:along,width:pw,rotation,key:`${r.id}-${o.side}-${o.at}-${end}`};});
  })),[rooms]);
  return panels.map(({key,...p})=><Curtain key={key} {...p}/>);
}

export function InteriorDetails({floor,ceilings,cut,furniture,mode,position,quality}){
  const ceilingItems=useMemo(()=>{
    const b=[];
    for(const r of floor.rooms){
      if(['outdoor','court','service','circulation'].includes(r.type))continue;
      const polygon=roomPolygon(r);
      if(!r.noWalls){
        const margin=.36,y=9.78;
        b.push(block(r.x+r.w/2,y,r.z+margin,r.w-.22,.17,.48,'white'),block(r.x+r.w/2,y,r.z+r.d-margin,r.w-.22,.17,.48,'white'));
        b.push(block(r.x+margin,y,r.z+r.d/2,.48,.17,r.d-.22,'white'),block(r.x+r.w-margin,y,r.z+r.d/2,.48,.17,r.d-.22,'white'));
        b.push(block(r.x+r.w/2,9.85,r.z+margin+.25,r.w-.9,.025,.025,'emissive'),block(r.x+r.w/2,9.85,r.z+r.d-margin-.25,r.w-.9,.025,.025,'emissive'));
      }
      const points=r.w<9?[[.3,.3],[.7,.7]]:[[.23,.23],[.77,.23],[.23,.77],[.77,.77]];
      for(const [fx,fz] of points){const x=r.x+r.w*fx,z=r.z+r.d*fz;if(!contains([x,z],polygon)||floor.holes.some(p=>contains([x,z],p)))continue;b.push(block(x,9.88,z,.38,.11,.38,'metal',0,'cylinder'));b.push(block(x,9.81,z,.25,.015,.25,'emissive',0,'cylinder'));}
      if(['living','bedroom','office'].includes(r.type)&&r.w>9){const x=r.x+r.w*.5,z=r.z+r.d*.5;if(contains([x,z],polygon)){b.push(block(x,9.74,z,1.7,.13,1.7,'brass',0,'cylinder'));b.push(block(x,9.64,z,1.5,.05,1.5,'emissive',0,'cylinder'));}}
    }
    if(floor.id==='first')for(let k=0;k<3;k++){const yy=7.5+k*.55,rr=1.4+k*.2;b.push(block(24.8,8.8,45.5,.025,2.8,.025,'brass'));for(let i=0;i<32;i++){const t=i*Math.PI*2/32;b.push(block(24.8+Math.cos(t)*rr,yy,45.5+Math.sin(t)*rr,.16,.08,.16,'emissive',0,'sphere'));}}
    return b;
  },[floor]);
  const details=useMemo(()=>{
    const b=[];
    for(const r of floor.rooms){
      if(['outdoor','court','circulation','bath'].includes(r.type))continue;
      // Electrical fittings mounted inside existing wall lines, never in openings.
      for(const x of r.noWalls?[]:[r.x+.55,r.x+r.w-.65]){
        if(!r.openings.some(o=>o.side==='n'&&x>=r.x+o.at&&x<=r.x+o.at+o.width)){b.push(block(x,1.45,r.z+.2,.21,.32,.035,'white'));b.push(block(x,1.45,r.z+.223,.025,.07,.005,'black'));}
      }
      if(r.type==='bedroom'){
        const x=r.x+r.w*.25,z=r.z+.2;
        if(!r.openings.some(o=>o.side==='n'&&x>r.x+o.at-2&&x<r.x+o.at+o.width+2)){
          b.push(block(x,5.7,z,3.2,2.5,.08,'darkwood'),block(x,5.7,z+.05,3.08,2.38,.025,'linen'));
          b.push(block(x-.42,5.6,z+.075,1.1,1.45,.025,'sage',0,'sphere'),block(x+.5,5.8,z+.078,1.2,1.2,.025,'leather',0,'sphere'));
        }
      }
      if(r.type==='office'||r.type==='living')plantParts(b,r.x+r.w-1,r.z+r.d-1,.6);
      for(const o of r.openings.filter(o=>o.kind==='window'&&o.sill<4)){
        const axis=['n','s'].includes(o.side)?0:1,fixed=axis===0?(o.side==='n'?r.z+.18:r.z+r.d-.18):(o.side==='w'?r.x+.18:r.x+r.w-.18),mid=(axis===0?r.x:r.z)+o.at+o.width/2;
        b.push(axis===0?block(mid,8.32,fixed,o.width+.25,.075,.075,'brass'):block(fixed,8.32,mid,.075,.075,o.width+.25,'brass'));
      }
    }
    return b;
  },[floor]);
  const mirror=floor.rooms.find(r=>r.furniture==='bath'&&mode==='walk'&&quality==='high'&&position&&Math.hypot(position[0]-(r.x+r.w/2),position[2]-(r.z+r.d/2))<7&&Math.abs(position[1]-floor.elevation)<1);
  return <>
    {ceilings&&<><Blocks items={ceilingItems}/>{floor.rooms.filter(r=>!['outdoor','court','circulation'].includes(r.type)).map(r=><Surface key={r.id} polygon={roomPolygon(r)} y={9.96} depth={.08} material="white"/>)}</>}
    {furniture&&!cut&&<><Dressings rooms={floor.rooms}/><Blocks items={details}/></>}
    {mirror&&<mesh position={[(mirror.x+mirror.w-1.25)*FT,5.5*FT,(mirror.z+.17)*FT]}><planeGeometry args={[1.85*FT,2.65*FT]}/><MeshReflectorMaterial resolution={256} mirror={1} mixStrength={1} roughness={.05} metalness={.7} color="#e4e8e7" depthScale={0} blur={[0,0]}/></mesh>}
  </>;
}
