# Single source of truth for "what version is about to ship".
#
# Deliberately reads the NATIVE files, never package.json. Versions are bumped
# by hand in the pbxproj and android/app/build.gradle; package.json's version
# is not what the stores see.
#
# iOS has no equivalent here: fastlane's get_version_number / get_build_number
# already read the pbxproj correctly.
module AppVersions
  module_function

  # Returns { code: Integer, name: String } from android/app/build.gradle.
  # Raises rather than returning a default: a version we cannot read is not a
  # version we should upload against.
  def android(repo_root)
    path = File.join(repo_root, "android", "app", "build.gradle")
    raise "android/app/build.gradle not found at #{path}" unless File.exist?(path)

    src  = File.read(path)
    code = src[/^\s*versionCode\s+(\d+)\s*$/, 1]
    name = src[/^\s*versionName\s+"([^"]+)"\s*$/, 1]

    raise "Could not parse versionCode from #{path}" if code.nil?
    raise "Could not parse versionName from #{path}" if name.nil?

    { code: code.to_i, name: name }
  end
end
