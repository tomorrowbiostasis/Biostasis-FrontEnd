# Deploying to Google Play Store -- Internal Testing

Step-by-step guide to build a production release of the Biostasis Android app and upload it to Google Play's Internal Testing track.

---

## Prerequisites

Before you begin, make sure you have:

- A [Google Play Developer account](https://play.google.com/console/) (one-time $25 registration fee)
- The Biostasis app created in Google Play Console with package name **`com.tomorrowbiostasis.app`**
- A real `android/app/google-services.json` from Firebase (see [Environment and Configuration](ENVIRONMENT_AND_CONFIGURATION.md))
- A `.env.production` file in the project root with valid API/AWS values (see [Environment and Configuration](ENVIRONMENT_AND_CONFIGURATION.md))
- JDK 17+ installed
- Android SDK with Build-Tools 35.0.0 and NDK 26.1.10909125
- Node.js (>= 18) and Yarn installed
- Dependencies installed: `yarn` (from project root)

---

## Step 1: Generate an Upload Keystore

If you don't already have one, generate a keystore for signing release builds:

```bash
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore biostasis-upload.keystore \
  -alias biostasis-upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You will be prompted for a keystore password, key password, and organization details.

**Important:**
- Store this file securely. If you lose it, you cannot push updates to Google Play without contacting Google Play support to reset your upload key.
- Do NOT commit the keystore to version control (it is gitignored by default).
- Place the keystore file in the `android/` directory (or any path accessible from `android/app/`).

---

## Step 2: Configure `android/keystore.properties`

Create the file `android/keystore.properties` with the following content:

```properties
storeFile=../biostasis-upload.keystore
storePassword=your-keystore-password
keyAlias=biostasis-upload
keyPassword=your-key-password
```

Adjust `storeFile` to the path of your keystore relative to `android/app/`.

This file is gitignored. Do not commit it.

---

## Step 3: Verify `.env.production`

Ensure `.env.production` exists in the project root with all required variables:

```
ENVIRONMENT=production
API_URL=https://api.biostasis.com
AWS_REGION=eu-central-1
AWS_USER_POOL_ID=eu-central-1_XXXXXXXXX
AWS_POOL_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_IDENTITY_POOL_ID=eu-central-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
AWS_OAUTH_DOMAIN=biostasis.auth.eu-central-1.amazoncognito.com
```

The `production` build flavor reads this file automatically.

---

## Step 4: Build the Production Release AAB

Google Play requires an Android App Bundle (AAB), not an APK.

```bash
cd android
./gradlew bundleProductionRelease
```

This will:
1. Compile the JavaScript bundle with Hermes bytecode
2. Build the native code
3. Sign the AAB with the keystore from `keystore.properties`
4. Output the file to:

```
android/app/build/outputs/bundle/productionRelease/app-production-release.aab
```

If the build fails, run `./gradlew clean` first and try again.

---

## Step 5: Verify the AAB

Optionally verify the AAB is valid using [bundletool](https://github.com/google/bundletool):

```bash
java -jar bundletool.jar validate --bundle=app/build/outputs/bundle/productionRelease/app-production-release.aab
```

Or simply check that the file exists and has a reasonable size (typically 30-60 MB).

---

## Step 6: Google Play Console -- App Setup

If this is the first time uploading:

1. Go to [Google Play Console](https://play.google.com/console/).
2. Click **Create app**.
3. Fill in app name, default language, app type (App), and free/paid status.
4. Complete the **Dashboard setup tasks**:
   - **Store listing**: App name, short description, full description, screenshots, feature graphic, app icon.
   - **Content rating**: Complete the questionnaire.
   - **Target audience and content**: Select the appropriate age group.
   - **Privacy policy**: Provide a URL to the privacy policy.
   - **App access**: Indicate if the app requires login (it does -- provide test credentials for review).

These must be completed before your first release, even for internal testing.

---

## Step 7: Upload to Internal Testing

1. In Google Play Console, navigate to **Testing > Internal testing**.
2. Click **Create new release**.
3. If prompted about app signing:
   - Choose **Use Google-managed signing** (recommended). Google will manage the app signing key; you only manage the upload key.
   - Or choose to manage your own signing key.
4. Upload the `app-production-release.aab` file.
5. Add **release notes** describing what this build contains.
6. Click **Review release**, then **Start rollout to Internal testing**.

---

## Step 8: Manage Testers

1. In **Testing > Internal testing**, click the **Testers** tab.
2. Create a new email list or select an existing one.
3. Add the email addresses of your testers (must be Google accounts).
4. Copy the **opt-in link** and share it with testers.
5. Testers open the link, accept the invitation, and can then install the app from the Play Store (or the direct install link).

Up to 100 testers can be added to internal testing.

---

## Step 9: Version Code Management

Google Play requires every upload to have a unique, increasing `versionCode`.

The version code is set in [`android/app/build.gradle`](../android/app/build.gradle):

```groovy
defaultConfig {
    versionName "2.1.5"
    versionCode 11
}
```

Before each new upload:
1. Increment `versionCode` (e.g., 11 -> 12).
2. Optionally update `versionName` to reflect the release (e.g., "2.1.6").
3. Rebuild the AAB and upload.

---

## Step 10: Promoting to Other Tracks

Once internal testing validates the build, you can promote it:

1. Go to the internal testing release.
2. Click **Promote release** and choose:
   - **Closed testing** (larger group, up to 2000 testers)
   - **Open testing** (anyone with the link)
   - **Production** (public on Google Play)
3. Each promotion may require additional review by Google.

---

## Troubleshooting

### Build fails with "keystore not found"

Verify that `android/keystore.properties` exists and `storeFile` points to the correct path relative to `android/app/`.

### Upload rejected: "Version code already used"

Increment `versionCode` in `android/app/build.gradle` and rebuild.

### Upload rejected: "Unoptimized APK"

Make sure you're uploading an `.aab` (App Bundle), not an `.apk`. Use `bundleProductionRelease`, not `assembleProductionRelease`.

### App crashes on launch in production

- Verify `.env.production` has the correct `API_URL` and AWS values.
- Verify `google-services.json` matches the Firebase project for `com.tomorrowbiostasis.app`.
- Check that ProGuard/R8 isn't stripping required classes. ProGuard is currently disabled (`minifyEnabled false` in `build.gradle`).

### "App not yet available" for testers

- The tester must use the same Google account that was added to the testers list.
- It can take a few hours for the internal testing build to propagate after the first upload.
- The tester must accept the opt-in link before the app appears.

### Signing key mismatch

If you previously uploaded with a different keystore, Google Play will reject the new AAB. Either use the same keystore or contact Google Play support to reset the upload key (only possible if you opted into Google-managed app signing).

---

## Quick Reference

| Action | Command |
|--------|---------|
| Install dependencies | `yarn` |
| Build production AAB | `cd android && ./gradlew bundleProductionRelease` |
| Build production APK (for sideloading) | `cd android && ./gradlew assembleProductionRelease` |
| Clean build | `cd android && ./gradlew clean` |
| Check version code | Look at `versionCode` in `android/app/build.gradle` |
| AAB output path | `android/app/build/outputs/bundle/productionRelease/app-production-release.aab` |
| APK output path | `android/app/build/outputs/apk/production/release/app-production-release.apk` |
