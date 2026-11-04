
document.addEventListener('DOMContentLoaded', () => {

  const landBtn = document.querySelector('#land-btn');
  const rig = document.querySelector('#rig');
  const landingEffects = document.querySelector('#landing-effects');
  const soundEmitter = document.querySelector('#sound-emitter');
  const hudSub = document.querySelector('.hud-sub');

  const marsPlanet = document.querySelector('#mars-planet');
  const spaceSky = document.querySelector('#space-sky');

  let isLanding = false;

  landBtn.addEventListener('click', () => {

    if (isLanding) return;
    isLanding = true;

    landBtn.disabled = true;
    landBtn.textContent = 'LANDING IN PROGRESS...';

    hudSub.textContent =
      'Landing sequence activated! Descending toward Mars...';

    hudSub.style.color = '#c084fc';

    // Play landing audio
    if (soundEmitter.components.sound) {
      soundEmitter.components.sound.playSound();
    }

    // Show landing exhaust
    landingEffects.setAttribute('visible', true);

    // Hide Mars planet as the craft approaches the surface
    marsPlanet.setAttribute('visible', false);

    // Change sky color during descent
    spaceSky.setAttribute('color', '#8c382b');
    spaceSky.removeAttribute('src');

    // Smooth spacecraft descent
    rig.setAttribute('animation', {
      property: 'position',
      from: '0 35 0',
      to: '0 0 0',
      dur: 12000,
      easing: 'easeInQuad'
    });

    // Landing progression
    setTimeout(() => {
      hudSub.textContent =
        'MARS APPROACH: 10 KM...';

    }, 4000);

    setTimeout(() => {
      hudSub.textContent =
        'MARS APPROACH: 1 KM... LANDING ENGINES ACTIVE';

    }, 8000);

    // Touchdown
    setTimeout(() => {

      hudSub.textContent =
        'TOUCHDOWN! MARS LANDING SUCCESSFUL.';

      hudSub.style.color = '#00e5ff';

      landingEffects.setAttribute('visible', false);

      landBtn.textContent = 'LANDING COMPLETE';

      // Proceed to exploration
      setTimeout(() => {
        window.location.href = 'scene6.html';
      }, 3000);

    }, 12500);

  });

});
