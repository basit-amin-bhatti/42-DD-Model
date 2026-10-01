import { FLOORS, roomPolygon } from '../data/house.js';
export default function MiniMap({floorId,position,mode,selected,onRoom}) {
  const f=mode==='walk'&&position?FLOORS.reduce((a,b)=>Math.abs(b.elevation-position[1])<Math.abs(a.elevation-position[1])?b:a):FLOORS.find(f=>f.id===floorId);
  return <div className="minimap"><div className="minimap-title"><span>{mode==='walk'?'YOUR POSITION':'PLAN LOCATOR'}</span><b>{f.code}</b></div><svg viewBox="-6 -5 52 78" role="img" aria-label={`${f.name} plan locator`}>
    <polygon points={f.footprint.map(p=>p.join(',')).join(' ')} fill="#e5e8df" stroke="#a5afa6" strokeWidth=".5"/>
    {f.rooms.map(r=><polygon key={r.id} className="map-room" role="button" tabIndex={0} aria-label={r.name+" · "+r.label} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onRoom(r.id);}}} onClick={()=>onRoom(r.id)} points={roomPolygon(r).map(p=>p.join(',')).join(' ')} fill={r.id===selected?'#609379':r.type==='outdoor'?'#c5d0b8':'#d0d7cb'} stroke="#f5f6f1" strokeWidth=".5"><title>{r.name} · {r.label}</title></polygon>)}
    {f.holes.map((p,i)=><polygon key={i} points={p.map(p=>p.join(',')).join(' ')} fill="#f9faf5" stroke="#a6b1a4" strokeDasharray="1 1" strokeWidth=".35"/>)}
    {mode==='walk'&&position&&<g transform={`translate(${position[0]},${position[2]}) rotate(${-position[3]*180/Math.PI})`}><path d="M 0 -5 L -2.5 -1 L 2.5 -1 Z" fill="#336951" opacity=".25"/><circle r="1.35" fill="#286445" stroke="white" strokeWidth=".5"/></g>}
  </svg><span className="map-front">FRONT / ARRIVAL ↓</span></div>;
}
