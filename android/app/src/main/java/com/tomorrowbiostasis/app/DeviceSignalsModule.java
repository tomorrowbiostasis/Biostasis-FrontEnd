package com.tomorrowbiostasis.app;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DeviceSignalsModule extends ReactContextBaseJavaModule {

    DeviceSignalsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    @NonNull
    public String getName() {
        return "DeviceSignalsModule";
    }

    @ReactMethod
    public void isDndActive(Promise promise) {
        try {
            NotificationManager nm = (NotificationManager)
                    getReactApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                int filter = nm.getCurrentInterruptionFilter();
                // INTERRUPTION_FILTER_ALL means no DND — anything else means some DND mode is active
                promise.resolve(filter != NotificationManager.INTERRUPTION_FILTER_ALL);
            } else {
                promise.resolve(false);
            }
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void isPackageInstalled(String packageName, Promise promise) {
        try {
            PackageManager packageManager = getReactApplicationContext().getPackageManager();
            packageManager.getPackageInfo(packageName, 0);
            promise.resolve(true);
        } catch (PackageManager.NameNotFoundException e) {
            promise.resolve(false);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void openAppSettings(String packageName, Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + packageName));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void openApp(String packageName, Promise promise) {
        try {
            PackageManager packageManager = getReactApplicationContext().getPackageManager();
            Intent intent = packageManager.getLaunchIntentForPackage(packageName);
            if (intent == null) {
                promise.resolve(false);
                return;
            }

            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }
}
