import { Building2, Footprints, Grid2X2, X, DoorOpen } from 'lucide-react';
import { FLOORS } from '../data/house.js';
export default function MobileNavigation({floor,mode,view,selectFloor,orbit,plan,walk,roomsOpen,setRoomsOpen,onRoom}){
  return <>
    <div className="mobile-floor-switch" role="group" aria-label="Switch floor">{FLOORS.map(f=><button key={f.id} aria-pressed={floor.id===f.id} onClick={()=>{setRoomsOpen(false);selectFloor(f.id);}}>{f.short==='Basement'?'Basement':f.id==='ground'?'Ground':'First'}</button>)}</div>
    <button className="mobile-rooms-button" aria-label="Choose a room" aria-expanded={roomsOpen} onClick={()=>setRoomsOpen(!roomsOpen)}><DoorOpen size={18}/><span>Rooms</span></button>
    <nav className="mobile-dock" aria-label="Navigation mode"><button aria-pressed={mode==='orbit'&&view!=='top'} onClick={orbit}><Building2 size={18}/>Explore</button><button aria-pressed={mode==='orbit'&&view==='top'} onClick={plan}><Grid2X2 size={18}/>Plan</button><button aria-pressed={mode==='walk'} onClick={walk}><Footprints size={18}/>Walk</button></nav>
    {roomsOpen&&<section className="mobile-room-sheet" role="dialog" aria-label="Choose a room"><header><div><small>{floor.name}</small><h3>Where would you like to go?</h3></div><button className="icon-button" aria-label="Close room list" onClick={()=>setRoomsOpen(false)}><X size={20}/></button></header><div className="mobile-room-list">{floor.rooms.filter(r=>r.type!=='circulation').map(r=><button key={r.id} onClick={()=>{setRoomsOpen(false);onRoom(r.id);}}><span>{r.name}<small>{r.label}</small></span><DoorOpen size={17}/></button>)}</div></section>}
  </>;
}
