// Decorative objects only. No architectural dimensions or support/collision data
// are authored here. Coordinates are feet, relative to the approved room bounds.
const part=(out,x,y,z,w,h,d,material='wood',shape='box',rotation=0,rx=0,rz=0)=>out.push({x,y,z,w,h,d,material,shape,rotation,rx,rz});
export function plantParts(out,x,z,size=1,base=0){
  part(out,x,base+.48*size,z,.9*size,.95*size,.9*size,'ceramic','cone');
  part(out,x,base+.93*size,z,.76*size,.04,.76*size,'soil','cylinder');
  for(let i=0;i<11;i++){
    const a=i*2.399,r=(.28+i*.035)*size,tipY=base+(1.25+i*.075)*size;
    part(out,x+Math.cos(a)*r*.45,base+1.25*size,z+Math.sin(a)*r*.45,.035,1.1*size,.035,'leafDark','cylinder',0,Math.sin(a)*.3,Math.cos(a)*.3);
    part(out,x+Math.cos(a)*r,tipY,z+Math.sin(a)*r,.36*size,.055*size,.85*size,i%3===0?'leafLight':'leaf','sphere',-a,Math.sin(a)*.55,Math.cos(a)*.4);
  }
}
export function openKitchenParts(){
  const out=[];
  part(out,13.3,1.5,26.4,2.2,3,12,'wood');part(out,13.3,3.07,26.4,2.3,.18,12.1,'marble');
  part(out,13.3,3.2,22.8,1.7,.1,2,'chrome');part(out,13.3,3.2,28,1.8,.1,2,'black');
  part(out,23.6,4,7.6,1.7,8,13.6,'oak');part(out,6,4,50.4,10.5,8,2,'oak');
  for(let i=0;i<6;i++){part(out,14.44,1.6,21.6+i*1.92,.07,2.7,1.86,'cabinet');part(out,14.5,2.65,21.6+i*1.92,.06,.05,1.55,'brass');}
  for(let i=0;i<6;i++)part(out,23,4,1.6+i*2.2,.04,7.85,.025,'darkwood');
  return out;
}
export function furnishRoom(r){
  const out=[];
  const add=(x,y,z,w,h,d,m='wood',shape='box',rot=0,rx=0,rz=0)=>part(out,r.x+x,y,r.z+z,w,h,d,m,shape,rot,rx,rz);
  const rotated=(x,z,rot)=>{const c=Math.cos(rot),s=Math.sin(rot);return (dx,y,dz,w,h,d,m,shape='box',rx=0,rz=0)=>add(x+dx*c+dz*s,y,z-dx*s+dz*c,w,h,d,m,shape,rot,rx,rz);};
  const lamp=(x,z,y=1.8)=>{add(x,y+.05,z,.48,.08,.48,'brass','cylinder');add(x,y+.6,z,.07,1.15,.07,'brass','cylinder');add(x,y+1.12,z,.78,.55,.78,'linen','cone');add(x,y+1.04,z,.52,.15,.52,'emissive','sphere');};
  const books=(x,z,y=1.5)=>{for(let i=0;i<3;i++)add(x+i*.02,y+i*.07,z,.8,.08,.56,i===1?'sage':'darkwood','rounded',i*.09);};
  const vase=(x,z,y)=>{add(x,y+.28,z,.34,.5,.34,'ceramic','cone');add(x,y+.59,z,.08,.35,.08,'brass','cylinder');for(let i=0;i<4;i++)add(x+Math.sin(i)*.16,y+.8+i*.08,z+Math.cos(i)*.12,.22,.04,.42,'leaf','sphere',i);};
  const rug=(x,z,w,d)=>{add(x,.042,z,w,.04,d,'rug','rounded');for(const dx of [-w/2+.16,w/2-.16])add(x+dx,.069,z,.055,.01,d-.28,'linen');for(const dz of [-d/2+.16,d/2-.16])add(x,.069,z+dz,w-.28,.01,.055,'linen');};
  const table=(x,z,w,d,h=1.35)=>{add(x,h,z,w,.18,d,'marble','rounded');add(x,h/2,z,w*.45,h-.16,d*.4,'darkwood','rounded');books(x-.3,z+.2,h+.15);vase(x+.55,z-.3,h+.1);};
  const sofa=(x,z,w=6,rot=0)=>{
    const b=rotated(x,z,rot);
    b(0,.5,0,w,.38,2.85,'darkwood','rounded');b(0,1.05,0,w-.15,.76,2.72,'fabric','rounded');b(0,1.82,-1.12,w-.2,1.65,.5,'fabric','rounded',-.09);
    for(const side of [-1,1]){b(side*(w/2-.18),1.25,0,.5,1.65,2.85,'fabric','rounded');for(const dz of [-1,1])b(side*(w/2-.6),.25,dz,.12,.5,.12,'brass','cylinder');}
    const n=Math.max(1,Math.floor(w/2));for(let i=0;i<n;i++){const dx=(i+.5)*w/n-w/2;b(dx,1.48,.14,w/n-.08,.28,2.25,'linen','rounded');b(dx,2,-.72,w/n-.22,1.3,.38,'linen','rounded',-.13);}
    if(w>4){b(-w*.29,1.97,-.55,1.15,1.15,.4,'sage','pillow',-.1,.15);b(w*.3,1.95,-.6,1.05,1.05,.4,'leather','pillow',-.12,-.12);}
  };
  const chair=(x,z,rot=0)=>{const b=rotated(x,z,rot);b(0,1.42,0,1.55,.3,1.65,'fabric','rounded');b(0,2.13,-.75,1.58,1.45,.28,'fabric','rounded',-.12);for(const dx of [-.58,.58])for(const dz of [-.58,.58])b(dx,.7,dz,.09,1.4,.09,'darkwood','cylinder');};
  const bed=(x,z,w=5.8,rot=0)=>{
    const b=rotated(x,z,rot);
    b(0,.46,0,w+.2,.8,7.2,'wood','rounded');b(0,1.05,0,w,.54,7,'linen','rounded');b(0,1.37,.25,w-.1,.16,6.45,'linen','rounded');
    b(0,2,-3.6,w+1,3.8,.34,'fabric','rounded');for(let i=0;i<6;i++)b(-w/2+(i+.5)*w/6,2.1,-3.79,w/6-.035,3.2,.025,'linen','rounded');
    b(0,1.49,1.25,w-.13,.23,4.25,'sage','pillow');b(0,1.62,-.85,w-.08,.14,.52,'linen','pillow');
    for(let i=0;i<4;i++)b(-w*.33+i*w*.22,1.59,1.1+i*.16,.9,.06,2.5,'sage','pillow',0,0,(i%2-.5)*.02);
    for(const side of [-1,1]){
      b(side*w/4,1.7,-2.55,w/2-.25,.5,1.5,'linen','pillow');b(side*w/4,1.75,-1.55,w/2-.35,.44,1.1,'fabric','pillow');
      b(side*(w/2+1.1),.95,-2.9,1.7,1.9,1.6,'wood','rounded');b(side*(w/2+1.1),1.93,-2.9,1.74,.11,1.65,'marble','rounded');
      b(side*(w/2+1.1),1,-2.06,1.4,.04,.035,'brass');
      const lx=side*(w/2+1.1),lz=-2.9;b(lx,2.15,lz,.4,.06,.4,'brass','cylinder');b(lx,2.6,lz,.055,.95,.055,'brass','cylinder');b(lx,3.1,lz,.72,.54,.72,'linen','cone');b(lx,3,lz,.45,.15,.45,'emissive','sphere');
    }
    b(0,.4,4.3,w*.8,.7,1.5,'fabric','rounded');for(const dx of [-w*.32,w*.32])b(dx,.18,4.3,.08,.35,.08,'brass','cylinder');
  };
  const cabinet=(x,z,w,d,rot=0)=>{
    const b=rotated(x,z,rot),n=Math.max(1,Math.round(w/2));
    for(let i=0;i<n;i++){const xx=-w/2+(i+.5)*w/n;
      b(xx,1.48,0,w/n-.025,2.9,d,'wood');b(xx,3,0,w/n-.015,.17,d+.06,'marble','rounded');b(xx,.16,d/2-.01,w/n-.025,.28,.1,'darkwood');
      b(xx,1.65,d/2+.02,w/n-.04,2.43,.08,'cabinet');b(xx,2.68,d/2+.07,w/n-.28,.035,.06,'brass');}
  };
  const faucet=(x,z,y)=>{add(x,y+.47,z,.07,.85,.07,'chrome','cylinder');add(x,y+.91,z+.24,.07,.06,.52,'chrome','rounded');add(x,y+.82,z+.48,.07,.22,.07,'chrome','cylinder');add(x+.22,y+.16,z,.08,.22,.08,'chrome','cylinder');};
  const kitchen=(small=false)=>{
    cabinet(1.2,r.d/2, r.d-.3,2.35,Math.PI/2);cabinet(r.w/2,r.d-1.2,r.w-.2,2.35,Math.PI);cabinet(r.w/2,1.2,r.w-.2,2.35);
    for(let i=0;i<Math.floor(r.w/2.3);i++){add(1.4+i*2.15,6.5,.72,2.08,2.4,1.3,'cabinet');add(1.4+i*2.15,5.22,1.3,2.1,.04,.07,'emissive');}
    add(1.25,3.09,3,1.78,.025,2.1,'chrome','rounded');add(1.25,3.12,3,1.4,.025,1.6,'dark','rounded');faucet(1.25,2.15,3.12);
    add(r.w*.67,3.11,r.d-1.23,2.5,.045,1.8,'black','rounded');for(const dx of [-.68,.68])for(const dz of [-.43,.43])add(r.w*.67+dx,3.15,r.d-1.23+dz,.62,.02,.62,'metal','cylinder');
    add(r.w*.67,1.75,r.d-2.41,2.3,1.75,.08,'black','rounded');add(r.w*.67,2.55,r.d-2.49,1.9,.07,.08,'chrome');add(r.w*.67,1.74,r.d-2.48,1.9,1.15,.025,'glass');
    add(r.w*.67,6.75,r.d-.85,2.5,.2,1.7,'metal','rounded');add(r.w*.67,7.65,r.d-.5,1.1,1.7,.9,'metal');
    if(!small&&r.w>10){add(r.w-1.4,3.45,1.5,2.5,6.9,2.65,'chrome','rounded');add(r.w-1.4,3.85,2.86,.035,5.7,.025,'dark');for(const dx of [-.17,.17])add(r.w-1.4+dx,4.2,2.94,.06,1.5,.08,'metal');}
    if(r.island){cabinet(r.w*.56,r.d*.45,5,2.6);for(const x of [r.w*.56-1.45,r.w*.56+1.45]){add(x,2.2,r.d*.45+2.1,1.2,.2,1.2,'leather','rounded');add(x,1.15,r.d*.45+2.1,.09,2.1,.09,'metal','cylinder');add(x,.15,r.d*.45+2.1,.85,.09,.85,'metal','cylinder');}}
    add(3,3.2,1.3,.7,.15,.7,'ceramic','cylinder');add(3,3.43,1.3,.4,.42,.4,'ceramic','cylinder');books(4.2,1.4,3.1);vase(r.w*.4,r.d-1.3,3.1);
  };
  switch(r.furniture){
    case 'bed':if(r.bedRotation){bed(4.5,r.d*.45,5.8,Math.PI/2);sofa(r.w-2.1,r.d-3,4,Math.PI/2);rug(r.w*.5,r.d*.5,r.w*.72,r.d*.55);}else{bed(r.w*.57,4.6);sofa(r.w-2,r.d-3.6,4,Math.PI/2);rug(r.w*.57,5.2,8.2,9);}plantParts(out,r.x+r.w-1.1,r.z+1.15,.8);break;
    case 'single-bed':bed(r.w*.4,r.d*.52,3.2);break;
    case 'lounge':rug(r.w*.54,r.d*.57,r.w*.7,r.d*.62);sofa(r.w-2.2,r.d*.49,7,Math.PI/2);sofa(r.w*.57,r.d-2.1,7,Math.PI);sofa(2.2,r.d*.5,5,-Math.PI/2);table(r.w*.54,r.d*.51,3.1,4.8);add(r.w*.52,3.9,.16,5.5,3,.12,'screen','rounded');cabinet(r.w*.52,.72,7.4,1.15);plantParts(out,r.x+r.w-1.1,r.z+1.3,1);if(r.kitchen)cabinet(r.w-4.25,r.d-1.3,7.7,2.3,Math.PI);break;
    case 'drawing':rug(r.w/2,20,11,11);add(r.w/2,2.65,5.8,8,.22,3.5,'wood','rounded');add(r.w/2,1.3,5.8,2.1,2.55,2.2,'darkwood','rounded');for(let i=0;i<4;i++){chair(r.w/2-3+i*2,3.2);chair(r.w/2-3+i*2,8.4,Math.PI);}chair(r.w/2-5.1,5.8,-Math.PI/2);chair(r.w/2+5.1,5.8,Math.PI/2);for(let i=0;i<4;i++)add(r.w/2-3+i*2,2.81,5.8,.65,.045,.65,'ceramic','cylinder');vase(r.w/2,5.8,2.83);sofa(2,19,7,-Math.PI/2);sofa(r.w-2,19,7,Math.PI/2);sofa(r.w/2,r.d-2.1,7,Math.PI);table(r.w/2,20,3,5);plantParts(out,r.x+1.2,r.z+12,1);break;
    case 'kitchen':kitchen(r.w<10);break;
    case 'bath':
      cabinet(r.w-1.25,1.2,2.2,1.8);add(r.w-1.25,3.11,1.2,1.5,.08,1.1,'ceramic','rounded');add(r.w-1.25,3.16,1.2,1.18,.06,.78,'dark','sphere');faucet(r.w-1.25,.58,3.12);
      add(r.w-1.25,5.5,.1,1.95,2.8,.08,'chrome','rounded');
      add(1.3,.65,r.d*.53,1.3,1.3,1.75,'ceramic','sphere');add(1.3,1.4,r.d*.53,1.48,.22,2.05,'ceramic','rounded');add(1.3,1.53,r.d*.53+.1,1,.03,1.3,'dark','sphere');add(1.3,2,r.d*.53-.88,1.45,2.2,.6,'ceramic','rounded');add(1.3,3.17,r.d*.53-.88,.35,.03,.25,'chrome');
      add(r.w/2,.09,r.d-1.7,r.w-.15,.12,3.2,'tile');add(r.w/2,.17,r.d-1.7,.45,.025,.45,'metal');add(r.w-.25,4.6,r.d-1,.06,4.3,.06,'chrome','cylinder');add(r.w-.25,6.75,r.d-1.35,.7,.08,.7,'chrome','cylinder');add(r.w-.25,3.55,r.d-1,.38,.1,.08,'chrome','rounded');
      if(r.w>5)add(r.w*.6,3.75,r.d-3.35,r.w*.7,7.3,.025,'glass');add(r.w*.6,7.45,r.d-3.35,r.w*.7,.04,.04,'chrome');
      add(r.w-2.3,4.3,.2,.75,.07,.12,'chrome');add(r.w-2.3,3.75,.31,.68,1.15,.08,'linen','rounded');break;
    case 'wardrobe':{add(r.w-1.05,4,r.d/2,2,8,r.d-.3,'wood');const n=Math.floor((r.d-.3)/2.1);for(let i=0;i<n;i++){const z=.15+(i+.5)*(r.d-.3)/n;add(r.w-2.1,4,z,.06,7.8,(r.d-.3)/n-.05,'oak');add(r.w-2.16,4,z+.55,.04,1.1,.045,'brass');}add(1.1,.45,r.d*.65,1.6,.65,2.9,'fabric','rounded');break;}
    case 'shelves':for(let i=1;i<5;i++){add(r.w/2,i*1.55,.9,r.w-.2,.12,1.8,'wood');for(let j=1;j<4;j++)add(j*1.8,i*1.55+.55,.85,1.4,1,1.5,'linen','rounded');}break;
    case 'office':add(r.w*.45,2.6,3.5,4,.18,2.5,'wood','rounded');for(const x of [r.w*.45-1.7,r.w*.45+1.7])add(x,1.3,3.5,.1,2.5,2,'metal');chair(r.w*.45,1.6);chair(2,r.d-2,Math.PI);chair(4.4,r.d-2,Math.PI);add(r.w*.45,3.47,3.3,2,1.35,.09,'screen','rounded');add(r.w*.45,2.83,3.4,.08,.38,.08,'metal');add(r.w*.45,2.75,4,.85,.05,.38,'black','rounded');books(r.w*.45+1.1,3.4,2.74);plantParts(out,r.x+1,r.z+1,.6);break;
    case 'bbq':cabinet(1.3,r.d*.55,5,2.4,Math.PI/2);add(1.3,3.35,r.d*.55,2,.45,3.8,'metal','rounded');for(let i=0;i<8;i++)add(1.3,3.61,r.d*.55-1.6+i*.45,1.8,.035,.04,'chrome');table(r.w/2+1,7,4,4,2.4);chair(r.w/2+1,3.8);chair(r.w/2+1,10.2,Math.PI);plantParts(out,r.x+r.w-1,r.z+r.d-1,1.2);break;
    case 'cars':for(const x of [4.5,14]){add(x,1.2,8,6.3,1.8,13.5,'car','rounded');add(x,2.8,7.2,5.5,2.2,7.2,'glass','rounded');add(x,3.9,7.2,5.4,.1,5.2,'car','rounded');for(const dx of [-3.2,3.2])for(const z of [3.8,12]){add(x+dx,.95,z,1.9,.65,1.9,'black','cylinder',0,0,Math.PI/2);add(x+dx,.95,z,1.1,.7,1.1,'chrome','cylinder',0,0,Math.PI/2);}for(const dx of [-2.1,2.1])add(x+dx,1.3,14.7,1.1,.3,.08,'emissive','rounded');}break;
  }
  // Preserve the plan's circulation: modular cabinets and decorative pieces
  // never occupy the inward clearance of an existing door or open passage.
  const clearances=r.openings.filter(o=>o.kind!=='window').map(o=>{
    const pad=.65,depth=2.8;
    if(o.side==='n'||o.side==='s')return {x:r.x+o.at+o.width/2,z:o.side==='n'?r.z+depth/2:r.z+r.d-depth/2,w:o.width+pad*2,d:depth};
    return {x:o.side==='w'?r.x+depth/2:r.x+r.w-depth/2,z:r.z+o.at+o.width/2,w:depth,d:o.width+pad*2};
  });
  return out.filter(b=>{
    if(b.y+b.h/2<.15||b.y-b.h/2>8.3)return true;
    const c=Math.abs(Math.cos(b.rotation||0)),s=Math.abs(Math.sin(b.rotation||0));
    const w=b.w*c+b.d*s,d=b.w*s+b.d*c;
    return !clearances.some(q=>Math.abs(b.x-q.x)<(w+q.w)/2&&Math.abs(b.z-q.z)<(d+q.d)/2);
  });
}
