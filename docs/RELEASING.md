# Releasing

Store releases run through fastlane, locally or from GitHub Actions
(`.github/workflows/release.yml`). The lanes live in `fastlane/`.

## Branches

| Branch    | What a push does                                                                 |
| --------- | -------------------------------------------------------------------------------- |
| `staging` | iOS → TestFlight (internal testers). Android → Play **internal** track.          |
| `main`    | Nothing, unless the repository variable `FASTLANE_PRODUCTION` is `true`. Then iOS → submitted to **App Review**, Android → Play **production** at a 10% staged rollout. |

`main` **promotes** what `staging` uploaded. When the build number on `main` is
already on TestFlight / the Play internal track, that exact build is submitted
or promoted and nothing is rebuilt. Only when it was never staged does `main`
build and upload it first.

A push whose build number is already in the store does nothing and ends
green, with a "Skipped" note in the run summary. To ship, bump the version.

There is one backend (production), so `staging` and `main` produce the same
binary. "Staging" here means "testers see it first", not a separate
environment.

## Shipping a release

1. On a branch, bump the version on **both** platforms and merge to `staging`:
   - iOS: `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in
     `ios/Biostasis.xcodeproj/project.pbxproj` (Debug and Release).
   - Android: `versionName` and `versionCode` in `android/app/build.gradle`.

   Versioning is manual on purpose; nothing auto-increments.
2. The `staging` push uploads to TestFlight and the Play internal track. Test it.
3. Merge `staging` into `main`. With `FASTLANE_PRODUCTION=true` that submits the
   same iOS build for review and starts the Android production rollout at 10%.
4. After Apple approves, release the version in App Store Connect (automatic
   release is off). Raise the Android rollout in Play Console when you are
   confident.

`FASTLANE_PRODUCTION` lives in GitHub → Settings → Secrets and variables →
Actions → **Variables**. Set it to anything other than `true` to pause
production releases from `main` without touching code.

You can also run the workflow by hand (Actions → release → Run workflow):
`staging` from any branch, `production` from `main` only. A manual production
run ignores `FASTLANE_PRODUCTION`.

## Running lanes locally

```bash
bundle install
cp fastlane/.env.example fastlane/.env          # fill in, never commit
cp android/keystore.properties.example android/keystore.properties
bundle exec fastlane doctor                     # checks everything, uploads nothing
```

| Lane                          | Effect                                              |
| ----------------------------- | --------------------------------------------------- |
| `fastlane ios build`          | Signed `.ipa` in `build/ios`, uploads nothing       |
| `fastlane ios beta`           | TestFlight                                          |
| `fastlane ios release`        | App Review submission                               |
| `fastlane ios certificates`   | Creates/refreshes signing in the match repo (human) |
| `fastlane android build`      | Signed `.aab` (production flavor), uploads nothing  |
| `fastlane android beta`       | Play internal track                                 |
| `fastlane android production` | Play production, 10% (`rollout:"1.0"` for 100%)     |

Useful options: `android beta dry_run:true` validates against Play and
publishes nothing; `draft:true` stages a Play release without rolling it out;
`skip_existing:true` turns "already uploaded" into a notice instead of an error.

## GitHub Actions secrets

Repository → Settings → Secrets and variables → Actions → **Secrets**:

| Secret                          | What it holds                                                        |
| ------------------------------- | -------------------------------------------------------------------- |
| `APP_STORE_CONNECT_KEY_ID`      | App Store Connect API key id                                         |
| `APP_STORE_CONNECT_ISSUER_ID`   | API issuer id                                                        |
| `APP_STORE_CONNECT_KEY_CONTENT` | base64 of the `.p8`, one line                                        |
| `MATCH_PASSWORD`                | Passphrase of the match signing repo                                 |
| `MATCH_GIT_BASIC_AUTHORIZATION` | base64 of `user:token` with read access to the signing repo          |
| `ANDROID_KEYSTORE_BASE64`       | base64 of the Play **upload** keystore                               |
| `ANDROID_KEY_STORE_PASSWORD`    | Keystore password                                                    |
| `ANDROID_KEY_ALIAS`             | Key alias                                                            |
| `ANDROID_KEY_ALIAS_PASSWORD`    | Key password                                                         |
| `PLAY_SERVICE_ACCOUNT_JSON`     | Google Play service-account JSON (Release manager on this app)      |
| `GOOGLE_SERVICES_JSON`          | `android/app/google-services.json` (gitignored)                      |
| `APP_ENV`                       | Contents of `.env.production`; CI writes it to `.env` and `.env.production` |
| `SLACK_WEBHOOK_URL`             | Optional release notifications                                       |

This repository is public. The workflow has no `pull_request` trigger, so
secrets never reach code from a fork.

## Decisions behind the setup

- **Manual versioning, with guards instead of auto-increment.** Every upload
  lane checks the store first (TestFlight for iOS, all four Play tracks for
  Android, because Play rejects a `versionCode` at or below anything uploaded
  anywhere). The guards are advisory: a build expired or removed from every
  track does not show up. The upload stays the final authority.
- **Android release signing never falls back.** `android/app/build.gradle`
  registers a release signing config only when `keystore.properties` or the
  `ANDROID_KEY_*` variables are complete, and aborts any release build at
  task-graph time otherwise. An unsigned or debug-signed bundle off a green
  build is the failure this prevents.
- **iOS: the pbxproj stays `CODE_SIGN_STYLE = Automatic` in git.** The lane
  flips only the Biostasis target's Release configuration to manual signing for
  the archive and restores the file from a snapshot afterwards. If
  `project.pbxproj` is dirty after a lane, the lane crashed; restore it before
  committing.
- **`app_store_connect_api_key` is the first Apple-facing action in every iOS
  lane.** Moving it after `match` brings back the interactive Apple ID prompt.
- **The `.ipa` is checked after signing:** `aps-environment = production`,
  HealthKit with background delivery, and the exported build number. Push,
  emergency alerts and bio monitoring all fail silently without them.
- **`upload_to_play_store` keeps every `skip_upload_*` flag.** Without them
  supply can push empty metadata over the live Play listing. Store listings are
  managed in the consoles, not in this repo.
- **Paths use the `repo_root` helper, never `__dir__`.** fastlane evaluates its
  files relative to `fastlane/` and changes directory between parse time and
  lane execution.
- `fastlane/README.md` is generated by fastlane; edit lane `desc` strings
  instead.
