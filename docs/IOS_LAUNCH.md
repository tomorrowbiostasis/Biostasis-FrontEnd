# iOS Launch: What You Need Besides `pod install`

Besides `pod install`, you need a few other setup steps before the iOS app will build and run correctly.

---

## 1. One-time preparation (before `pod install`)

- **Xcode** installed (Mac only).
- **Node.js** and **Yarn** — if you have Node/npm, install Yarn with: `npm install -g yarn`.
- **CocoaPods**: `sudo gem install cocoapods` (do this before `pod install`).
- **Project dependencies**: From the project root run **`yarn`**. This installs JS deps, runs `patch-package`, and the Android postinstall script; the iOS flow assumes this has been run.

---

## 2. Configuration files (required for the app to work)

These are not installed by CocoaPods or `yarn`; you add them yourself (or from team/backend repos).

- **`.env.development` and `.env.production`** in the **project root** (next to `package.json`).  
  They must contain: `ENVIRONMENT`, `API_URL`, `AWS_REGION`, `AWS_USER_POOL_ID`, `AWS_POOL_WEB_CLIENT_ID`, `AWS_IDENTITY_POOL_ID`, `AWS_OAUTH_DOMAIN`.  
  Values come from [Biostasis-Cloud-infrastructure](https://github.com/tomorrowbiostasis/Biostasis-Cloud-infrastructure). Without these, the app may build but won't connect to the API or auth.  
  See [Environment and Configuration](ENVIRONMENT_AND_CONFIGURATION.md).

- **`GoogleService-Info.plist`** in **`ios/Biostasis/`**.  
  Download from Firebase Console (add an iOS app with bundle ID matching the project, e.g. `app.biostasis`).  
  The Xcode project already references this file; without it, Firebase (e.g. push, Crashlytics) won't be configured.  
  See the root [README](../README.md) (Preparation, step 5).

---

## 3. Optional local tweaks

- **`.xcode.env.local`** in the **`ios/`** folder: only if you need a custom Node path (e.g. nvm).  
  See [ios/.xcode.env](../ios/.xcode.env).

---

## 4. How you actually launch iOS

- **From Xcode**: Open the **`ios`** folder (the `.xcodeproj` or workspace) in Xcode, pick a scheme and simulator/device, then Run.
- **From CLI**: After `pod install` and the config files above, from the project root:
  - `yarn ios` (uses default scheme), or
  - `yarn ios:dev` / `yarn ios:staging` if those schemes exist in your Xcode project.

You still need **Metro** for the JS bundle: run `yarn start` in one terminal, then build/run the app from Xcode or `yarn ios`.

---

## Summary

| Step | What |
|------|------|
| Before pods | Install Xcode, Node, Yarn, CocoaPods; run `yarn` in project root. |
| Config | Add `.env.development` and `.env.production` (root); add `ios/Biostasis/GoogleService-Info.plist` from Firebase. |
| After pods | Open `ios` in Xcode (or use `yarn ios`), start Metro with `yarn start`, then run the app. |

**Bottom line:** `pod install` is not enough — you also need the preparation steps, `yarn`, env files, Firebase plist, and then building/running via Xcode or CLI with Metro running.
