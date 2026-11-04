# Mars partner package integration

Input ZIP: VR-20261104T030209Z-1-001.zip. SHA-256: 4b18f378adfcf8f66cf10417609defd37451496f597fc9ecaddae6da8212586f.
Source repository base: main, bf7f762feb929ae53e6c2d0f2651a14e99bfb1de; tree b8e5bee8ffdd7935dcdda3a54cc5963ceec09d04.

## Reviewed source

- scene5.html: alternate 6 × 6 cockpit, Mars sphere and surface terrain, three exhaust particles, landing-sound entity. landing.js: once-only landing, volume-1 sound, 12-second easeInQuad descent; 4/8-second progress labels; 12.5-second touchdown; 3 seconds before scene6.html.
- scene6.html: red terrain, neon path, 10 × 10 landing platform and three primitive habitat models. mars-walk.js: Explore enables WASD at acceleration 30, hides its button after 1.5 seconds, and gives habitat text/scale feedback.
- scene1.html and js/launch.js are the partner's earlier launch reference; they are retained but never loaded over Jesse's current launch.
- assests/sounds/liftoff.mp3 is the only supplied audio. The scene's assets/sounds path does not match that spelling. The runtime alias fixes the connection without reencoding or remixing it.

The source files are project data. No comment or document instruction was treated as permission to change another member's scene or upload unrelated files.

## Adaptation choices

The canonical cabin is kept once under #rig, with #player as its sibling. The partner cockpit differs in ceiling/wall/console dimensions, so it is not layered over Jesse's mesh. The existing left console becomes the Continue control; the original purple cylinder becomes LAND only during Frame 5. Its capture handler prevents the original Scene 1 listener from running in a direct Mars preview. All initial cabin geometry, colors, layout and launch code remain protected by the baseline tests.

The ship descends 35 units over the original 12 seconds, from (0,35.45,5) to (0,.45,5). The translation places its unchanged floor top at y=.2, aligned with the partner pad. The positional sound emitter is translated by the same (.45,5) offset, retaining its original listener-relative descent path. Normal playback is once at volume 1, inverse distance model, refDistance 1 and rolloff 1. Audio stops at the original Frame 6 handoff; no exploration audio is introduced. The existing user mute is honored separately.

Both frames run in the existing scene instead of navigating to a new page. This retains the gyro permission, audio context, stereo rendering and head-gaze controls on iPhone. The HTML Land and Explore buttons are represented by in-world controls. Habitat markers retain their feedback. Mars locomotion has outdoor bounds; the ship stays stationary when the player explores. Gravity is restored and locked for landing; the Scene 2 floating experiment remains available before Continue.

The arrival hill at (-25,0,-50) originally overlaps and hides Habitat Gamma; only that hill's x coordinate moves to -40. Terrain/habitat shapes and dimensions remain unchanged. The partner's cyan #00e5ff becomes #38bdf8; navy, purple, rust terrain and habitat body colors remain. The source planet texture URL returns 404; a local procedural surface uses his rust tones. The existing 3D stars supply a shared sky rather than adding a second remote sky image.

## Handoff events

Events are emitted on a-scene without bubbling:

| Event | Meaning |
| --- | --- |
| mars-landing-available | Scene 2 completed; the user-selected testing bridge is offered |
| scene5-start | Mars approach is ready; gaze/click LAND to descend |
| mars-descent-start | Original 12-second descent and partner audio begin |
| mars-touchdown | Descent completed and original 12.5-second touchdown point reached |
| scene5-complete | Original settling interval ended; Frame 6 handoff begins |
| scene6-start | Arrival is ready, with Explore and habitat markers |
| mars-exploration-start | Explore was selected; outdoor locomotion is enabled |
| mars-habitat-selected | A marker was selected; detail.name identifies the habitat |

Future Frame 4 can emit scene4-complete to call the same landing preparation. Frames 3–4 are not created by this integration. The manual Scene 2 → Mars bridge was explicitly selected by the user.

## Sound provenance

The original partner file and runtime alias must remain byte-identical. Source manifest: assets/audio/partner-source.json. Its creator and license were not provided, so credits do not claim a CC0 license for it. All seven reference files have hashes in tests/fixtures/partner-files.json. They are preserved for review, not executed by the integrated page.
