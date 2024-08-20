package com.biostasis;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.facebook.react.bridge.JSIModulePackage; // <- add
import com.swmansion.reanimated.ReanimatedJSIModulePackage; // <- add
import android.util.Log;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

          @Override
          protected JSIModulePackage getJSIModulePackage() {
              return new ReanimatedJSIModulePackage(); // <- add
          }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
    Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
        try {
            Class<?> aClass = Class.forName("com.biostasis.ReactNativeFlipper");
            aClass
                .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                .invoke(null, context, reactInstanceManager);
        } catch (ClassNotFoundException e) {
            Log.e("Flipper Initialization", "Class not found: ");
        } catch (NoSuchMethodException e) {
            Log.e("Flipper Initialization", "Method not found: ");
        } catch (IllegalAccessException e) {
            Log.e("Flipper Initialization", "Illegal access: ");
        } catch (InvocationTargetException e) {
            Log.e("Flipper Initialization", "Invocation target exception: ");
        }
    }
  }
}
