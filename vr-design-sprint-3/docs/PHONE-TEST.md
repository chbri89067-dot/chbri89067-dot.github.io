# iPhone SE / Cardboard-style viewer test

Target supplied by Brian: iPhone SE with iOS 26.5. That exact phone/OS/headset combination has not been tested by the developer. Browser automation used an emulated SE-sized landscape viewport with simulated sensor events.

Phone link: https://chbri89067-dot.github.io/vr-design-sprint-3/?cardboard=1

The phone demo is hosted on GitHub Pages and needs no account or sign-in. Anyone with the link can open the demo. The group GitHub repository remains private. The localhost URL on your computer is not a phone-accessible HTTPS link.

## Start on the phone

1. Open the link in Safari, directly rather than inside another app's embedded browser. Keep the tab visible.
2. Disable Portrait Orientation Lock and rotate the phone to landscape.
3. For more screen area, use Safari's Share menu → Add to Home Screen → Open as Web App, then reopen it from its icon. This is optional; availability of browser fullscreen varies, so the code does not depend on fullscreen succeeding.
4. Start with the default 64 mm eye separation and 80° field of view. Tap **Allow motion & start viewer** and choose **Allow** in the motion prompt. Gently turn the phone until the view starts; no motion readings produces a message instead of silently entering a broken mode.
5. Put the phone in the viewer, aligning the two screen halves with its lenses. Begin seated. Gaze input waits 3.5 seconds after entry to give time to position the phone.
6. Look slightly down at the purple **LAUNCH** cylinder. Hold the reticle on it for 1.8 seconds. A purple progress ring fills while the head reticle stays on the control. Launch should start once, with Jesse's original engine sound.
7. After the original launch completes, look at the right console's **GRAVITY** control. Hold for 1.8 seconds to turn it off. The player and cup rise. Look away, then look back and hold again to restore gravity.
8. Turn around to find the phone-only cabin controls. Gaze at TO CONSOLE/AWAY/LEFT/RIGHT for a 0.3-unit step; RISE/LOWER adjusts height with gravity off; RETURN TO SEAT recenters; SOUND toggles Scene 2 audio; EXIT VIEWER returns to setup. Look away before repeating the same action. Physical head turning works; physical walking is not tracked by Cardboard.

For a faster gravity-only check, use the same link with **?scene=2&cardboard=1**.

## Record actual results for the professor

After exiting, expand **Record my phone test**. Tick only the behaviors you actually observed on the real phone, then choose **Download my test record**. It records browser/version, viewport, motion permission, sensor counts, stereo frame counts, audio context state and your checkboxes. The record is stored locally in that browser and downloaded on request; it is not sent to a server. Frame counts and sensor events do not, by themselves, prove lens alignment or a successful physical test.

Check: two views align through the lenses; head turns change the view; gaze launches once with sound; launch hands off; gravity toggles both ways; the cabin controls work; the session remains usable for several minutes without unacceptable heat or lag. Browser FPS is an on-device observation, not a guaranteed headset latency measurement.

## If it does not work

| Symptom | Next step |
| --- | --- |
| No motion prompt / no turning | Confirm HTTPS, Safari and a visible tab; retry motion permission. Reopen/reload the site if permission was denied. The setup diagnostics distinguishes permission from arriving sensor events. |
| Only one view | Use **Phone headset** and the phone setup, rather than the normal A-Frame WebXR entry. |
| Browser bars cover part of the view | Try the Home Screen web-app flow, then reopen in landscape. |
| Two images do not merge | Exit and adjust eye separation/FOV, realign the phone, and check that the viewer fits the SE. This generic stereo prototype has no viewer-QR optical calibration or lens-distortion correction. Do not treat poor optical alignment as a passed test. |
| No engine sound | Raise media volume, exit, and tap Start again to prepare audio before gaze. Scene 1 and Scene 2 have independent audio paths. |
| Input stops | Turn the phone sideways and keep the page visible. Gaze pauses if the page hides, the phone turns upright or sensor readings stop. |

## Implementation and limits

The adaptation is an A-Frame component using the existing scene and renderer. It renders two eye-offset cameras; it is not a duplicated video or a second standalone renderer. A-Frame look-controls supplies phone orientation; existing raycasting and gaze-dwell activate the same launch and gravity controls. Native WebXR remains available for devices that support it; the phone path does not require an immersive WebXR session.

The ship's dimensions, palette, materials and Scene 2 sound files/volumes are retained. The only edit inside Jesse's launch script is selecting the AudioContext prepared during the initial tap. Its two oscillators, frequencies, envelopes, launch timing and visual actions are unchanged. The preservation test normalizes only that one context-reuse expression before checking the original script hash.

Automated evidence is in **cardboard-phone-checks.json**. Physical iPhone Safari, headset optics, thermal behavior, actual sensor latency and viewer-button compatibility remain unverified. Gaze selection deliberately works without depending on the viewer's physical button.

Primary references:
- A-Frame 1.8 scene VR entry and render loop: https://github.com/aframevr/aframe/blob/v1.8.0/src/core/scene/a-scene.js
- A-Frame motion permission / HTTPS: https://aframe.io/docs/1.7.0/components/device-orientation-permission-ui.html
- A-Frame look-controls: https://github.com/aframevr/aframe/blob/v1.8.0/src/components/look-controls.js
- Apple Home Screen web apps: https://support.apple.com/guide/iphone/iphea86e5236/ios

## Hands-free headset input

The interaction method is head-gaze dwell: turn your head to aim the center reticle, hold it still on a control for 1.8 seconds, then look away before selecting that control again. The purple progress ring shows selection progress. Launch, gravity, cabin steps, floating height, recenter, sound and exit all support this method. Phone screen taps are blocked as in-world selections during headset mode.

Safari still requires a user gesture to request motion permission and prepare audio. Tap Start and approve the system prompt before putting on the viewer. This setup requirement cannot be replaced with a webpage gaze event. The mode uses orientation sensing rather than eye tracking.

Canonical demo: https://chbri89067-dot.github.io/vr-design-sprint-3/?cardboard=1
Download: https://chbri89067-dot.github.io/vr-design-sprint-3/VR-Design-Sprint-3-Integrated.zip

## Partner Mars landing and arrival

After Scene 2 finishes, look at CONTINUE TO MARS on the left console. Then gaze at LAND on the original purple cylinder. After touchdown and settling, select EXPLORE on the Mars path. After selecting EXPLORE, look down toward the colony (the direction you first face on arrival). Hold WALK TO PATH, WALK TO ALPHA, WALK TO BETA or WALK TO GAMMA for 1.8 seconds. The character walks automatically along the central route, then stops outside the selected habitat. Hold STOP WALKING to pause anywhere, or RETURN TO START to walk back to the path beside the landing pad. You can turn your head freely during travel; looking away does not cancel the selected walk. Look up at the glowing habitat markers to inspect them. Look behind you for small manual steps, instant RETURN TO START, SOUND and EXIT. Outdoor navigation leaves the ship on its landing pad.

Fast previews:
- Landing: https://chbri89067-dot.github.io/vr-design-sprint-3/?scene=5&cardboard=1
- Arrival: https://chbri89067-dot.github.io/vr-design-sprint-3/?scene=6&cardboard=1

The partner landing MP3 is unchanged. It uses its original non-looping positional playback and volume setting. The per-sound credits page identifies the supplied file separately.


## Gaze walking on Mars

The six purple/cyan walking controls appear only after EXPLORE. They follow your position, keeping the colony's original forward direction; they do not follow head rotation. Turn back toward that direction and lower your gaze to find them. The destination activates once per gaze, travels at up to 1.6 metres per second, and stops automatically at the path or a habitat entrance. Movement does not turn your view or move the ship. Stay physically seated while the virtual character walks.

STOP WALKING works by the same 1.8-second gaze selection. Losing phone motion readings for two seconds, hiding the page, leaving landscape mode or exiting the viewer stops the walk. When tracking returns, choose a destination again to resume. Manual movement cancels an automated route. Touch selection and two-finger walking are blocked during phone viewer mode; touch controls remain available outside it.

The walking route uses a clear central corridor and approach points outside the original habitat models. This is route navigation, not a general collision/physics simulation. The partner's models and audio are unchanged. Browser checks cover all destinations, gaze stop/return, movement of only the player, ground height, tap blocking and interruption handling. They do not establish real iPhone/Cardboard performance.
