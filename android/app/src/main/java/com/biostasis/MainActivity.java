package com.biostasis;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Biostasis";
  }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme, false);
        /*
         * This is potential android 9 fix for  androidx.fragment.app.Fragment$InstantiationException* Unable to start activity ComponentInfo{com.biostasis/com.biostasis.MainActivity}:
         * Unable to instantiate fragment com.swmansion.rnscreens.ScreenFragment: calling Fragment constructor caused an exception
         * savedInstanceState -> null
        */
        super.onCreate(null);
    }
}
