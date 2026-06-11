# Tomorrow Bio Mobile Production Readiness Audit

Date: 2026-06-09

## Executive Summary

The app is not ready for App Store or Google Play submission yet.

The JavaScript app now passes typecheck, lint at error level, and the Jest suite. The iOS release simulator build compiles. Android production release is blocked by missing/incorrect Firebase configuration for the production package `com.tomorrowbiostasis.app`.

This report separates issues fixed locally from release blockers that require production credentials, store metadata, backend/legal confirmation, or physical-device QA.

## Fixed In This Pass

### P0/P1 Build And Release Hygiene

- Removed obsolete Android JVM option `-XX:MaxPermSize=4096m`.
- Added repeatable release validation scripts:
  - `yarn ios:release-sim`
  - `yarn android:prod-release`
  - `yarn android:prod-bundle`
- Added `tomorrowbio://` as a backwards-compatible deep link scheme on iOS, Android, and React Navigation while preserving `biostasis://`.
- Updated visible app metadata to Tomorrow Bio where it is safe locally:
  - iOS display name.
  - Android app name.
  - React Native `displayName`.
  - Notification channel display names.
  - English baseline copy.

### Privacy And Logging

- Production console logging is disabled by `Logger.service`.
- Production diagnostics sharing now states that diagnostics are not automatically collected.
- AsyncStorage debug logs no longer print stored values.
- Push token logs no longer print FCM token values.
- Remote push diagnostics no longer persist full notification payloads and are dev-only.

### Type Safety And Tests

- Fixed TypeScript issues in auth form exports, emergency contact reducers/thunks, health normalization, Google Fit typing, provider typing, toast typing, and navigation reset casts.
- Scoped TypeScript compilation away from generated/root web components and inactive incomplete locale files.
- Kept active English locale compiled.

### Android Permissions

- Removed unused/overbroad manifest permissions:
  - `BLUETOOTH`
  - `BLUETOOTH_ADMIN`
  - `WRITE_EXTERNAL_STORAGE`
  - `ACCESS_NOTIFICATION_POLICY`
- Removed mandatory BLE feature declaration.
- Removed lock-screen activity flags from `MainActivity`.

## Validation Results

### Passed

- `npx tsc --noEmit --pretty false`
- `corepack yarn lint`
  - Passes with 0 errors.
  - 112 warnings remain in generated/root web files, dev screens, inactive locales, scripts, and tests.
- `corepack yarn test --runInBand`
  - 8 suites passed.
  - 160 tests passed.
- `git diff --check`
- `corepack yarn ios:release-sim`
  - iOS Release simulator build succeeded with code signing disabled.

### Failed / Blocked

- `corepack yarn android:prod-release`
  - Fails at `:app:processProductionReleaseGoogleServices`.
  - Error: `No matching client found for package name 'com.tomorrowbiostasis.app'`.
  - Local `android/app/google-services.json` contains `com.dermatologistMobile.app`, which is not valid for this app.

## P0 Release Blockers

1. Android production Firebase config is wrong.
   - Required: `android/app/google-services.json` from Firebase for package `com.tomorrowbiostasis.app`.
   - Current local file is for `com.dermatologistMobile.app`.

2. Store/legal review is not complete.
   - Emergency, health, location, background monitoring, and biostasis claims require legal/product review before submission.

3. Physical-device QA has not been completed in this pass.
   - Required on iOS and Android real devices, especially HealthKit, Health Connect/Google Fit, push notifications, background fetch, location, and emergency flows.

4. App Store/Google Play metadata is not complete in this repo.
   - Missing final screenshots, reviewer notes, demo credentials, privacy labels/data safety answers, and subscription/review details.

5. Android background location and battery optimization exemption remain active.
   - The code uses these flows, but they require strong Play Console declarations and user-facing justification.

## P1 Issues Before Submission

- Android release minification is disabled: `enableProguardInReleaseBuilds = false`.
- Android release lint is disabled: `lint.checkReleaseBuilds false`.
- OAuth callback still uses `biostasis://` in Cognito config. `tomorrowbio://` is accepted by the app, but Cognito allowed callback URLs must be updated before switching OAuth redirects.
- iOS bundle identifier and native target names still use `app.biostasis` / `Biostasis`. This should only be migrated with provisioning, Firebase, Cognito, deep links, and App Store Connect coordination.
- The inactive `de/es/fr/it` locale files are incomplete/stale and excluded from TypeScript. English is the only validated baseline.
- Many non-sensitive dev logs remain. Production console is disabled, but dev diagnostics still need process controls.
- No in-repo confirmation of account deletion, subscription entitlements, restore purchase, or reviewer/demo account flows.
- No verified production privacy policy URL, terms URL, support URL, or app review notes package.

## Security And Privacy Checklist

### Confirmed Locally

- HTTPS-only ATS with localhost exception for local networking.
- Tokens are handled through existing auth libraries and secure native integrations where available.
- Production console logging is disabled.
- Push token and notification diagnostics are redacted or dev-only.
- Unused Android dangerous permissions were removed where not used by code.

### Requires Backend/Product Confirmation

- Backend ownership checks and IDOR protections.
- Document upload validation, scanning, retention, and encryption.
- Account deletion implementation and data-retention policy.
- Consent versioning and audit trail.
- Emergency action audit logs.
- Subscription/trial entitlement source of truth.
- Analytics event inventory and PII/health-data review.

## Store Readiness Checklist

### iOS

- Release simulator build: passed.
- Signed archive/TestFlight upload: not run.
- App privacy nutrition labels: not prepared.
- HealthKit usage legal copy: needs review.
- Background/location usage: needs review.
- Demo account and review notes: missing.

### Android

- Production release build: blocked by Firebase package mismatch.
- Play Data Safety form: not prepared.
- Health apps declaration: likely required if health data is collected.
- Background location declaration: likely required if retained.
- Battery optimization policy review: required.
- Internal testing upload: not possible until release build passes.

## App Review Notes Draft

Tomorrow Bio is an emergency-support and preparation app. It does not replace emergency services, medical care, legal advice, or official emergency dispatch. It stores user-provided emergency information, contacts, documents, and optional health/location signals to support user-enabled emergency workflows.

Permissions requested:

- Notifications: check-ins and emergency alerts.
- Location: sharing location during emergency workflows.
- Health data: recent heart rate and steps for user-enabled monitoring.
- Documents/photos/files: user-selected document uploads.

Reviewer requirements still missing:

- Demo credentials.
- Test membership/subscription state.
- Confirmation whether emergency sending is simulated or production-backed in review builds.
- Support and privacy policy URLs.

## Release Plan

1. Replace Android Firebase config with the correct production `google-services.json`.
2. Re-run:
   - `yarn android:prod-release`
   - `yarn android:prod-bundle`
   - `yarn ios:release-sim`
   - signed iOS archive from Xcode or CI.
3. Run physical-device QA:
   - Fresh install onboarding.
   - Login/logout.
   - Password reset.
   - Emergency contact CRUD.
   - Health permission and refresh.
   - Location permission and emergency map preview.
   - Emergency hold-to-trigger and cancellation.
   - Push notification tap flows.
   - Background/foreground transitions.
   - Offline/low-network handling.
4. Complete legal/privacy/store review.
5. Upload to TestFlight and Google Play internal testing.
6. Monitor Crashlytics and backend logs during internal testing.
7. Fix all P0/P1 defects before staged rollout.
