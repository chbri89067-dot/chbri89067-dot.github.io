# Two maintained versions

The mobile and computer versions are separate product entry points sharing one scene source. This is an explicit project requirement.

## Mobile

Entry: mobile/index.html. Always offers the phone viewer setup. Uses the existing stereo adapter, motion permission/audio setup and head-gaze controls. The mobile-only secret is a faint stress mark near the upper-right window edge in Scene 3. One completed gaze triggers all four cracks automatically; normal dwell remains one action until gaze leaves. No obvious break button or reveal text is added to the product.

Scene 3 pauses while phone setup/tracking is unavailable. Its approach boundary waits when the secret is being examined or stressed, preventing a late gaze from being cut off. The source controller still owns the actual cracks, shards, float-out and subsequent journey. No new sound or alternative ship is introduced.

## Computer

Entry: desktop/index.html. Mouse drag/click and WASD work without phone setup. Original four-click window activation remains. The computer HTML does not attach the phone viewer, mobile secret or phone navigation components. The final scene still clears overlays while enabling the existing desktop movement.

## Shared source and build

experience.html contains the common A-Frame scene. js/, assets/, css/, vendor/ and reference/ are shared. mobile/window-secret.js is the isolated mobile adapter. scripts/build-versions.mjs generates the two HTML entry files with correct base URLs and platform attributes. Run npm run build before packaging/publishing changes to the shared HTML. Do not edit generated pages independently.

index.html is the version chooser. Legacy ?cardboard=1 URLs route to mobile. Scene-only links route according to an explicit platform parameter, phone user agent or desktop default. These routes preserve scene/dwell settings. A direct visit to the shared template redirects to the chooser.

The complete project ZIP includes both versions. Public hosting copies the whole VR subdirectory, preserving other portfolio content. The older ZIP filenames remain aliases of the complete bundle.
