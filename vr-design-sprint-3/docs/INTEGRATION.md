# Integrating Scene 2

Base commit: `cb2afbd76a7a62448dfaed5676de696201462646` on the group's main branch.

Use the complete folder to inspect the result locally, or apply the supplied patch to a separate local checkout of this exact base. No push is required. If the remote has newer group edits, merge the following additions instead of replacing a newer `index.html` wholesale.

1. Keep Jesse's `#rig`, all of `#spaceship-cabin`, the launch IDs and original inline launch script.
2. Load `js/scene2.js` after A-Frame and before `<a-scene>`, load `css/scene2.css`, and attach `scene-two` to `<a-scene>`.
3. Put the original camera inside `#player` with `cabin-motion`. Leave the cabin under `#rig`, outside `#player`.
4. Add the single gravity fixture and the four audio assets/entities, plus the exterior `#scene2-world`. Copy `assets/`, `vendor/`, and `credits.html`.
5. Keep the original launch-script section unchanged. The new component observes its named final animation's completion and starts automatically.

## Event contract

Events are emitted on the `<a-scene>` element, without bubbling.

| Event | When | Detail |
| --- | --- | --- |
| `scene2-start` | Jesse's `animation__ascent2` completes, or direct Scene 2 preview starts | source and rigPosition |
| `gravity-changed` | Player toggles the control | enabled: true / false |
| `scene2-complete` | The 24-second exterior transition reaches open space | nextScene: 3, gravityEnabled, rigPosition |

The final event is a handoff signal; this package does not navigate to a teammate's page. Scene 2 remains interactive until the next scene takes ownership. Example for the teammate implementing Scene 3:

```js
const scene = document.querySelector('a-scene');
scene.addEventListener('scene2-complete', event => {
  // Prepare Scene 3 here. Keep the same #rig, #player and #spaceship-cabin.
  // When your scene is actually ready to take over:
  // scene.components['scene-two'].stop();
});
```

`stop()` stops Brian's music and hum, restores gravity, and disables the Scene 2 floating offset. The world is left visible for a seamless environment handoff; the next scene decides when to hide or replace `#scene2-world`. `start()` is idempotent during one run. To replay from the start in development, reload the page. Direct preview is `index.html?scene=2`.

The existing left card still reads SKIP ASCENT; wiring an actual eye-close/skip feature is outside this requested change. Do not load the older `js/launch.js` alongside the active inline script.

## Console input revision

Keep the screen-selection component on #reticle. It uses one A-Frame cursor for direct desktop/touch clicks and switches to a head ray in VR/gaze mode. The removed HTML toolbar is not needed for launch or gravity. Keep the keyboard shortcuts and two-finger movement wiring in scene2.js. See BUTTON-REVISION.md.

## Phone mode

Load js/cardboard-phone.js after js/scene2.js, retain the phone setup markup and manifest, and attach cardboard-phone to the scene. screen-selection switches to the head ray while the phone adapter is active. The adapter wraps only the existing A-Frame renderer render call, restores viewport/scissor state after the two eyes, and leaves normal rendering unchanged when inactive. Phone-only navigation is a player child, separate from the preserved spaceship-cabin. One original launch-script expression reuses a setup-primed AudioContext; do not remove it if gaze must trigger Jesse's sound on iOS.
