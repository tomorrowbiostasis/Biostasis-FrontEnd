fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### doctor

```sh
[bundle exec] fastlane doctor
```

Check this machine can actually run a release. Uploads nothing, changes nothing.

----


## iOS

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Create or refresh the App Store signing material in the private certs repo.

Run this manually. The build/beta/release lanes are readonly and never mint a

certificate as a side effect. Use `force:true` only to REVOKE and regenerate the

distribution certificate; every machine and CI runner must re-run match after.

### ios build

```sh
[bundle exec] fastlane ios build
```

Build a signed App Store archive without uploading anything.

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build and upload to TestFlight. CI runs this on every push to `staging`.

skip_existing:true (CI) ends green with a notice when the build number is already

on TestFlight, instead of failing.

### ios release

```sh
[bundle exec] fastlane ios release
```

Submit to App Review. CI runs this on `main` when FASTLANE_PRODUCTION is true.

If staging already put this build on TestFlight, that exact build is submitted and

nothing is rebuilt. Otherwise the build is made and uploaded first. Release after

approval stays manual in App Store Connect.

----


## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build a signed release AAB (production flavor) without uploading anything.

### android beta

```sh
[bundle exec] fastlane android beta
```

Build and upload to the Play internal track. CI runs this on every push to `staging`.

skip_existing:true (CI) ends green with a notice when the versionCode is already

on Play, instead of failing. draft:true stages it without reaching testers.

### android production

```sh
[bundle exec] fastlane android production
```

Release to the Play PRODUCTION track as a staged rollout (10% unless rollout:"1.0").

CI runs this on `main` when FASTLANE_PRODUCTION is true. If staging already put this

versionCode on the internal track, that exact bundle is promoted and nothing is rebuilt.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
