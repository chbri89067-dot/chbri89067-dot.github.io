/* Phone-viewer adapter for the existing A-Frame 1.8 scene and renderer. */
(function () {
  'use strict';
  const THREE = AFRAME.THREE;
  const $ = id => document.getElementById(id);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  AFRAME.registerComponent('cardboard-phone', {
    init: function () {
      this.active=false;this.paused=false;this.samples=0;this.frames=0;this.frameTimes=[];
      this.preview=false;this.permission='not requested';this.starting=false;
      this.orientation=e=>{if([e.alpha,e.beta,e.gamma].every(Number.isFinite)){this.samples++;this.lastSample=performance.now();}};
      window.addEventListener('deviceorientation',this.orientation);
      this.resize=()=>{this.refreshPause();if(this.active)this.el.resize();};
      this.visibility=()=>{this.refreshPause();if(document.hidden)this.saveReport();};
      window.addEventListener('resize',this.resize);window.addEventListener('orientationchange',this.resize);document.addEventListener('visibilitychange',this.visibility);
      const setup=()=>this.setup();if(this.el.hasLoaded)setup();else this.el.addEventListener('loaded',setup,{once:true});
    },
    setup: function () {
      this.camera=$('camera');this.player=$('player');this.motion=this.player.components['cabin-motion'];this.reticle=$('reticle');
      this.selector=this.reticle.components['screen-selection'];this.renderer=this.el.renderer;
      this.stereo=new THREE.StereoCamera();this.center=new THREE.PerspectiveCamera();this.size=new THREE.Vector2();
      this.originalRender=this.renderer.render;
      const self=this;
      // A-Frame still owns the frame loop, components, raycasters and sole renderer.
      this.renderAdapter=function(world,camera){
        if(!self.active||this.xr.isPresenting||world!==self.el.object3D||camera!==self.el.camera||this.getRenderTarget())return self.originalRender.call(this,world,camera);
        return self.renderStereo(world,camera);
      };
      this.renderer.render=this.renderAdapter;
      $('phone-open').addEventListener('click',e=>{e.preventDefault();this.showSetup();});
      $('phone-close').addEventListener('click',()=>{$('phone-setup').hidden=true;});
      $('phone-start').addEventListener('click',()=>this.begin(false));
      $('phone-preview').addEventListener('click',()=>this.begin(true));
      $('phone-exit').addEventListener('click',()=>this.exit());
      $('phone-export').addEventListener('click',()=>this.downloadReport());
      $('phone-checks').addEventListener('change',()=>this.saveReport());
      this.buildActions();
      this.ready=true;
      const query=new URLSearchParams(location.search);
      if(query.has('cardboard')||AFRAME.utils.device.isMobile())this.showSetup();
      this.diagnosticsTimer=setInterval(()=>this.updateStatus(),1000);
    },
    showSetup: function () {
      $('phone-setup').hidden=false;
      $('phone-status').textContent=this.active?'Phone viewer is running. Exit it to change eye spacing or field of view.':'Turn the phone sideways. Tap Start, allow motion, then move the phone slightly before placing it in the viewer.';
      this.updateStatus();
    },
    primeAudio: function () {
      // A gaze event is not a trusted Safari gesture. Prepare Jesse's engine
      // context on this real tap; his oscillators/envelopes are left unchanged.
      const Context=window.AudioContext||window.webkitAudioContext;
      if(!window.marsPhoneAudioContext)window.marsPhoneAudioContext=new Context();
      const context=window.marsPhoneAudioContext;
      const silent=context.createBufferSource();silent.buffer=context.createBuffer(1,1,context.sampleRate);silent.connect(context.destination);silent.start();
      return Promise.all([context.resume(),THREE.AudioContext.getContext().resume()]);
    },
    begin: async function (preview) {
      if(this.active){$('phone-setup').hidden=true;return;}
      if(this.starting)return;
      if(innerWidth<innerHeight&&!preview){$('phone-status').textContent='Rotate the phone to landscape, then tap Start again.';return;}
      if(!isSecureContext&&!preview){$('phone-status').textContent='Motion access needs HTTPS. Open the provided secure phone-test link in Safari.';return;}
      if(!window.DeviceOrientationEvent&&!preview){$('phone-status').textContent='This browser does not expose orientation sensors. Use Safari on the phone, or use the mouse stereo preview.';return;}
      this.starting=true;this.preview=preview;$('phone-start').disabled=true;
      this.startSamples=this.samples;
      try {
        // Invoke both permission and audio immediately within the user's tap.
        const permission=preview?Promise.resolve('preview'):typeof DeviceOrientationEvent.requestPermission==='function'?DeviceOrientationEvent.requestPermission():Promise.resolve('granted');
        const audio=this.primeAudio();
        const fullscreen=!preview&&document.documentElement.requestFullscreen?document.documentElement.requestFullscreen().catch(()=>{}):Promise.resolve();
        const result=await permission;this.permission=result;
        await audio;await fullscreen;
        if(result!=='granted'&&!preview)throw new Error('Motion access was denied. Allow Motion & Orientation for this site in Safari, then retry.');
        const permissionUI=this.el.components['device-orientation-permission-ui'];if(permissionUI)permissionUI.permissionGranted=true;
        this.el.emit('deviceorientationpermissiongranted',{},false);
        const look=this.camera.components['look-controls'];if(look.magicWindowControls)look.magicWindowControls.enabled=!preview;
        if(!preview){
          $('phone-status').textContent='Motion allowed. Gently turn the phone while we check for sensor readings…';
          const until=performance.now()+5000;
          while(this.samples<=this.startSamples&&performance.now()<until)await new Promise(resolve=>setTimeout(resolve,100));
          if(this.samples<=this.startSamples)throw new Error('Permission was allowed, but no motion readings arrived. Keep this tab visible, move the phone, and retry.');
        }
        this.activate();
      } catch(error) {
        $('phone-status').textContent=error.message||String(error);this.saveReport();
      } finally {this.starting=false;$('phone-start').disabled=false;}
    },
    activate: function () {
      this.eyeSeparation=clamp(Number($('phone-ipd').value)||64,54,74)/1000;
      this.fov=clamp(Number($('phone-fov').value)||80,60,100);
      this.oldPixelRatio=this.renderer.getPixelRatio();this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
      this.oldTouch=this.camera.getAttribute('look-controls').touchEnabled;
      this.camera.setAttribute('look-controls','touchEnabled',false);
      this.active=true;this.enteredAt=performance.now();this.frames=0;this.frameTimes=[];this.actions.object3D.visible=true;
      this.actions.querySelectorAll('[data-phone-action]').forEach(el=>el.classList.add('clickable'));
      document.body.classList.add('cardboard-active');$('phone-setup').hidden=true;
      this.selector.sync();this.el.resize();this.refreshPause();
      const scene=this.el.components['scene-two'];scene.unlockAudio();
      this.requestWakeLock();this.saveReport();
      this.el.emit('cardboard-start',{preview:this.preview,eyeSeparation:this.eyeSeparation},false);
    },
    renderStereo: function (world,camera) {
      const r=this.renderer;this.renderer.getSize(this.size);
      const width=this.size.x,height=this.size.y,leftWidth=Math.floor(width/2);
      world.updateMatrixWorld(true);camera.updateMatrixWorld(true);
      this.center.copy(camera,false);this.center.matrixWorld.copy(camera.matrixWorld);this.center.matrixWorldInverse.copy(camera.matrixWorldInverse);
      this.center.fov=this.fov;this.center.aspect=leftWidth/height;this.center.updateProjectionMatrix();
      this.stereo.aspect=1;this.stereo.eyeSep=this.eyeSeparation;this.stereo.update(this.center);
      const oldAutoClear=r.autoClear,oldScissor=r.getScissorTest(),viewport=new THREE.Vector4(),scissor=new THREE.Vector4();r.getViewport(viewport);r.getScissor(scissor);
      try {
        r.autoClear=false;r.setScissorTest(true);
        r.setViewport(0,0,leftWidth,height);r.setScissor(0,0,leftWidth,height);r.clear();this.originalRender.call(r,world,this.stereo.cameraL);
        r.setViewport(leftWidth,0,width-leftWidth,height);r.setScissor(leftWidth,0,width-leftWidth,height);r.clear();this.originalRender.call(r,world,this.stereo.cameraR);
        this.frames++;
      } finally {r.autoClear=oldAutoClear;r.setViewport(viewport);r.setScissor(scissor);r.setScissorTest(oldScissor);}
    },
    refreshPause: function () {
      if(!this.active)return;
      this.paused=document.hidden||(!this.preview&&innerWidth<innerHeight);
      $('phone-rotate').hidden=!this.paused||document.hidden;
      if(this.selector)this.selector.sync();
    },
    tick: function (time,delta) {
      if(!this.active)return;
      if(delta>0&&delta<250){this.frameTimes.push(delta);if(this.frameTimes.length>120)this.frameTimes.shift();}
      // Give time to put the phone in its viewer; stale sensors suspend gaze.
      const trackingOK=this.preview||performance.now()-this.lastSample<2000;
      const enabled=!this.paused&&trackingOK&&performance.now()-this.enteredAt>3500;
      const dwell=this.reticle.components['gaze-dwell'];
      if(dwell&&dwell.data.enabled!==enabled)this.reticle.setAttribute('gaze-dwell','enabled',enabled);
    },
    buildActions: function () {
      this.actions=document.createElement('a-entity');this.actions.id='phone-actions';this.actions.setAttribute('position','0 1.35 1.35');this.actions.setAttribute('rotation','0 180 0');this.actions.setAttribute('visible',false);
      const label=(el,value,width=1)=>{const t=document.createElement('a-text');t.setAttribute('font','vendor/fonts/Roboto-msdf.json');t.setAttribute('font-image','vendor/fonts/Roboto-msdf.png');t.setAttribute('shader','msdf');t.setAttribute('value',value);t.setAttribute('align','center');t.setAttribute('color','#ffffff');t.setAttribute('width',width);t.setAttribute('position','0 0 0.015');el.appendChild(t);};
      const title=document.createElement('a-entity');title.setAttribute('position','0 .5 0');label(title,'PHONE / CABIN CONTROLS',2.5);this.actions.appendChild(title);
      const actions=[['left','LEFT'],['forward','TO CONSOLE'],['right','RIGHT'],['down','LOWER'],['back','AWAY'],['up','RISE'],['seat','RETURN TO SEAT'],['audio','SOUND ON / OFF'],['exit','EXIT VIEWER']];
      actions.forEach(([action,text],i)=>{const plane=document.createElement('a-plane');plane.dataset.phoneAction=action;plane.setAttribute('width','.48');plane.setAttribute('height','.22');plane.setAttribute('position',`${(i%3-1)*.54} ${.25-Math.floor(i/3)*.28} 0`);plane.setAttribute('material',`shader: flat; color: ${i%2?'#0891b2':'#a855f7'}; side: front`);label(plane,text,.85);plane.addEventListener('click',()=>this.action(action));this.actions.appendChild(plane);});
      this.player.appendChild(this.actions);
    },
    action: function (action) {
      if(!this.active||this.paused)return;
      const p=this.player.object3D.position;
      if(action==='left')p.x-=.3;if(action==='right')p.x+=.3;
      if(action==='forward')p.z-=.3;if(action==='back')p.z+=.3;
      if(action==='seat')this.motion.recenter();
      if(!this.motion.gravity&&(action==='up'||action==='down'))this.motion.heightTrim=clamp(this.motion.heightTrim+(action==='up'?.08:-.08),-.4,.12);
      if(action==='audio'){const scene=this.el.components['scene-two'];scene.setAudio(!scene.audioEnabled);}
      if(action==='exit')this.exit();
    },
    exit: function () {
      if(!this.active)return;
      this.active=false;this.actions.object3D.visible=false;
      this.actions.querySelectorAll('[data-phone-action]').forEach(el=>el.classList.remove('clickable'));
      this.camera.setAttribute('look-controls','touchEnabled',this.oldTouch);this.renderer.setPixelRatio(this.oldPixelRatio);
      document.body.classList.remove('cardboard-active');$('phone-rotate').hidden=true;this.selector.sync();this.el.resize();
      if(this.wakeLock)this.wakeLock.release().catch(()=>{});
      if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});
      this.saveReport();this.showSetup();this.el.emit('cardboard-end',{},false);
    },
    requestWakeLock: async function () {try{if(navigator.wakeLock)this.wakeLock=await navigator.wakeLock.request('screen');}catch{}},
    updateStatus: function () {
      if(!this.ready)return;
      const fps=this.frameTimes.length?Math.round(1000/(this.frameTimes.reduce((a,b)=>a+b,0)/this.frameTimes.length)):null;
      $('phone-diagnostics').textContent=`HTTPS: ${isSecureContext?'yes':'no'} · Motion: ${this.permission} · Readings: ${this.samples} · Stereo frames: ${this.frames}${fps?' · Browser FPS: '+fps:''}`;
      if(this.active)this.saveReport();
    },
    report: function () {
      const checks={};$('phone-checks').querySelectorAll('input').forEach(input=>checks[input.name]=input.checked);
      return {at:new Date().toISOString(),userAgent:navigator.userAgent,secureContext:isSecureContext,viewport:[innerWidth,innerHeight],devicePixelRatio,permission:this.permission,orientationSamples:this.samples,stereoFrames:this.frames,eyeSeparation:this.eyeSeparation||null,perEyeFov:this.fov||null,mode:this.preview?'mouse-stereo-preview':'phone-sensors',interaction:'head-gaze-dwell',screenTapSelection:false,active:this.active,launchAudioState:window.marsPhoneAudioContext?.state||'not prepared',selfReportedChecks:checks,hardwareVerifiedByAutomation:false,note:'Sensor readings may be simulated in browser QA. Only the tester can confirm real iPhone/headset behavior. Generic stereo profile; no viewer QR calibration or lens-distortion correction.'};
    },
    saveReport: function () {try{localStorage.setItem('mars-cardboard-test',JSON.stringify(this.report()));}catch{}},
    downloadReport: function () {this.saveReport();const blob=new Blob([JSON.stringify(this.report(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Mars-VR-phone-test.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);},
    remove: function () {
      this.exit();clearInterval(this.diagnosticsTimer);window.removeEventListener('deviceorientation',this.orientation);window.removeEventListener('resize',this.resize);window.removeEventListener('orientationchange',this.resize);document.removeEventListener('visibilitychange',this.visibility);
      if(this.renderer&&this.renderer.render===this.renderAdapter)this.renderer.render=this.originalRender;if(this.actions)this.actions.remove();
    }
  });
}());
