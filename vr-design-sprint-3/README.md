# Earth to Mars — mobile and computer versions

This project maintains **two versions** of the same six-scene A-Frame experience. They share Jesse's ship, scene geometry, palette and original audio, but have separate entry points and input behavior.

| Version | Entry | Controls |
| --- | --- | --- |
| Mobile VR | mobile/index.html | Phone/Cardboard stereo, head turning and gaze dwell after the initial Safari setup gesture. |
| Computer | desktop/index.html | Mouse click/drag and WASD. G controls gravity, M audio and H recenters. |

Live chooser: https://chbri89067-dot.github.io/vr-design-sprint-3/?v=platforms-20261104

Mobile: https://chbri89067-dot.github.io/vr-design-sprint-3/mobile/?v=platforms-20261104

Computer: https://chbri89067-dot.github.io/vr-design-sprint-3/desktop/?v=platforms-20261104

## Run and maintain

Use Node.js 18+, then run npm start or double-click Start-VR.cmd. No dependency installation is needed. Open http://localhost:8080/ to choose a version. The local server supports both subdirectories. Use the public HTTPS link for real phone motion permissions.

Edit the shared scene in experience.html and common js/, css/ and assets/. Run **npm run build** after editing the shared HTML. It generates mobile/index.html and desktop/index.html. The two generated pages are committed so static hosting needs no server-side build. The base URL in each page points shared assets to the project root.

Mobile-only behavior lives in mobile/window-secret.js. The computer page does not attach phone adapters, the phone setup panel or the mobile Easter egg. js/experience-mode.js makes the explicit profile available to the runtime. The root index.html is a version chooser. Older links containing cardboard or scene parameters are routed to the appropriate version, preserving their query settings.

## Mobile glass Easter egg

The old glass expected four separate selections, but the gaze cursor intentionally selects once until the user looks away. A continuous gaze therefore stopped at 1/4. Other controls retain that single-selection behavior.

During Scene 3, a small hairline stress mark appears near the **upper-right edge of the forward window**. It has no button face or label. Aim the reticle at it and complete the usual gaze hold, default 1 second and configurable from 0.5 to 2 seconds. That one selection starts four stress pulses 0.25 seconds apart, then the original shards and zero-gravity float-out play. Keep looking at it; no repeated nodding, tapping or look-away cycle is needed. Leaving before the hold completes cancels normally.

The generous transparent hit area is attached to the glass mark. The old whole-window four-selection target is disabled only in mobile. During phone setup or paused tracking, Scene 3 waits. If the user discovers the mark near the end of the cruise, approach waits for that gaze/sequence to finish. Scene 4 and the original landing follow normally afterward.

The computer version preserves Jesse's original four clicks on the forward window. The new mobile target is never created in that version.

## Preserved experience

All six scenes still run in one A-Frame 1.8.0 scene and renderer per version. Jesse's 6 × 6 cabin, models/colors, launch synthesis, solar system, cracks, eight shards, 2.4-second escape and Mars approach are retained. The partner's original source package and MP3 remain unchanged. No audio was added or edited.

The strengthened dwell ring and four-times-size hint remain in mobile. Its fill duration, clockwise direction and normal once-per-hover behavior are unchanged. The final Mars scene remains free of walking/menu overlays. Phone/Cardboard senses head rotation, not physical forward/backward position; the final phone view is stationary. Computer WASD remains available.

## Validation

Run npm test: 18 checks cover source/asset/geometry preservation, both generated platforms and one-selection completion/cancellation of the mobile stress sequence. docs/platform-versions-checks.json records the browser checks: both entry points, computer input, original computer window behavior, legacy phone routing, waiting for setup, gaze cancellation, all four mobile cracks from one hover, original escape, landing/final handoff, and late discovery with a 2-second dwell. No JavaScript or HTTP errors occurred in that run. Orientation input was synthetic; physical iPhone SE/iOS 26.5/Cardboard validation still needs the actual device.

See docs/VERSIONS.md and docs/PHONE-TEST.md. credits.html lists every runtime sound's source/license and usage. Older evidence files describe earlier versions.
