import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FT } from '../data/house.js';
import { PALETTE, useMaterials } from '../rendering/Materials.jsx';
export { PALETTE };
function pillowGeometry(segments){const g=new THREE.SphereGeometry(.5,segments,segments/2),p=g.attributes.position;for(let i=0;i<p.count;i++){for(const axis of ['X','Z']){const v=p[`get${axis}`](i);p[`set${axis}`](i,Math.sign(v)*Math.pow(Math.abs(v)*2,.45)*.5);}}g.computeVertexNormals();return g;}
const geometries={box:new THREE.BoxGeometry(1,1,1),rounded:new RoundedBoxGeometry(1,1,1,3,.065),pillow:pillowGeometry(24),sphere:new THREE.SphereGeometry(.5,16,10),cylinder:new THREE.CylinderGeometry(.5,.5,1,16),cone:new THREE.CylinderGeometry(.3,.5,1,20),torus:new THREE.TorusGeometry(.42,.055,8,24)};
const distant={...geometries,rounded:new RoundedBoxGeometry(1,1,1,1,.065),pillow:pillowGeometry(12),sphere:new THREE.SphereGeometry(.5,8,6),cylinder:new THREE.CylinderGeometry(.5,.5,1,8),cone:new THREE.CylinderGeometry(.3,.5,1,8)};
const matrix=new THREE.Object3D(),color=new THREE.Color();
export const block=(x,y,z,w,h,d,material='wall',rotation=0,shape='box')=>({x,y,z,w,h,d,material,rotation,shape});
function Batch({items,shape,material}){
  const ref=useRef(),library=useMaterials(),mat=library.get(material);
  const lod=useRef({next:0,center:new THREE.Vector3()});
  useFrame(({camera,clock})=>{
    if(!ref.current?.boundingSphere||clock.elapsedTime<lod.current.next)return;
    lod.current.next=clock.elapsedTime+.5;
    const center=lod.current.center.copy(ref.current.boundingSphere.center).applyMatrix4(ref.current.matrixWorld);
    ref.current.geometry=(camera.position.distanceTo(center)>24?distant:geometries)[shape]||geometries.box;
  });
  useLayoutEffect(()=>{
    if(!ref.current)return;
    items.forEach((b,i)=>{
      matrix.position.set(b.x*FT,b.y*FT,b.z*FT);matrix.rotation.set(b.rx||0,b.rotation||0,b.rz||0);
      matrix.scale.set(Math.max(.002,b.w*FT),Math.max(.002,b.h*FT),Math.max(.002,b.d*FT));matrix.updateMatrix();
      ref.current.setMatrixAt(i,matrix.matrix);ref.current.setColorAt(i,color.set(b.tint||'#ffffff'));
    });
    ref.current.instanceMatrix.needsUpdate=true;ref.current.instanceColor.needsUpdate=true;ref.current.computeBoundingSphere();
  },[items]);
  return <instancedMesh ref={ref} args={[geometries[shape]||geometries.box,mat,items.length]} castShadow={material!=='glass'&&material!=='emissive'} receiveShadow frustumCulled/>;
}
export function Blocks({items}){
  const groups=useMemo(()=>{const map=new Map();for(const b of items){const shape=b.shape||'box',key=`${shape}|${b.material}`;if(!map.has(key))map.set(key,{shape,material:b.material,items:[]});map.get(key).items.push(b);}return [...map.entries()];},[items]);
  return groups.map(([key,g])=><Batch key={key} {...g}/>);
}
export function Surface({polygon,holes=[],y=0,depth=.75,color,material='stone',onClick}){
  const library=useMaterials(),polygonKey=JSON.stringify(polygon),holesKey=JSON.stringify(holes);
  const geometry=useMemo(()=>{const shape=new THREE.Shape(polygon.map(([x,z])=>new THREE.Vector2(x*FT,-z*FT)));holes.forEach(p=>shape.holes.push(new THREE.Path(p.map(([x,z])=>new THREE.Vector2(x*FT,-z*FT)))));const geo=new THREE.ExtrudeGeometry(shape,{depth:depth*FT,bevelEnabled:false,steps:1,curveSegments:1});geo.rotateX(-Math.PI/2);return geo;},[polygonKey,holesKey,depth]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} material={library.get(material,color||'#ffffff')} position={[0,(y-depth)*FT,0]} receiveShadow castShadow onClick={onClick}/>;
}
export function Rail({a,b,y=0,height=3.3}){
  const items=useMemo(()=>{const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=Math.ceil(len/3),rotation=-Math.atan2(dz,dx),out=[];for(let i=0;i<=n;i++)out.push(block(a[0]+dx*i/n,y+height/2,a[1]+dz*i/n,.08,height,.08,'metal'));out.push(block((a[0]+b[0])/2,y+height,(a[1]+b[1])/2,len,.12,.12,'darkwood',rotation));out.push(block((a[0]+b[0])/2,y+height/2,(a[1]+b[1])/2,len,.06,.06,'metal',rotation));return out;},[a[0],a[1],b[0],b[1],y,height]);
  return <Blocks items={items}/>;
}
