/* Frames 5–6 adapted from the partner's supplied A-Frame project. */
(function () {
  'use strict';
  const THREE=AFRAME.THREE;
  const $=id=>document.getElementById(id);

  // The partner's remote Mars map was not included in the ZIP. Keep a local,
  // stylized surface in his terrain colors instead of requiring a CDN image.
  AFRAME.registerComponent('mars-surface',{
    init:function(){
      const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#9c4935';ctx.fillRect(0,0,1024,512);
      let seed=6045;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
      for(let i=0;i<240;i++){
        ctx.fillStyle=['#7c3026','#8b3a2b','#a34e38','#b4684c'][i%4];ctx.globalAlpha=.12+random()*.18;
        ctx.beginPath();ctx.ellipse(random()*1024,random()*512,8+random()*70,4+random()*25,random()*Math.PI,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;this.texture=new THREE.CanvasTexture(canvas);this.texture.colorSpace=THREE.SRGBColorSpace;
      this.apply=()=>{const mesh=this.el.getObject3D('mesh');if(mesh){mesh.material.map=this.texture;mesh.material.color.set('#ffffff');mesh.material.roughness=1;mesh.material.needsUpdate=true;}};
      this.el.addEventListener('object3dset',this.apply);this.apply();
    },
    remove:function(){this.el.removeEventListener('object3dset',this.apply);this.texture.dispose();}
  });

  AFRAME.registerComponent('mars-mission',{
    init:function(){
      this.phase='inactive';this.ready=false;this.transitioning=false;this.landingStartedAt=0;this.descentComplete=false;this.touchdownAt=0;
      const setup=()=>this.setup();if(this.el.hasLoaded)setup();else this.el.addEventListener('loaded',setup,{once:true});
    },
    setup:function(){
      this.flight=this.el.components['scene-two'];this.rig=$('rig');this.player=$('player');this.camera=$('camera');this.motion=this.player.components['cabin-motion'];
      this.world=$('mars-world');this.sky=$('mars-sky');this.planet=$('mars-planet');this.effects=$('mars-landing-effects');this.sound=$('partner-landing-sound');
      this.panel=$('mission-panel');this.panelLabel=$('mission-control-label');this.flightLabel=$('flight-display-label');this.hero=$('launch-btn');this.heroLabel=this.hero.querySelector('a-text');
      this.headStatus=$('mission-head-status');this.fade=$('mission-fade');this.explore=$('mars-explore-btn');this.exploreLabel=$('mars-explore-label');
      this.fade.object3D.traverse(object=>{object.renderOrder=10000;});
      this.onCruise=()=>this.offerLanding();this.el.addEventListener('scene2-complete',this.onCruise);
      this.onScene4=()=>this.prepareLanding();this.el.addEventListener('scene4-complete',this.onScene4);
      this.onContinue=()=>{if(this.phase==='cruise-ready')this.prepareLanding();};this.panel.addEventListener('click',this.onContinue);
      this.onHero=e=>{
        if(this.phase==='landing-ready'){e.stopImmediatePropagation();this.land();}
        else if(this.phase!=='inactive'&&this.phase!=='cruise-ready')e.stopImmediatePropagation();
      };
      this.hero.addEventListener('click',this.onHero,true);
      this.onExplore=()=>this.beginExploration();this.explore.addEventListener('click',this.onExplore);
      this.onDescent=()=>{this.descentComplete=true;};this.rig.addEventListener('animationcomplete__marsdescent',this.onDescent);
      this.onAudio=e=>{if(this.phase!=='inactive'&&this.phase!=='cruise-ready')this.sound.setAttribute('sound','volume',e.detail.enabled?1:0);};this.el.addEventListener('scene-audio-changed',this.onAudio);
      this.markers=Array.from(this.world.querySelectorAll('.house-marker'));
      this.markers.forEach(marker=>{
        marker.classList.remove('clickable');
        marker.addEventListener('click',()=>{
          if(this.phase!=='arrival-ready'&&this.phase!=='exploring')return;
          const name=marker.getAttribute('data-house');
          this.say('06 / MARS EXPLORATION',`You are exploring ${name} on Mars.`,name);
          this.flight.description.style.color='#c084fc';
          marker.setAttribute('animation',{property:'scale',to:'1.5 1.5 1.5',dur:300,dir:'alternate',loop:2});
          this.el.emit('mars-habitat-selected',{name},false);
        });
      });
      this.ready=true;
      const preview=new URLSearchParams(location.search).get('scene');
      if(preview==='5')this.prepareLanding(true);
      if(preview==='6'){this.configureMars();this.enterArrival(true);}
    },
    say:function(title,description,head){
      this.flight.title.textContent=title;this.flight.description.textContent=description;
      this.headStatus.setAttribute('value',head||description);this.headStatus.setAttribute('visible',true);
    },
    offerLanding:function(){
      if(this.phase!=='inactive')return;
      this.phase='cruise-ready';this.panelLabel.setAttribute('value','CONTINUE TO MARS\nHOLD TO SELECT');this.panel.classList.add('clickable');
      this.flight.description.textContent='Explore zero gravity, or select CONTINUE TO MARS on the left console to test the landing and arrival scenes.';
      this.el.emit('mars-landing-available',{fromScene:2,frames:[5,6]},false);
    },
    fadeTo:function(opacity){
      this.fade.setAttribute('visible',true);
      return new Promise(resolve=>{
        this.fade.addEventListener('animationcomplete__missionfade',resolve,{once:true});
        const from=this.fade.getAttribute('material').opacity;
        this.fade.removeAttribute('animation__missionfade');
        this.fade.setAttribute('animation__missionfade',{property:'material.opacity',from,to:opacity,dur:220,easing:'linear'});
      });
    },
    transition:async function(change,direct){
      this.transitioning=true;this.motion.locomotionEnabled=false;this.camera.setAttribute('wasd-controls','enabled',false);
      if(!direct)await this.fadeTo(1);
      change();
      if(!direct)await this.fadeTo(0);
      this.fade.setAttribute('visible',false);this.transitioning=false;
      const canWalk=this.phase!=='arrival-ready';this.motion.locomotionEnabled=canWalk;this.camera.setAttribute('wasd-controls','enabled',canWalk);
    },
    configureMars:function(){
      this.flight.stop();this.flight.gravity=true;this.flight.updateGravityUI();
      this.motion.setGravity(true);this.motion.height=0;this.motion.heightTrim=0;this.motion.environment='cabin';this.motion.recenter();this.player.object3D.position.y=0;
      this.flight.mug.object3D.position.set(1.8,.88,-1.1);this.flight.mug.object3D.rotation.set(0,0,0);
      $('gravity-btn').classList.remove('clickable');$('gravity-label').setAttribute('value','GRAVITY: LANDING LOCK');
      this.rig.removeAttribute('animation__ascent1');this.rig.removeAttribute('animation__ascent2');
      this.rig.object3D.position.set(0,35.45,5);this.rig.setAttribute('position','0 35.45 5');
      $('earth-launch-world').setAttribute('visible',false);$('scene2-world').setAttribute('visible',false);$('atmosphere').setAttribute('visible',false);
      this.world.setAttribute('visible',true);$('mars-landing-landscape').setAttribute('visible',true);$('mars-arrival-landscape').setAttribute('visible',false);
      $('mars-surface-lights').setAttribute('visible',false);$('launch-sun').setAttribute('visible',true);$('launch-ambient').setAttribute('visible',true);
      $('space-sky').setAttribute('visible',true);this.sky.setAttribute('visible',false);this.planet.setAttribute('visible',true);
      this.planet.removeAttribute('animation');this.planet.setAttribute('rotation','0 0 0');this.planet.setAttribute('animation',{property:'rotation',to:'0 360 0',loop:true,dur:120000,easing:'linear'});
      this.sound.setAttribute('sound','volume',this.flight.audioPreference===false?0:1);
      this.explore.setAttribute('visible',false);this.explore.classList.remove('clickable');
      this.panel.classList.remove('clickable');this.panelLabel.setAttribute('value','MARS APPROACH\nLANDING SYSTEM');
    },
    prepareLanding:async function(direct=false){
      if(!this.ready||this.transitioning||!['inactive','cruise-ready'].includes(this.phase))return;
      this.phase='preparing';this.panel.classList.remove('clickable');
      await this.transition(()=>{
        this.configureMars();this.phase='landing-ready';this.heroLabel.setAttribute('value','LAND');this.hero.classList.add('clickable');
        this.flightLabel.setAttribute('value','ENGINE STATUS\nREADY TO DESCEND');
        this.say('05 / MARS LANDING','Prepare for descent onto the Martian surface. Select the purple LAND control.','05 / HOLD LAND TO DESCEND');
        this.el.emit('scene5-start',{rigPosition:this.rig.object3D.position.toArray()},false);
      },direct);
    },
    land:function(){
      if(this.phase!=='landing-ready'||this.transitioning)return false;
      this.phase='landing';this.hero.classList.remove('clickable');this.heroLabel.setAttribute('value','LANDING');
      this.say('05 / MARS LANDING','Landing sequence activated! Descending toward Mars...','DESCENDING TOWARD MARS');this.flight.description.style.color='#c084fc';
      // Partner's source: once, volume 1, default positional attenuation. The
      // audio bytes are unedited. An explicit user mute may silence playback.
      if(this.sound.components.sound)this.sound.components.sound.playSound();
      this.effects.setAttribute('visible',true);this.planet.setAttribute('visible',false);
      $('space-sky').setAttribute('visible',false);this.sky.setAttribute('color','#8c382b');this.sky.setAttribute('visible',true);
      this.landingStartedAt=performance.now();this.descentComplete=false;this.lastProgress=0;
      this.rig.setAttribute('animation__marsdescent',{property:'position',from:'0 35.45 5',to:'0 .45 5',dur:12000,easing:'easeInQuad'});
      this.el.emit('mars-descent-start',{duration:12000,audio:'partner-liftoff.mp3'},false);return true;
    },
    enterArrival:async function(direct=false){
      if(this.transitioning&&!direct)return;
      if(this.sound.components.sound)this.sound.components.sound.stopSound();
      this.phase='arriving';
      await this.transition(()=>{
        this.rig.removeAttribute('animation__marsdescent');this.rig.object3D.position.set(0,.45,5);this.rig.setAttribute('position','0 .45 5');
        this.effects.setAttribute('visible',false);this.planet.setAttribute('visible',false);$('space-sky').setAttribute('visible',false);
        this.world.setAttribute('visible',true);$('mars-landing-landscape').setAttribute('visible',false);$('mars-arrival-landscape').setAttribute('visible',true);
        this.sky.setAttribute('color','#5c2528');this.sky.setAttribute('visible',true);
        $('launch-sun').setAttribute('visible',false);$('launch-ambient').setAttribute('visible',false);$('mars-surface-lights').setAttribute('visible',true);
        this.motion.environment='mars';this.motion.height=0;this.motion.setGravity(true);this.motion.recenter();this.motion.locomotionEnabled=false;
        this.camera.setAttribute('wasd-controls',{enabled:false,acceleration:30,fly:false});
        this.explore.setAttribute('visible',true);this.explore.classList.add('clickable');this.exploreLabel.setAttribute('value','EXPLORE MARS');
        this.markers.forEach(marker=>marker.classList.add('clickable'));
        this.hero.classList.remove('clickable');this.heroLabel.setAttribute('value','LANDED');this.flightLabel.setAttribute('value','MARS ARRIVAL\nTOUCHDOWN COMPLETE');
        this.phase='arrival-ready';this.say('06 / MARS EXPLORATION','Welcome to Mars. Select EXPLORE to begin.','06 / HOLD EXPLORE TO BEGIN');
        this.el.emit('scene6-start',{origin:'landing-pad',directPreview:direct},false);
      },direct);
    },
    beginExploration:function(){
      if(this.phase!=='arrival-ready'||this.transitioning)return false;
      this.phase='exploring';this.motion.locomotionEnabled=true;this.camera.setAttribute('wasd-controls',{enabled:true,acceleration:30,fly:false});
      this.explore.classList.remove('clickable');this.exploreLabel.setAttribute('value','EXPLORATION ACTIVE');this.exploreHideAt=performance.now()+1500;
      this.say('06 / MARS EXPLORATION','Welcome to Mars! Explore the habitats. Use WASD, touch movement, or the headset gaze navigation controls.','LOOK AT THE GLOWING HABITAT MARKERS');
      this.flight.description.style.color='#38bdf8';this.el.emit('mars-exploration-start',{},false);return true;
    },
    tick:function(){
      if(!this.ready)return;
      const now=performance.now();
      if(this.phase==='landing'){
        const elapsed=(now-this.landingStartedAt)/1000;
        if(elapsed>=4&&this.lastProgress<1){this.lastProgress=1;this.say('05 / MARS LANDING','MARS APPROACH: 10 KM...','MARS APPROACH / 10 KM');this.flightLabel.setAttribute('value','MARS APPROACH\n10 KM');}
        if(elapsed>=8&&this.lastProgress<2){this.lastProgress=2;this.say('05 / MARS LANDING','MARS APPROACH: 1 KM... LANDING ENGINES ACTIVE','1 KM / LANDING ENGINES ACTIVE');this.flightLabel.setAttribute('value','1 KM\nLANDING ENGINES ACTIVE');}
        if(elapsed>=12.5&&this.descentComplete){this.phase='touchdown';this.touchdownAt=now;this.effects.setAttribute('visible',false);this.heroLabel.setAttribute('value','LANDED');this.say('05 / MARS LANDING','TOUCHDOWN! MARS LANDING SUCCESSFUL.','TOUCHDOWN / MARS LANDING SUCCESSFUL');this.flight.description.style.color='#38bdf8';this.el.emit('mars-touchdown',{rigPosition:this.rig.object3D.position.toArray()},false);}
      }
      if(this.phase==='touchdown'&&now-this.touchdownAt>=3000){this.el.emit('scene5-complete',{nextScene:6},false);this.enterArrival();}
      if(this.exploreHideAt&&now>=this.exploreHideAt){this.explore.setAttribute('visible',false);this.exploreHideAt=0;}
    },
    remove:function(){
      this.el.removeEventListener('scene2-complete',this.onCruise);this.el.removeEventListener('scene4-complete',this.onScene4);this.el.removeEventListener('scene-audio-changed',this.onAudio);
      if(this.hero)this.hero.removeEventListener('click',this.onHero,true);if(this.panel)this.panel.removeEventListener('click',this.onContinue);if(this.explore)this.explore.removeEventListener('click',this.onExplore);
      if(this.rig)this.rig.removeEventListener('animationcomplete__marsdescent',this.onDescent);if(this.sound?.components.sound)this.sound.components.sound.stopSound();
    }
  });
}());
