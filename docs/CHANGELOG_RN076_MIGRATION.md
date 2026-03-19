# Changelog: React Native 0.76.7 Migration

This document describes every change made to the Android project (and related JS/config files) to migrate from the legacy React Native 0.67-era setup to **React Native 0.76.7**. Each section explains *what* changed and *why*.

---

## 1. Gradle Build System Upgrade

### What changed

| Component | Before | After |
|-----------|--------|-------|
| Android Gradle Plugin (AGP) | 4.2.1 | 8.6.0 |
| Gradle wrapper | 7.5 | 8.10.2 |
| `compileSdkVersion` | 33 | 35 |
| `targetSdkVersion` | 33 | 34 |
| `minSdkVersion` | 21 | 24 |
| `buildToolsVersion` | 31.0.0 | 35.0.0 |
| NDK version | 20.1.5948944 | 26.1.10909125 |
| Kotlin | 1.6.21 | 1.9.24 |

### Why

React Native 0.76 requires AGP 8.x and Gradle 8.x. The SDK, NDK, and Kotlin versions were bumped to match the versions RN 0.76 is tested against. `minSdkVersion` was raised to 24 because RN 0.76 no longer supports API 21-23.

### Files

- [`android/build.gradle`](../android/build.gradle) -- version constants in `buildscript.ext`
- [`android/gradle/wrapper/gradle-wrapper.properties`](../android/gradle/wrapper/gradle-wrapper.properties) -- distribution URL
- [`android/gradle.properties`](../android/gradle.properties) -- removed `FLIPPER_VERSION`, added `hermesEnabled` / `newArchEnabled`

---

## 2. React Native Gradle Plugin (replacing legacy scripts)

### What changed

**Removed:**
- `apply from: "../../node_modules/react-native/react.gradle"` -- the legacy bundling script
- `apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)` -- old autolinking
- The corresponding `applyNativeModulesSettingsGradle(settings)` call in `settings.gradle`
- Manual `REACT_NATIVE_VERSION` resolution via `node --print` and `configurations.all { force "com.facebook.react:react-native:..." }`

**Added:**
- `pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }` in `settings.gradle`
- `id "com.facebook.react.settings"` plugin and `ReactSettingsExtension.autolinkLibrariesFromCommand()` in `settings.gradle`
- `id "com.facebook.react.rootproject"` plugin in root `build.gradle`
- `id 'com.facebook.react'` plugin in `app/build.gradle` with a `react {}` block containing `autolinkLibrariesWithApp()` and `debuggableVariants`

### Why

RN 0.76 ships its own Gradle plugin that handles JS bundling, Hermes compilation, autolinking, and native library resolution. The old `react.gradle` and `native_modules.gradle` scripts are no longer published.

### Files

- [`android/settings.gradle`](../android/settings.gradle)
- [`android/build.gradle`](../android/build.gradle)
- [`android/app/build.gradle`](../android/app/build.gradle)

---

## 3. `android/app/build.gradle` Overhaul

### What changed

- **`namespace "app.biostasis"`** added to the `android {}` block. This replaces the `package` attribute that was previously in `AndroidManifest.xml`.
- **`buildFeatures { buildConfig true }`** added so the generated `BuildConfig` class is available (AGP 8 disables it by default).
- **`compileSdk`** syntax updated from `compileSdkVersion` (deprecated in AGP 8).
- **`react {}` block** replaces the old `project.ext.react` map and `apply from: react.gradle`.
- **Keystore loading made conditional** -- `keystoreProperties.load(...)` is now wrapped in `if (keystorePropertiesFile.exists())` so the build doesn't crash when `keystore.properties` is absent (common for fresh clones).
- **`resValue "build_config_package"`** changed from `"com.biostasis"` to `"app.biostasis"` to match the new namespace.
- **`packagingOptions`** added with `pickFirst` for `libjsi.so` and `libreactnative.so` to resolve duplicate native library conflicts between local source builds and prebuilt AARs.
- **`resolutionStrategy`** updated: removed the old `force "com.facebook.react:react-native:..."`, added `force 'androidx.core:core:1.15.0'` and `force 'androidx.core:core-ktx:1.15.0'` to prevent `androidx.core` 1.17+ from pulling in AGP 8.9+ / compileSdk 36 requirements.
- **`lintOptions`** renamed to **`lint`** (AGP 8 DSL change).
- **Vector icons Gradle** removed -- `apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"` and the `project.ext.vectoricons` block were removed because they caused duplicate `.ttf` resource errors with RN 0.76's autolinking.

### Why

Each change was needed either because the old API was removed/deprecated in AGP 8, because RN 0.76 changed how native libraries are built and linked, or to resolve specific build errors encountered during the migration.

### Files

- [`android/app/build.gradle`](../android/app/build.gradle)

---

## 4. Dependencies (Gradle)

### What changed

**Removed:**
- `implementation "com.facebook.react:react-native:+"` -- the generic npm-sourced RN dependency
- All Flipper dependencies (`flipper`, `flipper-network-plugin`, `flipper-fresco-plugin`)
- Local Hermes AAR references (`hermesPath + "hermes-debug.aar"` / `"hermes-release.aar"`)
- `implementation platform('org.jetbrains.kotlin:kotlin-bom:1.8.0')`

**Added:**
- `implementation("com.facebook.react:react-android")` -- the new Maven Central artifact for RN 0.76
- `implementation("com.facebook.react:hermes-android")` -- Hermes via Maven Central (conditional on `hermesEnabled`)
- `implementation platform('org.jetbrains.kotlin:kotlin-bom:1.9.24')`

### Why

RN 0.76 publishes prebuilt AARs to Maven Central under new artifact names (`react-android`, `hermes-android`). The old `react-native:+` artifact and local Hermes AARs from `node_modules` are no longer used. Flipper was deprecated in RN 0.73 and fully removed from the template in 0.74+.

### Files

- [`android/app/build.gradle`](../android/app/build.gradle) -- `dependencies {}` block

---

## 5. Repository Cleanup (`android/build.gradle`)

### What changed

**Removed from `allprojects.repositories`:**
- `maven { url("$rootDir/../node_modules/react-native/android") }` -- local maven for react-native
- `maven { url("$rootDir/../node_modules/jsc-android/dist") }` -- local maven for JSC
- `mavenCentral { content { excludeGroup "com.facebook.react" } }` -- the exclude filter that prevented fetching RN from Maven Central

**Removed from `allprojects.configurations.all`:**
- `force "com.facebook.react:react-native:" + REACT_NATIVE_VERSION` -- no longer needed

**Added:**
- `maven { url("$rootDir/../node_modules/@notifee/react-native/android/libs") }` -- required for the `@notifee` library

### Why

RN 0.76 artifacts are on Maven Central. The old local maven repos pointed to `node_modules` paths that no longer contain publishable AARs. The forced resolution was a workaround for version conflicts that don't apply with the new Gradle plugin.

### Files

- [`android/build.gradle`](../android/build.gradle) -- `allprojects.repositories`

---

## 6. Package Namespace Migration (`com.biostasis` to `app.biostasis`)

### What changed

- Java source files moved from `android/app/src/main/java/com/biostasis/` to `android/app/src/main/java/app/biostasis/`.
- `package` declarations updated from `package com.biostasis;` to `package app.biostasis;` in both `MainApplication.java` and `MainActivity.java`.
- `package="com.biostasis"` attribute removed from `AndroidManifest.xml`.
- `namespace "app.biostasis"` set in `android/app/build.gradle`.

### Why

AGP 8 requires the namespace to be set in `build.gradle` rather than in the manifest. The Gradle `namespace` was already `app.biostasis` (matching the `applicationId`), but the Java source files were still under `com.biostasis`. This mismatch caused a `ClassNotFoundException` at runtime because the compiled manifest referenced `app.biostasis.MainApplication` but the class was compiled under `com.biostasis`.

### Files

- [`android/app/src/main/java/app/biostasis/MainApplication.java`](../android/app/src/main/java/app/biostasis/MainApplication.java)
- [`android/app/src/main/java/app/biostasis/MainActivity.java`](../android/app/src/main/java/app/biostasis/MainActivity.java)
- [`android/app/src/main/AndroidManifest.xml`](../android/app/src/main/AndroidManifest.xml)
- [`android/app/build.gradle`](../android/app/build.gradle)

---

## 7. `MainApplication.java` Rewrite

### What changed

The entire `MainApplication.java` was rewritten:

**Removed:**
- `ReactNativeHost` usage (replaced with `DefaultReactNativeHost`)
- `JSIModulePackage` override returning `ReanimatedJSIModulePackage` (Reanimated v3+ uses Turbo Modules, not JSI Module Packages)
- Flipper initialization code (`ReactNativeFlipper.initializeFlipper(...)`)
- `SoLoader.init(this, false)` -- the old boolean-based init

**Added:**
- `DefaultReactNativeHost` with overrides for `isNewArchEnabled()` (returns `false`) and `isHermesEnabled()` (returns `true`)
- `SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE)` wrapped in a try-catch -- required for RN 0.76's merged native library architecture where `libreactnative.so` bundles multiple previously-separate `.so` files

### Why

RN 0.76 merges native libraries (`libreact_featureflagsjni.so`, `libhermes_executor.so`, `libreact_devsupportjni.so`, etc.) into a single `libreactnative.so`. The old `SoLoader.init(this, false)` cannot resolve these merged symbols, causing `UnsatisfiedLinkError` at runtime. `DefaultReactNativeHost` is the recommended base class that provides correct defaults for Hermes and New Architecture flags.

### Files

- [`android/app/src/main/java/app/biostasis/MainApplication.java`](../android/app/src/main/java/app/biostasis/MainApplication.java)

---

## 8. Flipper Removal

### What changed

- Deleted `android/app/src/debug/java/com/biostasis/ReactNativeFlipper.java`
- Removed `FLIPPER_VERSION=0.99.0` from `android/gradle.properties`
- Removed all `debugImplementation("com.facebook.flipper:...")` lines from `android/app/build.gradle`
- Replaced `redux-flipper` with `redux` in `package.json`

### Why

Flipper support was deprecated in React Native 0.73 and removed from the default template in 0.74. The `ReactNativeFlipper.java` class referenced APIs that no longer exist, causing compilation failures. React Native DevTools (built into the Metro dev server) replaces Flipper for debugging.

### Files

- `android/app/src/debug/java/com/biostasis/ReactNativeFlipper.java` (deleted)
- [`android/gradle.properties`](../android/gradle.properties)
- [`android/app/build.gradle`](../android/app/build.gradle)
- [`package.json`](../package.json)

---

## 9. JavaScript Dependency Changes

### What changed

| Package | Before | After | Reason |
|---------|--------|-------|--------|
| `react-native-screens` | `^3.5.0` | `4.5.0` | v3 references `ViewManagerWithGeneratedInterface` which doesn't exist in RN 0.76; v4.5.0 is the latest compatible version |
| `react-dom` | `^19.0.0` | `18.3.1` | Must match the `react` version (18.3.1) |
| `redux-flipper` | `^2.0.3` | removed | Flipper is no longer supported |
| `redux` | (transitive) | `^4.2.0` | Added as a direct dependency since `redux-flipper` was the only package that declared it |
| `prop-types` | not present | `^15.8.1` | Required by some RN libraries at runtime |

### Files

- [`package.json`](../package.json)
- `yarn.lock`

---

## 10. Patches

### `patches/react-native+0.76.7.patch`

Adds `includeBuild("../@react-native/gradle-plugin")` to `node_modules/react-native/settings.gradle.kts`. Without this, the RN Gradle plugin cannot be resolved when the `react-native` package is included as a Gradle build.

### `patches/react-native-svg+15.2.0.patch`

Changes `void setPointerEvents(PointerEvents)` to `@Override public void setPointerEvents(PointerEvents)` in `VirtualView.java`. RN 0.76 changed the method signature in the parent class from package-private to public; without this override fix, the build fails with a compilation error.

### Files

- [`patches/react-native+0.76.7.patch`](../patches/react-native+0.76.7.patch)
- [`patches/react-native-svg+15.2.0.patch`](../patches/react-native-svg+15.2.0.patch)

---

## 11. Postinstall Script

### What changed

Added `scripts/copy-android-local-properties.js` and updated the `postinstall` script in `package.json` to run it after `patch-package`.

### Why

When building from Android Studio (where `ANDROID_HOME` may not be set), the Hermes engine build script fails because it cannot find the Android SDK. This script copies `android/local.properties` into `node_modules/react-native/local.properties` and patches the Hermes engine Gradle file to read `sdk.dir` from `local.properties` as a fallback.

### Files

- [`scripts/copy-android-local-properties.js`](../scripts/copy-android-local-properties.js)
- [`package.json`](../package.json) -- `postinstall` script

---

## 12. `package.json` Script Updates

### What changed

All Android run scripts changed from `--variant=<name>` to `--mode <name>`:

| Before | After |
|--------|-------|
| `react-native run-android --variant=developmentdebug` | `react-native run-android --mode developmentDebug` |
| `react-native run-android --variant=stagingdebug` | `react-native run-android --mode stagingDebug` |
| etc. | etc. |

The default `android` script was also updated to `--mode developmentDebug` (previously it used no variant flag).

### Why

The React Native 0.76 CLI replaced `--variant` with `--mode` for selecting build variants.

### Files

- [`package.json`](../package.json) -- `scripts` section

---

## 13. `AndroidManifest.xml`

### What changed

Removed `package="com.biostasis"` from the root `<manifest>` element.

### Why

AGP 8 no longer supports setting the package namespace via the manifest. The namespace is now declared in `android/app/build.gradle` as `namespace "app.biostasis"`. Keeping the old attribute causes a build warning and potential conflicts.

### Files

- [`android/app/src/main/AndroidManifest.xml`](../android/app/src/main/AndroidManifest.xml)

---

## 14. `android/gradle.properties`

### What changed

- Removed `FLIPPER_VERSION=0.99.0`
- Added `hermesEnabled=true` (read by the RN Gradle plugin)
- Added `newArchEnabled=false` (disables New Architecture / Turbo Modules codegen to avoid `react-native-screens` prefab issues)
- Commented out `org.gradle.java.home` (was hardcoded to a specific machine path; should be set per-machine or omitted)

### Why

The RN 0.76 Gradle plugin reads `hermesEnabled` and `newArchEnabled` from `gradle.properties`. Flipper is gone so its version constant is no longer needed. The hardcoded JDK path would break the build on any other machine.

### Files

- [`android/gradle.properties`](../android/gradle.properties)
