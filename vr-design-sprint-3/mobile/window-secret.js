/* Mobile-only window Easter egg: one gaze selection starts four stress pulses. */
(function () {
  'use strict';
  AFRAME.registerComponent('mobile-window-secret',{
    init:function(){
      this.ready=false;this.stressing=false;this.finished=false;this.waitingForViewer=false;
      this.setupBound=()=>this.setup();
      if(this.el.hasLoaded)this.setup();else this.el.addEventListener('loaded',this.setupBound,{once:true});
    },
    setup:function(){
      this.controller=document.getElementById('scene34-controller').components['scene-three-four'];
      this.phone=this.el.components['cardboard-phone'];this.reticle=document.getElementById('reticle');
      this.onCruise=()=>this.arm();this.onBroken=()=>{this.finished=true;this.stressing=false;this.waitingForViewer=false;this.removeTarget();};
      this.onLeave=()=>{this.stressing=false;this.waitingForViewer=false;this.removeTarget();};
      this.el.addEventListener('scene3-start',this.onCruise);this.el.addEventListener('scene3-window-broken',this.onBroken);
      this.el.addEventListener('scene4-start',this.onLeave);this.el.addEventListener('scene5-start',this.onLeave);
      this.ready=true;if(this.controller.phase==='cruise'&&this.controller.windowHits<4)this.arm();
    },
    arm:function(){
      this.removeTarget();this.finished=false;this.stressing=false;
      this.controller.window.classList.remove('clickable');
      this.waitingForViewer=this.viewerUnavailable();
      const mark=document.createElement('a-entity');mark.id='mobile-window-stress-mark';mark.setAttribute('position','1.7 2.2 -2.79');
      // A small hairline at the glass edge, using Jesse's glass colors. There is
      // no button face, text, icon or tab stop; the hit area tolerates head jitter.
      for(const [start,end] of [['-.12 .08 .01','0 .025 .01'],['0 .025 .01','.07 -.1 .01'],['0 .025 .01','.14 .07 .01']]){
        const line=document.createElement('a-entity');line.setAttribute('line',{start,end,color:'#bae6fd'});mark.appendChild(line);
      }
      const target=document.createElement('a-plane');target.id='mobile-window-secret';target.classList.add('clickable');target.setAttribute('width','.85');target.setAttribute('height','.65');target.setAttribute('material','shader: flat; color: #bae6fd; opacity: 0; transparent: true; depthWrite: false; side: double');
      this.onSelect=()=>this.beginStress();target.addEventListener('click',this.onSelect);mark.appendChild(target);document.getElementById('rig').appendChild(mark);
      this.mark=mark;this.target=target;
      this.controller.description.textContent='Earth is behind us. Look around the solar system as the ship travels toward Mars.';
    },
    viewerUnavailable:function(){
      if(!this.phone.active)return !document.getElementById('phone-setup').hidden;
      return this.phone.paused||performance.now()-this.phone.enteredAt<3500||!this.phone.preview&&performance.now()-this.phone.lastSample>=2000;
    },
    isHolding:function(){
      if(!this.ready||this.finished||this.controller.phase!=='cruise')return false;
      if(this.stressing)return true;
      return !this.waitingForViewer&&!!this.target?.isConnected&&this.reticle.components['gaze-dwell']?.data.enabled&&this.reticle.components.raycaster?.intersectedEls.includes(this.target);
    },
    beginStress:function(){
      if(!this.ready||this.finished||this.stressing||this.controller.phase!=='cruise')return false;
      this.stressing=true;this.elapsed=0;this.nextPulse=.25;
      this.controller.crackWindow();
      this.el.emit('mobile-window-secret-selected',{input:'single-selection',stressPulses:4},false);return true;
    },
    tick:function(time,delta){
      if(!this.ready)return;
      this.waitingForViewer=this.controller.phase==='cruise'&&!this.finished&&this.viewerUnavailable();
      if(!this.stressing||this.waitingForViewer)return;
      if(this.controller.phase!=='cruise'){this.stressing=false;return;}
      this.elapsed+=Math.min(delta/1000,.05);
      while(this.stressing&&this.elapsed>=this.nextPulse&&this.controller.phase==='cruise'){
        this.nextPulse+=.25;this.controller.crackWindow();
      }
    },
    removeTarget:function(){
      if(this.target){this.target.classList.remove('clickable');this.target.removeEventListener('click',this.onSelect);}
      this.mark?.remove();this.mark=null;this.target=null;
    },
    remove:function(){
      this.el.removeEventListener('loaded',this.setupBound);if(!this.ready)return;
      this.el.removeEventListener('scene3-start',this.onCruise);this.el.removeEventListener('scene3-window-broken',this.onBroken);
      this.el.removeEventListener('scene4-start',this.onLeave);this.el.removeEventListener('scene5-start',this.onLeave);this.removeTarget();
    }
  });
}());
