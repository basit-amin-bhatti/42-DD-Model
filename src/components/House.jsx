import { useMemo } from 'react';
import { FT, FLOORS, WALL_HEIGHT, SLAB, roomPolygon } from '../data/house.js';
import { WALLS, wallPieces, stairSteps, EXTERNAL_STEPS, REAR_STEPS } from '../lib/architecture.js';
import { Blocks, Surface, Rail, block, PALETTE } from './Primitives.jsx';
import { Furniture, OpenKitchen } from './Furniture.jsx';
import { InteriorDetails } from './InteriorDetails.jsx';
import Landscape from './Landscape.jsx';

const ROOM_COLORS={bedroom:'#d5c4a7',bath:'#c7d4cf',kitchen:'#d9d7c9',living:'#e6ddc9',office:'#cdd2c8',service:'#d6d0c1',circulation:'#e3e0d5',outdoor:'#bfc1b4',court:'#acb5aa'};

function Walls({floor,cut,doorsOpen}) {
  const items=useMemo(()=>{
    const out=[];
    const height=cut?3.7:WALL_HEIGHT;
    for(const w of WALLS[floor.id]){
      const H=Math.min(w.height||height,height);
      for(const p of wallPieces(w,H)){
        const len=p.b-p.a,mid=(p.a+p.b)/2,y=(p.bottom+p.top)/2;
        out.push(w.axis===0?block(mid,y,w.fixed,len,p.top-p.bottom,w.thickness,'wall'):block(w.fixed,y,mid,w.thickness,p.top-p.bottom,len,'wall'));
        if(p.top===H)out.push(w.axis===0?block(mid,H+.015,w.fixed,len,.04,w.thickness,'cap'):block(w.fixed,H+.015,mid,w.thickness,.04,len,'cap'));
        if(p.bottom===0)out.push(w.axis===0?block(mid,.13,w.fixed,len,.26,w.thickness+.035,'stone'):block(w.fixed,.13,mid,w.thickness+.035,.26,len,'stone'));
      }
      for(const o of w.openings){
        const width=o.end-o.start,mid=(o.end+o.start)/2;
        const b=(along,y,thickness,ww,hh,mat)=>out.push(w.axis===0?block(along,y,w.fixed,ww,hh,thickness,mat):block(w.fixed,y,along,thickness,hh,ww,mat));
        if(o.kind==='window'){
          if(cut&&o.sill>height)continue;
          const top=Math.min(o.head,height),bottom=o.sill;
          if(top<=bottom)continue;
          b(mid,bottom,.72,width,.1,'stone'); b(mid,top,.18,width,.1,'metal');
          b(o.start+.06,(bottom+top)/2,.18,.12,top-bottom,'metal');b(o.end-.06,(bottom+top)/2,.18,.12,top-bottom,'metal');
          for(let j=1;j<Math.ceil(width/3);j++)b(o.start+width*j/Math.ceil(width/3),(bottom+top)/2,.13,.07,top-bottom,'metal');
          b(mid,(bottom+top)/2,.045,width-.15,top-bottom-.1,'glass');
        }
        if(o.kind==='door'){
          const h=Math.min(7,height);
          b(o.start+.05,h/2,.56,.1,h,'darkwood');b(o.end-.05,h/2,.56,.1,h,'darkwood');if(!cut)b(mid,7,.56,width,.13,'darkwood');
          const leafW=width>4?width/2:width;
          // Door leaf is hinged at the source opening; open leaves are parked at 90°.
          if(doorsOpen){
            const along=o.start+.1,cross=w.fixed+leafW/2;
            out.push(w.axis===0?block(along,h/2,cross,.1,h-.08,leafW-.14,'wood'):block(cross,h/2,along,leafW-.14,h-.08,.1,'wood'));
            out.push(w.axis===0?block(along+.1,3.2,w.fixed+leafW-.38,.08,.065,.42,'brass'):block(w.fixed+leafW-.38,3.2,along+.1,.42,.065,.08,'brass'));
            if(width>4)out.push(w.axis===0?block(o.end-.1,h/2,cross,.1,h-.08,leafW-.14,'wood'):block(cross,h/2,o.end-.1,leafW-.14,h-.08,.1,'wood'));
          } else {b(mid,h/2,.12,width-.12,h-.08,'wood');out.push(w.axis===0?block(o.end-.4,3.2,w.fixed+.13,.42,.065,.08,'brass'):block(w.fixed+.13,3.2,o.end-.4,.08,.065,.42,'brass'));}
        }
      }
    }
    return out;
  },[floor,cut,doorsOpen]);
  const opaque=useMemo(()=>items.filter(b=>b.material!=='glass'),[items]);
  const glazing=useMemo(()=>items.filter(b=>b.material==='glass'),[items]);
  return <><Blocks items={opaque}/><Blocks items={glazing} transparent/></>;
}
function Stairs({base=0,external=false}) {
  const steps=useMemo(()=>external?[...EXTERNAL_STEPS,...REAR_STEPS]:stairSteps(base),[base,external]);
  const items=useMemo(()=>steps.flatMap(s=>[
    block(s.x+s.w/2,s.y-.14,s.z+s.d/2,s.w,.28,s.d,'stone'),
    block(s.x+s.w/2,s.y-.012,s.z+s.d/2,s.w,.035,s.d-.015,'white'),
  ]),[steps]);
  const railItems=useMemo(()=>{
    const out=[];for(const s of steps){
      if(s.landing)continue;
      const x=s.w<1?s.x+s.w/2:s.x+.08,z=s.w<1?s.z+.1:s.z+s.d/2;
      out.push(block(x,s.y+1.6,z,.07,3.2,.07,'metal'));
      // Each local handrail section is horizontal at its tread datum.
      out.push(block(x,s.y+3.2,z,s.w<1?s.w+.04:.12,.1,s.w<1?.12:s.d+.04,'metal'));
    }return out;
  },[steps]);
  return <><Blocks items={items}/><Blocks items={railItems}/></>;
}

function FirstRails(){return <>
  <Rail a={[16.8,40.375]} b={[31.1,40.375]}/><Rail a={[16.8,40.375]} b={[16.8,51.875]}/>
  <Rail a={[16.8,51.875]} b={[22.1,51.875]}/><Rail a={[16.75,55.9]} b={[24.4,55.9]}/>
  <Rail a={[24.5,56.125]} b={[24.5,68.5]}/><Rail a={[16.5,56.125]} b={[16.5,68.5]}/>
  <Rail a={[0.4,20.25]} b={[0.4,49.125]}/><Rail a={[25,69.6]} b={[44,69.6]}/>
  <Rail a={[44,52]} b={[44,69.6]}/><Rail a={[39.75,52]} b={[44,52]}/>
  <Rail a={[17,61.25]} b={[24.4,61.25]}/>
 </>;}

function Floor({floor,options,active,onRoom,selected,mode,position}) {
  const {cut,ceilings,furniture,labels,doorsOpen,explode}=options;
  const lift=explode?(floor.elevation<0?-12:floor.elevation>0?12:0):0;
  const extras=useMemo(()=>{
    const out=[];
    if(floor.id==='first'){
      // Front terrace return and open-kitchen separation are visible in the source.
      out.push(block(41.75,-.375,57,4.75,.75,10,'slab'));
      for(let i=0;i<28;i++)out.push(block(6,.036,20.5+i,10.5,.018,.025,'stone'));
      for(let i=0;i<19;i++)out.push(block(25.5+i,.036,65.625,.03,.02,8.25,'stone'));
    }
    if(floor.id==='ground'){
      out.push(block(34.3125,-.375,59.8125,19.625,.75,15.375,'slab'));
      for(const x of [25,43.6])out.push(block(x,5,66.7,.7,10,.7,'stone'));
      for(let i=0;i<3;i++)out.push(block(20.4,-.15-i*.16,67.1+i*.55,8.3,.3,.65,'stone'));
    }
    return out;
  },[floor]);
  return <group position={[0,(floor.elevation+lift)*FT,0]}>
    <Surface polygon={floor.footprint} holes={floor.holes} depth={SLAB} material="stone"/>
    {floor.rooms.map(r=><group key={r.id}>
      {r.type!=='circulation'&&<Surface polygon={roomPolygon(r)} y={.024} depth={.025} material={r.type==='bedroom'||r.type==='office'?'oak':r.type==='outdoor'?'stone':r.type==='bath'?'tile':'marble'} color={selected===r.id?'#d6e5d1':undefined} onClick={e=>{if(mode==='walk')return;e.stopPropagation();onRoom(r.id);}}/>}
    </group>)}
    {floor.id==='basement'&&floor.courts.map(r=><Surface key={r.id} polygon={roomPolygon(r)} y={-.04} depth={.2} material="court"/>)}
    <Walls floor={floor} cut={cut&&mode!=='walk'} doorsOpen={doorsOpen}/>
    {furniture&&<Furniture rooms={floor.rooms}/>}
    {furniture&&floor.id==='first'&&<OpenKitchen/>}
    <InteriorDetails floor={floor} ceilings={ceilings} cut={cut&&mode!=='walk'} furniture={furniture} mode={mode} position={position} quality={options.quality}/>
    <Blocks items={extras}/>
    {floor.id==='first'&&<FirstRails/>}
    {floor.id==='ground'&&<><Rail a={[22,40.4]} b={[22,47.8]}/><Rail a={[22,40.15]} b={[31,40.15]}/></>}
    {floor.id!=='first'&&<Stairs/>}
    {floor.id==='first'&&options.isolate&&<Stairs base={-10.75}/>}
    {floor.id==='basement'&&<group position={[0,-floor.elevation*FT,0]}><Stairs external/></group>}
    {ceilings&&floor.id!=='first'&&floor.rooms.filter(r=>!['outdoor','court'].includes(r.type)&&!r.noWalls).map(r=><Surface key={`ceiling-${r.id}`} polygon={roomPolygon(r)} y={WALL_HEIGHT+SLAB} depth={SLAB} material="roof"/>)}
    {ceilings&&floor.id==='first'&&<Surface polygon={[[0,0],[38.75,0],[38.75,52.125],[39.875,52.125],[39.875,61.25],[24.75,61.25],[24.75,55.875],[16.25,55.875],[16.25,68.5],[0,68.5],[0,49.125],[11.5,49.125],[11.5,20],[0,20]]} y={WALL_HEIGHT+SLAB} depth={SLAB} material="roof"/>}
  </group>;
}

function Site(){
  const items=useMemo(()=>{
    const b=[];
    // Ground paving is subdivided around basement light wells, never a covering plane.
    b.push(block(7.625,-.58,76.125,27,.5,17,'grass'));
    b.push(block(32.7,-.59,76.125,22.85,.5,17,'stone'));
    b.push(block(-5,-.59,31,1.75,.5,72,'stone'));
    b.push(block(43.25,-.59,31,1.75,.5,72,'stone'));
    b.push(block(19,-.59,-4,50,.5,2.75,'stone'));
    // Boundary is low in study mode to preserve visibility.
    b.push(block(-5.875,1.25,39.625,.35,3,90,'stone'));b.push(block(44.125,1.25,39.625,.35,3,90,'stone'));
    b.push(block(19.125,1.25,-5.375,50,3,.35,'stone'));b.push(block(7.2,1.25,84.625,26,3,.35,'stone'));
    b.push(block(23,1.25,84.625,4,3,.35,'metal'));b.push(block(35.3,1.25,84.625,16.5,3,.35,'metal'));
    for(let i=0;i<9;i++)b.push(block(22.8+i*2.4,-.31,76,0.025,.025,17,'cap'));
    return b;
  },[]);
  return <Blocks items={items}/>;
}

export default function House({floorId,options,onRoom,selected,mode,position}) {
  const active=FLOORS.find(f=>f.id===floorId);
  const visibleFloors=FLOORS.filter(f=>{
    if(mode==='walk')return true;
    if(options.isolate)return f.id===floorId;
    return !options.hideUpper||f.elevation<=active.elevation;
  });
  return <>
    {options.site&&floorId!=='basement'&&<><Site/><Landscape/></>}
    {visibleFloors.map(f=><Floor key={f.id} floor={f} options={options} active={f.id===floorId} onRoom={onRoom} selected={selected} mode={mode} position={position}/>)}
  </>;
}

