# Environment and Configuration Reference

This document lists every configuration file and environment variable the Biostasis app requires to build and run. Each section describes the file's purpose, its expected contents, and where to obtain the values.

---

## 1. `.env` Files (React Native Config)

The app uses [`react-native-config`](https://github.com/luggit/react-native-config) to inject environment variables at build time. The Android build flavors map to specific env files:

| Build Flavor | Env File |
|--------------|----------|
| `development` / `developmentDebug` / `developmentRelease` | `.env.development` |
| `production` / `productionDebug` / `productionRelease` | `.env.production` |

Both files live in the **project root** (next to `package.json`). They are gitignored and must be created locally.

A bare `.env` placeholder also exists in the project root to satisfy `react-native-config`'s startup check. It does not need real values.

### Single environment (production only)

The app currently has only one backend: **production**. Both `.env.development` and `.env.production` point to the same production API and Cognito. The **development** flavor is for local debugging (app name "Biostasis dev", debug-only UI such as the debug menu in the drawer) and still uses production credentials. The only difference between the two env files is `ENVIRONMENT`: set to `development` in `.env.development` (so `EnvConfig.DEV` is true and dev-only UI is visible) and to `production` in `.env.production`.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ENVIRONMENT` | `development` or `production` -- controls feature flags and logging | `development` |
| `API_URL` | Base URL for the Biostasis backend API | `https://api.dev.biostasis.com` |
| `AWS_REGION` | AWS region for Cognito services | `eu-central-1` |
| `AWS_USER_POOL_ID` | Cognito User Pool ID | `eu-central-1_AbCdEfGhI` |
| `AWS_POOL_WEB_CLIENT_ID` | Cognito App Client ID (public, no secret) | `1a2b3c4d5e6f7g8h9i0j` |
| `AWS_IDENTITY_POOL_ID` | Cognito Identity Pool ID | `eu-central-1:12345678-abcd-efgh-ijkl-123456789012` |
| `AWS_OAUTH_DOMAIN` | Cognito Hosted UI domain | `biostasis-dev.auth.eu-central-1.amazoncognito.com` |

These values come from your AWS Cognito configuration and the Biostasis Cloud infrastructure. See the [Biostasis-Cloud-infrastructure](https://github.com/tomorrowbiostasis/Biostasis-Cloud-infrastructure) repository for setup.

### Example `.env.development`

```
ENVIRONMENT=development
API_URL=https://api.biostasis.com
AWS_REGION=eu-central-1
AWS_USER_POOL_ID=eu-central-1_XXXXXXXXX
AWS_POOL_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_IDENTITY_POOL_ID=eu-central-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
AWS_OAUTH_DOMAIN=biostasis.auth.eu-central-1.amazoncognito.com
```

### Example `.env.production`

```
ENVIRONMENT=production
API_URL=https://api.biostasis.com
AWS_REGION=eu-central-1
AWS_USER_POOL_ID=eu-central-1_XXXXXXXXX
AWS_POOL_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_IDENTITY_POOL_ID=eu-central-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
AWS_OAUTH_DOMAIN=biostasis.auth.eu-central-1.amazoncognito.com
```

(With a single production backend, both files use the same API and Cognito values; only `ENVIRONMENT` differs. Replace placeholders with real values from Biostasis-Cloud-infrastructure.)

### Where the values are consumed

`src/services/Env.service.ts` reads all variables from `react-native-config` and exports them as a typed `EnvConfig` object used throughout the app (API client, Amazon/Cognito service, feature flags).

---

## 2. `android/app/google-services.json`

Firebase configuration file required for push notifications (`firebase-messaging`) and analytics (`firebase-analytics-ktx`).

### How to obtain it

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select (or create) the project for Biostasis.
3. Add an Android app with package name **`com.tomorrowbiostasis.app`**.
4. Download `google-services.json` and place it at `android/app/google-services.json`.

This file is gitignored (`**/google-services.json` in `.gitignore`). A placeholder with dummy keys exists in the repo so the build doesn't fail, but **push notifications and analytics will not work** until it is replaced with a real file.

---

## 3. Android `client_secrets.json` (Google OAuth / Fit)

Google’s Android OAuth client metadata for **Google Fit** (and related flows) is packaged as a **Java classpath resource** named `client_secrets.json`. It is **not** read from TypeScript; the native stack resolves it at runtime.

The project uses **product flavors** (`development` / `production` in `android/app/build.gradle`). Each flavor has its own file:

| Flavor | Path |
|--------|------|
| **development** | `android/app/src/development/resources/client_secrets.json` |
| **production** | `android/app/src/production/resources/client_secrets.json` |

Do **not** place a competing `client_secrets.json` under `android/app/src/main/resources/` — only one file should be merged per variant.

The JSON shape is Google’s `installed` client format (`client_id`, `project_id`, `auth_uri`, `token_uri`, etc.). When you rotate OAuth clients in [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials, update the appropriate flavor file and keep **`google-services.json`** (section 2) and Firebase **SHA certificate fingerprints** in sync with your signing keys (including **Play App Signing** for store builds).

---

## 4. `android/keystore.properties`

Signing configuration used by `android/app/build.gradle` for both debug and release builds. The build script loads this file **only if it exists**, so debug builds work without it (using the default Android debug keystore).

**Required for release builds and Google Play uploads.**

### Expected format

```properties
storeFile=../my-upload-key.keystore
storePassword=your-store-password
keyAlias=my-key-alias
keyPassword=your-key-password
```

| Key | Description |
|-----|-------------|
| `storeFile` | Path to the `.keystore` / `.jks` file, relative to the `android/app/` directory |
| `storePassword` | Password for the keystore |
| `keyAlias` | Alias of the signing key within the keystore |
| `keyPassword` | Password for the specific key alias |

This file is gitignored (`keystore.properties` in `.gitignore`). See [Android Play Store Internal Testing](ANDROID_PLAY_STORE_INTERNAL_TESTING.md) for how to generate a keystore and configure this file.

---

## 5. `android/local.properties`

Contains the path to your local Android SDK (and optionally NDK). Android Studio typically generates this automatically.

### Expected format

```properties
sdk.dir=/Users/yourname/Library/Android/sdk
ndk.dir=/Users/yourname/Library/Android/sdk/ndk/26.1.10909125
```

If you don't have this file and `ANDROID_HOME` is set, the postinstall script (`scripts/copy-android-local-properties.js`) creates it automatically during `yarn install`.

This file is gitignored (`local.properties` in `.gitignore`).

---

## 6. `android/gradle.properties`

Project-wide Gradle settings. These are checked into version control. Relevant tunables:

| Property | Default | Description |
|----------|---------|-------------|
| `hermesEnabled` | `true` | Enables the Hermes JS engine. Required for RN 0.76. |
| `newArchEnabled` | `false` | Enables React Native New Architecture (Turbo Modules, Fabric). Currently disabled due to library compatibility. |
| `AsyncStorage_db_size_in_MB` | `50` | Maximum size of the AsyncStorage SQLite database. |
| `org.gradle.java.home` | (commented out) | Path to JDK. Uncomment and set if Android Studio's bundled JBR isn't on your `PATH`. |
| `org.gradle.jvmargs` | `-Xmx4096m ...` | JVM heap size for Gradle. Increase if you see OOM during builds. |

---

## 7. Upload Keystore (`.keystore` / `.jks`)

The actual keystore file used for signing release builds. It is referenced by `storeFile` in `keystore.properties`.

This file is gitignored (`*.keystore` in `.gitignore`). Keep it in a secure location and back it up -- losing the upload keystore means you cannot push updates to Google Play for the same app listing without contacting Google support.

---

## Quick Checklist for a New Developer

1. Run `yarn` to install dependencies and apply patches.
2. Create `.env.development` and `.env.production` in the project root with the variables listed above. With a single production backend, use the same API and Cognito values in both files (only `ENVIRONMENT` differs: `development` vs `production`). Obtain real values from Biostasis-Cloud-infrastructure or team config and replace the placeholders in both files.
3. Place a real `google-services.json` at `android/app/google-services.json` (from Firebase Console).
4. Confirm `client_secrets.json` exists for both flavors under `android/app/src/development/resources/` and `android/app/src/production/resources/` (checked in for this repo; update if your team rotates OAuth clients).
5. Verify `android/local.properties` exists with your SDK path (or set `ANDROID_HOME`).
6. (Optional, release only) Create `android/keystore.properties` and place your keystore file.
7. Open `android/` in Android Studio, sync, and build.
