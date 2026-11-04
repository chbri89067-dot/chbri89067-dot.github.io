
document.addEventListener('DOMContentLoaded', () => {

  const exploreBtn = document.querySelector('#explore-btn');
  const exploreUI = document.querySelector('#explore-ui');

  const camera = document.querySelector('#camera');
  const hudSub = document.querySelector('.hud-sub');
  const movementHint = document.querySelector('#movement-hint');

  const houseMarkers = document.querySelectorAll('.house-marker');

  let isExploring = false;

  // Begin exploration
  exploreBtn.addEventListener('click', () => {

    if (isExploring) return;
    isExploring = true;

    // Enable WASD movement on the camera
    camera.setAttribute('wasd-controls', {
      enabled: true,
      acceleration: 30,
      fly: false
    });

    // Enable look controls
    camera.setAttribute('look-controls', {
      enabled: true
    });

    hudSub.textContent =
      'Welcome to Mars! Use WASD to walk and mouse to look around.';

    hudSub.style.color = '#00e5ff';

    exploreBtn.textContent = 'EXPLORATION ACTIVE';
    exploreBtn.disabled = true;

    movementHint.textContent =
      'WASD: Move | Mouse: Look around | Click markers: Explore habitats';

    // Hide Explore button after activation
    setTimeout(() => {
      exploreUI.style.display = 'none';
    }, 1500);

  });

  // Habitat interactions
  houseMarkers.forEach(marker => {

    marker.addEventListener('click', () => {

      const houseName = marker.getAttribute('data-house');

      hudSub.textContent =
        `You are exploring ${houseName} on Mars.`;

      hudSub.style.color = '#c084fc';

      // Marker feedback
      marker.setAttribute('animation', {
        property: 'scale',
        to: '1.5 1.5 1.5',
        dur: 300,
        dir: 'alternate',
        loop: 2
      });

    });

  });

});
