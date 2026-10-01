import test from 'node:test';
import assert from 'node:assert/strict';
import { joystickVector, movementVector, resetTouch } from '../src/lib/touch-input.js';
test('thumb control has a dead zone, proportional speed and bounded diagonal input',()=>{
  assert.deepEqual(joystickVector(2,-2),{side:0,forward:0,x:0,y:0});
  const half=joystickVector(0,-20),full=joystickVector(0,-90),diagonal=joystickVector(90,-90);
  assert.ok(half.forward>0&&half.forward<full.forward);assert.equal(full.forward,1);
  assert.ok(Math.abs(Math.hypot(diagonal.side,diagonal.forward)-1)<1e-9);
  assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.y)-40)<1e-9);
});
test('touch and keyboard travel use the camera heading without faster diagonals',()=>{
  assert.deepEqual(movementVector(1,0,0),{x:0,z:-4.5});
  const east=movementVector(1,0,-Math.PI/2);assert.ok(Math.abs(east.x-4.5)<1e-9);
  const diagonal=movementVector(1,1,0);assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.z)-4.5)<1e-9);
  const analog=movementVector(.25,0,0);assert.equal(analog.z,-1.125);
});
test('cancellation and pause clear both movement and unconsumed look input',()=>{
  const input={side:1,forward:.5,lookX:90,lookY:12,wake:()=>{}};const wake=input.wake;
  resetTouch(input);assert.deepEqual([input.side,input.forward,input.lookX,input.lookY],[0,0,0,0]);assert.equal(input.wake,wake);
});
