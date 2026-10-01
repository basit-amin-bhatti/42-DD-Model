import { useEffect, useRef } from 'react';
import { Move, Hand } from 'lucide-react';
import { joystickVector, resetTouch } from '../lib/touch-input.js';
export default function TouchControls({input,paused}){
  const stick=useRef(),thumb=useRef(),pointer=useRef(null),center=useRef([0,0]);
  const release=()=>{pointer.current=null;resetTouch(input.current);if(thumb.current)thumb.current.style.transform='translate(0px,0px)';input.current.wake?.();};
  const end=e=>{if(e.pointerId===pointer.current)release();};
  useEffect(()=>{if(paused)release();const stop=()=>release();window.addEventListener('blur',stop);document.addEventListener('visibilitychange',stop);return()=>{release();window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',stop);};},[paused,input]);
  const move=e=>{if(pointer.current!==e.pointerId||paused)return;const v=joystickVector(e.clientX-center.current[0],e.clientY-center.current[1]);input.current.side=v.side;input.current.forward=v.forward;thumb.current.style.transform=`translate(${v.x}px,${v.y}px)`;input.current.wake?.();};
  return <div className={`touch-controls ${paused?'paused':''}`}>
    <div className="move-control"><span>MOVE</span><div ref={stick} className="joystick" role="group" aria-label="Touch movement joystick" onPointerDown={e=>{if(paused||pointer.current!==null)return;e.preventDefault();e.stopPropagation();pointer.current=e.pointerId;const rect=e.currentTarget.getBoundingClientRect();center.current=[rect.left+rect.width/2,rect.top+rect.height/2];e.currentTarget.setPointerCapture(e.pointerId);move(e);}} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}><div className="joystick-guides">＋</div><div ref={thumb} className="joystick-thumb"><Move size={20}/></div></div></div>
    <div className="touch-look-hint"><Hand size={16}/><span>Swipe to look</span></div>
  </div>;
}
