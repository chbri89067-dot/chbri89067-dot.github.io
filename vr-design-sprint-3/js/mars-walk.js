/* Gaze-selected walking along clear routes between the partner's habitats. */
(function () {
  'use strict';
  const THREE=AFRAME.THREE;
  AFRAME.registerComponent('mars-walk',{
    init:function(){
      this.route=[];this.walking=false;this.position=new THREE.Vector3();this.distanceTravelled=0;
      this.destinations={path:{label:'THE PATH',x:0,z:-9},alpha:{label:'HABITAT ALPHA',x:-8,z:-14},beta:{label:'HABITAT BETA',x:8,z:-25},gamma:{label:'HABITAT GAMMA',x:0,z:-38},start:{label:'THE PAD EXIT',x:0,z:-1.5}};
      this.setupBound=()=>this.setup();
      if(this.el.sceneEl.hasLoaded)this.setup();else this.el.sceneEl.addEventListener('loaded',this.setupBound,{once:true});
    },
    setup:function(){
      this.scene=this.el.sceneEl;this.camera=document.getElementById('camera');this.rig=document.getElementById('rig');this.motion=this.el.components['cabin-motion'];
      this.panel=document.createElement('a-entity');this.panel.id='mars-walk-controls';this.panel.setAttribute('visible',false);this.el.appendChild(this.panel);
      const text=(parent,value,position,width)=>{
        const t=document.createElement('a-text');t.setAttribute('font','vendor/fonts/Roboto-msdf.json');t.setAttribute('font-image','vendor/fonts/Roboto-msdf.png');t.setAttribute('shader','msdf');t.setAttribute('value',value);t.setAttribute('position',position);t.setAttribute('align','center');t.setAttribute('width',width);t.setAttribute('color','#ffffff');parent.appendChild(t);return t;
      };
      text(this.panel,'MARS / WALK BY GAZE','0 .51 .02',2.7);
      this.status=text(this.panel,'HOLD A DESTINATION / GAZE TO WALK','0 -.53 .02',2.5);
      const choices=[['path','WALK TO PATH'],['alpha','WALK TO ALPHA'],['beta','WALK TO BETA'],['gamma','WALK TO GAMMA'],['start','RETURN TO START'],['stop','STOP WALKING']];
      choices.forEach(([key,label],i)=>{
        const b=document.createElement('a-plane');b.dataset.marsWalk=key;b.setAttribute('width','.86');b.setAttribute('height','.29');b.setAttribute('position',`${(i%3-1)*.94} ${.19-Math.floor(i/3)*.36} 0`);b.setAttribute('material',`shader: flat; color: ${key==='stop'?'#0891b2':'#a855f7'}; side: double`);
        const caption=text(b,label,'0 0 .025',.8);caption.setAttribute('wrap-count',18);b.addEventListener('click',()=>key==='stop'?this.stop('STOPPED / CHOOSE A DESTINATION'):this.go(key));this.panel.appendChild(b);
      });
      this.onExplore=()=>{this.show(true);this.status.setAttribute('value','HOLD A DESTINATION / GAZE TO WALK');};
      this.onReset=()=>{this.stop();this.show(false);};
      this.onPause=()=>{if(document.hidden)this.stop('PAUSED / CHOOSE A DESTINATION');};
      this.onBlur=()=>this.stop('PAUSED / CHOOSE A DESTINATION');
      this.onKey=e=>{if(['KeyW','KeyA','KeyS','KeyD','KeyH'].includes(e.code))this.stop('MANUAL MOVEMENT / GAZE TO WALK');};
      this.scene.addEventListener('mars-exploration-start',this.onExplore);this.scene.addEventListener('scene6-start',this.onReset);this.scene.addEventListener('scene5-start',this.onReset);this.scene.addEventListener('cardboard-end',this.onBlur);
      document.addEventListener('visibilitychange',this.onPause);window.addEventListener('blur',this.onBlur);window.addEventListener('keydown',this.onKey);
      this.ready=true;
    },
    show:function(visible){
      this.available=visible;
      this.panel.setAttribute('visible',false);this.panel.querySelectorAll('[data-mars-walk]').forEach(b=>b.classList.remove('clickable'));
      this.el.components['vr-menu']?.sync(true);
    },
    go:function(key){
      const mission=this.scene.components['mars-mission'],target=this.destinations[key],phone=this.scene.components['cardboard-phone'];
      if(!target||mission.phase!=='exploring'||mission.transitioning||!this.motion.locomotionEnabled||document.hidden||phone?.active&&phone.paused)return false;
      this.el.object3D.updateWorldMatrix(true,false);this.camera.object3D.getWorldPosition(this.position);
      // Travel on the center corridor, then cross to the front of each habitat.
      // These stops stay outside buildings and rocks; the camera never auto-turns.
      const here={x:this.position.x,z:this.position.z};this.route=[];
      if(Math.abs(here.x)>.05)this.route.push({x:0,z:here.z});
      if(target.x!==0&&Math.abs(here.z-target.z)>.05)this.route.push({x:0,z:target.z});
      this.route.push({x:target.x,z:target.z});
      this.destination=key;this.walking=true;this.speed=0;this.distanceTravelled=0;
      const wasd=this.camera.components['wasd-controls'];if(wasd?.velocity)wasd.velocity.set(0,0,0);
      this.camera.setAttribute('wasd-controls','enabled',false);
      this.status.setAttribute('value',`WALKING TO ${target.label} / GAZE AT STOP`);
      this.scene.emit('mars-walk-start',{destination:key,route:this.route.map(p=>({...p})),speed:1.6},false);return true;
    },
    stop:function(message){
      const wasWalking=this.walking;this.walking=false;this.route=[];this.speed=0;
      if(!this.ready)return;
      if(message)this.status.setAttribute('value',message);
      if(this.scene.components['mars-mission']?.phase==='exploring')this.camera.setAttribute('wasd-controls','enabled',true);
      if(wasWalking)this.scene.emit('mars-walk-stop',{destination:this.destination,message:message||'stopped'},false);
    },
    tick:function(time,delta){
      if(!this.ready)return;
      // The panel follows position, not head rotation, so every button remains
      // reachable by gaze. Look down toward the colony's original forward view.
      const c=this.camera.object3D.position;this.panel.object3D.position.set(c.x,1.35,c.z-2.4);
      if(!this.walking)return;
      const phone=this.scene.components['cardboard-phone'];
      if(document.hidden||this.scene.components['mars-mission'].phase!=='exploring'||!this.motion.locomotionEnabled||phone?.active&&(phone.paused||!phone.preview&&performance.now()-phone.lastSample>=2000)){
        this.stop('PAUSED / CHOOSE A DESTINATION');return;
      }
      if(Math.abs(this.motion.touch.x)+Math.abs(this.motion.touch.y)+Math.abs(this.motion.stick.x)+Math.abs(this.motion.stick.y)>.12){this.stop('MANUAL MOVEMENT / GAZE TO WALK');return;}
      const dt=Math.min(delta/1000,.05);if(!(dt>0))return;
      this.camera.object3D.getWorldPosition(this.position);const next=this.route[0];
      if(!next){this.arrive();return;}
      const dx=next.x-this.position.x,dz=next.z-this.position.z,distance=Math.hypot(dx,dz);
      this.speed=Math.min(1.6,(this.speed||0)+dt*2.4);
      const pace=this.route.length===1?Math.min(this.speed,Math.max(.25,distance*2)):this.speed;
      const step=Math.min(distance,pace*dt),p=this.el.object3D.position;
      if(distance>0){p.x+=dx/distance*step;p.z+=dz/distance*step;this.distanceTravelled+=step;}
      // Ground height matches cabin-motion, including the original raised path.
      const x=this.position.x+(distance?dx/distance*step:0),z=this.position.z+(distance?dz/distance*step:0);
      const ground=Math.abs(x)<=5&&z>=0&&z<=10?.2:Math.abs(x)<=2.5&&z>=-30&&z<=0?.055:0;p.y=ground-this.rig.object3D.position.y;
      if(distance-step<.015){this.route.shift();if(!this.route.length)this.arrive();}
    },
    arrive:function(){
      const key=this.destination,travelled=this.distanceTravelled;this.stop(`ARRIVED / ${this.destinations[key].label}`);
      this.scene.emit('mars-walk-arrived',{destination:key,distance:travelled},false);
    },
    remove:function(){
      this.stop();if(!this.ready)return;
      for(const [name,fn] of [['mars-exploration-start',this.onExplore],['scene6-start',this.onReset],['scene5-start',this.onReset],['cardboard-end',this.onBlur]])this.scene.removeEventListener(name,fn);
      document.removeEventListener('visibilitychange',this.onPause);window.removeEventListener('blur',this.onBlur);window.removeEventListener('keydown',this.onKey);this.panel.remove();
    }
  });
}());
