require "fileutils"

platform :ios do
  # Load the App Store Connect API key. This MUST be the first Apple-facing
  # action in every lane: it publishes the key into lane_context and sets
  # Spaceship::ConnectAPI.token, which is what stops match/sigh/pilot from
  # falling back to an interactive Apple ID + 2FA prompt.
  private_lane :asc_api_key do
    app_store_connect_api_key(
      key_id:                ENV.fetch("APP_STORE_CONNECT_KEY_ID"),
      issuer_id:             ENV.fetch("APP_STORE_CONNECT_ISSUER_ID"),
      key_content:           ENV.fetch("APP_STORE_CONNECT_KEY_CONTENT"),
      is_key_content_base64: true,
      in_house:              false
    )
  end

  # Highest TestFlight build for the marketing version, 0 when there is none.
  # initial_build_number: 0 (not the default 1) so a brand-new version train
  # does not look like it already holds build 1.
  #
  # Caveat: a build expired from the train does not appear here, so this is
  # advisory. The upload remains the final authority.
  private_lane :latest_uploaded_build do |options|
    latest_testflight_build_number(
      api_key:              options[:api_key],
      app_identifier:       APP_IDENTIFIER,
      version:              options[:version],
      initial_build_number: 0,
      live:                 false
    ).to_i
  end

  desc "Create or refresh the App Store signing material in the private certs repo."
  desc "Run this manually. The build/beta/release lanes are readonly and never mint a"
  desc "certificate as a side effect. Use `force:true` only to REVOKE and regenerate the"
  desc "distribution certificate; every machine and CI runner must re-run match after."
  lane :certificates do |options|
    setup_ci if ENV["CI"]
    api_key = asc_api_key

    if options[:force]
      UI.important("force:true will REVOKE and regenerate the distribution certificate.")
      UI.important("Every machine and CI runner will need to re-run match afterwards.")
      UI.user_error!("Aborted.") unless UI.confirm("Continue?")
    end

    match(
      type:           "appstore",
      app_identifier: APP_IDENTIFIER,
      api_key:        api_key,
      readonly:       false,
      force:          options[:force] || false
    )
  end

  desc "Build a signed App Store archive without uploading anything."
  lane :build do |options|
    setup_ci if ENV["CI"]
    preflight(platform: :ios)
    api_key = asc_api_key

    unless options[:skip_install]
      Dir.chdir(repo_root) { sh("yarn", "install", "--immutable") }
      cocoapods(podfile: "ios/Podfile", use_bundle_exec: true, try_repo_update_on_error: true)
    end

    match(
      type:           "appstore",
      app_identifier: APP_IDENTIFIER,
      api_key:        api_key,
      readonly:       true
    )

    profile_name = lane_context[SharedValues::MATCH_PROVISIONING_PROFILE_MAPPING][APP_IDENTIFIER]
    if profile_name.to_s.empty?
      UI.user_error!(
        "match returned no provisioning profile for #{APP_IDENTIFIER}. " \
        "If the distribution certificate expired, run `bundle exec fastlane ios certificates`."
      )
    end

    expected_build = get_build_number(xcodeproj: XCODEPROJ)

    # Snapshot the pbxproj before touching it, so the ensure below can restore
    # EXACTLY what this lane changed and nothing else.
    pbxproj        = File.join(repo_root, XCODEPROJ, "project.pbxproj")
    pbxproj_backup = "#{pbxproj}.fastlane-backup"
    FileUtils.cp(pbxproj, pbxproj_backup)

    begin
      # The project is CODE_SIGN_STYLE = Automatic in git, which ignores the
      # distribution profile match installs. Flip ONLY this target and ONLY the
      # Release configuration to Manual for the archive.
      #
      # Not done with gym(xcargs:) because command-line build settings apply to
      # every target in the workspace, including Pods resource bundles that
      # cannot satisfy an app provisioning profile.
      update_code_signing_settings(
        path:                  XCODEPROJ,
        targets:               [IOS_TARGET],
        build_configurations:  ["Release"],
        use_automatic_signing: false,
        team_id:               TEAM_ID,
        code_sign_identity:    "Apple Distribution",
        profile_name:          profile_name,
        bundle_identifier:     APP_IDENTIFIER
      )

      build_app(
        workspace:        XCWORKSPACE,
        scheme:           SCHEME,
        configuration:    "Release",
        clean:            true,
        export_method:    "app-store",
        export_team_id:   TEAM_ID,
        output_directory: "build/ios",
        output_name:      "Biostasis.ipa",
        export_options:   {
          method:               "app-store",
          signingStyle:         "manual",
          teamID:               TEAM_ID,
          provisioningProfiles: { APP_IDENTIFIER => profile_name },
          uploadSymbols:        true,
          # Without this, Xcode rewrites CFBundleVersion during export and the
          # build-number guard would be checking a number that is not what ends
          # up in the .ipa. Versioning here is manual on purpose.
          manageAppVersionAndBuildNumber: false
        }
      )
    ensure
      # Restore the snapshot taken above, undoing exactly the signing settings
      # this lane applied. Never `git checkout` the file: that would also revert
      # an uncommitted CURRENT_PROJECT_VERSION bump made just before a release.
      #
      # Ruby `ensure` does not run on SIGKILL, so a dirty project.pbxproj after
      # a lane means the lane crashed. Restore it before committing.
      if File.exist?(pbxproj_backup)
        FileUtils.mv(pbxproj_backup, pbxproj, force: true)
      end
    end

    assert_ipa_entitlements(
      ipa:            lane_context[SharedValues::IPA_OUTPUT_PATH],
      expected_build: expected_build
    )
  end

  desc "Build and upload to TestFlight. CI runs this on every push to `staging`."
  desc "skip_existing:true (CI) ends green with a notice when the build number is already"
  desc "on TestFlight, instead of failing."
  lane :beta do |options|
    setup_ci if ENV["CI"]
    preflight(platform: :ios)
    api_key = asc_api_key

    version = get_version_number(xcodeproj: XCODEPROJ, target: IOS_TARGET)
    build   = get_build_number(xcodeproj: XCODEPROJ)
    latest  = latest_uploaded_build(api_key: api_key, version: version)

    # Fail-fast guard. Versioning is manual, so instead of auto-incrementing we
    # refuse to spend twenty minutes building something App Store Connect will
    # reject.
    if build.to_i <= latest
      next skip_or_fail(
        "TestFlight already has build #{latest} for #{version}, and CURRENT_PROJECT_VERSION " \
        "is #{build}. Bump CURRENT_PROJECT_VERSION in #{XCODEPROJ} (Debug and Release) to ship a new build.",
        options
      )
    end

    build(skip_install: options[:skip_install])

    upload_to_testflight(
      api_key:                           api_key,
      app_identifier:                    APP_IDENTIFIER,
      skip_waiting_for_build_processing: true,
      distribute_external:               false
    )

    notify_slack("#{APP_NAME} iOS #{version} (#{build}) uploaded to TestFlight")
  end

  desc "Submit to App Review. CI runs this on `main` when FASTLANE_PRODUCTION is true."
  desc "If staging already put this build on TestFlight, that exact build is submitted and"
  desc "nothing is rebuilt. Otherwise the build is made and uploaded first. Release after"
  desc "approval stays manual in App Store Connect."
  lane :release do |options|
    setup_ci if ENV["CI"]
    preflight(platform: :ios)
    api_key = asc_api_key

    version = get_version_number(xcodeproj: XCODEPROJ, target: IOS_TARGET)
    build   = get_build_number(xcodeproj: XCODEPROJ)

    # A version that is already submitted, approved or live cannot take another
    # submission, and a live version closes its TestFlight train. Every later
    # push to main lands here until someone bumps MARKETING_VERSION.
    state = app_store_version_state(version)
    if state
      next skip_or_fail(
        "App Store version #{version} is already #{state}. Raise MARKETING_VERSION in " \
        "#{XCODEPROJ} to submit a new release.",
        options
      )
    end

    latest = latest_uploaded_build(api_key: api_key, version: version)
    if build.to_i < latest
      UI.user_error!(
        "TestFlight already has build #{latest} for #{version}, newer than CURRENT_PROJECT_VERSION " \
        "#{build}. main is behind staging; merge staging (or bump the build number) and re-run."
      )
    end

    submit_options = {
      api_key:                           api_key,
      app_identifier:                    APP_IDENTIFIER,
      app_version:                       version,
      submit_for_review:                 true,
      automatic_release:                 false,
      force:                             true,
      precheck_include_in_app_purchases: false,
      # Metadata and screenshots are managed in App Store Connect, not in this
      # repo. Uploading from a non-existent local metadata directory would blank
      # the live listing.
      skip_metadata:                     true,
      skip_screenshots:                  true,
      submission_information:            {
        add_id_info_uses_idfa:             false,
        export_compliance_uses_encryption: false
      }
    }

    if build.to_i == latest
      UI.message("Build #{build} is already on TestFlight, submitting it without rebuilding")
      upload_to_app_store(**submit_options, build_number: build.to_s, skip_binary_upload: true)
    else
      build(skip_install: options[:skip_install])
      upload_to_app_store(**submit_options)
    end

    notify_slack("#{APP_NAME} iOS #{version} (#{build}) submitted to App Review")
  end

  # Verify the SIGNED artifact rather than trusting Xcode.
  #
  # `xcodebuild -exportArchive` with method: app-store takes aps-environment
  # from the embedded provisioning profile. Push (Firebase Messaging) and the
  # emergency alerts depend on it being production, so assert it.
  #
  # HealthKit background delivery feeds the bio monitoring; it must be on the
  # App ID and in the profile, or monitoring silently stops in the store build.
  private_lane :assert_ipa_entitlements do |options|
    require "tmpdir"

    ipa = options[:ipa]
    UI.user_error!("No .ipa path in lane context, did build_app run?") if ipa.to_s.empty?

    workdir = Dir.mktmpdir("ipa-verify")
    begin
      sh("unzip", "-o", "-q", ipa, "-d", workdir)
      app = Dir.glob(File.join(workdir, "Payload", "*.app")).first
      UI.user_error!("No .app found inside #{ipa}") if app.nil?

      entitlements = sh("codesign", "-d", "--entitlements", ":-", "--xml", app, log: false)

      unless entitlements =~ %r{aps-environment</key>\s*<string>production</string>}m
        UI.user_error!(
          "The signed app has aps-environment != production. Push notifications WILL " \
          "silently fail on this build. Check the profile in the match repo and " \
          "ios/Biostasis/BiostasisRelease.entitlements. Do not delete this check."
        )
      end

      %w[com.apple.developer.healthkit com.apple.developer.healthkit.background-delivery].each do |key|
        next if entitlements.include?(key)

        UI.user_error!(
          "The signed app is missing #{key}. Enable HealthKit (with background delivery) on " \
          "the App ID in the Developer portal, then re-run `bundle exec fastlane ios certificates`."
        )
      end

      built = sh("/usr/libexec/PlistBuddy", "-c", "Print :CFBundleVersion",
                 File.join(app, "Info.plist"), log: false).strip
      if built != options[:expected_build].to_s
        UI.user_error!(
          "Exported CFBundleVersion is #{built} but the build-number guard checked " \
          "#{options[:expected_build]}. manageAppVersionAndBuildNumber must be false."
        )
      end

      UI.success("Signed app verified: aps-environment=production, HealthKit, build #{built}")
    ensure
      FileUtils.remove_entry(workdir)
    end
  end
end

# App Store state of `version` when it can no longer take a submission, else
# nil. Needs the API key already loaded (Spaceship::ConnectAPI.token).
#
# PREPARE_FOR_SUBMISSION, DEVELOPER_REJECTED, REJECTED and METADATA_REJECTED
# are deliberately absent: a version in those states can still be submitted.
LOCKED_APP_STORE_STATES = %w[
  WAITING_FOR_REVIEW IN_REVIEW PENDING_APPLE_RELEASE PENDING_DEVELOPER_RELEASE
  PROCESSING_FOR_APP_STORE READY_FOR_SALE READY_FOR_DISTRIBUTION ACCEPTED
].freeze

def app_store_version_state(version)
  app = Spaceship::ConnectAPI::App.find(APP_IDENTIFIER)
  UI.user_error!("App #{APP_IDENTIFIER} not found in App Store Connect") if app.nil?

  versions = app.get_app_store_versions(filter: { versionString: version, platform: "IOS" })
  states   = versions.map { |v| v.respond_to?(:app_version_state) && v.app_version_state || v.app_store_state }
  states.compact.find { |s| LOCKED_APP_STORE_STATES.include?(s.to_s) }
end
