(() => {
  const story=document.querySelector('.scroll-story'),stage=document.querySelector('.story-stage');
  const chapters=[...document.querySelectorAll('.story-chapter')],steps=[...document.querySelectorAll('.story-steps li')];
  const bar=document.querySelector('.story-progress div'),caption=document.querySelector('#scene-label');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:900px)'),saveData=!!navigator.connection?.saveData;
  const intro=document.querySelector('.mobile-story-intro'),outro=document.querySelector('.mobile-story-outro'),action=document.querySelector('.mobile-story-action'),cue=document.querySelector('.mobile-scroll-cue'),skip=document.querySelector('.mobile-story-skip');
  let scheduled=false,current=-1,loading=false,loadGeneration=0;
  function loadScript(src){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=reject;document.body.append(el)})}
  async function loadScene(){
    if(loading||window.CoatingScene||reduce.matches||saveData)return;
    const generation=++loadGeneration;loading=true;
    try{if(!window.THREE)await loadScript('three.min.js');if(generation!==loadGeneration||reduce.matches)return;await loadScript('coating-scene.js');if(reduce.matches){window.CoatingScene?.dispose();window.CoatingScene=null}else schedule()}catch(e){document.querySelector('.story-visual').classList.add('scene-fallback')}finally{loading=false}
  }
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))loadScene()},{rootMargin:'100px'});observer.observe(stage);
  function update(){
    scheduled=false;
    const rect=story.getBoundingClientRect(),travel=Math.max(1,story.offsetHeight-stage.offsetHeight);
    const topOffset=mobile.matches?document.querySelector('.site-header').getBoundingClientRect().height:0;
    const p=reduce.matches||saveData?0:CoatingMath.clamp((topOffset-rect.top)/travel),t=CoatingMath.sample(p);
    if(t.chapter!==current){current=t.chapter;chapters.forEach((el,i)=>{el.classList.toggle('active',i===current);el.setAttribute('aria-hidden',String(i!==current))});steps.forEach((el,i)=>el.classList.toggle('active',i===current));caption.textContent=['KINEMATIC STUDY / ASSEMBLE','CONTROLLED ENERGY / COAT','SURFACE STUDY / REVEAL'][current]}
    const starts=[0,.32,.77],ends=[.32,.77,1.1],appear=current===0?1:CoatingMath.ease((p-starts[current])/.045),disappear=current===2?1:1-CoatingMath.ease((p-(ends[current]-.045))/.045);
    chapters.forEach((el,i)=>{el.style.opacity=i===current?appear*disappear:0;el.style.transform=`translateY(${i===current?(1-appear)*18:18}px)`});
    bar.style.transform=`scaleX(${p})`;
    if(mobile.matches){
      const fade=1-CoatingMath.ease((p-.08)/.12),reveal=CoatingMath.ease((p-.81)/.08);
      intro.style.opacity=fade;intro.style.visibility=fade>.01?'visible':'hidden';intro.setAttribute('aria-hidden',String(fade<=.01));
      outro.style.opacity=reveal;outro.style.visibility=reveal>.01?'visible':'hidden';outro.setAttribute('aria-hidden',String(reveal<=.01));outro.inert=reveal<=.01;
      const a=Math.max(fade,reveal);action.style.opacity=a;action.style.visibility=a>.05?'visible':'hidden';action.inert=a<=.05;action.setAttribute('aria-hidden',String(a<=.05));cue.style.opacity=fade;
      if(skip){skip.style.visibility=a<=.05?'visible':'hidden';skip.inert=a>.05;skip.setAttribute('aria-hidden',String(a>.05))}
      stage.style.setProperty('--mobile-reveal',CoatingMath.ease((p-.77)/.17));
    }
    if(rect.bottom>0&&rect.top<innerHeight)window.CoatingScene?.draw(reduce.matches ? 0.28 : p);
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
  function preference(){document.documentElement.classList.toggle('no-story-motion',reduce.matches||saveData);if(reduce.matches||saveData){loadGeneration++;window.CoatingScene?.dispose();window.CoatingScene=null}else if(stage.getBoundingClientRect().top<innerHeight)loadScene();current=-1;schedule()}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',preference);
  addEventListener('pageshow',preference);preference();
  mobile.addEventListener('change',schedule);
})();
