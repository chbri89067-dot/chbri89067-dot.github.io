# GitHub Pages — mobile and computer versions

The VR subdirectory in chbri89067-dot/chbri89067-dot.github.io now has an explicit chooser at index.html, plus mobile/index.html and desktop/index.html. Both use shared assets and the common experience.html source. Only mobile loads mobile/window-secret.js and phone viewer controls. Computer uses mouse and keyboard.

Legacy phone links containing cardboard=1 route to the mobile entry and retain their query settings. Existing scene aliases also route through the chooser. Runtime script cache version: platforms-20261104. Run npm run build before publishing generated pages. Keep experience.html, mobile/, desktop/, js/, css/, assets/, vendor/, reference/, docs/, credits.html and the manifest together.

The canonical bundle is VR-Design-Sprint-3-Complete.zip and contains both versions. The older Mobile-Complete, Integrated and No-Account ZIP names remain aliases of the same current bytes. Other portfolio files are preserved. Wait for Pages deployment and verify both public entries and the download before handing them off.
