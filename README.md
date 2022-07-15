# Biostasis

## Table of content

1.**Building / Running section**  
>1.1 [Before you begin](#before-you-begin)  
  1.2 [Environments](#environments)  
  1.3 [Build distribution](#build-distribution)  
  1.4 [Android](#android)   
  1.5 [iOS](#ios)  
  1.6 [Run](#run)  
2. **[Authorization](#authorization)**
3. **[Main feature - Automated emergency](#main-feature-automated-emergency)**  
>3.1 [Automated Emergency Android](#automated-emergency-android)  
  3.2 [Automated Emergency iOS](#automated-emergency-ios)  
  3.3 [Examples](#examples)  
  3.4 [Alarms](#alarms)  
4. **Code**
>4.1 [Project structure](#project-structure)  
  4.2 [Tooling / Providers](#tooling-providers)  
  4.3 [Headless JS (Android only)](#headless-js-android-only)  
  4.4 [Navigation and tools](#navigation-and-tools)  
  4.5 [State management](#state-management)  
  4.6 [Services](#services)  
  4.7 [Background.service (Android only)](#backgroundservice-android-only)  
  4.8 [Native Manager (iOS)](#native-manager-ios)  
  4.9 [Setup wearables](#setup-wearables)  
  4.10 [Current packages versions](#current-packages-versions)  

## Setup and first run

### Before you begin

Ask the project administrator for configuration files that are not kept in the repository.

- add `.env.{environment-name}` file to the root folder of project (currently we are using React Native config which is harvesting .env.development / .env.production nomenclature)
- add `keystore.properties` file to `/android`
- add `local.properties` file to `/android`
- add `my-upload-key.keystore` file to `/android/app` (for production builds)

#### Google services config files 

- add proper configuration files for corresponding  build variants :
- **android**  `android/app/src` appropriate `google-service.json` in `developmentDebug` `developmentRelease` `productionDebug` and `productionRelease` folders
- **ios** `ios/Firebase/` add  `GoogleService-Info-debug.plist` , `GoogleService-Info-production.plist`

### Environments

- App has implemented support for environment variables.
- Configuration based on https://www.bigbinary.com/blog/handling-environment-specific-configurations-in-react-native ( currently no staging included)
- If you want to add new environment, follow the link above

### Build distribution

Production builds are provided via Testing tracks and TestFlight builds.
No CI/CD

#### Android

Setup proper build variant in android studio -> build -> generate signed bundle / apk (you need proper keystore) .

Upload appropriate generated bundle to Google Play Console.

#### iOS

iOS version is distributed manually.

1. Archive the app from Xcode.
2. Distribute as "Ad Hoc" and save locally.   
   2.1. Distribute as 'Distribution'  
3. Upload the archive to the Firebase service.  
   3.1. Upload to test flight for prod testers

Certificates are needed for Xcode to make the build. Please contact the project administrator to get the certificates.

### Run

All available environment versions have their scripts in `package.json`.

1. `yarn` && `cd ios && pod install` like regular react native app. Keep in mind - there are some changes applied to 3rd packages , so patches folder should be created after running yarn more info: https://github.com/ds300/patch-package

Basic commands example:

1. `yarn start`
2. `yarn android:dev`
3. for iOS - please run through xcode application which is more  convenient or with `ios:dev`

## Authorization

Authorization process is handled by AWS Cognito, listeners are attached in `AuthListeners.tsx` component and authorize via `Amazon.service.ts`.

## Main feature Automated emergency

This is the main feature of the app. There are two types: pulse-based and time-based. Pulse-based emergency is triggered when the device does not detect the pulse of the user. Time-based makes regular checks by a notification.

Turning the automated emergency ON in the Automated Emergency Settings screen in the app. To actually turn one of the automated emergency types ON we need to confirm the additional checks.

### Automated Emergency Android

On Android, we use React Native Background Fetch for running the pulse checks. Everything is done in JavaScript.

1.  **Pulse-based trigger**  
     To turn this type of trigger on, we need to mark the additional checks. The Google Fit check will trigger an authentication modal. Other checks (companion app connected to Google Fit and background service enabled) are trust-based as we cannot directly verify if user have done this. When all the checks are marked, the pulse-based trigger is turned on in the backend side. A non-dismissible notification is shown in the system saying that the app is watching user health. A background service is turned on, checking user pulse from Google Fit in short intervals (shorter than the selected frequency).  
     In the pulse-based trigger the backend has always an emergency scheduled. This emergency is then delayed every time the device sends positive information / status (= pulse was detected in the last time period, time period = the time frequency chosen by the user). The positive information is sent either automatically by the background service. The notification is triggered by the backend.
    1.  **User has positive pulse data in the last time period**  
         If user has positive health data detected, then a call to the backend is made with time of next emergency. During this time the backend will be waiting for the next positive information sent. Otherwise, the emergency will be triggered. The app notification is now saying that a positive status was sent to the backend (won't be shown on production). Every positive info sent to backend delays the planned emergency.
    2.  **Pulse wasn't detected in the last time period**  
        If no pulse was detected during set time no positive info is sent -causing further escalation predeceased with Are you ok notification. If user does nothing, then a loud alarm is scheduled in delays. In the meantime a notification is sent from the backend and then a text message.  
         Pulse can be checked during pauses or nighttime , positive info is sent , but can be omitted by backend while pause time is set.
    3.  **Emergency triggered**  
        After the emergency has been triggered, opening the app should lead to a modal informing about this fact. Triggered means not only that the information was already sent to contacts but also the last minutes before that. If the final emergency time has not yet come, it's still possible for the user to tell the ap they are ok and the emergency is delayed again. If the information to contacts was already sent, nothing more should happen from the backend side, unless a positive status is sent to the backend again (then, the system is reset and back to how it functioned before the emergency). On the app/device side, the background service will continue to be triggered and send positive status if pulse detected.
2.  **Time-based trigger**  
    This type of trigger does not turn the background service on. If enabled, backend will send notifications asking "are you ok" in specified time intervals to the device. Then the user has 20 minutes to confirm, which sends the positive status to the backend. The difference from the pulse-based trigger is that backend waits for the positive information only between the "are you ok" notification and the actual emergency, not all the time. The scheduled pauses and the night are also skipped. If no reaction from user, the emergency message is sent to contacts. Nothing more should happen from the backend or device at this point.

### Automated Emergency iOS

On iOS we use a custom native (Written in swift, not JavaScript) module, that's only turned on or off by the app logic.

1.  **Pulse-based trigger**  
     To turn this type of trigger on, we need to mark the additional checks. The HealthKit check will trigger an authentication modal. Due to Apple policy, we don't have possibility to verify if user has shared pulse information with our application, nor if user has Apple Watch paired. Therefore both of those checks are trust-based.
     If user authenticates our application for pulse information gathering, application will get periodic pulse update from system.

     When update happens, positive information is sent to the backend. In the pulse-based trigger the backend has always an emergency scheduled. This emergency is then delayed every time the device sends positive information / status (= pulse was detected in the last time period, time period = the time frequency chosen by the user).

     Backend will response depending on the case:
      1.  **User has positive pulse data in the last time period**  
            If user has positive health data detected, then a call to the backend is made with time of next emergency. During this time the backend will be waiting for the next positive information sent. Otherwise, the emergency will be triggered. On debug environment, local notification shows, informing tester about positive information being sent to backend (won't be shown on production). Every positive info sent to backend delays the planned emergency.
      2.  **Pulse wasn't detected in the last time period**  
            If no pulse was detected during set time no positive aplication stays passive. Emergency trigger escalation on iOS is handled by backend side. Escalation starts with "Are you ok notification". If user does nothing, then a loud alarm is scheduled in delays. In the meantime a notification is sent from the backend and then a text message.
      3.  **Emergency triggered**  
            After the emergency has been triggered, opening the app should lead to a modal informing about this fact. Triggered means not only that the information was already sent to contacts but also the last minutes before that. If the final emergency time has not yet come, it's still possible for the user to tell the ap they are ok and the emergency is delayed again. If the information to contacts was already sent, nothing more should happen from the backend side, unless a positive status is sent to the backend again (then, the system is reset and back to how it functioned before the emergency). On the app/device side, the background service will continue to be triggered and send positive status if pulse detected.

            Note that system update of pulse:
            * Will happen no more often than once per hour
            * Won't happen on locked phone (Will wait for user to unlock the phone)
            * Will happen even after phone is restarted
            * Will happen only if new data is available, therefore won't happen if user takes off iWatch.
            * Won't happen or will be throttled if system is low on battery

2.  **Time-based trigger**  
    Works exactly like on Android.

### Examples

Let's look at a typical scenario. First, the pulse-based trigger (Android only):

1. User turns on the Automated Emergency selecting the pulse-based trigger in the app. We then call the method `startBackgroundFetch` (described in more detail below). It sets the Background Fetch library to execute the regularly run `pulseCheck()` (also better described below) task in regular time intervals.
2. The `pulseCheck()` task is executed. It checks the pulse and sends the positive status to the backend if the pulse is detected.
3. If backend doesn't receive positive information during specific period , it triggers escalation flow , predeceased by 'Are you ok' notification.
4. Pulse check method is sending signal to postpone escalation within specific time (set by user interval)

Pulse based trigger (iOS):
1. User turns on the Automated Emergency selecting the pulse-based trigger in the app. Native module `NativeManager` method `updateDataCollectionStatus()` is called. Internally it checks for user current settings and checks to determine if data collection should be started or stopped.
2.  `HealthKitManager` class, part of native module requests system to update periodically with pulse data.
3. When such update happens, `NetworkingManager` is used to send positive info to backend
4. If backend doesn't receive positive information during specific period , it triggers escalation flow , predeceased by 'Are you ok' notification.
5. Pulse check method is sending signal to postpone escalation within specific time (set by user interval)

Let's look at the time-based trigger now:

1. User turns on the Automated Emergency selecting the time-based trigger in the app. It's doing nothing on the device side. Instead, it tells the backend to send notifications asking "are you ok" in specified time intervals.
2. The backend sends the "are you ok" notification to the device. After every notification, user has 20 minutes to react.
3. From this point it works just like above: in 5 minutes user will receive a text message, then in 5 minutes an alarm will play.

### Alarms

Alarms are a part of the escalation ("Are you ok?" notification > Text message > **Alarm** > Send information to contacts). Alerts can be triggered by:

1. (Android only) Remote notification (both pulse-based and time-based triggers). The registered headless tasks execute the function `HandleBackgroundNotification` (described in more detail below).
2. Remote Notification received while app is in foreground. Handled by listeners from react-native-notifications https://github.com/wix/react-native-notifications.
3. iOS notifications are sent with custom payload sound, with appropriate asset on iOS side. ``Note:`` As they are normal (not alert - this requires additional allowance by Apple) types of notifications, the sound might be silenced by user by disabling sound in iOS.

...and one way to turn the alarm off:
Sounds which use Alert.service can be dismissed by calling resetAllSounds method, iOS background notification is asset based , only by opening app from notification we can dismiss sound

1. After selecting the "are you ok" notification, the user can turn off the alarm by selecting the "I'm OK" (actual caption may be different) button.

## Project structure

1. **assets** *icon components and static images*
2. **components** *shared components*
3. **constants** *self-explanatory*
4. **hooks** *self-explanatory*"
5. **i18n** *localization*
6. **models** *types*
7. **navigators** *stacks and navigator components*
8. **providers** *AuthListeners / NotificationListeners / and other providers : SafeArea / PersistGate / Native Base UI provider*
9. **redux** *redux toolkit store*
10. **screens** *screens with related components*
11. **services** *all services pointed out in [Services](#services) section*
12. **theme** *theme for native-base*
13. **utils** *self-explanatory*

### Tooling / Providers

3rd party services:
- Firebase - Cloud messaging / Crashlytics https://rnfirebase.io/  
- AWS/ Cognito - user auth service https://github.com/aws-amplify/amplify-js  

### Headless JS (Android only)

In the `index.js` file in the root folder there are a few entry points for Headless JS tasks:

```typescript
if (!isIOS) {
  BackgroundFetch.registerHeadlessTask(mainScheduledEvent());
  messaging().setBackgroundMessageHandler(HandleBackgroundNotification);
}
```

1. `mainScheduledEvent` is a function that is called in the background. It's located in the Background.service (described in more detail in the Services section).
2. `messaging` class registration for handling background notifications with appropriate actions (mainly for starting Alerts)

### Navigation and tools

Root navigation structure is based in `src/navigators/index.tsx` and looks like this (simplified version):

```typescript jsx
<NavigationContainer>
  {isReady && (
    <>
      <NotificationListener />
      <CancelEmergencyPopup />
    </>
  )}
  <Stack.Navigator>
    {isLogged ? (
      <>
      <Stack.Screen name="MainStack" />
      <Stack.Screen name="HealthConditionError" />
      </>
    ) : (
      <Stack.Screen name="AuthStack" />
    )}
    <Stack.Screen name="LostConnection" />
  </Stack.Navigator>
  <Toast />
  {loadingInitData && <Loader />}
</NavigationContainer>
```

1. On the top we are keeping the tools: NotificationListener and CancelEmergencyPopup. Those are special components that we use to handle different events while the app is running.
2. The main part consists of two stacks: AuthStack and MainStack. AuthStack is used when the user is not logged in, MainStack is used when the user is logged in.
3. Also, we are keeping two special screens here: LostConnection and HealthConditionError. Those are used to handle the app being offline and to display the "Are you ok?" popup. HealthConditionError is just for loggedIn user.
4. At the bottom we are keeping the Toast component. It is used to display the toast messages.

### State management

We use Redux Toolkit to manage the state of the app. The state is stored in the `src/redux/store` folder.

The state is persisted with some slices being kept in the secure `react-native-encrypted-storage` library EncryptedStorage.

## Services

The app uses a few special services to handle complicated tasks. The services are kept in the `src/services` folder.

1. **AsyncStorage.service**  
   A wrapper for the AsyncStorage library, mainly for logging purposes and keeping current app state ( IsEmergencyEscalationStarted flag ) and for iOS usage to get proper app state while app is killed / in background
2. **Date.service**  
   Tool for managing different time-related tasks.
3. **TimeSlot.service**  
   Tool for managing time slots, a feature in Biostasis.
4. **Amazon.service**  
   Shortcuts for authentication with Amazon.
5. **API.service**  
   All API endpoints are kept in this service.
6. **Background.service**  
   A service for handling the background tasks. Described below in more detail.
7. **GoogleFit.service**  
   A service for handling the Google Fit data (Android only).
8. **Location.service**  
   A service for handling the location data.
9. **Logger.service**  
   A logger mechanism for the app. Stores logs in AsyncStorage and lets testers share them with the developer.
10. **Notification.service**  
    Name may be misleading as this service is a shortcut for using the Toast component.
11. **Push.service**  
    For retrieving and saving the push token.
12. **Time.service**  
    Helper for calculating if the emergency service is in pause mode.
13. **Validation.service**  
    A service for validating the input data.
14. **Env.service**
    Facade for env variables
15. **Alert.service**
    Facade for sound alerts with additional stop , play , reset functionality

#### Background.service (Android only)

Let's look at the methods of the Background.service:

_Related to the foreground service:_

- **enableForegroundService()**  
  Enables the foreground service on Android, the tool that sits in notifications in the OS and lets us display output to the user even when the app is not in the foreground. _Important note: when the app uses the foreground service, it can run background tasks more frequently._
- **updateNotification()**  
  Tool for updating the foreground service notification.

_Related to React Native Background Fetch:_

- **startBackgroundFetch()**  
  Starts and configures the background fetch tool. We call this method from the `AutomatedEmergencySettingsScreen`. Then, we can run specific tasks in the background.
- **stopBackgroundFetch()**  
  Stops either background fetch or a specific task.
  - **scheduleTask()**  
    It's a generic tool for scheduling a task, not only retries. It's behaving like setTimeout, but for headless tasks.
- **mainScheduledEvent()**  
  This is the entry function for Background Fetch. It splits into specific tasks based on task ID. Here we also handle timeouts. It's invoked both in background and foreground. Please check Background Fetch documentation for more info on how the library works: https://github.com/transistorsoft/react-native-background-fetch.

_Handlers for specific background tasks:_

- **emergencyRetry()**  
  Handles the retry of the emergency service. If success, it will stop the retry. If not, it will schedule another retry.
- **pulseCheck()**  
  This is the default task that runs in the background when user has the pulse-based trigger turned on. It checks if the pulse is ok. If it's ok, it will send the "positive info" to the server.
- **soundNotification()**  
  This task is responsible for playing the alarm, while using background task we need to schedule this with low delay.

_Entry point for the headless task triggered by a remote notification:_

- **HandleBackgroundNotification()**  
  This is the entry point for the headless task triggered by a remote notification. It's scheduling the alarm for `EMERGENCY_ALERT` type push notification . With that payload type BackgroundEventsEnum.AlarmBeforeEmergence task  is scheduled. Also this handler can set proper flag for `IsEmergencyEscalationStarted` async storage value (this value is responsible for proper app state), for proper navigation while opening Biostasis not from push notification

## Native Manager (iOS)
Since react native currently doesn't support running in "Headless mode" (Without any part of application to be seen, background mode) on iOS, additional native manager has been proposed to handle part of tasks, that are done in background only.

Native manager is responsible for data collection of user pulse and location and then updating backend with it.

#### Singleton
Native manager is singleton, this pattern fixes problem of react creating this class multiple times per app lifecycle.

#### Properties
Native manager contains multiple class properties, which are responsible for different functionalities. Manager is responsible for communication between sub-modules.

1. **HealthKitManager**
Responsible for communication with health kit framework. It's main purpose is to show request for healthKit authorization to user, and start/stop observer queues for Pulse data. It also Parses data received from system observer queue via `HealthKitDataHandler` class. If Data is positive (In our case, just exist) it delegates this information to `NativeManager`.
2. **NotificationManager**
Responsible for showing user local (Not sent by server) notifications. It's purpose depends on environment. In Debug environment, `NativeManager` uses it for debug notifications (Positive info sent, location updated etc). On Production environment, it is only used to show user notification about lack of internet connection, when updating positive information has failed due to it.
3. **NetworkManager**
Used by `NativeManager` to send pulse, location to backend. Also is used to refresh auth-token required by cognito for authorization purposes if this token has expired.
4. **StorageManager**
Used by `NativeManager` to read values of react storage. This allows `NativeManager` to determine if user has turned automatic emergency on, and also allows to read auth-token for cognito.
5. **LocationManager**
Responsible for communication with location framework. It's main purpose is to request for location authorization to user, and then start/stop observer for location updates. It delegates this information to `NativeManager`.

#### Lifecycle
1. Start with start of application
2. use `determineAndSetDataCollectionStatus()` to determine if collection queues should be turned on or off.
3. Stay in memory, wait for update from `HealthKitManager`, `LocationManager`, or function `updateDataCollectionStatus()` being called from react.

  ##### update from `HealthKitManager`, `LocationManager`:
  When such updates happen, `NativeManager` uses either `sendPositiveUpdateToServer` or `updateLocation` methods from `NetworkManager` to update server with this data.
  ##### updateDataCollectionStatus() call from react:
  When react uses this method, `NativeManager` first waits 2.5 seconds, for internal async storage to update it's values, then uses `determineAndSetDataCollectionStatus()` to set queues on or off depending on new values.

### Setup wearables

iOS and Apple Watch:

1. Set up the Apple Watch.

Android:

We need a device that has a companion app capable to connect to Google Fit and working in the background. Not every device has this capability. Example with Mi Band 5/6:

1. Install the Zepp Life (formerly Mi Band) app on your Android device.
2. Open the Zepp Life app and click on the "Connect" button.
3. Set up the band connection in the default way.
4. Connect the Zepp Life app to your Google Fit account.
5. Enable background modes in the Zepp Life app.
6. Open Zepp Life Settings and then enable "Show status in the notification bar".
7. Go back to Biostasis app.
8. Enable Automated Emergency in the Biostasis app.
9. Enable the pulse-based trigger (is selected by default).
10. Enable the Google Fit switch and pair the BioStasis app with your Google Fit account, the same as you used in the step 4.
11. Enable the other switches ("Background modes" from step 4 and "Connect app to Google Fit" from step 4).
12. You should see "System is ON" and a status in the notification bar.

### Current packages versions

    "@react-native-async-storage/async-storage": "^1.15.5",
    "@react-native-community/datetimepicker": "^3.5.2",
    "@react-native-community/netinfo": "6.0.0",
    "@react-native-firebase/app": "14.7.0",
    "@react-native-firebase/crashlytics": "14.7.0",
    "@react-native-firebase/messaging": "14.7.0",
    "@react-native-picker/picker": "^1.16.3",
    "@react-navigation/drawer": "^6.4.1",
    "@react-navigation/native": "^6.0.10",
    "@react-navigation/stack": "^6.2.1",
    "@reduxjs/toolkit": "1.8.0",
    "@types/uuid": "^8.3.1",
    "@voximplant/react-native-foreground-service": "3.0.1",
    "amazon-cognito-identity-js": "^5.0.4",
    "aws-amplify": "4.3.24",
    "axios": "^0.21.1",
    "dayjs": "^1.10.6",
    "formik": "^2.2.9",
    "i18next": "^20.3.2",
    "native-base": "3.0.3",
    "patch-package": "^6.4.7",
    "postinstall-postinstall": "^2.1.0",
    "react": "17.0.2",
    "react-i18next": "^11.11.1",
    "react-native": "0.67.2",
    "react-native-background-fetch": "^4.0.3",
    "react-native-config": "^1.4.6",
    "react-native-device-info": "^8.3.3",
    "react-native-device-time-format": "^2.3.0",
    "react-native-document-picker": "^6.0.4",
    "react-native-encrypted-storage": "^4.0.2",
    "react-native-fs": "^2.18.0",
    "react-native-geolocation-service": "^5.3.0-beta.1",
    "react-native-gesture-handler": "^1.10.3",
    "react-native-get-random-values": "^1.7.0",
    "react-native-google-fit": "^0.18.3",
    "react-native-inappbrowser-reborn": "^3.6.3",
    "react-native-linear-gradient": "^2.5.6",
    "react-native-mask-text": "^0.2.2",
    "react-native-modal-datetime-picker": "^10.2.0",
    "react-native-notifications": "4.3.1",
    "react-native-paper": "^4.9.2",
    "react-native-permissions": "^3.0.5",
    "react-native-phone-input": "^1.0.10",
    "react-native-reanimated": "2.4.1",
    "react-native-safe-area-context": "^3.3.0",
    "react-native-screens": "3.5.0",
    "react-native-share": "^7.2.0",
    "react-native-sound": "^0.11.2",
    "react-native-splash-screen": "^3.2.0",
    "react-native-svg": "^12.1.1",
    "react-native-svg-charts": "^5.4.0",
    "react-native-swipe-list-view": "^3.2.9",
    "react-native-swiper": "^1.6.0",
    "react-native-toast-message": "^1.4.9",
    "react-native-vector-icons": "^8.1.0",
    "react-phone-number-input": "^3.1.26",
    "react-redux": "^7.2.4",
    "redux-persist": "^6.0.0",
    "styled-components": "^5.3.0",
    "styled-system": "^5.1.5",
    "use-between": "^0.0.18",
    "use-countdown-timer": "^1.3.1",
    "uuid": "^8.3.2",
    "yup": "^0.32.9"
