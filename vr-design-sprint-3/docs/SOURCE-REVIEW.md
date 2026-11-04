# Review of Jesse's implementation

Reviewed on October 30, 2026, through the connected GitHub account. Repository: `chbri89067-dot/VR-Design-Sprint-3`; default branch `main`; reviewed head `cb2afbd76a7a62448dfaed5676de696201462646`, authored by `jesse-carr` (Jesse Carr). The latest message is “added some more to the Earth landscape and fixed the control center layout.” The repository had three files: `index.html`, `js/launch.js` and `README.md`; no repository-specific AGENTS.md was present in that tree.

## Active entry point and launch

`index.html` loads A-Frame 1.8.0 and defines the working scene and inline launch logic. The launch handler guards repeated launches, updates the HUD, plays two Web Audio oscillators, starts smoke and an engine light, compresses the launch button, and vibrates the entire flight rig. At 3 seconds it starts a 5-second ascent to `0 450 -100`. At 8 seconds it starts a 6-second ascent to **`0 2800 -600`** and darkens the sky. Scene 2 listens to **`animationcomplete__ascent2`**, so it follows the actual completion, rather than a second competing timer.

The inline script is preserved exactly. Its audio is a sawtooth oscillator rising from 40 to 140 Hz and a triangle oscillator rising from 80 to 320 Hz, with Jesse's original envelopes. Scene 2 adds independent audio entities and does not substitute a recording for those sounds.

## Ship contract

- Ceiling: width 6, depth 6, y 3.2; inset ceiling width/depth 4.5 at y 3.05.
- Floor: width/depth 6, thickness 0.3, y -0.4.
- Side walls: x -2.9 / 2.9, width 0.2, height 3.8, depth 6; rear wall z 2.9.
- Desk: width 4.8, height 0.6, depth 1.0, position `0 0.55 -1.35`.
- Angled pillars: x -2.4 / 2.4, z -1.5, width 0.6, height 3.8, depth 0.8, opposite 10-degree rolls.
- Hull colors: `#0f172a`, `#1e293b`, `#090d16`; rails `#334155`, ladder details `#475569`.
- Lighting/panels: cyan `#38bdf8`, panel face `#0891b2`, panel emission `#0e7490`; purple `#c084fc` and `#a855f7`.
- Launch button: radius 0.22, height 0.12, position `0 0.98 -1.25`, tilt -15 degrees.
- Armrests: x -1.9 / 1.9; original mug at `1.8 0.88 -1.1`, radius 0.07, height 0.18.

All original cabin geometry, materials and decorative elements stay in place. The existing hull is the exterior geometry available in this revision; there is no separate spacecraft mesh or GLTF model in the repository. No replacement exterior was invented. The distant rocket is part of Jesse's Kennedy Space Center environment, and is also retained.

## Looking and locomotion

The camera retains A-Frame look-controls and WASD controls. Its original default starting height is 1.6. A new `#player` parent inside `#rig` supplies the gravity offset, touch movement and controller movement. The cabin stays a sibling of that player under `#rig`. This prevents a gravity change from lifting the ship together with the viewer. Walking acceleration is reduced for this small cabin, and only its outer-wall bounds are added.

## Older file

`js/launch.js` is not referenced by the current page. It expects older IDs such as `#smoke-effects`, `#sound-emitter` and `.hud-sub`; attaching it to the current scene would produce conflicts and null references. It is retained byte-for-byte for the group, and remains unloaded.

## Non-ship integration changes

The same A-Frame version is bundled locally. The external single-face star image is replaced by code-generated 3D stars. The sky entities follow the viewer so the ship cannot fly outside their original small spheres. The original Earth scenery is wrapped in an identity transform and hidden only at the Scene 2 handoff. Scene 2 adds its own exterior Earth/haze objects without changing the cabin. Original text uses the same Roboto font through local asset paths. No meeting-note instruction was treated as authorization to publish, submit, or change another member's scenes.

## November 2 follow-up

The upstream main head still matches the reviewed commit. The purple launch fixture and entire inline launch script remain protected. Only its input routing changed to support direct mouse/touch clicks. The added HTML toolbar and direction pad were removed at the user's request; keyboard actions, two-finger touch movement, the original ship and all sound assets/settings are retained.

## Phone-headset adaptation

Cardboard-style phone support is in js/cardboard-phone.js. The existing ship geometry and all sound parameters remain protected. Inside the original launch script, the AudioContext expression now prefers window.marsPhoneAudioContext, prepared by a trusted setup tap for iOS gaze-triggered playback. This single expression is the only allowed normalization before the original launch-script hash check. Earlier statements about a byte-identical full inline script describe the pre-phone revision.
