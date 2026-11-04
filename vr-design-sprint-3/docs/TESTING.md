# Integrated verification

## Source and asset checks

Eight npm tests protect the original cabin and launch synthesis, unloaded legacy launch.js, single A-Frame extension, four existing CC0 source hashes, all seven supplied partner files, the unchanged partner MP3, and original habitat/landing-terrain/exhaust shapes and dimensions. The cabin check allows only mission IDs and the already documented font/mug/gravity additions. The launch check allows only the existing prepared phone AudioContext expression.

## Browser checks

See integrated-mars-checks.json for the current run. It uses the real A-Frame renderer in Edge, synthetic orientation on an emulated iPhone SE, and real gaze timers/touch events. It covers Scene 2 gravity and actual completion, gaze Continue, landing tap rejection, the partner audio settings/playback, real descent and touchdown timing, pad/floor alignment, preserved stereo session, automatic arrival, Explore, all three habitats, outdoor gaze navigation/recenter, served audio hash and per-sound credits. A fresh desktop context checks the original launch, direct Mars entry, pointer landing/Explore and WASD.

Earlier browser-checks.json, button-checks.json and cardboard-phone-checks.json are retained as prior-stage evidence. Their scope and dates are recorded in those files.

## Physical hardware still to test

No physical iPhone SE, iOS 26.5 browser or Cardboard viewer was available to the automated runner. Confirm actual motion input, lens alignment, sound level, thermal behavior, sustained performance and gaze comfort on the target device. The viewer profile is generic stereo without QR calibration or lens correction. Browser success does not certify physical-headset behavior.


## Outdoor gaze walking revision

Run npm test for the original eight preservation checks. The supplemental browser run is recorded in mars-gaze-walk-checks.json: synthetic iPhone-size sensor input, gaze-only Explore/destinations/stop/return/exit, real continuous player movement to all three habitat approaches, no movement from a screen tap, one setup permission, fixed ship, unchanged ground height and interruption stops. Physical iPhone SE/iOS 26.5/Cardboard testing remains unperformed.
