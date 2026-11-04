# GitHub-hosted phone demo

Live path: https://chbri89067-dot.github.io/vr-design-sprint-3/?cardboard=1

The editable group source stays on the brian/scene-2-gravity branch in the private VR-Design-Sprint-3 repository. The public static demo is an isolated vr-design-sprint-3 directory in the existing chbri89067-dot.github.io Pages repository. That avoids changing the group repository's visibility or the portfolio's other pages. Its build.mjs includes that directory for future static builds.

All URLs in the runtime are relative, so the project works from this subdirectory. The package has no dependency on the earlier hosting domain or a sign-in service. Keep js/, css/, vendor/, assets/, manifest.webmanifest and credits.html beside index.html when updating it.

Headset selection uses the existing A-Frame raycaster and head-gaze dwell, with a progress ring. Screen taps cannot activate in-world controls while the phone viewer is active. Setup still needs a physical tap for Safari motion permission and audio. After setup, gaze operates launch, gravity, movement, height, seat, sound and exit. Browser tests use simulated sensors; actual iPhone/headset validation remains pending.
