import { useMemo } from 'react';
import { Blocks, block } from './Primitives.jsx';
import { plantParts } from '../lib/furnishing.js';
export default function Landscape(){
  const items=useMemo(()=>{
    const b=[];
    for(const [x,z] of [[-3,81],[17,81],[41,-2],[-3,-2]]){
      b.push(block(x,2.2,z,.25,4.4,.25,'darkwood',0,'cylinder'));
      for(let i=0;i<6;i++){const a=i*2.399;b.push({...block(x+Math.cos(a)*.6,3.7+i*.19,z+Math.sin(a)*.6,.12,2.1,.12,'darkwood',0,'cylinder'),rz:Math.cos(a)*.5,rx:Math.sin(a)*.5});}
      for(let i=0;i<42;i++){const a=i*2.399,rr=Math.sqrt((i+.5)/42)*1.65;b.push(block(x+Math.cos(a)*rr,4.55+Math.sin(i*1.4)*.8,z+Math.sin(a)*rr,.9,1.1,.95,i%3===0?'leafLight':i%3===1?'leaf':'leafDark',a,'sphere'));}
    }
    for(let i=0;i<12;i++)plantParts(b,-4.5,70.5+i*.9,.42);
    for(const [x,z] of [[20.5,68.5],[42.5,69],[1,69]])plantParts(b,x,z,.85);
    for(const x of [-3.5,18.5,42]){b.push(block(x,.8,78,.08,1.6,.08,'metal',0,'cylinder'));b.push(block(x,1.62,78,.22,.16,.22,'emissive',0,'cylinder'));}
    // Thin applied stone joints, garden edging and planters retain the original
    // boundary and paving extents; there are no new architectural enclosures.
    b.push(block(7.625,-.2,67.625,27,.16,.16,'stone'),block(20.9,-.2,76.125,.16,.16,17,'stone'));
    for(let i=0;i<12;i++)b.push(block(32.7,-.32,68.1+i*1.4,22.7,.01,.023,'darkwood'));
    return b;
  },[]);
  return <Blocks items={items}/>;
}
