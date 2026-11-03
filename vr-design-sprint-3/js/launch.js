document.addEventListener('DOMContentLoaded', () => {
  const launchBtn = document.querySelector('#launch-btn');
  const rig = document.querySelector('#rig');
  const smokeEffects = document.querySelector('#smoke-effects');
  const soundEmitter = document.querySelector('#sound-emitter');
  const hudSub = document.querySelector('.hud-sub');

  let isLaunching = false;

  launchBtn.addEventListener('click', () => {
    if (isLaunching) return;
    isLaunching = true;

    // Update HUD instructions
    hudSub.textContent = "Liftoff initiated! Ascending into orbit...";
    hudSub.style.color = "#c084fc";

    // Play liftoff audio
    if (soundEmitter && soundEmitter.components.sound) {
      soundEmitter.components.sound.playSound();
    }

    // Show smoke/exhaust visual effects
    smokeEffects.setAttribute('visible', 'true');

    // Button feedback animation (press down)
    launchBtn.setAttribute('animation', 'property: position; to: 0 1.15 -1.3; dur: 200; dir: alternate; loop: 2;');

    // Trigger smooth upward ascent animation for the entire rig/camera & cabin
    setTimeout(() => {
      rig.setAttribute('animation', {
        property: 'position',
        to: '0 85 -30',
        dur: 8000,
        easing: 'easeInQuad'
      });
    }, 500);

    // Optional: Transition to Scene 02 after ascent completes
    setTimeout(() => {
      console.log("Transitioning to Scene 02...");
      // window.location.href = 'scene2.html';
    }, 8500);
  });
});