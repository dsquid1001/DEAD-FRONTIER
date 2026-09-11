export class PlayerController {
  constructor(camera, joystickEl, stickEl, lookArea, onDamage) {
    this.camera = camera; this.joystickEl = joystickEl; this.stickEl = stickEl; this.lookArea = lookArea; this.onDamage = onDamage;
    this.position = new camera.position.constructor(0, 1.65, 8);
    this.velocity = {x:0,y:0,z:0}; this.moveSpeed=4.8; this.accel=13; this.drag=16; this.jumpSpeed=5.6; this.gravity=16;
    this.yaw=0; this.pitch=0; this.enabled=true; this.grounded=true; this.keys={}; this.joy={x:0,y:0}; this.joyPointer=null; this.lookPointer=null; this.lastLook={x:0,y:0};
    this.bind(); this.syncCamera();
  }
  bind(){
    addEventListener('keydown',e=>{this.keys[e.code]=true;if(e.code==='Space')this.jump()}); addEventListener('keyup',e=>this.keys[e.code]=false);
    this.joystickEl.addEventListener('pointerdown',e=>{if(!this.enabled)return;this.joyPointer=e.pointerId;this.joystickEl.setPointerCapture(e.pointerId);this.updateJoy(e)});
    this.joystickEl.addEventListener('pointermove',e=>{if(e.pointerId===this.joyPointer)this.updateJoy(e)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(t=>this.joystickEl.addEventListener(t,e=>{if(e.pointerId===this.joyPointer){this.joyPointer=null;this.joy={x:0,y:0};this.stickEl.style.transform='translate(0px,0px)'}}));
    this.lookArea.addEventListener('pointerdown',e=>{if(!this.enabled)return;this.lookPointer=e.pointerId;this.lookArea.setPointerCapture(e.pointerId);this.lastLook.x=e.clientX;this.lastLook.y=e.clientY});
    this.lookArea.addEventListener('pointermove',e=>{if(e.pointerId!==this.lookPointer)return;const dx=e.clientX-this.lastLook.x,dy=e.clientY-this.lastLook.y;this.lastLook.x=e.clientX;this.lastLook.y=e.clientY;this.yaw-=dx*.004;this.pitch-=dy*.003;this.pitch=Math.max(-1.35,Math.min(1.35,this.pitch));this.syncCamera()});
    ['pointerup','pointercancel','lostpointercapture'].forEach(t=>this.lookArea.addEventListener(t,e=>{if(e.pointerId===this.lookPointer)this.lookPointer=null}));
  }
  updateJoy(e){const r=this.joystickEl.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=r.width*.5-36;let x=e.clientX-cx,y=e.clientY-cy;const d=Math.hypot(x,y);if(d>max){x=x/d*max;y=y/d*max}this.joy.x=x/max;this.joy.y=-y/max;this.stickEl.style.transform=`translate(${x}px,${y}px)`}
  jump(){if(this.enabled&&this.grounded){this.velocity.y=this.jumpSpeed;this.grounded=false}}
  setEnabled(v){this.enabled=v;if(!v){this.joy={x:0,y:0};this.velocity.x=this.velocity.z=0}}
  update(dt){if(!this.enabled)return;let x=this.joy.x,y=this.joy.y;if(this.keys.KeyA||this.keys.ArrowLeft)x-=1;if(this.keys.KeyD||this.keys.ArrowRight)x+=1;if(this.keys.KeyW||this.keys.ArrowUp)y+=1;if(this.keys.KeyS||this.keys.ArrowDown)y-=1;const len=Math.hypot(x,y);if(len>1){x/=len;y/=len}const sy=Math.sin(this.yaw),cy=Math.cos(this.yaw);const tx=(cy*x+sy*y)*this.moveSpeed,tz=(sy*x-cy*y)*this.moveSpeed;const rate=len?this.accel:this.drag;const f=1-Math.exp(-rate*dt);this.velocity.x+=(tx-this.velocity.x)*f;this.velocity.z+=(tz-this.velocity.z)*f;this.velocity.y-=this.gravity*dt;this.position.x+=this.velocity.x*dt;this.position.y+=this.velocity.y*dt;this.position.z+=this.velocity.z*dt;if(this.position.y<1.65){this.position.y=1.65;this.velocity.y=0;this.grounded=true}this.position.x=Math.max(-52,Math.min(52,this.position.x));this.position.z=Math.max(-52,Math.min(52,this.position.z));this.syncCamera()}
  syncCamera(){this.camera.position.set(this.position.x,this.position.y,this.position.z);this.camera.rotation.order='YXZ';this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch}
}
