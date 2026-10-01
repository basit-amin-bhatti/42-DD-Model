import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FT, getFloor, FLOORS } from '../data/house.js';
import { furnishedMove, roomArrival } from '../lib/furniture-collision.js';
import { movementVector, resetTouch } from '../lib/touch-input.js';

const EYE=5.5;
export default function Navigation({floorId,mode,view,resetKey,options,onPosition,onLock,teleport,touchInput,handheld,paused}) {
  const {camera,gl,size,invalidate}=useThree();
  const orbit=useRef(),keys=useRef(new Set()),locked=useRef(false),active=useRef(false),dragging=useRef(false),angles=useRef({yaw:0,pitch:0});
  const feet=useRef([20,0,56]),lastReport=useRef(0);
  const velocity=useRef(new THREE.Vector2()),visualY=useRef(EYE),smoothLook=useRef({yaw:0,pitch:0});
  const walkContext=useRef(null);
  const doorsOpenRef=useRef(options.doorsOpen);doorsOpenRef.current=options.doorsOpen;
  const furnitureRef=useRef(options.furniture);furnitureRef.current=options.furniture;
  useEffect(()=>{
    const floor=getFloor(floorId),lift=options.explode?(floor.elevation<0?-12:floor.elevation>0?12:0):0;
    if(mode==='walk'){
      const context=`${floorId}:${resetKey}`;
      if(walkContext.current===context)return;
      walkContext.current=context;
      feet.current=[floor.spawn[0],floor.elevation,floor.spawn[1]];
      camera.position.set(feet.current[0]*FT,(feet.current[1]+EYE)*FT,feet.current[2]*FT);
      const yaw=floor.id==='first'?-Math.PI/2:0;
      angles.current={yaw,pitch:0};camera.rotation.set(0,yaw,0,'YXZ');
      smoothLook.current={yaw,pitch:0};velocity.current.set(0,0);visualY.current=floor.elevation+EYE;keys.current.clear();
      resetTouch(touchInput.current);
      camera.fov=62;camera.updateProjectionMatrix();
      onPosition([...feet.current,0]);invalidate();return;
    }
    walkContext.current=null;
    const y=(floor.elevation+lift)*FT,center=new THREE.Vector3(19*FT,y+1,34*FT);
    camera.fov=view==='top'?34:38;camera.updateProjectionMatrix();
    const framing=Math.max(1,size.height/size.width);
    if(view==='top')camera.position.set(center.x,y+42*framing,center.z+.001);
    else if(view==='front')camera.position.set(25*FT,y+7,105*FT);
    else camera.position.set(center.x+23*framing,y+28*framing,center.z+31*framing);
    camera.lookAt(center);
    if(orbit.current){orbit.current.target.copy(center);orbit.current.update();}
    invalidate();
  },[floorId,mode,view,resetKey,options.explode,size.width,size.height]);

  useEffect(()=>{
    if(mode!=='walk'||!teleport)return;
    const f=getFloor(teleport.floorId),r=f.rooms.find(r=>r.id===teleport.roomId);
    if(!r)return;
    const arrival=roomArrival(r,f,options.furniture);
    if(arrival){
      const [x,z]=arrival;
      const yaw=Math.atan2(x-r.x-r.w/2,z-r.z-r.d/2);
      angles.current={yaw,pitch:0};smoothLook.current={yaw,pitch:0};camera.rotation.set(0,yaw,0,'YXZ');
      feet.current=[x,f.elevation,z];visualY.current=f.elevation+EYE;velocity.current.set(0,0);camera.position.set(x*FT,(f.elevation+EYE)*FT,z*FT);onPosition([...feet.current,0]);invalidate();
    }
  },[teleport,mode]);

  useEffect(()=>{touchInput.current.wake=invalidate;return()=>{touchInput.current.wake=null;};},[touchInput,invalidate]);
  useEffect(()=>{
    const el=gl.domElement;let pointer=null,lastX=0,lastY=0;
    const down=e=>{if(mode!=='walk'||!handheld||paused||pointer!==null)return;e.preventDefault();pointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;el.setPointerCapture(pointer);active.current=true;onLock(true);invalidate();};
    const move=e=>{if(e.pointerId!==pointer)return;touchInput.current.lookX+=e.clientX-lastX;touchInput.current.lookY+=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;invalidate();};
    const up=e=>{if(e.pointerId===pointer)pointer=null;};
    el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);
    return()=>{if(pointer!==null&&el.hasPointerCapture(pointer))el.releasePointerCapture(pointer);el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('lostpointercapture',up);};
  },[mode,handheld,paused,gl,invalidate,onLock,touchInput]);

  useEffect(()=>{
    const el=gl.domElement;
    el.tabIndex=0;
    resetTouch(touchInput.current);velocity.current.set(0,0);keys.current.clear();
    active.current=mode==='walk'&&handheld&&!paused;onLock(active.current);
    if(paused&&document.pointerLockElement===el)document.exitPointerLock();
    const change=()=>{locked.current=document.pointerLockElement===el;active.current=mode==='walk'&&!paused&&(locked.current||handheld);onLock(active.current);if(!active.current)keys.current.clear();};
    const move=e=>{if(handheld||paused||(!locked.current&&!dragging.current)||!active.current||mode!=='walk')return;angles.current.yaw-=e.movementX*.002;angles.current.pitch=THREE.MathUtils.clamp(angles.current.pitch-e.movementY*.002,-1.45,1.45);invalidate();};
    const keydown=e=>{
      if(mode!=='walk'||paused||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
      const code=e.code||({w:'KeyW',a:'KeyA',s:'KeyS',d:'KeyD',ArrowUp:'ArrowUp',ArrowDown:'ArrowDown',ArrowLeft:'ArrowLeft',ArrowRight:'ArrowRight',Escape:'Escape'}[e.key]);
      if(code==='Escape'){active.current=false;onLock(false);keys.current.clear();return;}
      if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(code))e.preventDefault();
      // A quick tap must move even if keyup arrives before the next animation frame.
      if(active.current&&!e.repeat&&!keys.current.has(code)){
        const forward=['KeyW','ArrowUp'].includes(code)?1:['KeyS','ArrowDown'].includes(code)?-1:0;
        const side=['KeyD','ArrowRight'].includes(code)?1:['KeyA','ArrowLeft'].includes(code)?-1:0;
        const yaw=angles.current.yaw;
        feet.current=furnishedMove(feet.current,(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*.16,(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*.16,doorsOpenRef.current,furnitureRef.current);
      }
      keys.current.add(code);
      invalidate();
    };
    const keyup=e=>{keys.current.delete(e.code);invalidate();};
    const start=()=>{if(mode!=='walk'||paused)return;active.current=true;onLock(true);el.focus();invalidate();if(!handheld&&!document.pointerLockElement){try{const p=el.requestPointerLock();p?.catch?.(()=>{active.current=true;onLock(true);});}catch{active.current=true;onLock(true);}}};
    const down=()=>{dragging.current=true;},up=()=>{dragging.current=false;};
    const blur=()=>{keys.current.clear();resetTouch(touchInput.current);velocity.current.set(0,0);active.current=false;onLock(false);};
    const visibility=()=>{if(document.hidden)blur();else if(handheld&&mode==='walk'&&!paused){active.current=true;onLock(true);invalidate();}};
    el.addEventListener('mousedown',down);document.addEventListener('mouseup',up);
    el.addEventListener('click',start);document.addEventListener('pointerlockchange',change);document.addEventListener('mousemove',move);
    window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);
    window.addEventListener('focus',visibility);
    document.addEventListener('visibilitychange',visibility);
    return ()=>{el.removeEventListener('mousedown',down);document.removeEventListener('mouseup',up);el.removeEventListener('click',start);document.removeEventListener('pointerlockchange',change);document.removeEventListener('mousemove',move);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);window.removeEventListener('focus',visibility);document.removeEventListener('visibilitychange',visibility);keys.current.clear();active.current=false;resetTouch(touchInput.current);if(document.pointerLockElement===el)document.exitPointerLock();};
  },[mode,gl,onLock,handheld,paused,invalidate,touchInput]);

  useFrame((state,delta)=>{
    if(mode!=='walk')return;
    if(active.current&&!paused){
      const k=keys.current;
      const input=touchInput.current;
      angles.current.yaw-=input.lookX*.004;angles.current.pitch=THREE.MathUtils.clamp(angles.current.pitch-input.lookY*.004,-1.45,1.45);input.lookX=0;input.lookY=0;
      const forward=(k.has('KeyW')||k.has('ArrowUp')?1:0)-(k.has('KeyS')||k.has('ArrowDown')?1:0)+input.forward;
      const side=(k.has('KeyD')||k.has('ArrowRight')?1:0)-(k.has('KeyA')||k.has('ArrowLeft')?1:0)+input.side;
      const dt=Math.min(delta,.04);
      const yaw=angles.current.yaw;
      const {x:targetX,z:targetZ}=movementVector(forward,side,yaw,k.has('ShiftLeft')?9:4.5);
      const easing=1-Math.exp(-12*dt);velocity.current.x=THREE.MathUtils.lerp(velocity.current.x,targetX,easing);velocity.current.y=THREE.MathUtils.lerp(velocity.current.y,targetZ,easing);
      const dx=velocity.current.x*dt,dz=velocity.current.y*dt;
      // Small bounded substeps keep movement from tunnelling through partitions.
      const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.18));
      for(let i=0;i<n;i++)feet.current=furnishedMove(feet.current,dx/n,dz/n,options.doorsOpen,options.furniture);
      visualY.current=THREE.MathUtils.damp(visualY.current,feet.current[1]+EYE,15,dt);
      smoothLook.current.yaw=THREE.MathUtils.damp(smoothLook.current.yaw,yaw,24,dt);smoothLook.current.pitch=THREE.MathUtils.damp(smoothLook.current.pitch,angles.current.pitch,24,dt);
      camera.position.set(feet.current[0]*FT,visualY.current*FT,feet.current[2]*FT);
      camera.rotation.set(smoothLook.current.pitch,smoothLook.current.yaw,0,'YXZ');
      if(Math.hypot(velocity.current.x,velocity.current.y)>.01||Math.abs(smoothLook.current.yaw-yaw)>.0005||Math.abs(smoothLook.current.pitch-angles.current.pitch)>.0005||Math.abs(visualY.current-feet.current[1]-EYE)>.001)invalidate();
    }
    if(state.clock.elapsedTime-lastReport.current>.15){lastReport.current=state.clock.elapsedTime;onPosition([...feet.current,angles.current.yaw]);}
  });
  return mode==='orbit'?<OrbitControls ref={orbit} enabled={!paused} makeDefault enableDamping dampingFactor={.09} minDistance={5} maxDistance={140} maxPolarAngle={Math.PI*.495} minPolarAngle={.002} screenSpacePanning/>:null;
}
