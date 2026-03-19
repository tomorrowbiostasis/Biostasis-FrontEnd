# Step-by-Step Guide: Building Biostasis in Android Studio

This guide explains how to build and run the Biostasis React Native app in Android Studio. The Android project has been updated to match **React Native 0.76** (React Native Gradle Plugin, Hermes via dependency, no `react.gradle`).

---

## Prerequisites (before opening Android Studio)

1. **Node.js** (>= 18 per `package.json` engines) and **Yarn**
   - Install Yarn: `npm install --global yarn`

2. **JDK 17** (recommended for RN 0.76)
   - Android Studio often ships with a bundled JBR; ensure `JAVA_HOME` points to JDK 17+.
   - If Gradle fails to find the right JDK, uncomment and set `org.gradle.java.home` in `android/gradle.properties`.

3. **Android Studio** with:
   - Android SDK (compileSdk 35, targetSdk 34)
   - NDK (version 26.1.10909125 or compatible)
   - Android SDK Build-Tools 35.0.0

4. **Environment and secrets**
   - **`.env` files** in project root (e.g. `.env.development`, `.env.production`) as required by react-native-config and [Biostasis-Cloud-infrastructure](https://github.com/tomorrowbiostasis/Biostasis-Cloud-infrastructure) (see main [README](../README.md)).
   - **`android/app/google-services.json`** from your Firebase project (package name `com.tomorrowbiostasis.app`).
   - **`android/keystore.properties`** is optional for debug: the build script loads it only when the file exists. For release or custom debug signing, add this file (see main README; keep it out of version control).

5. **Install dependencies and patches**
   - From project root: `yarn` (runs `postinstall` and **patch-package** for `react-native-sound`).

---

## Build in Android Studio

1. Open **Android Studio**.
2. **File → Open** and select the **`android`** folder of the project (e.g. `Biostasis-ReactNative/android`), not the repo root.
3. Wait for **Gradle sync** to finish (may take several minutes the first time).
4. If prompted, accept **Android SDK / NDK** or **Gradle** updates.
5. Ensure **`local.properties`** exists with `sdk.dir` pointing to your Android SDK (Android Studio usually creates this).
6. In the **Build Variants** tool window, choose the variant to run (e.g. **developmentDebug** or **productionDebug**).
7. Start **Metro**: in a terminal at project root run `yarn start`.
8. In Android Studio: **Run → Run 'app'** (or the green play button) to build and install on an emulator or device.
9. For a **physical device**, set up port forwarding for Metro (e.g. `adb reverse tcp:8081 tcp:8081`) as in the [README](../README.md).

---

## Build from terminal (without Android Studio)

1. Fulfill prerequisites above and run `yarn` at project root.
2. Ensure `android/local.properties` contains `sdk.dir` (create it if needed).
3. In one terminal: `yarn start`.
4. In another terminal: `yarn android:dev` (or `yarn android`, or the variant you need).

---

## Known library and environment issues

- **react-native-sound**: Patched via `patches/react-native-sound+0.11.2.patch`; run `yarn` after clone or dependency changes.
- **Flipper**: Removed from the app `build.gradle` for RN 0.76; use **React Native DevTools** for debugging.
- **Kotlin version**: The project uses Kotlin 1.9.24 to match RN 0.76. If you see Kotlin compiler or stdlib errors, ensure `kotlinVersion` in `android/build.gradle` and any BOMs match.
- **com.facebook.react:react-native not found**: The root project applies `com.facebook.react.rootproject`; ensure Gradle sync completes and repositories are resolved.
- **keystore.properties**: Optional; the script only loads it when the file exists. For release builds, add `android/keystore.properties` with your signing data (see main README).

---

## Summary

- **Prerequisites**: Node, Yarn, JDK 17+, Android Studio + SDK/NDK, `.env` files, `google-services.json`, and `yarn` (patches applied).
- **Android project**: Aligned with RN 0.76 (React Native Gradle Plugin, `hermesEnabled`, no `react.gradle`, Flipper removed, keystore loading only when file exists).
- **Then**: Open the `android` folder in Android Studio, sync, select build variant, start Metro, and Run 'app'.
