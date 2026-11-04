# Console control revision — November 2, 2026

Requested changes: make the purple launch button work when clicked; remove the black buttons with light outlines; retain alignment, ship colors, movement and sound design.

The in-world launch cylinder keeps its original position, size, purple color and materials. The original inline launch script is unchanged. The reticle now uses A-Frame's mouse ray outside VR so an actual click/tap on the visible cylinder activates it. In VR or optional gaze mode, it returns to a head ray. Only one cursor handles selection, and drag gestures are filtered to avoid launching while looking around.

The HTML toolbar and direction pad are removed. Their remaining actions are available with G (gravity), M (Scene 2 audio), H (recenter) and V (gaze dwell). WASD/arrows, controller locomotion and Q/E floating adjustment remain. Two-finger touch dragging moves through the cabin, while one-finger dragging looks around. The standard A-Frame headset/fullscreen entry remains because it provides VR entry. Audio sources remain available through an unboxed text link and credits.html.

No ship transforms, dimensions, colors, lighting settings, launch timing, audio files, gain envelopes, playback volumes or Scene 2 exterior animation were changed by this revision. The five preservation checks still protect those source boundaries.

This was checked against the repository's current main head, cb2afbd76a7a62448dfaed5676de696201462646, which still matches the reviewed Jesse baseline. The complete Scene 2 extension and this revision are prepared for the brian/scene-2-gravity branch.

The raw browser results are in button-checks.json. Physical VR hardware remains untested.
