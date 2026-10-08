# Preflight: fail in seconds, not twenty minutes.
#
# Design point: collect EVERY problem and report them together. A preflight
# that stops at the first failure makes a developer do five round trips.

def which?(binary)
  system("command -v #{binary} > /dev/null 2>&1")
end

desc "Check this machine can actually run a release. Uploads nothing, changes nothing."
lane :doctor do
  preflight(platform: :all)
end

private_lane :preflight do |options|
  scope    = options[:platform] || :all
  wants    = ->(p) { scope == :all || scope == p }
  # Credentials that are only needed to talk to a store. The `build` lanes
  # produce artifacts and upload nothing, so they should not demand them.
  # `doctor` checks everything.
  upload   = options.fetch(:upload, true)
  problems = []
  info     = {}

  # ── toolchain ─────────────────────────────────────────────────────────────
  problems << "node is not on PATH" unless which?("node")
  node_version = `node -v 2>/dev/null`.strip
  if node_version =~ /^v(\d+)/
    info["node"] = node_version
    problems << "node #{node_version} is below the >=18 the app needs" if Regexp.last_match(1).to_i < 18
  end
  problems << "yarn is not on PATH" unless which?("yarn")
  problems << "node_modules is missing, run `yarn install`" unless Dir.exist?(File.join(repo_root, "node_modules"))

  # ── runtime config ────────────────────────────────────────────────────────
  # react-native-config bakes an env file into the binary at build time. A
  # missing file does NOT fail the build: it produces an app with empty config
  # that only fails at runtime, after the upload. Hard-fail here.
  #
  # iOS reads the root .env (the scheme sets no ENVFILE); the Android
  # production flavor reads .env.production (envConfigFiles in
  # android/app/build.gradle). There is one backend, so both hold the
  # production values.
  env_files = []
  env_files << ".env" if wants.call(:ios)
  env_files << ".env.production" if wants.call(:android)
  env_files.each do |name|
    unless File.exist?(File.join(repo_root, name))
      problems << "#{name} is missing, react-native-config would bake an EMPTY config into the build"
    end
  end

  # ── iOS ───────────────────────────────────────────────────────────────────
  if wants.call(:ios)
    %w[APP_STORE_CONNECT_KEY_ID APP_STORE_CONNECT_ISSUER_ID APP_STORE_CONNECT_KEY_CONTENT MATCH_PASSWORD].each do |key|
      problems << "#{key} is not set (fastlane/.env, copy fastlane/.env.example)" if ENV[key].to_s.strip.empty?
    end
    problems << "xcodebuild is not available (check `xcode-select -p`)" unless which?("xcodebuild")
    unless File.exist?(File.join(repo_root, "ios", "GoogleService-Info.plist"))
      problems << "ios/GoogleService-Info.plist is missing, the Firebase build phase will fail"
    end

    begin
      info["ios version"] = get_version_number(xcodeproj: XCODEPROJ, target: IOS_TARGET)
      info["ios build"]   = get_build_number(xcodeproj: XCODEPROJ)
    rescue StandardError => e
      problems << "could not read the iOS version from #{XCODEPROJ}: #{e.message}"
    end
  end

  # ── Android ───────────────────────────────────────────────────────────────
  if wants.call(:android)
    has_props = File.exist?(File.join(repo_root, "android", "keystore.properties"))
    has_env   = !ENV["ANDROID_KEY_STORE_FILE"].to_s.strip.empty?
    unless has_props || has_env
      problems << "android/keystore.properties is missing and ANDROID_KEY_STORE_FILE is unset " \
                  "(copy android/keystore.properties.example), release builds will refuse to start"
    end
    unless File.exist?(File.join(repo_root, "android", "app", "google-services.json"))
      problems << "android/app/google-services.json is missing (gitignored, get it from Firebase)"
    end
    if upload && !File.exist?(play_json_key)
      problems << "Play service-account JSON not found at #{play_json_key}"
    end
    unless ENV["ANDROID_HOME"] || ENV["ANDROID_SDK_ROOT"] || File.exist?(File.join(repo_root, "android", "local.properties"))
      problems << "ANDROID_HOME/ANDROID_SDK_ROOT unset and android/local.properties is missing"
    end

    begin
      android_version = AppVersions.android(repo_root)
      info["android versionName"] = android_version[:name]
      info["android versionCode"] = android_version[:code]
    rescue StandardError => e
      problems << "could not read the Android version: #{e.message}"
    end
  end

  info.each { |key, value| UI.message("  #{key}: #{value}") }

  unless problems.empty?
    UI.error("Preflight found #{problems.size} problem(s):")
    problems.each { |p| UI.error("  • #{p}") }
    UI.user_error!("Preflight failed. Fix all of the above, then re-run.")
  end

  UI.success("Preflight OK")
  info
end
