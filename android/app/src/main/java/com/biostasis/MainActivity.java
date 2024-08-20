package com.biostasis;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.security.ProviderInstaller;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity implements ProviderInstaller.ProviderInstallListener {

  private static final int ERROR_DIALOG_REQUEST_CODE = 1;

  private boolean retryProviderInstall;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Biostasis";
  }

  //Update the security provider when the activity is created.
  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme, false);
        /*
         * This is potential android 9 fix for  androidx.fragment.app.Fragment$InstantiationException* Unable to start activity ComponentInfo{com.biostasis/com.biostasis.MainActivity}:
         * Unable to instantiate fragment com.swmansion.rnscreens.ScreenFragment: calling Fragment constructor caused an exception
         * savedInstanceState -> null
        */
        super.onCreate(savedInstanceState);
        ProviderInstaller.installIfNeededAsync(this, this);
  }


  /**
   * This method is only called if the provider is successfully updated
   * (or is already up to date).
   */
  @Override
  public void onProviderInstalled() {
    // Provider is up to date; app can make secure network calls.
  }

  /**
   * This method is called if updating fails. The error code indicates
   * whether the error is recoverable.
   */
  @Override
  public void onProviderInstallFailed(int errorCode, Intent recoveryIntent) {
    GoogleApiAvailability availability = GoogleApiAvailability.getInstance();
    if (availability.isUserResolvableError(errorCode)) {
      // Recoverable error. Show a dialog prompting the user to
      // install/update/enable Google Play services.
      availability.showErrorDialogFragment(
              this,
              errorCode,
              ERROR_DIALOG_REQUEST_CODE,
              new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface dialog) {
                  // The user chose not to take the recovery action.
                  onProviderInstallerNotAvailable();
                }
              });
    } else {
      // Google Play services isn't available.
      onProviderInstallerNotAvailable();
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode,
                                  Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == ERROR_DIALOG_REQUEST_CODE) {
      // Adding a fragment via GoogleApiAvailability.showErrorDialogFragment
      // before the instance state is restored throws an error. So instead,
      // set a flag here, which causes the fragment to delay until
      // onPostResume.
      retryProviderInstall = true;
    }
  }

  /**
   * On resume, check whether a flag indicates that the provider needs to be
   * reinstalled.
   */
  @Override
  protected void onPostResume() {
    super.onPostResume();
    if (retryProviderInstall) {
      // It's safe to retry installation.
      ProviderInstaller.installIfNeededAsync(this, this);
    }
    retryProviderInstall = false;
  }

  private void onProviderInstallerNotAvailable() {
    // This is reached if the provider can't be updated for some reason.
    // App should consider all HTTP communication to be vulnerable and take
    // appropriate action.
  }
}
