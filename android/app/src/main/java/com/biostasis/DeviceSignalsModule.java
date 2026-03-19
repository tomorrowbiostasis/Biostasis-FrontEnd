package com.biostasis;

import android.app.NotificationManager;
import android.content.Context;

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
}
