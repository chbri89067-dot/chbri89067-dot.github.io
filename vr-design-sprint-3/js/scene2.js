/* Brian's Scene 2. Jesse's cabin geometry and inline launch code remain in index.html. */
(function () {
  'use strict';
  const THREE = AFRAME.THREE;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const ease = n => { n = clamp(n, 0, 1); return n * n * (3 - 2 * n); };

  AFRAME.registerComponent('follow-view', {
    tick: function () {
      const camera = this.el.sceneEl.camera;
      if (camera) camera.getWorldPosition(this.el.object3D.position);
    }
  });

  // Actual 3D points replace the upstream external star-image dependency.
  AFRAME.registerComponent('star-field', {
    init: function () {
      let seed = 47231;
      const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
      const positions = [], colors = [];
      for (let i = 0; i < 1400; i++) {
        const v = new THREE.Vector3(random() - .5, random() - .5, random() - .5).normalize().multiplyScalar(350);
        positions.push(v.x, v.y, v.z);
        const c = new THREE.Color(i % 9 === 0 ? '#c084fc' : i % 6 === 0 ? '#38bdf8' : '#f8fafc');
        colors.push(c.r, c.g, c.b);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      this.material = new THREE.PointsMaterial({size: .62, vertexColors: true, transparent: true, opacity: .6, depthWrite: false});
      this.points = new THREE.Points(geometry, this.material);
      this.el.setObject3D('stars', this.points);
    },
    setOpacity: function (value) { this.material.opacity = value; },
    remove: function () { this.points.geometry.dispose(); this.material.dispose(); this.el.removeObject3D('stars'); }
  });

  // Stylized Earth: no downloaded imagery, model, or texture license dependency.
  AFRAME.registerComponent('earth-surface', {
    init: function () {
      const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1d4ed8'; ctx.fillRect(0, 0, 2048, 1024);
      const land = [
        [[180,210],[330,130],[540,170],[600,280],[470,370],[400,500],[310,380],[210,330]],
        [[490,500],[620,490],[700,580],[650,760],[580,880],[530,750],[550,620]],
        [[1000,200],[1150,160],[1200,290],[1160,420],[1030,400],[980,300]],
        [[1110,400],[1280,420],[1360,590],[1260,790],[1170,720],[1110,540]],
        [[1220,170],[1460,110],[1730,230],[1770,360],[1600,400],[1480,540],[1340,430],[1270,320]],
        [[1590,700],[1750,660],[1840,760],[1750,830],[1620,790]]
      ];
      land.forEach((polygon, i) => {ctx.fillStyle = i % 2 ? '#166534' : '#15803d';ctx.beginPath();polygon.forEach(([x,y], j) => j ? ctx.lineTo(x,y) : ctx.moveTo(x,y));ctx.closePath();ctx.fill();});
      ctx.fillStyle = '#f8fafc';ctx.fillRect(0,0,2048,45);ctx.fillRect(0,985,2048,39);
      ctx.strokeStyle = '#f8fafc99';ctx.lineWidth = 6;
      for(let i=0;i<40;i++){ctx.beginPath();const y=100+(i*53)%820,x=(i*277)%1900;ctx.moveTo(x,y);ctx.bezierCurveTo(x+60,y-22,x+150,y+24,x+210,y-6);ctx.stroke();}
      this.texture = new THREE.CanvasTexture(canvas); this.texture.colorSpace = THREE.SRGBColorSpace;
      const apply = () => {
        const mesh = this.el.getObject3D('mesh'); if(!mesh) return;
        mesh.material.map = this.texture; mesh.material.color.set('#ffffff'); mesh.material.roughness = 1; mesh.material.metalness = 0; mesh.material.needsUpdate = true;
      };
      this.el.addEventListener('object3dset', apply);apply();
    },
    remove: function () { this.texture.dispose(); }
  });

  // Float the player, never the rig that carries the complete spaceship.
  AFRAME.registerComponent('cabin-motion', {
    init: function () {
      this.gravity = true; this.enabled = false; this.height = 0; this.heightTrim = 0;
      this.environment = 'cabin'; this.locomotionEnabled = true;
      this.keys = new Set(); this.stick = {x: 0, y: 0}; this.touch = {x: 0, y: 0}; this.elapsed = 0;
      this.forward = new THREE.Vector3(); this.right = new THREE.Vector3(); this.rotation = new THREE.Quaternion();
      this.keyDown = e => { if(!e.target.matches('input,select,textarea')) this.keys.add(e.code); };
      this.keyUp = e => this.keys.delete(e.code);
      this.clear = () => {this.keys.clear();this.stick.x=this.stick.y=this.touch.x=this.touch.y=0;};
      window.addEventListener('keydown',this.keyDown);window.addEventListener('keyup',this.keyUp);window.addEventListener('blur',this.clear);
      this.onStick=e=>{this.stick.x=e.detail.x;this.stick.y=e.detail.y;};
      this.controllers=Array.from(this.el.querySelectorAll('[laser-controls]'));
      this.controllers.forEach(c=>{c.addEventListener('thumbstickmoved',this.onStick);c.addEventListener('controllerdisconnected',this.clear);});
    },
    setGravity: function (enabled) { this.gravity = enabled; this.heightTrim = 0; },
    recenter: function () {
      const camera = document.querySelector('#camera'); this.el.object3D.position.x = this.el.object3D.position.z = 0;
      camera.object3D.position.x = camera.object3D.position.z = 0;
      if(this.environment==='mars'){this.el.object3D.position.set(0,-.45,-6.5);}
      const wasd = camera.components['wasd-controls']; if(wasd && wasd.velocity) wasd.velocity.set(0,0,0);
    },
    tick: function (time, delta) {
      const camera = document.querySelector('#camera'); if(!camera) return;
      const dt = Math.min(delta / 1000, .05); this.elapsed += dt;
      if(this.enabled && !this.gravity){
        if(this.keys.has('KeyE')) this.heightTrim += dt*.32;
        if(this.keys.has('KeyQ')) this.heightTrim -= dt*.32;
        this.heightTrim=clamp(this.heightTrim,-.4,.12);
      }
      const target = this.enabled && !this.gravity ? .58+this.heightTrim+.035*Math.sin(this.elapsed*1.15) : 0;
      this.height += (target-this.height)*(1-Math.exp(-dt*1.6));
      if(this.environment!=='mars')this.el.object3D.position.y = this.height;
      const x = clamp(this.stick.x+this.touch.x,-1,1), z = clamp(this.stick.y+this.touch.y,-1,1);
      if(this.locomotionEnabled&&(Math.abs(x)>.12 || Math.abs(z)>.12)){
        camera.object3D.getWorldQuaternion(this.rotation);this.forward.set(0,0,-1).applyQuaternion(this.rotation);this.forward.y=0;this.forward.normalize();
        this.right.crossVectors(this.forward,new THREE.Vector3(0,1,0)).normalize();
        this.el.object3D.position.addScaledVector(this.forward,-z*dt*.8).addScaledVector(this.right,x*dt*.8);
      }
      // Cabin bounds remain unchanged. Mars uses the partner's outdoor space.
      const rig=this.el.parentElement.object3D.position;
      for(const axis of ['x','z']){
        const outside=this.environment==='mars',space=this.environment==='space';
        const total=this.el.object3D.position[axis]+camera.object3D.position[axis]+(outside?rig[axis]:0);
        const bounded=outside?clamp(total,axis==='x'?-55:-70,axis==='x'?55:15):space?clamp(total,axis==='x'?-55:-100,axis==='x'?55:15):clamp(total,-2.45,2.45);
        this.el.object3D.position[axis]+=bounded-total;
      }
      if(this.environment==='mars'){
        const worldX=rig.x+this.el.object3D.position.x+camera.object3D.position.x,worldZ=rig.z+this.el.object3D.position.z+camera.object3D.position.z;
        const ground=Math.abs(worldX)<=5&&worldZ>=0&&worldZ<=10?.2:Math.abs(worldX)<=2.5&&worldZ>=-30&&worldZ<=0?.055:0;
        this.el.object3D.position.y=ground-rig.y;
      }
    },
    remove: function () {window.removeEventListener('keydown',this.keyDown);window.removeEventListener('keyup',this.keyUp);window.removeEventListener('blur',this.clear);this.controllers.forEach(c=>{c.removeEventListener('thumbstickmoved',this.onStick);c.removeEventListener('controllerdisconnected',this.clear);});}
  });

  // Uses the original A-Frame reticle ray. Also starts when gaze mode is enabled
  // while already hovering a target; one activation until the gaze leaves it.
  AFRAME.registerComponent('gaze-dwell', {
    schema:{enabled:{default:false},duration:{type:'number',default:1000}},
    init:function(){
      this.target=null;this.waited=0;this.fired=false;this.baseScale=this.el.object3D.scale.clone();
      this.ring=document.querySelector('#dwell-progress');this.outline=document.querySelector('#dwell-outline');this.hint=document.querySelector('#dwell-hint');this.lastArc=-1;
      this.backing=document.querySelector('#dwell-backing');
      this.feedbackLayers=[];
      for(const [node,order] of [[this.backing,1001],[this.outline,1002],[this.ring,1003],[this.el,1004]])if(node){
        const apply=()=>{const mesh=node.getObject3D('mesh');if(mesh){mesh.renderOrder=order;mesh.material.depthTest=false;mesh.material.depthWrite=false;}};
        node.addEventListener('object3dset',apply);apply();this.feedbackLayers.push([node,apply]);
      }
    },
    update:function(){this.data.duration=clamp(Number(this.data.duration)||1000,500,2000);},
    eligible:function(el){
      if(!el.isConnected||!el.classList.contains('clickable'))return false;
      for(let node=el.object3D;node;node=node.parent)if(!node.visible)return false;
      const flight=this.el.sceneEl.components['scene-two'];
      if(el.id==='gravity-btn'&&!flight.active)return false;
      if(el.id==='ship-window'&&document.querySelector('#scene34-controller')?.components['scene-three-four']?.phase!=='cruise')return false;
      return true;
    },
    tick:function(time){
      const scene=this.el.sceneEl,ray=this.el.components.raycaster,mission=scene.components['mars-mission'],phone=scene.components['cardboard-phone'];
      const tracked=!phone?.active||!phone.paused&&(phone.preview||performance.now()-phone.lastSample<2000);
      const target=this.data.enabled&&!document.hidden&&tracked&&ray&&!mission?.transitioning?ray.intersectedEls.find(el=>this.eligible(el)):null;
      if(target!==this.target){this.target=target;this.enteredAt=time;this.waited=0;this.fired=false;}
      if(target&&!this.fired){
        this.waited=Math.max(0,time-this.enteredAt);
        if(this.waited>=this.data.duration){
          this.fired=true;
          // Hide feedback before the action changes the scene or menu state.
          this.ring?.setAttribute('visible',false);this.outline?.setAttribute('visible',false);this.hint?.setAttribute('visible',false);
          this.backing?.setAttribute('visible',false);
          target.emit('click',{cursorEl:this.el,inputMethod:'head-gaze-dwell'},true);
        }
      }
      const hovering=!!target&&!this.fired,progress=hovering?clamp(this.waited/this.data.duration,0,1):0;
      this.el.object3D.scale.copy(this.baseScale).multiplyScalar(1+progress*.3);
      this.ring?.setAttribute('visible',hovering);this.outline?.setAttribute('visible',hovering);this.hint?.setAttribute('visible',hovering);
      this.backing?.setAttribute('visible',hovering);
      const arc=hovering?Math.max(.01,progress*360):.01;
      if(this.ring&&Math.abs(arc-this.lastArc)>.5){this.ring.setAttribute('geometry','thetaLength',arc);this.lastArc=arc;}
    },
    remove:function(){this.feedbackLayers.forEach(([node,fn])=>node.removeEventListener('object3dset',fn));}
  });

  // Use one A-Frame cursor: mouse/touch on the visible control, head ray in VR
  // or optional gaze mode. A single cursor prevents two activations per click.
  AFRAME.registerComponent('screen-selection', {
    init: function () {
      this.gaze=false;this.dragged=false;this.touchWalking=false;
      this.sync=()=>{
        const phone=this.el.sceneEl.components['cardboard-phone'];
        const headRay=this.el.sceneEl.is('vr-mode')||this.gaze||phone?.active;
        this.el.setAttribute('cursor','rayOrigin',headRay?'entity':'mouse');
        this.el.setAttribute('gaze-dwell','enabled',phone?.active?!phone.paused:this.gaze);
      };
      this.el.sceneEl.addEventListener('enter-vr',this.sync);
      this.el.sceneEl.addEventListener('exit-vr',this.sync);
      this.bind=()=>{
        const canvas=this.el.sceneEl.canvas;this.canvas=canvas;
        this.down=e=>{if(e.isPrimary){this.startX=e.clientX;this.startY=e.clientY;this.dragged=false;}};
        this.move=e=>{if(e.buttons&&Math.hypot(e.clientX-this.startX,e.clientY-this.startY)>8)this.dragged=true;};
        // A-Frame dispatches the 3D click synchronously on pointer release.
        this.guard=e=>{const phone=this.el.sceneEl.components['cardboard-phone'],mission=this.el.sceneEl.components['mars-mission'];if((e.detail?.mouseEvent||e.detail?.touchEvent)&&(phone?.active||mission?.transitioning||this.dragged||this.touchWalking))e.stopImmediatePropagation();};
        this.el.sceneEl.addEventListener('click',this.guard,true);
        canvas.addEventListener('pointerdown',this.down,true);canvas.addEventListener('pointermove',this.move,true);
        this.touchStart=e=>{
          if(this.el.sceneEl.components['cardboard-phone']?.active){e.preventDefault();e.stopImmediatePropagation();return;}
          if(e.touches.length<2)return;
          const c=this.el.sceneEl.components['scene-two'];if(!c.ready)return;
          this.touchWalking=true;this.dragged=true;this.touchX=(e.touches[0].clientX+e.touches[1].clientX)/2;this.touchY=(e.touches[0].clientY+e.touches[1].clientY)/2;
          c.camera.setAttribute('look-controls','touchEnabled',false);e.preventDefault();e.stopImmediatePropagation();
        };
        this.touchMove=e=>{
          if(!this.touchWalking||e.touches.length<2)return;
          const c=this.el.sceneEl.components['scene-two'],x=(e.touches[0].clientX+e.touches[1].clientX)/2,y=(e.touches[0].clientY+e.touches[1].clientY)/2;
          c.motion.touch={x:clamp((x-this.touchX)/70,-1,1),y:clamp((y-this.touchY)/70,-1,1)};e.preventDefault();e.stopImmediatePropagation();
        };
        this.touchEnd=e=>{
          if(!this.touchWalking)return;
          const c=this.el.sceneEl.components['scene-two'];c.motion.touch={x:0,y:0};
          if(!e.touches.length){this.touchWalking=false;c.camera.setAttribute('look-controls','touchEnabled',true);}
          e.preventDefault();e.stopImmediatePropagation();
        };
        canvas.addEventListener('touchstart',this.touchStart,{capture:true,passive:false});canvas.addEventListener('touchmove',this.touchMove,{capture:true,passive:false});
        canvas.addEventListener('touchend',this.touchEnd,{capture:true,passive:false});canvas.addEventListener('touchcancel',this.touchEnd,{capture:true,passive:false});
        this.sync();
      };
      if(this.el.sceneEl.canvas)this.bind();else this.el.sceneEl.addEventListener('render-target-loaded',this.bind,{once:true});
    },
    toggleGaze:function(){this.gaze=!this.gaze;this.sync();return this.gaze;},
    remove:function(){
      this.el.sceneEl.removeEventListener('enter-vr',this.sync);this.el.sceneEl.removeEventListener('exit-vr',this.sync);this.el.sceneEl.removeEventListener('render-target-loaded',this.bind);
      this.el.sceneEl.removeEventListener('click',this.guard,true);
      if(this.canvas){this.canvas.removeEventListener('pointerdown',this.down,true);this.canvas.removeEventListener('pointermove',this.move,true);for(const [type,fn] of [['touchstart',this.touchStart],['touchmove',this.touchMove],['touchend',this.touchEnd],['touchcancel',this.touchEnd]])this.canvas.removeEventListener(type,fn,true);}
    }
  });

  AFRAME.registerComponent('gravity-toggle', {
    init: function () {
      this.el.addEventListener('click', () => { const c=this.el.sceneEl.components['scene-two']; if(c)c.toggleGravity(); });
    }
  });

  AFRAME.registerComponent('scene-two', {
    schema: {duration: {default: 24}},
    init: function () {
      this.active=false;this.complete=false;this.elapsed=0;this.gravity=true;this.lastToggle=-Infinity;
      this.audioEnabled=false;this.audioPreference=null;this.audioStarted=false;this.ready=false;
      const setup=()=>this.setup(); if(this.el.hasLoaded)setup();else this.el.addEventListener('loaded',setup,{once:true});
    },
    setup: function () {
      this.rig=document.querySelector('#rig');this.player=document.querySelector('#player');this.motion=this.player.components['cabin-motion'];
      this.camera=document.querySelector('#camera');this.world=document.querySelector('#scene2-world');
      this.earth=document.querySelector('#orbital-earth');this.haze=document.querySelector('#earth-haze');this.sky=document.querySelector('#space-sky');
      this.mug=document.querySelector('#cabin-mug');this.title=document.querySelector('#hud h1');this.description=document.querySelector('#hud p');
      this.button=document.querySelector('#gravity-btn');this.label=document.querySelector('#gravity-label');
      this.music=document.querySelector('#scene2-music');this.hum=document.querySelector('#scene2-hum');
      this.el.addEventListener('enter-vr',()=>document.body.classList.add('in-vr'));
      this.el.addEventListener('exit-vr',()=>document.body.classList.remove('in-vr'));
      this.onHandoff=()=>this.start();this.rig.addEventListener('animationcomplete__ascent2',this.onHandoff);
      this.keyHandler=e=>{
        if(e.repeat||e.target.matches('input,select,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;
        if(e.code==='KeyG'){this.unlockAudio();this.button.emit('click');}
        if(e.code==='KeyM')this.setAudio(!this.audioEnabled);
        if(e.code==='KeyH')this.motion.recenter();
        if(e.code==='KeyV')document.querySelector('#reticle').components['screen-selection'].toggleGaze();
      };
      window.addEventListener('keydown',this.keyHandler);
      this.gestureHandler=()=>this.unlockAudio();window.addEventListener('pointerdown',this.gestureHandler,{once:true});
      this.ready=true;
      if(new URLSearchParams(location.search).get('scene')==='2'){
        this.rig.object3D.position.set(0,2800,-600);this.rig.setAttribute('position','0 2800 -600');
        document.querySelector('#atmosphere').setAttribute('color','#020617');this.sky.setAttribute('visible',true);
        this.start();
      }
    },
    unlockAudio: function () {
      const ctx=THREE.AudioContext.getContext();if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      if(this.audioPreference===null)this.setAudio(true);
    },
    setAudio: function (enabled) {
      this.audioEnabled=enabled;this.audioPreference=enabled;if(enabled)THREE.AudioContext.getContext().resume().catch(()=>{});
      if(enabled&&this.active&&!this.audioStarted)this.startAudio();
      if(!enabled){this.music.setAttribute('sound','volume',0);this.hum.setAttribute('sound','volume',0);}
      this.el.emit('scene-audio-changed',{enabled},false);
    },
    startAudio: function () {
      if(!this.audioEnabled||!this.music.components.sound||!this.hum.components.sound)return;
      this.music.components.sound.playSound();this.hum.components.sound.playSound();this.audioStarted=true;
    },
    playEffect: function (id) {
      if(!this.audioEnabled)return;const sound=document.querySelector(id).components.sound;if(sound)sound.playSound();
    },
    start: function () {
      if(this.active)return;
      this.active=true;this.elapsed=0;this.complete=false;this.motion.enabled=true;
      this.world.object3D.position.copy(this.rig.object3D.position);this.world.setAttribute('visible',true);
      document.querySelector('#earth-launch-world').setAttribute('visible',false);
      this.sky.setAttribute('visible',true);
      document.querySelector('#launch-btn').classList.remove('clickable');
      this.title.textContent='02 / STRATOSPHERE TO SPACE';this.description.style.color='#cbd5e1';
      this.description.textContent='The blue atmospheric rim thins as Earth falls away. Explore the cabin; the gravity control is now unlocked.';
      this.updateGravityUI();this.startAudio();
      this.el.emit('scene2-start',{source:'scene1-ascent-complete',rigPosition:this.rig.object3D.position.toArray()},false);
    },
    toggleGravity: function () {
      if(!this.active||performance.now()-this.lastToggle<450)return false;
      this.lastToggle=performance.now();this.gravity=!this.gravity;this.motion.setGravity(this.gravity);this.updateGravityUI();
      this.playEffect('#gravity-click-sound');this.playEffect('#gravity-field-sound');
      this.description.textContent=this.gravity?'Gravity restored. You are settling back down; looking and walking still work.':'Gravity is off. You and the loose mug float; keep looking around, and use Q / E to adjust your height.';
      this.el.emit('gravity-changed',{enabled:this.gravity},false);return true;
    },
    updateGravityUI: function () {
      this.label.setAttribute('value',this.gravity?'GRAVITY: ON':'GRAVITY: OFF');
      this.button.setAttribute('color',this.gravity?'#38bdf8':'#c084fc');
      this.button.setAttribute('material','emissive',this.gravity?'#0e7490':'#a855f7');
    },
    tick: function (time, delta) {
      if(!this.active||!this.ready)return;
      this.elapsed+=Math.min(delta/1000,.05);const progress=ease(this.elapsed/this.data.duration);
      this.earth.object3D.position.set(0,-180-progress*100,-240-progress*230);this.earth.object3D.rotation.y=-.6+this.elapsed*.003;
      this.haze.object3D.position.copy(this.earth.object3D.position);this.haze.setAttribute('material','opacity',.16*(1-progress)+.025);
      const stars=this.sky.components['star-field'];if(stars)stars.setOpacity(.6+.4*progress);
      const lift=this.motion.height;
      this.mug.object3D.position.set(1.8-(this.gravity?0:.10*Math.sin(this.elapsed*.55)),.88+lift*.9,-1.1);
      this.mug.object3D.rotation.z=this.gravity?this.mug.object3D.rotation.z*.95:Math.sin(this.elapsed*.7)*.15;
      if(this.audioEnabled){const fade=ease(this.elapsed/6);this.music.setAttribute('sound','volume',fade*.16);this.hum.setAttribute('sound','volume',fade*.035);}
      if(progress>=1&&!this.complete){this.complete=true;this.title.textContent='02 / SPACE CRUISE';this.description.textContent=this.gravity?'Earth is behind us. Explore the cabin or try the gravity control.':'In open space with gravity off. Restore it whenever you are ready.';this.el.emit('scene2-complete',{nextScene:3,gravityEnabled:this.gravity,rigPosition:this.rig.object3D.position.toArray()},false);}
    },
    stop: function () {
      if(!this.ready)return;this.active=false;this.motion.setGravity(true);this.motion.enabled=false;
      [this.music,this.hum].forEach(e=>{if(e.components.sound)e.components.sound.stopSound();});this.audioStarted=false;
    },
    remove: function () {
      this.stop();if(this.rig)this.rig.removeEventListener('animationcomplete__ascent2',this.onHandoff);
      window.removeEventListener('keydown',this.keyHandler);window.removeEventListener('pointerdown',this.gestureHandler);
    }
  });
}());
