.PHONY: setup start android ios web build-android build-ios setup-web clean apk-android

# App directory
APP_DIR = IPO-Status

# Remove build artifacts and Expo cache
clean:
	cd $(APP_DIR) && rm -rf android ios .expo web-build

# Install pnpm dependencies
setup:
	cd $(APP_DIR) && pnpm install

# Start Expo dev server (clear cache)
start:
	cd $(APP_DIR) && npx expo start -c

# Run on Android emulator/device
android:
	cd $(APP_DIR) && unset NPM_CONFIG_REGISTRY && pnpm run android

# Run on iOS simulator/device
ios:
	cd $(APP_DIR) && unset NPM_CONFIG_REGISTRY && pnpm run ios

# Run on web browser
web: setup-web
	cd $(APP_DIR) && unset NPM_CONFIG_REGISTRY && pnpm run web

# Install web dependencies
setup-web:
	cd $(APP_DIR) && npx expo install react-native-web react-dom @expo/metro-runtime

# Build native Android app
build-android:
	cd $(APP_DIR) && unset NPM_CONFIG_REGISTRY && export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools && export PATH=$$PATH:$$ANDROID_HOME/cmdline-tools/latest/bin && EXPO_USE_APP_CLIENT=true npx expo run:android

# Build standalone Android APK
apk-android:
	cd $(APP_DIR) && unset NPM_CONFIG_REGISTRY && export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools && export PATH=$$PATH:$$ANDROID_HOME/cmdline-tools/latest/bin && npx expo prebuild -p android --clean && cd android && ./gradlew assembleRelease
	cp $(APP_DIR)/android/app/build/outputs/apk/release/app-release.apk ipo-allocation-status.apk

# Build native iOS app
build-ios:
	cd $(APP_DIR) && unset NPM_CONFIG_REGISTRY && EXPO_USE_APP_CLIENT=true npx expo run:ios
