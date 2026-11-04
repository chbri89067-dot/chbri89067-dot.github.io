> Current revision: ring fill is 100% opaque, track is 70%, and strokes are 1.5 times wider on a black backing. Final-scene navigation/overlay DOM nodes are removed. Earlier scene behavior is retained. See TESTING.md and ring-clear-mars-checks.json for current evidence.

# Jesse Scenes 3–4 and mobile interface integration

Base: GitHub main ac8055ea9032ce1c8aae84c5c09b173a1787dcf0. All 63 source blobs were compared with a local snapshot before editing. Jesse's latest two commits supply Scenes 3–4 and polish the window Easter egg. They add no audio files or synthesis. Existing sound bytes and playback parameters are retained.

The normal sequence now runs launch, Scene 2, the 14-second solar cruise, 16-second approach, landing preparation, gaze LAND, descent and arrival. The four-hit window input uses the shared reticle and requires leave/re-enter for each hit. The eight shards, crack branches, 2.4-second escape animation and subsequent cruise are unchanged. scene34.js differs only by initial window deactivation and synchronizing the gravity label when entering zero gravity. Source-normalization preservation tests protect everything else in that file, and exact hashes protect the solar-system/approach world markup and window geometry.

A single gaze-dwell component now defaults to 1000 ms, clamps 500–2000 ms, and reads the existing A-Frame raycaster. A full thin outline appears on hover and a mirrored arc starting at 90 degrees grows clockwise. Leave cancels/reset; completion hides feedback before dispatching one click. A held target stays latched until gaze leaves. Hidden ancestors, inactive controls, scene fades and stale/paused phone tracking are excluded. No additional cursor or renderer is introduced.

The shared camera-relative HOLD TO SELECT text width changes from 0.5 to 2.0. Four small shared-geometry offsets thicken the bundled Roboto. Browser measurement verifies both rendered width and height exceed four times the previous size. Text/ring feedback ends on completion or cancellation. The setup control and optional dwell query value configure the same duration across every scene and menu.

vr-menu owns the collapsed Menu/Hide Menu toggle. It exposes the existing cabin controls or Mars walking controls and removes hidden targets from raycasting. A closed-menu Stop Walking control remains available during travel. Position follows the player, while orientation stays in the world so off-center targets remain reachable by head turning. Menu changes do not navigate or create another stereo session.

Validation: npm test includes 13 tests. Supplemental browser evidence is mobile-six-scenes-checks.json and mobile-interface-walk-checks.json. Synthetic sensor input is identified in those records. Physical phone/headset verification remains pending. Older evidence files are retained as historical results and may refer to the prior 1.8-second interface or the former Scene 2-to-5 bridge.

Primary API reference: https://github.com/aframevr/aframe/blob/v1.8.0/docs/components/cursor.md
