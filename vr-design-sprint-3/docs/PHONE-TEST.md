# Mobile VR test

This is the **mobile** version. The separate computer version uses mouse and keyboard.

Mobile: https://chbri89067-dot.github.io/vr-design-sprint-3/mobile/?v=platforms-20261104

Computer: https://chbri89067-dot.github.io/vr-design-sprint-3/desktop/?v=platforms-20261104

## Start

Open the mobile link in Safari, turn the phone sideways and set media volume. Choose Selection hold, default 1 second and adjustable from 0.5 to 2 seconds. Tap Allow motion & start viewer and approve motion before inserting the phone into the headset. Move it slightly until sensor readings arrive. Gaze selection starts after the settling delay.

Turn your head to aim the reticle. The opaque clockwise ring fills and selects once. Looking away early cancels/reset; ordinary controls require leaving and re-entering before another selection. Screen taps are blocked while the phone viewer is active. The initial Safari setup tap is still required.

## Test the mobile glass Easter egg

Fast preview: https://chbri89067-dot.github.io/vr-design-sprint-3/mobile/?scene=3&v=platforms-20261104

Scene 3 waits while the setup panel is open, so permission time does not use up the cruise. Look near the upper-right edge of the forward glass for a small pale hairline mark. Hold the center reticle on that mark until selection completes. One completed hold starts four crack stages automatically and the window breaks, followed by the original 2.4-second float-out. Do not look away and back four times. There is no break button in the scene.

Try looking away before the ring fills: the glass should remain intact. Try a 2-second selection hold. The sequence should still complete if discovered near the end of cruise. After the escape, the journey should continue through Mars approach and landing in the same viewer session.

The computer version retains four ordinary mouse clicks on the window. It does not contain the mobile stress-mark target.

## Other scenes

Launch, Scene 2 gravity, approach and landing retain their controls and original audio. Menu / Hide Menu remain in earlier mobile scenes. The final Mars scene removes walking/navigation overlays and opens automatically. Phone/Cardboard tracks orientation, not physical movement forward or backward. Computer users retain WASD movement.

## Evidence and limits

Browser results are in platform-versions-checks.json. Motion events were simulated; actual iPhone SE/iOS 26.5/headset optics, latency and performance remain unverified. The generic stereo profile has no viewer-specific lens calibration. After exiting in an earlier scene, the setup panel can download a local test report; tick only what was observed on the physical phone.
