# Test the complete mobile VR project

No account is required. Full experience: https://chbri89067-dot.github.io/vr-design-sprint-3/?cardboard=1&v=ring-clear-mars-20261104-r2

## Start in Safari

1. Open the HTTPS link in Safari, turn the phone sideways and set media volume.
2. Choose Selection hold: 0.5, 1 (default), 1.5 or 2 seconds. Eye spacing and field of view remain adjustable before entry.
3. Tap Allow motion & start viewer and approve motion. Gently move the phone until readings arrive, then place it in the headset. This real setup gesture prepares motion and audio.
4. Turn your head to aim the center reticle. Hold a target while the purple ring fills clockwise. It disappears and activates the item once. Looking away early cancels; looking away and back enables another selection. The larger bold HOLD TO SELECT label appears during the hold and disappears with the ring.

## Try the scenes

Gaze at LAUNCH, then use GRAVITY in Scene 2. Scene 3's solar-system cruise and Scene 4's Mars approach now run automatically, followed by the purple LAND control. After touchdown, the final Mars view opens automatically.

In Scene 3, try the Easter egg: gaze at the forward window four separate times, looking away between each activation. Jesse's cracks, shards and zero-gravity float-out run. Staying focused on the window counts once. Space movement is available through Menu after the float-out. The scene then proceeds toward Mars.

The existing SKIP ASCENT / CLOSE EYES console label offers a gaze-operated shortcut to landing; no closed-eye sensing is implemented.

## Menu in Scenes 1–5 and the final Mars view

In Scenes 1–5, look down in the original forward direction for Menu. Hold it to display the existing options; hold Hide Menu to close them. Their behavior and dwell timing are unchanged.

The final scene removes walking destinations, Stop/Return, Menu, Explore, phone-action containers and navigation captions from the DOM. They occupy no space and cannot receive clicks, hover or focus. The Mars world and existing habitat markers remain. Safari setup is still shown before entering the phone viewer when opening the final-scene preview directly.

The iPhone/Cardboard path tracks head rotation, not physical position. Moving or walking forward/backward does not move the character. With the walking controls removed, phone users have a stationary look-around view. Existing desktop WASD remains unchanged. No replacement movement gesture has been added.

The ring uses an opaque white fill, a 70%-opaque purple track and an opaque black backing. The stroke is 1.5 times its previous width. Its 0.5–2-second configurable timing, clockwise fill, leave-to-cancel/reset, once-per-hover selection and confirmation behavior are preserved.

## Fast tests and download

- Scene 3 and window: https://chbri89067-dot.github.io/vr-design-sprint-3/?scene=3&cardboard=1&v=ring-clear-mars-20261104-r2
- Scene 4: https://chbri89067-dot.github.io/vr-design-sprint-3/?scene=4&cardboard=1&v=ring-clear-mars-20261104-r2
- Mars view: https://chbri89067-dot.github.io/vr-design-sprint-3/?scene=6&cardboard=1&v=ring-clear-mars-20261104-r2
- Complete project: https://chbri89067-dot.github.io/vr-design-sprint-3/VR-Design-Sprint-3-Mobile-Complete.zip?v=ring-clear-mars-20261104-r2

The extracted package includes START-HERE.html and READ-ME-FIRST.txt. To run on a computer, use Node.js 18+ and Start-VR.cmd or npm start. Use the public HTTPS link for the phone test.

## Record your physical test

After exiting by gaze, expand Record my phone test. Tick only what you observed and download the record. The report is stored locally, not uploaded. Check stereo alignment, head turning, one-second ring, cancel/re-enter behavior, Menu/Hide Menu in Scenes 1–5, gravity, cruise/approach, window escape, landing audio and the clear final Mars view.

If motion stops, keep Safari visible, rotate to landscape and retry. If sound is absent, raise media volume, exit and tap Start again. If the two views do not merge, exit and adjust eye spacing/FOV and headset alignment.

Browser QA uses synthetic orientation and does not validate physical iPhone SE/iOS 26.5/Cardboard behavior. The generic stereo profile has no viewer-QR calibration or lens-distortion correction. Safari setup still requires the initial permission/audio gesture.
