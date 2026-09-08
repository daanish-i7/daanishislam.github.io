(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CoatingMath=api})(typeof window!=='undefined'?window:globalThis,function(){
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
  function ik(x,y,z,l1=1.65,l2=1.55){
    const r=Math.hypot(x,z),d=Math.hypot(r,y),safe=clamp(d,.05,l1+l2-.001);
    const a=Math.atan2(y,r)+Math.acos(clamp((l1*l1+safe*safe-l2*l2)/(2*l1*safe),-1,1));
    const ex=l1*Math.cos(a),ey=l1*Math.sin(a),b=Math.atan2(y-ey,r-ex);
    return {a,b,ex,ey,r,y,yaw:-Math.atan2(z,x),reachable:d<l1+l2};
  }
  function sample(p){
    p=clamp(p);const assemble=ease(p/.28),process=clamp((p-.32)/.43),finish=ease((p-.77)/.21);
    const angle=process*Math.PI*1.5-.8,radius=.38+.22*process;
    const x=.85+Math.cos(angle)*radius,z=Math.sin(angle)*radius;
    const y=1.27+(1-ease((p-.22)/.10))*.45+finish*.55;
    return {p,assemble,process,finish,x,y,z,spray:ease((p-.30)/.04)*(1-ease((p-.73)/.045)),chapter:p<.32?0:p<.77?1:2,ik:ik(x+1.35,y-1.0,z)};
  }
  return {clamp,ease,ik,sample};
});
