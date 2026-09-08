/* Original articulated coating-cell animation. No source video or frame sequence. */
(function(){
  'use strict';
  const host=document.querySelector('.story-visual');
  if(!host||!window.THREE||!window.CoatingMath)return;
  const T=window.THREE,M=window.CoatingMath;
  let renderer;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,window.innerWidth<=900?1.25:1.6));
  renderer.setClearColor(0x0c0e0f,0);renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.domElement.id='coating-canvas';renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,1,.1,80);
  scene.fog=new T.FogExp2(0x0c0e0f,.036);
  scene.add(new T.HemisphereLight(0xdbeaff,0x20140d,1.7));
  function light(color,intensity,x,y,z){const a=new T.DirectionalLight(color,intensity);a.position.set(x,y,z);scene.add(a);return a}
  const key=light(0xffe5cb,4,-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=6;key.shadow.camera.bottom=-5;key.shadow.normalBias=.035;
  light(0x96bdff,2.5,4,3,-4);light(0xff9552,1.3,-4,2,-3);
  const room=new T.Scene();room.background=new T.Color(0x30353b);
  for(const v of [[0,5,0,8,.1,5,0xffffff],[-5,1,2,.1,4,6,0xbed4ed],[4,2,-3,.1,5,3,0xffc79d]]){const box=new T.Mesh(new T.BoxGeometry(v[3],v[4],v[5]),new T.MeshBasicMaterial({color:v[6]}));box.position.set(v[0],v[1],v[2]);room.add(box)}
  const pmrem=new T.PMREMGenerator(renderer);const environment=pmrem.fromScene(room,.05);scene.environment=environment.texture;pmrem.dispose();
  room.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});
  const orange=new T.MeshStandardMaterial({color:0xcb6126,metalness:.62,roughness:.29});
  const graphite=new T.MeshStandardMaterial({color:0x1e2429,metalness:.75,roughness:.32});
  const steel=new T.MeshStandardMaterial({color:0xa2b0b7,metalness:.95,roughness:.25});
  const black=new T.MeshStandardMaterial({color:0x090c0e,metalness:.2,roughness:.6});
  const edgeMat=new T.LineBasicMaterial({color:0xeebf90,transparent:true,opacity:.7,depthWrite:false});
  const robot=new T.Group();scene.add(robot);const edges=[];
  function mesh(geometry,mat,parent,x=0,y=0,z=0,edge=true){const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);if(edge){const wire=new T.LineSegments(new T.EdgesGeometry(geometry,26),edgeMat);m.add(wire);edges.push(wire)}return m}
  function box(w,h,d,mat,parent,x=0,y=0,z=0){return mesh(new T.BoxGeometry(w,h,d),mat,parent,x,y,z)}
  function cyl(r1,r2,h,mat,parent,x=0,y=0,z=0,segments=40){return mesh(new T.CylinderGeometry(r1,r2,h,segments),mat,parent,x,y,z)}
  function bolt(parent,x,y,z,r=.035){const m=cyl(r,r,.07,steel,parent,x,y,z,6);return m}
  const base=new T.Group();base.position.x=-1.35;robot.add(base);
  box(.98,.13,.86,graphite,base,0,.08);cyl(.37,.47,.32,graphite,base,0,.30);cyl(.34,.36,.40,orange,base,0,.61);cyl(.32,.32,.13,black,base,0,.87);
  for(const x of [-.36,.36])for(const z of [-.30,.30])bolt(base,x,.17,z,.045);
  const arm=new T.Group();robot.add(arm);
  const shoulder=cyl(.28,.28,.51,orange,arm);shoulder.rotation.x=Math.PI/2;
  const shoulderCap=cyl(.19,.19,.55,graphite,arm);shoulderCap.rotation.x=Math.PI/2;
  const upper=new T.Group(),fore=new T.Group(),wrist=new T.Group();arm.add(upper,fore,wrist);
  function link(length,width,group){
    const sh=new T.Shape();sh.moveTo(.08,-width*.5);sh.lineTo(length-.15,-width*.35);sh.quadraticCurveTo(length+.05,0,length-.15,width*.35);sh.lineTo(.08,width*.5);sh.quadraticCurveTo(-.15,0,.08,-width*.5);
    const geo=new T.ExtrudeGeometry(sh,{depth:.29,bevelEnabled:true,bevelThickness:.055,bevelSize:.05,bevelSegments:3,steps:1,curveSegments:8});geo.translate(0,0,-.145);
    mesh(geo,orange,group);box(length*.59,width*.38,.325,graphite,group,length*.47,0,0);
    for(const x of [.10,length-.12]){const j=cyl(width*.47,width*.47,.43,graphite,group,x,0,0);j.rotation.x=Math.PI/2;const c=cyl(width*.31,width*.31,.455,steel,group,x,0,0);c.rotation.x=Math.PI/2;
      for(let i=0;i<4;i++){const a=i*Math.PI/2;const b=bolt(group,x+Math.cos(a)*width*.22,Math.sin(a)*width*.22,.24,.025);b.rotation.x=Math.PI/2;}}
  }
  link(1.65,.38,upper);link(1.55,.29,fore);
  const motor=box(.43,.33,.5,graphite,upper,.22,.28);cyl(.13,.13,.56,black,upper,.22,.28).rotation.x=Math.PI/2;
  cyl(.17,.20,.26,orange,wrist,0,.20);cyl(.115,.145,.24,steel,wrist,0,-.015);cyl(.060,.105,.23,graphite,wrist,0,-.23);cyl(.028,.06,.13,steel,wrist,0,-.4);
  for(let i=0;i<4;i++)cyl(.12,.12,.023,graphite,wrist,0,-.08+i*.045);
  const cablePoints=[new T.Vector3(0,.22,-.26),new T.Vector3(.4,.35,-.27),new T.Vector3(.9,.30,-.27),new T.Vector3(1.45,.08,-.26)];
  mesh(new T.TubeGeometry(new T.CatmullRomCurve3(cablePoints),24,.043,8,false),black,upper,0,0,0,false);
  const table=new T.Group();table.position.set(.85,0,0);scene.add(table);
  cyl(.64,.7,.12,graphite,table,0,.06);cyl(.28,.36,.27,graphite,table,0,.25);cyl(.71,.58,.10,steel,table,0,.435);
  const disc=new T.Group();table.add(disc);disc.position.y=.54;
  const shape=new T.Shape();shape.absarc(0,0,.86,0,Math.PI*2,false);
  const center=new T.Path();center.absarc(0,0,.15,0,Math.PI*2,true);shape.holes.push(center);
  for(let i=0;i<6;i++){let a=i*Math.PI/3;let hole=new T.Path();hole.absarc(Math.cos(a)*.70,Math.sin(a)*.70,.057,0,Math.PI*2,true);shape.holes.push(hole)}
  const discGeo=new T.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:true,bevelThickness:.014,bevelSize:.014,bevelSegments:2,steps:1,curveSegments:48});discGeo.rotateX(-Math.PI/2);
  const coatUniform={value:0};
  const discMaterial=new T.MeshStandardMaterial({color:0x69757f,metalness:.92,roughness:.40});
  discMaterial.onBeforeCompile=shader=>{
    shader.uniforms.uCoat=coatUniform;
    shader.vertexShader='varying vec3 vSurface;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSurface = position;');
    shader.fragmentShader='uniform float uCoat; varying vec3 vSurface;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float a = (atan(vSurface.z, vSurface.x) + 3.14159265) / 6.2831853;
      float covered = 1.0 - smoothstep(uCoat - 0.018, uCoat + 0.018, a);
      if(uCoat < 0.001) covered=0.0;
      if(uCoat > 0.999) covered=1.0;
      float machining = sin(length(vSurface.xz) * 650.0) * 0.028;
      vec3 raw = vec3(0.34,0.39,0.44) + machining;
      vec3 coated = vec3(0.72,0.76,0.77) + machining * 0.22;
      diffuseColor.rgb = mix(raw, coated, covered);
    `);
  };
  mesh(discGeo,discMaterial,disc,0,0,0,false);
  const guide=new T.Mesh(new T.TorusGeometry(1.02,.005,5,100),new T.MeshBasicMaterial({color:0xdca374,transparent:true,opacity:.32}));guide.rotation.x=Math.PI/2;guide.position.y=.72;table.add(guide);
  const floor=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshStandardMaterial({color:0x0c1014,metalness:.18,roughness:.78}));floor.rotation.x=-Math.PI/2;floor.position.y=-.015;floor.receiveShadow=true;scene.add(floor);
  const grid=new T.GridHelper(10,25,0x59666e,0x303c43);grid.position.y=.001;grid.material.transparent=true;grid.material.opacity=.2;scene.add(grid);
  const glow=new T.PointLight(0xffa145,0,3.5,2);scene.add(glow);
  const particleCount=550,positions=new Float32Array(particleCount*3),sizes=new Float32Array(particleCount);
  for(let i=0;i<particleCount;i++)sizes[i]=.5+(Math.sin(i*81.37)*43758.5%1+1)%1;
  const particlesGeo=new T.BufferGeometry();particlesGeo.setAttribute('position',new T.BufferAttribute(positions,3));particlesGeo.setAttribute('aSize',new T.BufferAttribute(sizes,1));
  const particlesMat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uStrength:{value:0},uRatio:{value:Math.min(devicePixelRatio||1,1.6)}},vertexShader:'attribute float aSize; uniform float uRatio; varying float vSize; void main(){vSize=aSize;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((2.0+aSize*4.0)*uRatio*4.0/-mv.z,1.0,14.0);}',fragmentShader:'uniform float uStrength; varying float vSize; void main(){float r=length(gl_PointCoord-0.5)*2.0;float a=pow(max(0.0,1.0-r),2.0)*uStrength;gl_FragColor=vec4(mix(vec3(1.0,0.24,0.035),vec3(1.0,0.96,0.68),vSize),a);}' });
  const sparks=new T.Points(particlesGeo,particlesMat);sparks.frustumCulled=false;scene.add(sparks);
  const solids=[orange,graphite,steel,black];solids.forEach(m=>{m.transparent=true});
  let width=0,height=0,lastP=0,disposed=false;
  function resize(){const b=host.getBoundingClientRect();if(width!==b.width||height!==b.height){width=b.width;height=b.height;const density=Math.min(devicePixelRatio||1,window.innerWidth<=900?1.25:1.6);renderer.setPixelRatio(density);particlesMat.uniforms.uRatio.value=density;renderer.setSize(width,height,false);camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix()}}
  function draw(p){
    if(disposed)return;lastP=p;resize();const s=M.sample(p),e=1-s.assemble;
    base.position.y=e*.05;arm.position.set(-1.35-e*.16,1.0+e*.30,0);arm.rotation.y=s.ik.yaw;
    upper.rotation.z=s.ik.a;upper.position.set(-e*.12,e*.35,0);
    fore.position.set(s.ik.ex+e*.25,s.ik.ey+e*.7,0);fore.rotation.z=s.ik.b;
    wrist.position.set(s.ik.r+e*.5,s.ik.y+e*.95,0);
    robot.position.x=-s.finish*.65;robot.position.z=-s.finish*.2;
    const opacity=.10+.90*M.ease((p-.035)/.235);solids.forEach(m=>{m.opacity=opacity});edgeMat.opacity=(1-M.ease((p-.16)/.16))*.75;
    edges.forEach(edge=>{edge.visible=edgeMat.opacity>.002});guide.material.opacity=(1-s.finish)*(.15+.22*e);guide.rotation.z=s.process*1.8;
    grid.material.opacity=.17*(1-s.finish);disc.rotation.y=-s.process*Math.PI*1.4;coatUniform.value=s.process;
    glow.position.set(s.x,.80,s.z);glow.intensity=s.spray*5;particlesMat.uniforms.uStrength.value=s.spray;
    const frac=x=>x-Math.floor(x),tipY=s.y-.465;
    for(let i=0;i<particleCount;i++){
      const u=frac(i*.61803398875+s.process*14),a=i*2.39996,rand=frac(Math.sin(i*91.7)*43758.5453);
      if(i<390){const spread=(.012+u*.058)*Math.sqrt(rand);positions[i*3]=s.x+Math.cos(a)*spread;positions[i*3+1]=tipY+(.665-tipY)*u;positions[i*3+2]=s.z+Math.sin(a)*spread}
      else{const r=u*(.14+rand*.37);positions[i*3]=s.x+Math.cos(a)*r;positions[i*3+1]=.67+Math.sin(u*Math.PI)*(.04+rand*.16);positions[i*3+2]=s.z+Math.sin(a)*r}
    }
    particlesGeo.attributes.position.needsUpdate=true;sparks.visible=s.spray>.001;
    const finish=s.finish,orbit=s.process*.20;
    const portrait=window.innerWidth<=900;
    const near=portrait?new T.Vector3(2.5,3.3,3.3):new T.Vector3(2.4,2.8,2.8),wide=portrait?new T.Vector3(4.0-orbit,3.5,7.8+orbit):new T.Vector3(4.6-orbit,3.25,6.6+orbit);
    if(portrait){const fit=Math.max(1,.83/camera.aspect);wide.multiplyScalar(fit);near.multiplyScalar(Math.max(1,.86/camera.aspect))}
    camera.position.copy(wide.lerp(near,finish));
    const target=new T.Vector3(-.05,portrait?1.42:1.22,0).lerp(new T.Vector3(.77,.66,0),finish);
    camera.lookAt(target);camera.fov=portrait?40:width<height?44:37;camera.updateProjectionMatrix();
    renderer.render(scene,camera);host.classList.add('webgl-ready');
  }
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();host.classList.remove('webgl-ready')});
  renderer.domElement.addEventListener('webglcontextrestored',()=>draw(lastP));
  window.CoatingScene={draw,dispose(){disposed=true;scene.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())}});environment.dispose();renderer.dispose();renderer.domElement.remove();host.classList.remove('webgl-ready');}};
  draw(0);
})();
