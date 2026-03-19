/**
 * Ensures node_modules/react-native has a local.properties so the included
 * React Native build (when building from source) can find the Android SDK/NDK.
 * Copies from android/local.properties if it exists; otherwise creates from ANDROID_HOME.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const androidLocal = path.join(root, 'android', 'local.properties');
const rnLocal = path.join(root, 'node_modules', 'react-native', 'local.properties');

function getSdkDir() {
  if (fs.existsSync(androidLocal)) {
    const content = fs.readFileSync(androidLocal, 'utf8');
    const m = content.match(/sdk\.dir=(.+)/);
    if (m) return m[1].trim();
  }
  return process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || '';
}

function ensureAndroidLocalProperties(sdkDir) {
  if (!sdkDir || !fs.existsSync(sdkDir)) return false;
  let content = `sdk.dir=${sdkDir.replace(/\\/g, '/')}\n`;
  const ndkDir = path.join(sdkDir, 'ndk', '26.1.10909125');
  if (fs.existsSync(ndkDir)) {
    content += `ndk.dir=${ndkDir.replace(/\\/g, '/')}\n`;
  }
  fs.mkdirSync(path.dirname(androidLocal), { recursive: true });
  fs.writeFileSync(androidLocal, content, 'utf8');
  return true;
}

function copyToReactNative() {
  if (!fs.existsSync(androidLocal)) return;
  const rnDir = path.dirname(rnLocal);
  if (!fs.existsSync(rnDir)) return; // react-native not installed
  fs.copyFileSync(androidLocal, rnLocal);
}

// So hermes-engine build reads sdk.dir from local.properties when ANDROID_HOME is not set (e.g. Android Studio).
function patchHermesEngineBuild() {
  const hermesBuild = path.join(root, 'node_modules', 'react-native', 'ReactAndroid', 'hermes-engine', 'build.gradle.kts');
  if (!fs.existsSync(hermesBuild)) return;
  let content = fs.readFileSync(hermesBuild, 'utf8');
  const original = `fun getSDKPath(): String {
  val androidSdkRoot = System.getenv("ANDROID_SDK_ROOT")
  val androidHome = System.getenv("ANDROID_HOME")
  return when {
    !androidSdkRoot.isNullOrBlank() -> androidSdkRoot
    !androidHome.isNullOrBlank() -> androidHome
    else -> throw IllegalStateException("Neither ANDROID_SDK_ROOT nor ANDROID_HOME is set.")
  }
}`;
  const patched = `fun getSDKPath(): String {
  val androidSdkRoot = System.getenv("ANDROID_SDK_ROOT")
  val androidHome = System.getenv("ANDROID_HOME")
  if (!androidSdkRoot.isNullOrBlank()) return androidSdkRoot
  if (!androidHome.isNullOrBlank()) return androidHome
  val localPropsFile = rootProject.file("local.properties")
  if (localPropsFile.exists()) {
    val content = localPropsFile.readText()
    val regex = Regex("sdk\\\\.dir=(.+)")
    val sdkDir = regex.find(content)?.groupValues?.get(1)?.trim()
    if (!sdkDir.isNullOrBlank()) return sdkDir
  }
  throw IllegalStateException("Neither ANDROID_SDK_ROOT nor ANDROID_HOME is set.")
}`;
  let changed = false;
  if (content.includes(original)) {
    content = content.replace(original, patched);
    changed = true;
  } else if (content.includes('localPropsFile') && !content.includes('Regex("sdk')) {
    const oldPatched = `fun getSDKPath(): String {
  val androidSdkRoot = System.getenv("ANDROID_SDK_ROOT")
  val androidHome = System.getenv("ANDROID_HOME")
  if (!androidSdkRoot.isNullOrBlank()) return androidSdkRoot
  if (!androidHome.isNullOrBlank()) return androidHome
  val localPropsFile = rootProject.file("local.properties")
  if (localPropsFile.exists()) {
    val props = java.util.Properties()
    localPropsFile.inputStream().use { props.load(it) }
    props.getProperty("sdk.dir")?.takeIf { it.isNotBlank() }?.let { return it.trim() }
  }
  throw IllegalStateException("Neither ANDROID_SDK_ROOT nor ANDROID_HOME is set.")
}`;
    if (content.includes('java.util.Properties()')) {
      content = content.replace(oldPatched, patched);
      changed = true;
    }
  }

  // Allow build when sdkmanager is not installed (CMake already present via SDK Manager).
  if (content.includes('getSDKManagerPath()') && !content.includes('getSDKManagerPathOrNull()')) {
    content = content.replace(
      'else -> throw GradleException("Could not find sdkmanager executable.")\n  }\n}\n\nval reactNativeRootDir',
      'else -> throw GradleException("Could not find sdkmanager executable.")\n  }\n}\n\nfun getSDKManagerPathOrNull(): String? =\n  try {\n    getSDKManagerPath()\n  } catch (_: Exception) {\n    null\n  }\n\nval reactNativeRootDir'
    );
    changed = true;
  }
  if (content.includes('onlyIf { !File(cmakePath).exists() }') && !content.includes('sdkManagerPathOrNull != null')) {
    content = content.replace(
      'val installCMake by\n    tasks.registering(Exec::class) {\n      onlyIf { !File(cmakePath).exists() }\n      commandLine(\n          windowsAwareCommandLine(getSDKManagerPath(), "--install", "cmake;${cmakeVersion}"))\n    }',
      'val sdkManagerPathOrNull = getSDKManagerPathOrNull()\nval installCMake by\n    tasks.registering(Exec::class) {\n      onlyIf { !File(cmakePath).exists() && sdkManagerPathOrNull != null }\n      commandLine(\n          if (sdkManagerPathOrNull != null)\n            windowsAwareCommandLine(sdkManagerPathOrNull, "--install", "cmake;${cmakeVersion}")\n          else\n            listOf("true"))\n    }'
    );
    changed = true;
  }

  if (changed) fs.writeFileSync(hermesBuild, content, 'utf8');
}

const sdkDir = getSdkDir();
if (sdkDir && !fs.existsSync(androidLocal)) {
  ensureAndroidLocalProperties(sdkDir);
}
if (fs.existsSync(androidLocal)) {
  copyToReactNative();
  patchHermesEngineBuild();
}
