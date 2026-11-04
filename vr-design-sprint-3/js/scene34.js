(function () {
  'use strict';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const ease = value => value * value * (3 - 2 * value);
  const ESCAPE_DURATION = 2.4;
  const CRUISE_DURATION = 14;
  const CRUISE_SPEED = 4;

  AFRAME.registerComponent('scene-three-four', {
    init: function () {
      this.phase = 'inactive';
      this.windowHits = 0;
      this.approachElapsed = 0;
      this.floatElapsed = 0;
      this.cruiseElapsed = 0;
      this.scene2Elapsed = 0;
      this.awaitingCruise = false;
      this.ready = false;
      this.scene = this.el.sceneEl;
      this.onScene2Start = () => {
        this.scene2Elapsed = 0;
        this.awaitingCruise = true;
      };
      this.onScene2Complete = () => this.startCruise();
      this.onWindowClick = () => this.crackWindow();
      this.onScene5Start = () => this.reset();
      this.onMissionReady = () => this.startPreview();
      this.setup = () => this.initializeScene();
      if (this.scene.hasLoaded) this.setup();
      else this.scene.addEventListener('loaded', this.setup, {once: true});
    },

    initializeScene: function () {
      this.mission = this.scene.components['mars-mission'];
      this.flight = this.scene.components['scene-two'];
      this.rig = document.querySelector('#rig');
      this.player = document.querySelector('#player');
      this.motion = this.player.components['cabin-motion'];
      this.cabin = document.querySelector('#spaceship-cabin');
      this.window = document.querySelector('#ship-window');
      this.window.classList.remove('clickable');
      this.cracks = document.querySelector('#window-cracks');
      this.shards = document.querySelector('#window-shards');
      this.world = document.querySelector('#scene34-world');
      this.solarSystem = document.querySelector('#solar-system');
      this.planet = document.querySelector('#mars-approach-planet');
      this.sky = document.querySelector('#space-sky');
      this.atmosphere = document.querySelector('#atmosphere');
      this.title = document.querySelector('#hud h1');
      this.description = document.querySelector('#hud p');
      this.headStatus = document.querySelector('#mission-head-status');
      this.scene.addEventListener('scene2-start', this.onScene2Start);
      this.scene.addEventListener('scene2-complete', this.onScene2Complete);
      this.scene.addEventListener('scene5-start', this.onScene5Start);
      this.window.addEventListener('click', this.onWindowClick);
      this.ready = true;

      const preview = new URLSearchParams(location.search).get('scene');
      if (preview === '3' || preview === '4') {
        this.preview = preview;
        if (this.mission.ready) this.startPreview();
        else this.scene.addEventListener('mars-mission-ready', this.onMissionReady, {once: true});
      }
    },

    startPreview: function () {
      this.mission.offerLanding();
      if (this.preview === '3') this.startCruise();
      if (this.preview === '4') this.startApproach();
    },

    startCruise: function () {
      if (!this.ready || this.phase !== 'inactive') return;
      if (this.mission.phase === 'inactive') this.mission.offerLanding();
      this.phase = 'cruise';
      this.awaitingCruise = false;
      this.windowHits = 0;
      this.window.setAttribute('visible', true);
      this.window.setAttribute('material', 'opacity', 0.1);
      this.window.classList.add('clickable');
      this.cracks.replaceChildren();
      this.cracks.setAttribute('visible', true);
      this.shards.replaceChildren();
      this.shards.setAttribute('visible', false);
      this.cabin.setAttribute('visible', true);
      this.world.object3D.position.copy(this.rig.object3D.position);
      this.world.setAttribute('visible', true);
      document.querySelector('#launch-btn').classList.remove('clickable');
      this.solarSystem.setAttribute('visible', true);
      this.planet.setAttribute('visible', false);
      this.atmosphere.setAttribute('visible', false);
      this.sky.setAttribute('visible', true);
      document.querySelector('#earth-launch-world').setAttribute('visible', false);
      document.querySelector('#scene2-world').setAttribute('visible', false);
      this.title.textContent = '03 / OUTER SPACE CRUISE';
      this.description.textContent = 'Earth is behind us. Click or gaze at the forward window four times to fracture it and float into zero gravity. Select SKIP ASCENT HOLD / CLOSE EYES on the left console to go straight to Mars landing.';
      this.headStatus.setAttribute('value', '03 / OUTER SPACE CRUISE');
      this.headStatus.setAttribute('visible', true);
      this.scene.emit('scene3-start', {windowHitsRequired: 4}, false);
    },

    crackWindow: function () {
      if (this.phase !== 'cruise') return;
      this.windowHits += 1;
      this.window.setAttribute('material', 'opacity', 0.1 + this.windowHits * 0.075);
      this.addCracks(this.windowHits);
      this.headStatus.setAttribute('value', `WINDOW STRESS / ${this.windowHits} OF 4`);
      this.scene.emit('scene3-window-hit', {hits: this.windowHits, required: 4}, false);
      if (this.windowHits === 4) this.breakWindow();
    },

    addCracks: function (hit) {
      const roots = [
        [[0, 0], [-0.75, 0.66], [-1.4, 0.8]],
        [[0, 0], [0.8, 0.55], [1.35, 1.05]],
        [[0, 0], [-0.65, -0.75], [-1.25, -1.05]],
        [[0, 0], [0.8, -0.72], [1.45, -1.1]]
      ];
      const branch = roots[hit - 1];
      for (let index = 0; index < branch.length - 1; index += 1) {
        const line = document.createElement('a-entity');
        const [start, end] = [branch[index], branch[index + 1]];
        line.setAttribute('line', {
          start: `${start[0]} ${start[1]} 0.02`,
          end: `${end[0]} ${end[1]} 0.02`,
          color: '#e0f2fe'
        });
        this.cracks.appendChild(line);
      }
    },

    breakWindow: function () {
      this.phase = 'escaping';
      this.window.classList.remove('clickable');
      this.window.setAttribute('visible', false);
      this.cracks.setAttribute('visible', false);
      this.createShards();
      this.shards.setAttribute('visible', true);
      this.motion.environment = 'space';
      this.motion.setGravity(false);
      this.flight.gravity = false;
      this.flight.updateGravityUI();
      this.motion.enabled = true;
      this.motion.locomotionEnabled = true;
      document.querySelector('#camera').setAttribute('wasd-controls', 'enabled', true);
      this.floatElapsed = 0;
      this.player.setAttribute('animation__floatout', {
        property: 'position.z',
        from: this.player.object3D.position.z,
        to: -7,
        dur: 2400,
        easing: 'easeInOutQuad'
      });
      this.headStatus.setAttribute('value', 'WINDOW BREACHED / ZERO-G ESCAPE');
      this.description.textContent = 'The forward window is open. Float out, then explore the solar system while the ship cruises toward Mars.';
      this.scene.emit('scene3-window-broken', {}, false);
    },

    createShards: function () {
      for (let index = 0; index < 8; index += 1) {
        const angle = index * Math.PI / 4;
        const x = Math.cos(angle) * 1.25;
        const y = 1.5 + Math.sin(angle) * 0.72;
        const shard = document.createElement('a-box');
        shard.setAttribute('position', `${x} ${y} -2.8`);
        shard.setAttribute('width', '0.32');
        shard.setAttribute('height', '0.42');
        shard.setAttribute('depth', '0.025');
        shard.setAttribute('color', '#bae6fd');
        shard.setAttribute('material', 'shader: flat; opacity: 0.6; transparent: true; side: double');
        shard.setAttribute('animation__drift', {
          property: 'position',
          from: `${x} ${y} -2.8`,
          to: `${x * 1.9} ${y + Math.sin(angle) * 0.9} -4`,
          dur: 900,
          easing: 'easeOutCubic'
        });
        shard.setAttribute('animation__spin', {
          property: 'rotation',
          to: `${index * 19} ${index * 31} ${index * 47}`,
          dur: 900,
          easing: 'easeOutCubic'
        });
        this.shards.appendChild(shard);
      }
    },

    startApproach: function () {
      if (!this.ready || this.phase === 'approach' || this.phase === 'landing') return;
      this.phase = 'approach';
      this.solarSystem.setAttribute('visible', false);
      this.world.object3D.position.copy(this.rig.object3D.position);
      this.world.setAttribute('visible', true);
      document.querySelector('#launch-btn').classList.remove('clickable');
      this.planet.object3D.position.set(0, 0, -260);
      this.planet.object3D.scale.setScalar(0.35);
      this.planet.setAttribute('visible', true);
      this.approachElapsed = 0;
      this.motion.environment = 'space';
      this.motion.setGravity(false);
      this.flight.gravity = false;
      this.flight.updateGravityUI();
      this.motion.enabled = true;
      this.motion.locomotionEnabled = true;
      document.querySelector('#camera').setAttribute('wasd-controls', 'enabled', true);
      this.title.textContent = '04 / MARS APPROACH';
      this.description.textContent = 'Mars is growing in the forward viewport as the spacecraft closes on its destination.';
      this.headStatus.setAttribute('value', '04 / MARS APPROACH');
      this.atmosphere.setAttribute('visible', false);
      this.sky.setAttribute('visible', true);
      document.querySelector('#earth-launch-world').setAttribute('visible', false);
      document.querySelector('#scene2-world').setAttribute('visible', false);
      this.scene.emit('scene4-start', {duration: 16000}, false);
    },

    tick: function (time, delta) {
      if (!this.ready) return;
      const dt = Math.min(delta / 1000, 0.05);
      if (this.awaitingCruise && this.flight.active && this.phase === 'inactive') {
        this.scene2Elapsed += dt;
        if (this.scene2Elapsed >= this.flight.data.duration) this.startCruise();
      }
      if (this.phase === 'escaping') {
        this.floatElapsed += dt;
        this.moveForward(dt);
        if (this.floatElapsed >= ESCAPE_DURATION) {
          this.phase = 'cruise';
          this.cruiseElapsed = 0;
          this.description.textContent = 'Explore freely in zero gravity as the ship moves through the solar system. Mars approach begins shortly.';
          this.headStatus.setAttribute('value', '03 / ZERO-G SOLAR CRUISE');
        }
      }
      if (this.phase === 'cruise') {
        this.cruiseElapsed += dt;
        this.moveForward(dt);
        if (this.cruiseElapsed >= CRUISE_DURATION) this.startApproach();
      }
      if (this.phase === 'approach') {
        this.approachElapsed += dt;
        const progress = clamp(this.approachElapsed / 16, 0, 1);
        const eased = ease(progress);
        this.planet.object3D.position.set(0, 0, -260 + eased * 160);
        this.planet.object3D.scale.setScalar(0.35 + eased * 2.15);
        if (progress === 1) {
          this.phase = 'landing';
          this.headStatus.setAttribute('value', 'MARS APPROACH COMPLETE');
          this.scene.emit('scene4-complete', {nextScene: 5}, false);
        }
      }
    },

    moveForward: function (delta) {
      this.rig.object3D.position.z -= CRUISE_SPEED * delta;
    },

    reset: function () {
      this.phase = 'inactive';
      this.windowHits = 0;
      this.window.setAttribute('visible', false);
      this.window.classList.remove('clickable');
      this.cracks.replaceChildren();
      this.cracks.setAttribute('visible', false);
      this.shards.replaceChildren();
      this.shards.setAttribute('visible', false);
      this.cabin.setAttribute('visible', true);
      this.world.setAttribute('visible', false);
      this.player.removeAttribute('animation__floatout');
      this.player.object3D.position.set(0, 0, 0);
      this.motion.environment = 'cabin';
    },

    remove: function () {
      this.scene.removeEventListener('loaded', this.setup);
      if (!this.ready) return;
      this.scene.removeEventListener('scene2-complete', this.onScene2Complete);
      this.scene.removeEventListener('scene2-start', this.onScene2Start);
      this.scene.removeEventListener('scene5-start', this.onScene5Start);
      this.scene.removeEventListener('mars-mission-ready', this.onMissionReady);
      this.window.removeEventListener('click', this.onWindowClick);
    }
  });
}());
