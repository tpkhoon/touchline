# The Android app

An APK you install once; after that the game updates itself from the live site.

## How it works

- `.github/workflows/android.yml` builds the app on GitHub (no Android Studio needed) and keeps the file at one address:
  **https://github.com/tpkhoon/touchline/releases/tag/android-latest** (`touchline.apk`).
- The app is a shell (Capacitor) around the live game at `https://tpkhoon.github.io/touchline/`. It opens the game from there,
  and the game's service worker keeps a copy for offline play. So **every push to `main` (the Pages deploy) is a new version of the
  game on the phone** the next time it is opened with a connection. Nothing to rebuild or reinstall.
- The first launch needs a connection (it fetches the game and the phone's world, about 13 MB); after that it plays offline. A phone gets a lighter world than a computer: the same clubs and players, without the players' season-by-season past (a career table rebuilds it) and with squads of sixteen until you play a league in full.
- Saves live in the app's own storage on the phone. Export a save from Settings now and then.

## Installing

1. On the phone, open the release address above and download `touchline.apk`.
2. Open it. Android asks to allow installs from that browser or file manager ("install unknown apps"): allow it once.
3. Install, open Touchline.

## When to rebuild the APK

Only when something native changes: the icon or splash, the permissions, a Capacitor plugin, the Android files. The workflow
runs by itself on a push that touches `android/`, `capacitor.config.json` or the workflow, and by hand from
**Actions → Android app → Run workflow**. Install the new APK over the old one; saves stay if it is signed with the same key.

## The signing key

An update installs over the old app only if both are signed with the same key. The workflow uses the key in the repository secret
`ANDROID_KEYSTORE_BASE64` (a debug-style keystore: alias `androiddebugkey`, password `android`). A copy of the keystore is
kept off the repository at `.devtools/android/debug.keystore` on the machine that made it: **keep a backup of it**. Without the
secret the runner makes a new key each build, and then an update needs an uninstall first (which removes the saves: export first).

To set the secret again from a keystore file:

```bash
base64 -w0 .devtools/android/debug.keystore | gh secret set ANDROID_KEYSTORE_BASE64
```

## Not for the Play Store

This is a debug-signed APK for installing by hand. A Play Store build needs a release key, an upload to the Play Console, and the
app bundled rather than loaded from the site; that is the device-builds step in the roadmap.
