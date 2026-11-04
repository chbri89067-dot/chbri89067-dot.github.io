/* Shared headset interface. It uses the existing A-Frame scene and cursor. */
(function () {
  'use strict';
  AFRAME.registerComponent('bold-label',{
    init:function(){
      this.apply=()=>{
        const mesh=this.el.getObject3D('text');if(!mesh)return;
        this.el.removeObject3D('bold-text');
        const group=new AFRAME.THREE.Group();
        // Slightly overlapping copies give the bundled Roboto a heavier weight.
        // Geometry and material are shared; no new font or remote asset is used.
        for(const [x,y] of [[-.0014,0],[.0014,0],[0,-.0014],[0,.0014]]){
          const copy=mesh.clone();copy.position.x+=x;copy.position.y+=y;copy.renderOrder=1002;group.add(copy);
        }
        mesh.material.depthTest=false;mesh.material.depthWrite=false;mesh.renderOrder=1002;
        this.el.setObject3D('bold-text',group);
      };
      this.el.addEventListener('textfontset',this.apply);this.apply();
    },
    remove:function(){this.el.removeEventListener('textfontset',this.apply);this.el.removeObject3D('bold-text');}
  });

  AFRAME.registerComponent('vr-menu',{
    init:function(){
      this.open=false;this.ready=false;
      this.setupBound=()=>this.setup();
      if(this.el.sceneEl.hasLoaded)this.setup();else this.el.sceneEl.addEventListener('loaded',this.setupBound,{once:true});
    },
    setup:function(){
      this.scene=this.el.sceneEl;this.camera=document.getElementById('camera');this.phone=this.scene.components['cardboard-phone'];this.walk=this.el.components['mars-walk'];
      this.anchor=document.createElement('a-entity');this.anchor.id='vr-menu-anchor';this.el.appendChild(this.anchor);
      const make=(id,value,x,width)=>{
        const button=document.createElement('a-plane');button.id=id;button.setAttribute('position',`${x} .1 -1.9`);button.setAttribute('width',width);button.setAttribute('height','.3');button.setAttribute('material','shader: flat; color: #a855f7; transparent: true; side: double; depthTest: false; depthWrite: false');
        const foreground=()=>{const mesh=button.getObject3D('mesh');if(mesh)mesh.renderOrder=1000;};button.addEventListener('object3dset',foreground);foreground();
        const text=document.createElement('a-text');text.setAttribute('font','vendor/fonts/Roboto-msdf.json');text.setAttribute('font-image','vendor/fonts/Roboto-msdf.png');text.setAttribute('shader','msdf');text.setAttribute('value',value);text.setAttribute('width',width*.86);text.setAttribute('wrap-count',16);text.setAttribute('align','center');text.setAttribute('color','#ffffff');text.setAttribute('position','0 0 .025');
        const captionLayer=()=>{const mesh=text.getObject3D('text');if(mesh){mesh.renderOrder=1001;mesh.material.depthTest=false;mesh.material.depthWrite=false;}};
        text.addEventListener('object3dset',captionLayer);text.addEventListener('textfontset',captionLayer);captionLayer();button.appendChild(text);this.anchor.appendChild(button);return button;
      };
      this.toggle=make('vr-menu-toggle','Menu',0,.85);this.stopButton=make('vr-menu-stop','STOP WALKING',1.05,1.05);
      this.onToggle=()=>{if(!this.scene.components['mars-mission']?.transitioning)this.setOpen(!this.open);};
      this.onStop=()=>this.walk.stop('STOPPED / CHOOSE A DESTINATION');
      this.toggle.addEventListener('click',this.onToggle);this.stopButton.addEventListener('click',this.onStop);
      this.onPhase=()=>this.setOpen(false);
      this.phaseEvents=['cardboard-start','cardboard-end','scene2-start','scene3-start','scene4-start','scene5-start','scene6-start'];
      this.phaseEvents.forEach(name=>this.scene.addEventListener(name,this.onPhase));this.ready=true;this.sync(true);
    },
    setOpen:function(open){this.open=!!open;this.sync(true);},
    sync:function(force=false){
      if(!this.ready||!this.phone.actions||!this.walk.panel)return;
      const outside=this.el.components['cabin-motion'].environment==='mars';
      const available=!!(this.phone.active||document.getElementById('reticle').components['screen-selection'].gaze||this.scene.is('vr-mode')||this.walk.available);
      const key=[this.open,outside,available,this.phone.active,this.walk.available,this.walk.walking].join('|');if(!force&&key===this.key)return;this.key=key;
      this.toggle.setAttribute('visible',available);this.toggle.classList.toggle('clickable',available);this.toggle.querySelector('a-text').setAttribute('value',this.open?'Hide Menu':'Menu');
      const head=document.getElementById('mission-head-status');
      if(this.open&&available){if(!this.statusSuppressed){this.statusWasVisible=head.getAttribute('visible');this.statusSuppressed=true;}head.setAttribute('visible',false);}
      else if(this.statusSuppressed){head.setAttribute('visible',this.statusWasVisible);this.statusSuppressed=false;}
      const stop=available&&!this.open&&this.walk.walking;this.stopButton.setAttribute('visible',stop);this.stopButton.classList.toggle('clickable',stop);
      const walkVisible=available&&this.open&&this.walk.available;
      this.walk.panel.setAttribute('visible',walkVisible);this.walk.panel.querySelectorAll('[data-mars-walk]').forEach(b=>b.classList.toggle('clickable',walkVisible));
      const cabinVisible=available&&this.open&&this.phone.active;
      this.phone.actions.setAttribute('visible',cabinVisible);this.phone.actions.setAttribute('rotation','0 0 0');
      this.phone.actions.firstElementChild.setAttribute('visible',!outside);
      this.phone.actions.querySelectorAll('[data-phone-action]').forEach((b,i)=>{
        const action=b.dataset.phoneAction,show=cabinVisible&&(!outside||action==='audio'||action==='exit');
        b.setAttribute('visible',show);b.classList.toggle('clickable',show);
        b.setAttribute('width','.86');b.setAttribute('height','.29');
        b.setAttribute('position',outside?`${action==='audio'?-.48:.48} 0 0`:`${(i%3-1)*.94} ${.25-Math.floor(i/3)*.36} 0`);
        const text=b.querySelector('a-text');text.setAttribute('width','.8');text.setAttribute('wrap-count',18);
      });
      this.scene.emit('vr-menu-changed',{open:this.open,visible:available},false);
    },
    tick:function(){
      if(!this.ready)return;
      const c=this.camera.object3D.position;this.anchor.object3D.position.set(c.x,0,c.z);
      if(this.phone.actions)this.phone.actions.object3D.position.set(c.x,this.el.components['cabin-motion'].environment==='mars'?.46:1.35,c.z-2.4);
      if(this.open&&this.statusSuppressed)document.getElementById('mission-head-status').setAttribute('visible',false);
      this.sync();
    },
    remove:function(){
      this.el.sceneEl.removeEventListener('loaded',this.setupBound);if(!this.ready)return;
      this.phaseEvents.forEach(name=>this.scene.removeEventListener(name,this.onPhase));this.toggle.removeEventListener('click',this.onToggle);this.stopButton.removeEventListener('click',this.onStop);this.anchor.remove();
    }
  });

  // Final-scene navigation UI is removed from the document, not hidden.
  AFRAME.registerComponent('clear-mars-ui',{
    init:function(){
      this.onArrival=()=>queueMicrotask(()=>this.clear());
      this.el.addEventListener('scene6-start',this.onArrival);
    },
    clear:function(){
      if(this.cleared)return;this.cleared=true;
      const player=document.getElementById('player');
      player.removeAttribute('vr-menu');player.removeAttribute('mars-walk');
      for(const id of ['phone-actions','mars-explore-btn','mission-head-status','hud','movement-help','audio-sources','phone-open','phone-exit'])document.getElementById(id)?.remove();
      document.getElementById('phone-rotate')?.style.setProperty('display','none','important');
      this.el.querySelectorAll('.a-enter-vr,.a-enter-ar').forEach(node=>node.remove());
      this.pendingStart=true;
    },
    tick:function(){
      const mission=this.el.components['mars-mission'];
      if(this.pendingStart&&mission?.phase==='arrival-ready'&&!mission.transitioning){
        // No redundant Explore button is left on the final view. Existing
        // desktop/joystick movement and habitat feedback remain unchanged.
        this.pendingStart=false;mission.beginExploration();
      }
    },
    remove:function(){this.el.removeEventListener('scene6-start',this.onArrival);}
  });
}());
