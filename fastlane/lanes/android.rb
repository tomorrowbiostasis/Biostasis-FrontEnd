PLAY_TRACKS = %w[internal alpha beta production].freeze

# These skips are NOT optional on any upload. supply defaults every
# skip_upload_* to false and defaults metadata_path to
# ./fastlane/metadata/android. That directory does not exist here, so without
# these flags supply can push empty listing metadata over the LIVE Play listing.
PLAY_SKIPS = {
  skip_upload_apk:         true,
  skip_upload_metadata:    true,
  skip_upload_images:      true,
  skip_upload_screenshots: true,
  skip_upload_changelogs:  true
}.freeze

platform :android do
  # { "internal" => [24, ...], ... } for every Play track. Each track is rescued
  # individually because a track that has never been used raises rather than
  # returning empty.
  #
  # Caveat: a versionCode uploaded and later removed from every track does not
  # appear here, so the guards built on this are advisory. The upload is the
  # final authority; they just save ten minutes in the "forgot to bump" case.
  private_lane :play_version_codes do
    PLAY_TRACKS.to_h do |track|
      codes = begin
        google_play_track_version_codes(
          track:        track,
          package_name: PACKAGE_NAME,
          json_key:     play_json_key
        ) || []
      rescue StandardError => e
        UI.important("Could not read Play track '#{track}' (#{e.message}), continuing")
        []
      end
      [track, codes.map(&:to_i)]
    end
  end

  desc "Build a signed release AAB (production flavor) without uploading anything."
  lane :build do |options|
    preflight(platform: :android, upload: false)

    unless options[:skip_install]
      # postinstall runs patch-package; a stale node_modules builds unpatched code.
      Dir.chdir(repo_root) { sh("yarn", "install", "--immutable") }
    end

    gradle(task: "clean", project_dir: "android/") unless options[:clean] == false

    # Resolves to bundleProductionRelease. Signing is configured in
    # android/app/build.gradle, NOT via android.injected.signing.* here:
    # injected properties fix only this code path and fail silently, leaving a
    # plain `./gradlew bundleProductionRelease` unsigned.
    gradle(
      task:        "bundle",
      flavor:      ANDROID_FLAVOR,
      build_type:  "Release",
      project_dir: "android/"
    )
  end

  desc "Build and upload to the Play internal track. CI runs this on every push to `staging`."
  desc "skip_existing:true (CI) ends green with a notice when the versionCode is already"
  desc "on Play, instead of failing. draft:true stages it without reaching testers."
  lane :beta do |options|
    preflight(platform: :android)

    version = AppVersions.android(repo_root)

    # Play rejects a versionCode less than or equal to anything previously
    # uploaded to ANY track, so check them all, not just the one we upload to.
    highest = play_version_codes.values.flatten.push(0).max
    if version[:code] <= highest
      next skip_or_fail(
        "Play already has versionCode #{highest} (highest across #{PLAY_TRACKS.join('/')}) and " \
        "android/app/build.gradle declares #{version[:code]}. Bump versionCode (and versionName " \
        "for a user-visible release) to ship a new build.",
        options
      )
    end

    build(skip_install: options[:skip_install], clean: options[:clean])

    release_status = options[:draft] ? "draft" : "completed"

    upload_to_play_store(
      track:          PLAY_TRACK,
      release_status: release_status,
      package_name:   PACKAGE_NAME,
      json_key:       play_json_key,
      aab:            lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
      # Release NAME in Play Console. Left to itself supply uses the bare
      # versionName, so every release would read "2.2.1". Match Play Console's
      # own convention for manual uploads, "<versionCode> (<versionName>)".
      version_name:   "#{version[:code]} (#{version[:name]})",
      # `fastlane android beta dry_run:true` validates against Play without
      # publishing anything, the safest possible first network test.
      validate_only:  options[:dry_run] || false,
      **PLAY_SKIPS
    )

    if options[:dry_run]
      UI.success("Play validation passed for #{version[:name]} (#{version[:code]}), nothing was published")
    elsif release_status == "draft"
      UI.important(
        "#{version[:name]} (#{version[:code]}) uploaded as a DRAFT. It reaches internal testers " \
        "only after you roll it out in Play Console → Test and release → Testing → Internal testing."
      )
      notify_slack("#{APP_NAME} Android #{version[:name]} (#{version[:code]}) staged as a draft on Play #{PLAY_TRACK}")
    else
      UI.success("#{version[:name]} (#{version[:code]}) released to Play #{PLAY_TRACK} testers")
      notify_slack("#{APP_NAME} Android #{version[:name]} (#{version[:code]}) released to Play #{PLAY_TRACK}")
    end
  end

  desc "Release to the Play PRODUCTION track as a staged rollout (10% unless rollout:\"1.0\")."
  desc "CI runs this on `main` when FASTLANE_PRODUCTION is true. If staging already put this"
  desc "versionCode on the internal track, that exact bundle is promoted and nothing is rebuilt."
  lane :production do |options|
    preflight(platform: :android)

    version = AppVersions.android(repo_root)
    codes   = play_version_codes

    # Staged by default: production without a fraction pushes to 100% of users
    # at once. Override with rollout:"1.0" once you are confident.
    rollout = options[:rollout] || "0.1"
    percent = (rollout.to_f * 100).round

    if codes["production"].include?(version[:code])
      next skip_or_fail(
        "versionCode #{version[:code]} is already on Play production. Raise rollout in Play " \
        "Console, or bump versionCode to release a new build.",
        options
      )
    end

    play = {
      package_name:  PACKAGE_NAME,
      json_key:      play_json_key,
      rollout:       rollout,
      validate_only: options[:dry_run] || false,
      **PLAY_SKIPS
    }

    if codes[PLAY_TRACK].include?(version[:code])
      UI.message("versionCode #{version[:code]} is on the #{PLAY_TRACK} track, promoting it without rebuilding")
      upload_to_play_store(
        track:                        PLAY_TRACK,
        track_promote_to:             "production",
        track_promote_release_status: options[:draft] ? "draft" : "inProgress",
        version_code:                 version[:code],
        skip_upload_aab:              true,
        **play
      )
    else
      highest = codes.values.flatten.push(0).max
      if version[:code] <= highest
        UI.user_error!(
          "Play already has versionCode #{highest} and android/app/build.gradle declares " \
          "#{version[:code]}, which is not on the #{PLAY_TRACK} track to promote. " \
          "main is behind staging; merge staging (or bump versionCode) and re-run."
        )
      end

      build(skip_install: options[:skip_install], clean: options[:clean])

      upload_to_play_store(
        track:          "production",
        release_status: options[:draft] ? "draft" : "inProgress",
        aab:            lane_context[SharedValues::GRADLE_AAB_OUTPUT_PATH],
        version_name:   "#{version[:code]} (#{version[:name]})",
        **play
      )
    end

    if options[:dry_run]
      UI.success("Play PRODUCTION validation passed for #{version[:name]} (#{version[:code]}), nothing was published")
    else
      UI.success("#{version[:name]} (#{version[:code]}) rolling out to #{percent}% of production")
      notify_slack("#{APP_NAME} Android #{version[:name]} (#{version[:code]}) rolling out to #{percent}% on Play production")
    end
  end
end
