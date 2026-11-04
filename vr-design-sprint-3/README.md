# Earth to Mars — complete mobile VR project

A-Frame 1.8.0 with all six scenes in one scene, camera and renderer. This mobile update is based on Jesse Carr's main commit ac8055ea9032ce1c8aae84c5c09b173a1787dcf0, including his solar-system cruise, Mars approach and four-selection window-breaking Easter egg.

## Phone test

Open https://chbri89067-dot.github.io/vr-design-sprint-3/?cardboard=1&v=mobile-20261104 in Safari. Turn the phone sideways, tap Allow motion & start viewer and approve motion before placing it in the headset. This initial gesture prepares Safari motion and audio. After setup, turn your head to aim the center reticle and hold a target for one second. A purple outline appears, fills clockwise, disappears and selects once. Look away before selecting that target again. Looking away early cancels and resets the fill.

Set Selection hold to 0.5, 1, 1.5 or 2 seconds before starting. Developers can set gaze-dwell.duration in milliseconds; it is clamped to 500–2000. The ?dwell=0.5 through ?dwell=2 query option supports intermediate values. A shared bold HOLD TO SELECT label is at least four times the previous rendered size and disappears on selection or cancellation.

## Journey

1. Gaze at the purple LAUNCH control. Jesse's launch and original engine synthesis run.
2. Scene 2 shows the stratosphere-to-space transition. Gaze at GRAVITY to float or settle.
3. Jesse's Scene 3 shows the moving solar-system cruise for 14 seconds. Optional: gaze at the forward window four separate times, looking away between selections. His cracks, eight shards and 2.4-second zero-gravity float-out run. The subsequent cruise retains his timing and movement.
4. Scene 4 advances and enlarges Mars over 16 seconds, then automatically prepares the landing.
5. Gaze at LAND. The partner's unchanged recording and original 12-second descent, 12.5-second touchdown and three-second settling run.
6. Gaze at EXPLORE MARS. Look down toward the original forward direction and select Menu, then Walk to Path / Alpha / Beta / Gamma or Return to Start. The character walks automatically and stops outside each habitat. Gaze at Stop Walking to pause.

The existing SKIP ASCENT / HOLD / CLOSE EYES console label is Jesse's optional shortcut to landing. Gaze selects it; the phone does not detect closed eyes.

## Menu

The menu starts collapsed. Gaze at Menu to show the options, then Hide Menu to collapse them. The same button stays in place and requires look-away before another selection. Closed options are removed from raycasting. Cabin/space movement, floating height, recenter, sound and exit appear in the cabin menu. Mars shows walking destinations plus sound and exit. If the menu is hidden while walking, a separate Stop Walking control remains beside Menu. Major scene changes collapse the menu.

The menu follows your position and stays in the world's original forward direction, so you can turn your head to target every option. It does not lock the off-center buttons to head rotation. Screen selection and two-finger walking are blocked in phone viewer mode. Outside the viewer, desktop drag/click/WASD and touch movement remain. V toggles desktop gaze mode.

## Run locally

Install Node.js 18 or later, then double-click Start-VR.cmd on Windows or run npm start. No dependency installation is needed. Open http://localhost:8080/ on the computer. For iPhone motion use the HTTPS public link; opening index.html in Files does not provide the complete sensor setup.

Direct previews: ?scene=2, ?scene=3, ?scene=4, ?scene=5 and ?scene=6. Append &cardboard=1 for phone setup. scene3.html through scene6.html redirect to the corresponding integrated scene.

## Preservation and code

Jesse's 6 × 6 ship, cabin layout, palette, models, launch synthesis, solar-system geometry, Mars-approach geometry, cruise/approach timings, cracks, shards and float-out remain. Only two small lifecycle corrections are made to scene34.js: the window is not selectable before cruise, and the gravity label agrees with the zero-gravity state. The partner's seven source files remain under reference/partner-original/VR and his landing MP3 is byte-identical. No sounds or music were added or edited.

js/scene34.js owns Jesse's Scenes 3–4. js/vr-interface.js owns Menu/Hide Menu and heavier shared hint rendering. js/scene2.js owns the single gaze dwell controller, launch-to-space transition and independent player motion. js/cardboard-phone.js adapts the existing renderer for stereo and prepares motion/audio. js/mars-mission.js and js/mars-walk.js retain landing and outdoor walking.

credits.html contains each sound's usage, preview, source and license information. The supplied partner MP3 has no creator/license in its original package, and remains identified accordingly.

Run npm test: 13 checks protect Jesse's and the partner's source assets, geometry, audio and scene wiring. Current simulated-phone browser results are docs/mobile-six-scenes-checks.json and docs/mobile-interface-walk-checks.json. Physical iPhone SE/iOS 26.5/Cardboard optics, motion latency and performance still require your real device. The stereo profile has no viewer-specific lens calibration.
