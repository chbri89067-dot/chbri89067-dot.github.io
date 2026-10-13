(() => {
  const image = document.querySelector('#court-animation');
  const replay = document.querySelector('#court-replay');
  const pause = document.querySelector('#court-pause');
  const controls = document.querySelector('[data-animation-controls]');
  const status = document.querySelector('#court-animation-status');
  if (!image || !replay || !pause || !controls || !status) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let completionTimer;
  const showStill = () => {
    window.clearTimeout(completionTimer);
    image.onload = null;
    image.src = image.dataset.poster;
    pause.disabled = true;
    replay.textContent = 'Play animation';
    status.textContent = 'Stopped on the opening frame. Select Play animation to watch the final GIF.';
  };
  const showAnimation = () => {
    window.clearTimeout(completionTimer);
    replay.textContent = 'Replay animation';
    pause.disabled = false;
    status.textContent = 'Playing the final animation. The scene lasts nine seconds and plays once.';
    // A fresh URL restarts a play-once GIF without changing the supplied artwork.
    image.onload = () => {
      completionTimer = window.setTimeout(() => {
        pause.disabled = true;
        status.textContent = 'Animation complete: the shogun is missing. Select Replay animation to watch again.';
      }, 9000);
    };
    image.src = `${image.dataset.animation}?replay=${Date.now()}`;
  };

  controls.hidden = false;
  replay.addEventListener('click', showAnimation);
  pause.addEventListener('click', showStill);
  motionPreference.addEventListener('change', event => {
    if (event.matches) showStill();
  });
  if (motionPreference.matches) showStill();
  else showAnimation();
})();
