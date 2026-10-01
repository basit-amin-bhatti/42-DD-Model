export function joystickVector(dx,dy,radius=40){
  const length=Math.hypot(dx,dy),distance=Math.min(length/radius,1);
  if(distance<.12)return {side:0,forward:0,x:0,y:0};
  const power=(distance-.12)/.88,scale=power/(length||1);
  return {side:dx*scale,forward:-dy*scale,x:dx/(length||1)*distance*radius,y:dy/(length||1)*distance*radius};
}
export function movementVector(forward,side,yaw,speed=4.5){
  const scale=speed/Math.max(1,Math.hypot(forward,side));
  return {x:(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*scale,z:(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*scale};
}
export function resetTouch(input){input.forward=0;input.side=0;input.lookX=0;input.lookY=0;}
