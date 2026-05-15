const translations = {
  appName: 'Biostasis',
  bottomTab: {
    home: 'Home',
    profile: 'Profile',
    activate: 'ACTIVATE',
    emergency: 'EMERGENCY',
    activateA11y: 'Activate emergency',
  },
  dashboardHome: {
    banner: {
      active: 'System active · Monitoring',
      noContacts: 'No emergency contacts',
      systemOff: 'Emergency system off',
    },
    greeting: {
      morning: 'Good morning,',
      afternoon: 'Good afternoon,',
      evening: 'Good evening,',
    },
    collectedAt: 'The data was collected at: {{time}}',
    collectedAtNone: 'No health data collected yet',
    sectionEmergencySystem: 'Emergency system',
    metrics: {
      heartRate: 'Heart rate',
      steps: 'Steps',
      noData: 'No data yet',
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      normal: 'Normal',
      today: 'today',
    },
    cards: {
      emergencySystem: {
        title: 'Emergency System',
        active: 'Active · Receiving data',
        inactive: 'Inactive · Tap to enable',
      },
      healthLogs: {
        title: 'Health Logs',
        subtitle: 'Health logs and history logs',
      },
      manageSettings: {
        title: 'Manage Settings',
        subtitle: 'Emergency contacts & triggers',
        subtitleEmpty: 'Add emergency contacts',
      },
      emergencySetup: {
        title: 'Emergency Setup',
        done: 'Configuration complete',
        todo: 'Finish setting up your emergency system',
        badgeDone: 'Done',
        badgeTodo: 'Set up',
      },
    },
  },
  emergencyConfirm: {
    title: 'You are about to trigger emergency!',
    description:
      'By holding the button for 3 seconds, you will trigger an emergency. Here is what will happen:',
    step1: 'Your emergency contacts will be notified',
    step2:
      'They will reach out to you and the cryopreservation team to coordinate the emergency response',
    hold: 'HOLD TO TRIGGER EMERGENCY',
  },
  profileHub: {
    title: 'Profile',
    userData: 'Profile & User Data',
    accountSettings: 'Account Settings',
    medicalInfo: 'Medical Information',
    currentHealthLog: 'Current Health Log',
    historyLogs: 'History Logs',
  },
  profileUserData: {
    title: 'Profile & User Data',
    save: 'Save changes',
  },
  accountSettingsScreen: {
    title: 'Account Settings',
    notificationsSub: 'Emergency alerts & updates',
    tipsTitle: 'Tips & Tricks',
    tipsSub: 'Monthly wellness reminders',
    gdprTitle: 'Request My Data (GDPR)',
    gdprSub: 'Receive a full copy of your data',
    dangerZone: 'Danger Zone',
    deleteAction: 'Delete account',
  },
  medicalInfoScreen: {
    title: 'Medical Information',
    intro:
      'Your physician details are included in emergency notifications sent to your contacts.',
    physicianName: 'Physician Name',
    physicianNamePlaceholder: 'Dr. Full Name',
    physicianAddress: 'Physician Address',
    physicianAddressPlaceholder: 'Street, City, Country',
    medicalHistory: 'Medical History',
    seriousQuestion: 'Any serious medical conditions?',
    seriousHint: 'Toggle on to add details',
    diagnosis: 'What was your most recent diagnosis?',
    diagnosisPlaceholder: 'Write your diagnosis here',
    lastVisit: 'Date of last hospital visit?',
  },
  currentHealthLog: {
    title: 'Current Health Log',
    emptyTitle: 'No health data connected',
    emptySubtitle: 'Connect a wearable to start tracking',
    heartRate: 'Heart Rate',
    restingHeartRate: 'Resting Heart Rate',
    restingHr: 'Resting HR',
    steps: 'Steps',
    totalSteps: 'Total Steps',
    today: 'today',
    session: 'session',
    hrEndDate: 'HR End Date',
    restingHrEndDate: 'Resting HR End Date',
    stepsEndDate: 'Steps End Date',
    viewHistory: 'View History Logs',
  },
  historyLogs: {
    title: 'History Logs',
    entry: 'Entry #{{index}}',
    hrEndDate: 'Heart rate end date',
    stepsEndDate: 'Steps end date',
    restingHrEndDate: 'Resting heart end date',
    empty: 'No history logs yet.',
  },
  settings: {
    title: 'Settings',
    emergencyContact: 'Emergency Contact Settings',
    emergencySystem: 'Emergency System Settings',
    tomorrowBio: 'Sign up with Tomorrow Bio',
    termsOfService: 'Terms of Service',
    privacyStatements: 'Privacy Statements',
    logOut: 'Log out',
    termsUrl: 'https://tomorrowbiostasis.com/terms-conditions/',
    privacyUrl: 'https://tomorrowbiostasis.com/privacy/',
  },
  onboarding: {
    next: 'Next',
    getStarted: 'Get Started',
    skipIntro: 'Skip intro',
    slide1: {
      badge: 'BIOSTASIS SECURITY',
      title: 'Your emergency, our priority.',
      body: 'If you ever need cryopreservation care, this app ensures the right people are notified instantly — leading to faster standby response.',
    },
    slide2: {
      badge: 'EMERGENCY ALERTS',
      title: 'Build your notification network.',
      body: 'Add emergency contacts, set custom messages, upload documents, and configure automated triggers — all in one place.',
    },
    slide3: {
      badge: 'RAPID RESPONSE',
      title: 'Advanced care, ready when it matters.',
      body: 'Biostasis connects you with trained emergency response teams for faster, more coordinated cryopreservation support.',
    },
  },
  welcome: {
    eyebrow: 'BIOSTASIS',
    title: 'Emergency care, at your fingertips.',
    tagline:
      'Instant alerts. Automated systems. Peace of mind for when it counts most.',
    createAccount: 'Create an account',
    logIn: 'Log in',
    termsPrefix: 'By continuing you agree to our',
    terms: 'Terms of Service',
    and: '&',
    privacy: 'Privacy Policy',
  },
  common: {
    or: 'or',
    and: 'and',
    continue: 'Continue',
    save: 'Save',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    welcome: 'Welcome {{username}}',
    setUp: 'Set up',
    message: 'Message',
    logOut: 'Log out',
    submit: 'Submit',
    ok: 'OK',
    retry: 'Retry',
    yes: 'Yes',
    no: 'No',
    refresh: 'Refresh',
    fine: "I'm Fine",
    startEmergency: 'Start Emergency',
    setUpPauseTimes: 'Set-Up Pause Times',
    error: 'We have some problems with our service',
    errorNetwork: 'Probably you are offline, please reconnect.',
  },
  headers: {
    welcome: 'Welcome',
    welcomeUsername: 'Welcome,\n{{username}}',
  },
  drawer: {
    logOut: 'Log Out',
    dashboard: 'Home',
    profile: 'Profile',
    accountSettings: 'Account Settings',
    automatedEmergency: 'Emergency System Settings',
    termsLabel: 'Terms of Service',
    termsUrl: 'https://tomorrowbiostasis.com/terms-conditions/',
    privacyLabel: 'Privacy Statements',
    privacyUrl: 'https://tomorrowbiostasis.com/privacy/',
    uploadDocuments: 'Upload Documents',
    AddNewEmergencyContact: 'Add Emergency Contact',
    debugInfo: 'Debug Info',
    emergencyContactSettings: 'Emergency Contact Settings',
    pauseTimes: 'Pause Emergency System',
    signUpForCryopreservation: 'Sign Up with Tomorrow Bio',
    devLogs: 'Current Health Log',
    devHistoryLogs: 'Dev History Logs',
    devPushLogs: 'Dev Push Logs',
  },
  signUpForTomorrow: {
    title: 'Sign up with Tomorrow Bio',
    signUpUrl: 'https://tomorrowbiostasis.com/signup/',
    internetError: {
      title: 'No internet connection',
      description: 'This page require internet connection!',
    },
  },
  socialMediaUrls: {
    website: 'https://www.tomorrow.bio/',
    twitter: 'https://twitter.com/tomorrowbio',
    instagram: 'https://www.instagram.com/tomorrowbio/',
    youtube: 'https://www.youtube.com/channel/UCO-RhsVpguwTJuntw_US0Mw',
  },
  user: {
    updatedSuccessfully: 'Your data has been updated successfully',
  },
  LogIn: {
    apple: 'Log in with Apple',
    google: 'Log in with Google',
    LogIn: 'Log In',
    emailTitleLogIn: 'Log in with your email:',
    emailTitleSignUp: 'Sign up with your email:',
  },
  signUp: {
    apple: 'Sign up with Apple',
    google: 'Sign up with Google',
    signUp: 'Sign up',
    createAccount: 'Create a new Account',
    steps: {
      eyebrow: 'STEP {{current}} OF {{total}}',
    },
    common: {
      next: 'Next',
    },
  },
  signOut: {
    disabledAutomatedEmergencyContinue: 'Do you want to continue?',
    disabledAutomatedEmergency:
      'Automated emergency will be turned off after you log out!',
  },
  termsAgree: {
    agreeToThe: 'I agree to the',
    terms: 'Terms',
    privacyPolicy: 'Privacy Policy',
  },
  forgotPassword: {
    screenName: 'Forgot Password',
    title: 'Forgot your Password?',
    doNotRememberPassword: "Don't remember your password?",
    enterEmail:
      'Please enter your email address. We will send you an email to reset your password.',
    enterNewPasswordForEmail: 'Enter a new password',
    emailSent:
      "We've just sent you an email to reset your password. Check your inbox and open the link on a mobile device with the Biostasis app installed.",
    passwordChanged: 'Password updated. Please sign in.',
    resetLinkExpired: 'Password reset link expired.\nPlease try again.',
    newPassword: 'New Password',
    warning:
      'Ensure that you already have an account registered using your custom email. Note that registrations made through Apple and Google will not be functional.',
    subtitle: "We'll send a reset link to your email.",
    newPasswordTitle: 'Create new password',
    newPasswordSubtitle: 'Choose a strong password for your account.',
    confirmPasswordLabel: 'Confirm password',
  },
  placeholder: {
    password: 'your password',
    newPassword: 'your new password',
    confirmNewPassword: 'confirm your new password',
    email: 'yours@example.com',
  },
  auth: {
    welcomeTo: 'Welcome to Biostasis',
    accountWasCreated:
      'Your account has been created. To activate it, check your inbox and open the link on a mobile device with the Biostasis app installed.',
    invalidCredentials: 'Incorrect username or password',
    linkExpired: 'Link has expired. Please try again',
    accountActivated: 'Your account has been activated. You can now sign in.',
  },
  authScreen: {
    tabSignIn: 'Log in',
    tabSignUp: 'Sign up',
    appleCta: 'Continue with Apple',
    googleCta: 'Continue with Google',
    emailLabel: 'Email address',
    emailPlaceholder: 'yours@example.com',
    passwordLabel: 'Password',
    termsAgree: 'I agree to the',
    terms: 'Terms of Service',
    signIn: {
      title: 'Welcome back.',
      subtitle: 'Log in to your Biostasis account.',
      cta: 'Log in',
      dividerLabel: 'or log in with email',
      passwordPlaceholder: 'Your password',
      forgotPassword: 'Forgot password?',
    },
    signUp: {
      title: 'Create account',
      subtitle: 'Join Biostasis to manage your emergency preparedness.',
      cta: 'Create account',
      dividerLabel: 'or sign up with email',
      passwordPlaceholder: 'Create a password',
    },
  },
  defaultError: 'The operation was unsuccessful',
  validation: {
    fieldRequired: 'This field is required',
    invalidEmail: 'Invalid email address',
    email: {
      invalid: 'Invalid email address',
      accountAlreadyExist: 'An account with the given email already exists',
    },
    password: {
      tooShort: 'Password is too short',
      whiteSpace: 'Password cannot contain white space',
      minLength: 'Password must contain at least 8 characters',
    },
    userName: {
      minLength: 'Name must contain at least 2 characters',
      maxLength: 'Name cannot be longer than 50 characters',
      restrictions: 'Name can contain letters, hyphens and spaces only',
    },
    emergencySettings: {
      minMaxLength: 'Text should be 10-1000 characters long',
    },
    number: {
      incorrectFormat:
        'The phone number is not correct. Please enter a valid number and try again',
    },
  },
  userName: {
    title: "What's your full name?",
    subtitle:
      'This appears in emergency notifications sent to your contacts.',
    firstName: 'First name',
    lastName: 'Last name',
    firstNamePlaceholder: 'e.g. Petar',
    lastNamePlaceholder: 'e.g. Petrov',
  },
  userPhone: {
    title: 'What is your phone number?',
    combinedTitle: 'Phone & birthday',
    combinedSubtitle: 'Used for account security and age verification.',
    phoneNumber: 'Phone number',
    invalidPhoneNumber: 'Invalid phone number',
  },
  selectAction: {
    whatToDo: 'What would you\nlike to do?',
    signUpForTheCryopreservation: {
      title: 'I want to sign up for a cryopreservation contract',
      description:
        'Sign up for the cryopreservation contact in just 15 minutes and completely online and set up emergency alert',
    },
    storeCryopreservationContract: {
      title: 'I already a cryopreservation contract and want to add it',
      description:
        'Store your cryopreservation contract and Advanced Directives in one safe place and set up emergency contacts',
    },
    useAppForEmergencyManagement: {
      title: 'I just want to use the app for emergency management',
      description:
        'Set up contacts that should be notified in case of medical emergency and prepare all the documents they might need',
    },
  },
  userDateOfBirth: {
    title: 'What is your date of birth?',
    invalidDate: 'Invalid date',
    invalidUserAge: 'You need to be at least 18 year old',
    selectDate: 'Select date',
    label: 'Date of birth',
    placeholder: 'dd/mm/yy',
  },
  setupComplete: {
    welcome: 'Welcome',
    title: 'Setup complete',
  },
  userAddress: {
    title: 'Your home address',
    subtitle: 'Used when emergency teams need to locate you quickly.',
    street: 'Street',
    city: 'City',
    country: 'Country',
    zipCode: 'ZIP',
    currentLocation: 'Use my current location',
    wrongAddress: 'Wrong Address, Please make sure to enter existing address',
  },
  emergencyContactsSettings: {
    title: 'Emergency Contacts',
    emergencyList: 'Emergency Contact List',
    emergencyAndSettings: 'Emergency Contacts\nand Settings',
    makeSureToTestEmergencyContact:
      'Test your emergency trigger with each contact so they know how it works.',
    AddNewEmergencyContact: 'Add Emergency Contact',
    emergencyButtonSettings: 'Emergency Message Settings',
    yourContacts: 'Your Contacts',
    includeWithMessage: 'Include with message',
    emergencyMessageLabel: 'Emergency Message',
    emergencyMessageHelper:
      'This message is emailed and texted to all contacts when your emergency triggers.',
    saveChanges: 'Save changes',
    sendTestMessage: 'Send test message',
    addNewEdit: {
      title: 'Contact Information:',
      firstName: 'First Name (Emergency Contact)',
      lastName: 'Last Name (Emergency Contact)',
      email: 'Email (Emergency Contact)',
      phoneNumber: 'Phone Number (Emergency Contact)',
      errorDuringUpdate:
        'There is a problem with the data in the form. Please check the correctness of the data and save it again.',
      activateContact: 'Contact has been activated successfully',
      deactivateContact: 'Contact has been deactivated successfully',
      errorActivate: 'Could not activate contact',
      addContact: 'Contact has been added successfully',
      errorAddContact: 'Could not add the new contact',
      updateContact: 'Contact has been updated successfully',
      errorUpdateContact: 'Something went wrong. Could not update contact',
      deleteContact: 'Contact has been deleted successfully',
      errorDeleteContact: 'Something went wrong. Could not delete contact',
      alert: {
        title: 'Delete Contact',
        description: 'Are you sure you want to delete this contact?',
      },
    },
    explanations: {
      description1:
        'Here you can set up the emergency contacts who will be notified in case of an emergency. You can configure what information should be sent in case of an emergency, including text/email messages, location, and documents.',
      description2:
        'You can always edit the list of emergency contacts and what type of information/notification they should receive.',
    },
    settings: {
      disclaimer:
        'An email and text message will be send to all emergency contacts when an emergency is triggered',
      sendEmailAndTextMessage: 'Send email and text message',
      includeInfo: 'Include this info:',
      location: 'Location',
      uploadedDocuments: 'Uploaded Documents',
      sendTestEmail: 'Send Me a Test Email',
      defaultMessage:
        'This is an emergency signal from {{username}}. You are receiving this message because I may be in need of a cryopreservation Additional information here and attached.',
      testMessageSent: 'Test email sent. Please check your inbox.',
    },
    documents: {
      title: 'Documents',
      topInfo: 'Sent automatically to all contacts when emergency is triggered.',
      tapToUpload: 'Tap to upload',
      addDocument: 'Add document',
      headers: {
        directive: 'Medical directive',
        lastWill: 'Last will',
        other: 'Other document',
      },
      upload: {
        directive: 'Upload medical directive',
        lastWill: 'Upload last will',
        other: 'Upload other document',
      },
      messages: {
        errors: {
          upload: 'Error during upload: {{error}}',
          fileWrongType: 'The file is corrupted or in the wrong format',
          fetching: 'Error during fetching documents: {{error}}',
          remove: 'Error during deleting document: {{error}}',
        },
        success: {
          upload: 'The document was saved successfully',
          remove: 'The document was successfully deleted',
        },
        uploadStarted: 'File upload started',
      },
      alert: {
        title: 'Delete Document',
        description: 'Are you sure you want to delete this document?',
      },
    },
    confirmationModal: {
      title: 'Confirm deletion. Are you sure?',
    },
    automatedEmergencySettings: {
      title: 'Emergency Settings',
      enableSystemTitle: 'Automated Emergency Settings',
      compatibleSmartDeviceConnected: 'Compatible smartdevice connected',
      confirmReadManual: 'I understand how it works',
      howItWorks: {
        title: 'How it works',
        step1Title: 'Connect',
        step1Desc:
          'Pair your wearable or use your phone\'s built-in sensors (steps, heart rate).',
        step2Title: 'Monitor',
        step2Desc:
          'The app checks your health data regularly. If no signal is detected, you\'ll get a warning notification first.',
        step3Title: 'Emergency',
        step3Desc:
          'If there\'s still no response, the system triggers an alert to your emergency contacts.',
      },
      enableAutomatedEmergency: 'Enable automated emergency',
      setUpSmartDevice: 'Set up Smart device',
      connectedSmartDevice: 'Connected with {{device}}',
      pauseAutomatedEmergency: 'Pause Automated Emergency',
      setUpSpecificTimes: 'Set up specific times {{specificTimes}}',
      automatedEmergencyDisabledFor:
        'Automated emergency is disabled for {{pauseTime}}',
      cancelEmergencyPause: 'Cancel automated emergency pause',
      youStillHavePause:
        'Pause is still active. Remember that if you enable automated emergency, it will be paused for {{pauseTime}}',
      frequencySet: 'Frequency set successfully to',
      bioTrigger: {
        title: 'Bio-based trigger',
        permissions: {
          title: 'Give Health permissions',
          alertTitle: 'Health Permissions',
          alertDescription:
            'You will be prompted to allow Biostasis to access your health data. Please confirm.',
        },
        turnOn: 'Bio-based',
        warning: 'Turning on bio-based will disable the time-based trigger!',
        appleWatch: {
          title: 'Wearable Device Connected',
          description:
            "We use your wearable device (thanks to HealthKit integration) to retrieve your health data. If you don't use one, please choose the time-based trigger system instead.",
          alertTitle: 'Pair Wearable Device',
          alertDescription:
            "Your wearable device should be paired with your iPhone in order to sync your health data. Please make sure it's properly paired. If not, follow the instructions in the device's companion app.",
        },
        googleFit: {
          title: 'Authenticate Google Fit',
          description:
            'We use Google Fit to retrieve your health data. Please authenticate and configure the device companion app. Some devices are not able to sync to Google Fit. Please choose the time-based trigger system in such case.',
          connect: 'Connect app to Google Fit',
          alertTitle1: 'Authenticate',
          alertDescription1:
            "Please authenticate Google Fit to let Biostasis access your recorder health data. If you don't have the Google Fit app installed, please install it from Google Play first.",
          alertTitle2: 'Add Google Fit',
          alertDescription2:
            'Please open the Preferences section in your watch / fitness band companion app. Then find a section saying Add Accounts or similar. Choose Google Fit and then pass the authorization process.',
        },
        backgroundModes: {
          title: 'Enable background modes',
          alertTitle: 'Enable background modes',
          alertDescription:
            'Please open the Preferences section in your watch / fitness band companion app. Then find a section saying Permissions or similar. Find Background Modes and enable it.',
        },
        frequency: 'Emergency Trigger Time-frame:',
      },
      systemOff: 'System is off',
      systemOn: 'System is on',
      systemOffMessage: 'Automated Emergency System turned off successfully',
      timeTrigger: {
        title: 'Time-based trigger',
        description:
          "We will send notifications every chosen amount of time. If you don't respond to one of them, the emergency system will be triggered. Your sleep schedule hours are automatically excluded.",
        frequency: 'Emergency Trigger Time-frame:',
        systemStart: 'Time-based automated system is running',
        turnOn: 'Time-based',
        warning: 'Turning on time-based will disable the bio-based trigger!',
      },
      pauseTime: {
        title: 'Set-up System Pause Times',
        description:
          'Stop the emergency system from triggering for recurring or temporary time frames.',
      },
      sleepSchedule: {
        title: 'Sleep Schedule',
        description:
          'Automatically pause the emergency system during your usual sleep hours to prevent false alarms.',
        enableSchedule: 'Enable sleep schedule',
        bedtime: 'Bedtime',
        wakeTime: 'Wake time',
        sleepWindow: 'System pauses nightly from {{bedtime}} to {{wakeTime}}',
      },
      sleepScheduleSheet: {
        title: 'Set up your sleep schedule',
        description:
          'The emergency system needs to know when you sleep so it doesn\u2019t trigger false alarms during the night.',
        hint: 'Tap a time to adjust it',
        save: 'Enable sleep schedule',
        skip: 'Skip for now',
      },
      smartDetection: {
        title: 'Smart Sleep Detection',
        description:
          'Automatically detect when you are sleeping using device signals to prevent false alarms.',
        enableDetection: 'Enable smart detection',
        useFocus: 'Use Focus / Do Not Disturb',
        useFocusDescription:
          'Pause emergency system when your phone is in Focus or Do Not Disturb mode.',
        useCharging: 'Use charging detection',
        useChargingDescription:
          'Treat nighttime charging as a sleep signal.',
        useHealthData: 'Use health data recency',
        useHealthDataDescription:
          'Detect when your ring or watch stops sending data as a sleep signal.',
        nighttimeWindow: 'Nighttime window',
        nighttimeWindowDescription:
          'Hours considered nighttime when no sleep schedule is set.',
        nighttimeFrom: 'From',
        nighttimeTo: 'To',
      },
      time: {
        hours: '{{count}} hours',
        hoursDefault: '{{count}} hours (default)',
        minutes: '{{count}} minutes',
        minutesDefault: '{{count}} minutes (default)',
        minutesDev: '{{count}} minutes (dev)',
      },
      interval: {
        title: 'Choose interval',
      },
      readLess: 'Read Less',
      readMore: 'Read More',
      seeAll: 'See all',
      collapse: 'Collapse',
    },
    dayTimePicker: {
      invalidDate: 'Invalid date',
      dateFormat24: 'Date should be in 24h format',
      dateFormat12: 'Date should be in 12h format',
    },
  },
  dashboard: {
    title: 'Medical Biostasis\nAt Your Fingertips',
    profile: {
      title: 'Profile & Medical Info',
      description:
        'Ensure that your vital information is always up to date and readily accessible.',
    },
    contacts: {
      title: 'Manage Emergency Settings',
      description:
        'Configure your emergency contacts and choose how they will be notified in case of emergencies.',
      notActive: 'Set up emergency contacts',
      active: 'Set up completed',
    },
    automatedEmergency: {
      title: 'Automated Emergency System',
      description:
        'Set up and activate automated emergency system to check on you using different emergency triggers',
      active: {
        bioTrigger: 'Bio-based trigger',
        timeTrigger: 'Time-based trigger',
      },
      notActive: 'Set up automated system',
      recommendationDaysLeft:
        'The recommendation system will analyze your health data and provide personalized recommendations every week. Your next recommendation is in {{daysLeft}} ',
      days: 'days',
      day: 'day',
      recommendationMessage:
        'Based on your health data we recommend you to pick {{recommendedPeriod}} hours as your Emergency Trigger Time-frame',
    },
    documents: {
      title: 'Documents',
      description:
        'Upload essential documents such as your last will and testament, patient advance directive, and more.',
    },
    signUpForCryopreservation: {
      tomorrowBio: {
        title: 'Sign Up with Tomorrow Bio',
        description: 'European Provider with strong SST infrastructure',
        footer: 'Learn more & sign up',
      },
      alcor: {
        title: 'Sign up with Alcor',
        description: 'Provider in the US with long-term track record',
        footer: 'Learn more',
      },
      cryonicsInstitute: {
        title: 'Sign up with Cryonics Institute',
        description: 'A member organization providing cryonics services',
      },
      southernCryonics: {
        title: 'Sign up with Southern Cryonics',
        description:
          'A non-profit organization operates Australia’s first cryonic storage facility',
      },
    },
    customizeMessage: {
      title: 'Customize Emergency Message',
      description:
        'Modify the message and email sent to your contacts during an emergency situation',
    },
    emergency: {
      countdown: 'EMERGENCY',
      countdownSent: 'EMERGENCY SENT',
      countdownRetrying: 'ALMOST THERE',
      countdownCanceled: 'EMERGENCY\nCANCELLED',
      countdownSubtitleHold: 'Hold to activate.',
      countdownSubtitleBeing: 'INFORMATION IS BEING SENT.',
      countdownSubtitleDone: 'ALL DONE',
      countdownSubtitleRetrying: 'WORKING...',
      setUpContacts: 'SET UP EMERGENCY CONTACT',
      cancel: 'Cancel',
      ok: 'OK',
      enableContacts: 'Enable emergency contacts',
      error: 'There was a problem our service. Please retry.',
      noContacts: 'You did not add any contacts',
    },
    sections: {
      userProfile: 'My Data',
      emergencySystem: 'Emergency System Settings',
      signUp: 'Sign up for Cryopreservation',
    },
  },
  location: {
    location: 'Location',
    locationPermissionDenied: 'Location permission denied',
    unableToOpenSettings: 'Unable to open settings',
    turnOnLocationFromSettings:
      'Turn on Location Services to allow "Biostasis" to determine your location.',
    goToSettings: 'Go to Settings',
    notEnoughsPermissions:
      'The Biostasis application requires constant location information. To allow the use of your location, go to location privacy settings and select "always"',
  },
  notifications: {
    goToSettings: 'Go to Settings',
    permissionsError:
      'The Biostasis feature requires  push notification permissions.',
  },
  time: {
    short: {
      m: 'min',
      h: 'h',
    },
    lessThanMinute: 'less than minute',
    m: '1 minute',
    mm: '{{m}} minutes',
    h: '1 hour{{secondPrecision}}',
    hh: '{{h}} hours{{secondPrecision}}',
    d: '1 day{{secondPrecision}}',
    dd: '{{d}} days{{secondPrecision}}',
  },
  specificTimesScreen: {
    title: 'Pause Emergency System',
    pauseNow: {
      title: 'Pause Emergency System',
      description:
        'Temporarily pause the automated emergency system until a specific time of your choice.',
      cancelMessage: 'Pause has been cancelled. The system is active again.',
      pauseConfirmed: 'System paused until {{time}}',
      startDisclaimer: 'Pause the system',
      systemPaused: 'System is paused',
      pausedUntil: 'The emergency system is paused until {{time}}.',
      cancelPause: 'Cancel pause',
    },
    specificTimes: {
      title: 'Set-up Specific Times',
      description:
        'Disable the automated system repeatedly during specific times of the week/days.',
      start: 'Start:',
      end: 'End:',
      addAdditionalTime: 'Add additional time',
      startSection: {
        pickDay: 'Pick start day(days)',
        pickTime: 'Set start time',
      },
      endSection: {
        pickDay: 'Pick end day(days)',
        pickTime: 'Set end time',
      },
      daysFullName: {
        everyday: 'Everyday',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
      },
      daysShortName: {
        everyday: 'Everyday',
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
      },
      changeSettings: 'Time settings changed successfully',
      active: 'Active',
      inactive: 'Inactive',
    },
  },
  profileDefault: {
    title: 'Profile & Medical Information',
    medicalInfo: {
      title: 'Medical Information',
      description:
        'Keeping your medical information updated can help improve the quality of your cryopreservation',
      footer: 'Edit medical info',
    },
    editProfile: {
      title: 'Profile & User Data',
      description:
        'You have the flexibility to update and modify your information at any time, ensuring accurate details are sent to your designated emergency contacts.',
      footer: 'Edit profile',
    },
    accountSettings: {
      title: 'Account Settings',
      description:
        'Manage and customize your account settings to ensure a personalized experience tailored to your preferences and needs.',
      footer: 'Change settings',
    },
  },
  accountSettings: {
    title: 'Account settings',
    allowNotifications: 'Allow Notifications',
    receiveTipsAndTricks: 'Receive Tips and Tricks',
    GDPR: {
      title: 'Request saved data (GDPR)',
      description:
        'Request a copy of your saved data in accordance with GDPR regulations to ensure the transparency and security of your information.',
      label:
        'Kindly provide the email address where you would like your data to be sent.',
      notification: 'Thanks! Your request was successfully submitted.',
      error: 'There was a problem with sending GDPR',
    },
    deleteAccount: {
      title: 'Delete My Account',
      description:
        'Permanently remove all of your data. This action cannot be reversed.',
      confirmMessage: 'Are you sure you want to delete your account?',
      successMessage: 'Account successfully deleted.\n You are logged out.',
    },
    notificationOff: 'Notification turned off successfully',
    notificationOn: 'Notification turned on successfully',
  },

  profileEdit: {
    title: 'Edit Profile',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phoneNumber: 'Phone number',
    dateOfBirth: 'Date of Birth',
    address: 'Full Address\n(Street, City, Country, Zip/Postal Code)',
  },
  profileMedicalInfo: {
    title: 'Edit / Add Medical Info',
    primaryPhysician: 'Name of your primary physician',
    primaryPhysicianAddress:
      'Full address of your primary physician (street, city, country)',
    switchLabel: 'Have you ever had any serious medical issues?',
    mostRecentDiagnosis: 'What was your most recent diagnosis?',
    lastHospitalVisit: 'Date of last hospital visit?',
  },
  lostConnection: {
    text1: 'No internet connection',
    text2: 'Please connect to the internet to avoid false emergency triggers.',
  },
  airplaneMode: {
    text1: 'Airplane mode is on',
    text2:
      'Please connect to the internet again and make sure to turn off the automated emergency system to avoid false emergency triggers.',
  },
  healthConditionError: {
    title: 'Automated Health Check',
    text0:
      "We've detected a health issue, because no health data has been sent.",
    text1:
      'The automated emergency system regularly monitors your well-being according to the frequency you have chosen.',
    text3: 'Are you OK?',
    startEmergency: 'No, Start emergency',
    success:
      'Positive signal indicates that you are still alive has been sent successfully.',
  },
  healthCheck: {
    title: 'Automated Health Check',
    message: 'Positive signal sent successfully ✅.',
  },
  confirmAlert: {
    title: 'Confirm action',
    text: 'Are you sure to confirm this action?',
  },
  warningFrequencyMessage: {
    android: {
      title: 'Warning ⚠️ ',
      description:
        'You may need to pause the system while you are asleep. Also, some smartwatches do not synchronize your health data directly, which may lead to false emergency triggers.\n\nAre you sure you want to continue?',
    },
    ios: {
      title: 'Warning ⚠️ ',
      description:
        'Some Smart watch does not Are you sure to confirm this action?',
    },
  },
  bioCheck: {
    messages: {
      unableToSendEmergency: 'Unable to send emergency',
      airPlaneOff: 'Please turn Airplane Mode OFF',
      networkError: 'Network error',
      checkConnection: 'Please check your internet connection',
      offline: 'You are offline',
      pleaseComeBackOnline:
        'Please check your internet connection to make sure you are still alive',
      connectToSendEmergency: 'Please connect to send emergency!',
      automatedEmergency: 'Automated Bio Check',
      infoSend: 'Positive health info sent',
      heartRate: 'Heart Rate: ',
      restingHeartRate: 'Resting Heart Rate: ',
      movement: {
        title: 'Movement: ',
        unit: 'steps',
      },
      noDataUnit: 'no-data',
      noData: '⚠️ No Data found, Please check your health data source',
      wearableSyncWarning: 'No recent health data received',
      wearableSyncWarningBody:
        'Please open your wearable app to sync your health data. If this persists, an emergency check will follow.',
      refresh: 'Refreshing your health data...',
      userSendSignal:
        'Positive signal sent successfully ✅. Make sure to check your health data source!',
    },
  },
  automatedEmergencyStatus: {
    start: {
      title: 'Automated Health Check',
      describe: 'The Biostasis Emergency App is checking your health data',
    },
    emergency: 'Starting Emergency Process...',
    restart: 'Automated emergency system restarted',
    failed:
      'Automated Health Check did not start! Please, Check your emergency settings.',
    stop: {
      title: 'Automated Health Check Stopped',
      describe:
        'The Biostasis Emergency App stopped due to emergency situation!',
    },
  },
  cryopreservationCompaniesUrls: {
    alcor: 'https://www.alcor.org/',
    cryonicsInstitute: 'https://cryonics.org/',
    southernCryonics: 'https://southerncryonics.com/',
  },
  languages: {
    title: 'Change Language:',
    english: 'English',
    spanish: 'Spanish',
    german: 'German',
    french: 'French',
    italian: 'Italian',
  },
  devLogs: {
    title: 'Current Health Log',
    description:
      'This screen is for developers to log and track issues. It is not intended for end-users.',
    logs: 'Logs',
    noLogs: 'No logs available',
    error: 'Error loading logs',
    retry: 'Retry loading logs',
  },
  devHistoryLogs: {
    title: 'Dev history logs',
    description:
      'This screen is for developers to log and track issues. It is not intended for end-users.',
    logs: 'Logs',
    noLogs: 'No logs available',
    error: 'Error loading logs',
    retry: 'Retry loading logs',
  },
  devPushLogs: {
    title: 'Dev push logs',
    description:
      'This screen is for developers to log and track push notification issues. It is not intended for end-users.',
    logs: 'Logs',
    noLogs: 'No logs available',
    error: 'Error loading logs',
    retry: 'Retry loading logs',
  },
};

export default translations;
