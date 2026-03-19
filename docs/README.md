# Biostasis Mobile App – Full Documentation

This folder contains the canonical documentation for the Biostasis React Native application: app purpose, business logic, and technical architecture.

## Documents

| Document | Description |
|----------|-------------|
| [**Purpose and Business Logic**](PURPOSE_AND_BUSINESS_LOGIC.md) | What the app does, user flows, and detailed business rules: authentication, sign-up, emergency contacts, Automated Emergency System (bio-based and time-based), documents, profile, account, and validation. |
| [**Technical Architecture**](TECHNICAL_ARCHITECTURE.md) | Tech stack, app entry and shell, navigation, Redux state and persistence, background tasks, notifications, and deep linking. |
| [**API and Services**](API_AND_SERVICES.md) | API client, endpoints, request/response types, and service-by-service descriptions (Amazon/Cognito, Push, Background, BioCheck, Notification, TimeSlot, Env). |
| [**Android Studio Build**](ANDROID_STUDIO_BUILD.md) | Step-by-step guide to build and run the app in Android Studio (RN 0.76, prerequisites, known issues). |
| [**iOS Launch**](IOS_LAUNCH.md) | What you need besides `pod install` to launch the iOS app: prerequisites, env files, Firebase plist, and how to run from Xcode or CLI. |
| [**Changelog: RN 0.76 Migration**](CHANGELOG_RN076_MIGRATION.md) | Every change made during the React Native 0.76.7 migration, organized by area, with explanations of what changed and why. |
| [**Environment and Configuration**](ENVIRONMENT_AND_CONFIGURATION.md) | All required `.env` variables, Firebase config, keystore setup, `gradle.properties` tunables, and a new-developer checklist. |
| [**Android Play Store Internal Testing**](ANDROID_PLAY_STORE_INTERNAL_TESTING.md) | Step-by-step guide to build a production AAB, upload to Google Play Console, and manage internal testers. |

For installation, Firebase/AWS setup, and running the app, see the root [README](../README.md).
