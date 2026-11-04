# Current ring and final-view verification

Run npm test. All 14 tests include the original geometry/audio/scene preservation checks and an exact comparison of the dwell controller after removing only the new visual backing references. Its timing, progress direction, hover, cancellation, selection and confirmation logic remain byte-identical.

ring-clear-mars-checks.json records rendered material opacity, 1.5-times stroke width, black-backed contrast above 3:1, unchanged one-second clockwise behavior, leave/reset and one selection per hover, earlier-scene menu controls, landing handoff, actual removal of final-scene navigation/overlay DOM nodes across phone/desktop viewport sizes, retained world-marker confirmation and no JavaScript/HTTP errors.

Phone sensor input is simulated. Physical iPhone/Cardboard testing is not performed. Phone orientation input changes rotation, not real-world forward/back position. Earlier six-scene and walking-interface reports are historical records of the previous UI.
