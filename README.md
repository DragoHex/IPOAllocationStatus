# IPO Allocation Tracker

React Native (Expo) app track IPO allotment status across multiple Indian registries (NSE, BSE, KFintech, Link Intime, Purva Sharegistry, Alankit, Skyline).

## Structure
- `IPO-Status/`: Expo app source code
- `doc/`: Registry research and API notes
- `scripts/`: Python/JS investigation scripts for scraping APIs
- `skills/`: Custom AI agent skills (e.g., adding new registrars)

## Prerequisites

Before running the native build commands (`make build-android` or `make build-ios`), ensure you have the following installed:

### Android
- **Android SDK / Tools**: Install via Homebrew
  ```bash
  brew install --cask android-commandlinetools android-platform-tools temurin
  ```
- **SDK Setup**:
  ```bash
  export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
  yes | sdkmanager --licenses
  sdkmanager "platforms;android-34" "build-tools;34.0.0"
  ```
- **Emulator**: You must either connect a physical device via USB (with USB Debugging enabled) or create/start an emulator.
  ```bash
  export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
  # To create and run an emulator using command line:
  sdkmanager "system-images;android-34;google_apis;arm64-v8a" "emulator"
  avdmanager create avd -n Pixel_API_34 -k "system-images;android-34;google_apis;arm64-v8a"
  $ANDROID_HOME/emulator/emulator -avd Pixel_API_34 &
  ```

### iOS
- **Xcode**: Download and install from the Mac App Store.
- **CocoaPods**: Required for iOS dependencies.

## Commands (Makefile)

Use `make` from root to run or build.

- `make setup`: Install dependencies.
- `make start`: Start Expo dev server.
- `make android`: Start Android dev server.
- `make ios`: Start iOS dev server.
- `make web`: Auto-install web deps & run as webapp.
- `make build-android`: Build & install native Android app on a running emulator/device.
- `make apk-android`: Build a standalone release APK at `IPO-Status/android/app/build/outputs/apk/release/app-release.apk`.
- `make build-ios`: Build native iOS app (requires Xcode).
- `make clean`: Remove build artifacts (android/ios/.expo folders).

Note: `ANDROID_HOME` must point to `/opt/homebrew/share/android-commandlinetools` (as set by the Makefile), not `~/Library/Android/sdk` — that path doesn't exist on this machine.

## Test on Device

1. `make start`
2. Install **Expo Go** app on Android/iOS.
3. Scan QR code from terminal.
4. Use `--tunnel` flag if device/Mac on different or isolated networks.

## Features

- **Accounts**: Store PAN cards locally (SQLite).
- **Fetch**: Auto-fetch active IPOs from BSE, NSE, and Registrars. Map identical IPOs. Select up to 5 IPOs simultaneously.
- **Status**: Concurrent fetching from highest-priority source.
  - `✔-lots` = Allotted (shows lot count)
  - `✗` = Not Allotted
  - `N/A` = Not Applied / Record Not Found
  - `⚠️` = API Error / Blocked

## Add New Registrar

Registrars change APIs frequently to block bots.

1. Inspect network tab on registrar site during PAN search.
2. If API uses JSON/Forms with no server-side captcha:
   - Update `IpoItem` interface in `IPO-Status/src/api/index.ts` with new source enum.
   - Add fetch logic in `fetchAllIpos()` to pull active IPO list and merge with existing map.
   - Create `check[Registrar]Status()` mapper function.
   - Prepend new registrar check inside `fetchStatusForPan()`.
3. Read `skills/ipo-integration/SKILL.md` for exact steps.
