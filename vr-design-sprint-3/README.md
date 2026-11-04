# Earth to Mars — integrated A-Frame scenes

The project combines Jesse's original launch, Brian's stratosphere-to-space/gravity scene, and the partner's Mars landing and exploration package. It uses one A-Frame 1.8.0 scene, camera and renderer through all four implemented frames, including the phone/Cardboard-style stereo session.

Repository base: main at bf7f762feb929ae53e6c2d0f2651a14e99bfb1de. All 39 files in that commit were verified before integration. The partner package is preserved under reference/partner-original/VR; its Scene 1 is a reference and does not replace Jesse's launch.

## Run

With Node.js 18 or later, run **npm start** or double-click **Start-VR.cmd** on Windows. No package installation is needed. Open http://localhost:8080/ on the computer. For an iPhone, use the HTTPS GitHub Pages demo: https://chbri89067-dot.github.io/vr-design-sprint-3/?cardboard=1

Direct previews: **index.html?scene=2**, **index.html?scene=5**, **index.html?scene=6**. Add **&cardboard=1** for phone setup. The scene5.html and scene6.html entry files redirect to the corresponding integrated preview and retain query options.

## Experience

1. Select the purple LAUNCH control for Jesse's original launch.
2. Scene 2 unlocks GRAVITY. The player and loose cup float independently of the ship. After its 24-second transition, the left console offers CONTINUE TO MARS.
3. Select CONTINUE TO MARS, then select the purple LAND control. The partner's original landing recording and 12-second descent run. Touchdown is announced after 12.5 seconds, followed by his 3-second settling period.
4. Frame 6 opens on the partner's path, with the landed ship behind the player. Select EXPLORE and the Alpha, Beta and Gamma habitat markers. Desktop walking uses his acceleration setting of 30; phone users look down toward the colony for WALK TO PATH / ALPHA / BETA / GAMMA, RETURN TO START and STOP WALKING. Holding a destination starts a smooth walk to its entrance.

The direct Scene 2 → Frame 5 control is the testing bridge Brian selected because Frames 3–4 are not yet in the repository. The scene4-complete event also prepares landing, so those scenes can connect later.

## Controls

Desktop: drag to look, click the visible 3D controls, WASD/arrows to move, G for cabin gravity, Q/E for floating height, H to recenter, M for scene audio and V for optional gaze dwell. Touch mode keeps two-finger movement outside the viewer.

Phone headset: first tap Start and approve motion access in Safari. Then use head-gaze dwell: aim the center reticle and hold for 1.8 seconds until the purple ring fills. Screen taps do not select controls during viewer mode. Launch, gravity, Continue, Land, Explore, habitat markers, navigation and exit support gaze. No second page load or permission request is needed between the scenes. Cardboard tracks head turning rather than physical walking or eye movement.

Cabin walking retains Jesse's original bounds. Mars walking expands to the colony area; RETURN TO START recenters outdoors. Floating height controls are hidden outdoors. The 6 × 6 cabin, ceiling, desk, walls, pillars, armrests, lights and mug retain their original dimensions and palette. The original left panel and hero cylinder are reused with changing mission labels.

## Partner preservation and adaptations

All seven supplied files are preserved unchanged under reference/. The three habitat models, landing terrain, exhaust geometry, path and landing pad retain their shapes and dimensions. Cyan accents are normalized from #00e5ff to Jesse's #38bdf8. A single outdoor hill moves from x=-25 to x=-40 so it does not hide Habitat Gamma; its shape and size are unchanged. The partner's alternate cockpit is replaced by the existing canonical ship. The pad remains 10 × 10 and the ship lands fully inside it, with its floor aligned to the pad top.

The Mars planet image URL referenced by the partner returns 404 and no texture was included. A local procedural surface in his rust colors supplies that missing asset. The existing star field and local font keep the runtime independent of CDNs.

## Audio

Jesse's launch synthesis and the four Scene 2 library recordings retain their existing parameters/files. The partner's liftoff.mp3 is copied unchanged to assets/audio/partner-liftoff.mp3. Its SHA-256 is 621bd3440459f5f9281017f9a4bf5b32e2cdc46ea185163b61eb2e5f71007f13. Landing uses his volume 1, non-looping positional playback with the original attenuation defaults and handoff stop. User mute is an explicit volume override. No new exploration soundtrack or effects were added.

The archive misspells the folder as assests, while the original HTML requests assets. The runtime fixes that path. The partner did not include creator/license information for the MP3; it is identified as supplied audio rather than labeled CC0. See **credits.html** for each runtime sound's source, usage, playable preview and download, including the partner recording.

## Project layout and verification

js/mars-mission.js owns the Frame 5/6 state transitions and partner interactions. js/scene2.js keeps the original scene and adds outdoor bounds to cabin-motion. js/cardboard-phone.js keeps the stereo renderer adapter and cabin gaze navigation. js/mars-walk.js adds gaze-selected outdoor walking routes, stop, return, and tracking/focus-loss stops. index.html contains the preserved cabin and imported Mars geometry. assets/audio/partner-source.json records the supplied audio. docs/PARTNER-INTEGRATION.md explains the adaptation and event contract.

Run **npm test**. The eight checks protect Jesse's cabin/launch, old unloaded launch.js, existing audio, all original partner files, the unchanged partner MP3, and the partner habitat/landing/effect geometries. docs/integrated-mars-checks.json records the integrated browser checks. docs/mars-gaze-walk-checks.json records the added walking checks. Phone sensors are simulated in browser QA; the supplied iPhone SE/iOS 26.5 and physical viewer still require real-device validation. The stereo profile has no viewer-specific QR lens calibration or lens correction.
