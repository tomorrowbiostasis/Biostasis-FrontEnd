source 'https://rubygems.org'

# Ruby version is pinned in .ruby-version (ruby/setup-ruby reads it in CI).
# The floor is 3.1 rather than the React Native template's 2.6.10 because
# fastlane and CocoaPods 1.16 cannot install on 2.6.
ruby ">= 3.1.0"

# Pinned to the minor that produced the committed ios/Podfile.lock
# (COCOAPODS: 1.16.2). This used to allow 1.15.x, which contradicted that
# lockfile. Bumping this minor rewrites Podfile.lock's COCOAPODS line, so do it
# deliberately and commit the regenerated Podfile.lock in the same change.
gem 'cocoapods', '~> 1.16.2'

# activesupport < 7.1 does not run on Ruby 3.4, which dropped mutex_m /
# bigdecimal / logger from the default gems. That is also why the old
# concurrent-ruby < 1.3.4 and xcodeproj < 1.26 pins are gone: both worked
# around activesupport 6/7.0 and CocoaPods 1.15.
gem 'activesupport', '>= 7.1.3'

gem "fastlane"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
