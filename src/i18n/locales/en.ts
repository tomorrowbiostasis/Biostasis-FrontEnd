const translations = {
  appName: 'Biostasis',
  onboarding: {
    title: 'Biostasis Emergency App',
    slogan: `Get the best${'\n'}medical biostasis possible`,
    slide1: {
      label: 'Easy to use Emergency Biostasis App',
      text: 'With this app others can be quickly notified if you are in need of cryopreservation, leading to faster standby response.',
    },
    slide2: {
      label: 'Set up your emergency notification system',
      text: 'Create emergency contacts, customize your emergency message, upload documents, configure an automated emergency system, and more.',
    },
  },
  common: {
    or: 'or',
    and: 'and',
    continue: 'Continue',
    save: 'Save',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    welcome: 'Welcome,\n{{username}}',
    setUp: 'Set up',
    message: 'Message',
    logOut: 'Log out',
    submit: 'Submit',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    error: 'We have some problems with our service',
    errorNetwork: 'Probably you are offline, please reconnect.',
  },
  headers: {
    welcome: 'Welcome',
    welcomeUsername: 'Welcome, {{username}}',
  },
  drawer: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    accountSettings: 'Account Settings',
    automatedEmergency: 'Automated Emergency Settings',
    termsLabel: 'Terms of Service',
    termsUrl: 'https://tomorrowbiostasis.com/terms-conditions/',
    privacyLabel: 'Privacy Statements',
    privacyUrl: 'https://tomorrowbiostasis.com/privacy/',
    signUpForCryopreservation: 'Sign up for Cryopreservation',
    signUpUrl: 'https://tomorrowbiostasis.com/signup/',
    debugInfo: 'Debug Info',
  },
  signIn: {
    apple: 'Sign in with Apple',
    google: 'Sign in with Google',
    signIn: 'Sign in',
  },
  signUp: {
    apple: 'Sign up with Apple',
    google: 'Sign up with Google',
    signUp: 'Sign up',
  },
  signOut: {
    disabledAutomatedEmergencyContinue: 'Do you want to continue?',
    disabledAutomatedEmergency: 'Automated emergency will be turned off',
  },
  termsAgree: {
    agreeToThe: 'I agree to the',
    terms: 'Terms',
    privacyPolicy: 'Privacy Policy',
  },
  forgotPassword: {
    dontRememberPassword: "Don't remember your password?",
    enterEmail:
      'Please enter your email address. We will send you an email to reset your password.',
    enterNewPasswordForEmail: 'Enter a new password for',
    emailSent:
      "We've just sent you an email to reset your password. Check your inbox and open the link on a mobile device with the Biostasis app installed.",
    passwordChanged: 'Password updated. Please sign in.',
    resetLinkExpired: 'Password reset link expired.\nPlease try again.',
    newPassword: 'New Password',
  },
  placeholder: {
    password: 'your password',
    newPassword: 'your new password',
    confirmNewPassword: 'confirm your new password',
    email: 'yours@example.com',
  },
  auth: {
    welcomeTo: `Welcome to${'\n'}BIOSTASIS`,
    accountWasCreated:
      'Your account has been created. To activate them, check your inbox and open the link on a mobile device with the Biostasis app installed.',
    invalidCredentials: 'Incorrect username or password',
    linkExpired: 'Link has expired. Please try again',
    accountActivated: 'Your account has been activated. You can now sign in.',
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
    title: 'What is your name?',
    firstName: 'First name',
    lastName: 'Last name',
  },
  userPhone: {
    title: 'What is your phone number?',
    phoneNumber: 'Phone number',
    invalidPhoneNumber: 'Invalid phone number',
  },
  selectAction: {
    whatToDo: 'What would you\nlike to do?',
    signUpForTheCryopreservation: {
      title: 'I want to sign up for a cryopreservation contract',
      description:
        'Sign up for the cryopreservation contact in just 15 minutes and completely online and set up emegrency alert',
    },
    storeCrypreservationContract: {
      title: 'I already a cryopreservation contract and want to add it',
      description:
        'Store your crypreservation contract and Advanced Directives in one safe place and set up emergency contacts',
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
  },
  userAddress: {
    title: 'What is your complete address including country?',
    yourAddress: 'Your Address',
    placeholder: 'Street address, ZIP code, city, country',
  },
  emergencyContacts: {
    emergencyAndSettings: 'Emergency Contacts\nand Settings',
    makeSureToTestEmergencyContact:
      'Make sure to test your emergency trigger with your new contact so they learn how it works.',
    addEmergencyContact: 'Add Emergency Contact',
    emergencyButtonSettings: 'Emergency Button Settings',
    addNewEdit: {
      title: 'Emergency Contact',
      firstName: 'First Name (Emergency Contact)',
      lastName: 'Last Name (Emergency Contact)',
      email: 'Email (Emergency Contact)',
      phoneNumber: 'Phone Number (Emergency Contact)',
      errorDuringUpdate:
        'There is a problem with the data in the form. Please check the correctness of the data and save it again.',
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
    confirmationModal: {
      title: 'Confirm deletion. Are you sure?',
    },
    automatedEmergencySettings: {
      title: 'Automated Emergency Settings',
      compatibleSmartDeviceConnected: 'Compatible smartdevice connected',
      pleaseReadManual:
        'Please read the Automated Emergency System Manual before activating the system',
      systemDescription:
        'This system wil automatically send an emergency signal based on a varity of data point from a smartdevice with pulse data.\nLearn more about how the system works in detail here:',
      manualDescription: 'Automated Emergency System Manual',
      confirmReadManual: 'I confirm that I read the manual',
      enableAutomatedEmergency: 'Enable automated emergency',
      setUpSmartDevice: 'Set up Smartdevice',
      connectedSmartDevice: 'Connected with {{device}}',
      pauseAutomatedEmergency: 'Pause Automated Emergency',
      setUpSpecificTimes: 'Set up specific times {{specificTimes}}',
      automatedEmergencyDisabledFor:
        'Automated emergency is disabled for {{pauseTime}}',
      cancelEmergencyPause: 'Cancel automated emergency pause',
      youStillHavePause:
        'Pause is still active. Remember that if you enable automated emergency, it will be paused for {{pauseTime}}',
      pulseTrigger: {
        title: 'Use pulse-based trigger',
        description:
          "We use your Apple Watch (thanks to HealthKit integration) to retrieve your pulse data. If you don't use one, please choose the time-based trigger system instead.",
        permissions: {
          title: 'Give Health permissions',
          alertTitle: 'Health Permissions',
          alertDescription:
            'You will be prompted to allow Biostasis to access your pulse data. Please confirm.',
        },
        appleWatch: {
          title: 'Apple Watch is paired',
          alertTitle: 'Pair Apple Watch',
          alertDescription:
            "Your Apple Watch should be paired with your iPhone in order to sync your pulse data. Please make sure it's properly paired. If not, follow the instructions in the Watch iOS app.",
        },
        googleFit: {
          title: 'Authenticate Google Fit',
          description:
            'We use Google Fit to retrieve your pulse data. Please authenticate and configure the device companion app. Some devices are not able to sync to Google Fit. Please choose the time-based trigger system in such case.',
          connect: 'Connect app to Google Fit',
          alertTitle: 'Add Google Fit',
          alertDescription:
            'Please open the Preferences section in your watch / fitness band companion app. Then find a section saying Add Accounts or similar. Choose Google Fit and then pass the authorization process.',
        },
        backgroundModes: {
          title: 'Enable background modes',
          alertTitle: 'Enable background modes',
          alertDescription:
            'Please open the Preferences section in your watch / fitness band companion app. Then find a section saying Permissions or similar. Find Background Modes and enable it.',
        },
      },
      timeTrigger: {
        title: 'Use time-based trigger',
        description:
          "We will send notifications every chosen amount of time. In case you don't respond to one of them, the emergency system will be triggered. Night (10pm - 6am) is excluded.",
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
      description: 'Keep important information up to date',
    },
    contacts: {
      title: 'Emergency Settings',
      description:
        'Set up emergency contacts and configure how they’re notified',
    },
    documents: {
      title: 'Documents',
      description: 'Upload your last will, patient advance directive, etc.',
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
  },
  profileDefault: {
    title: 'Profile & Medical Information',
    medicalInfo: 'Medical Information',
    editProfile: 'Edit profile',
    EditAddMedicalInfo: 'Edit / add medical information',
  },
  accountSettings: {
    title: 'Account settings',
    allowNotifications: 'Allow notifications',
    receiveTipsAndTricks: 'Receive tips and tricks',
    requestSavedData: 'Request saved data (GDPR)',
    deleteAccount: 'Delete account',
  },

  profileEdit: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phoneNumber: 'Phone number',
    dateOfBirth: 'Date of Birth',
    address: 'Full Address (Street, City, Country)',
  },
  profileMedicalInfo: {
    description:
      'Keeping your medical information updated can help improve the quality of your cryopreservation',
    primaryPhysician: 'Name of your primary physician',
    primaryPhysicianAddress:
      'Full address of your primary physician (street, city, country)',
    switchLabel: 'Have you ever had any serious medical issues?',
    mostRecentDiagnosis: 'Was was the most recent diagnosis?',
    lastHospitalVisit: 'Date of last hospital visit?',
  },
  gdpr: {
    title: 'Request Saved Data',
    label: 'Email my data here',
    notification: 'Thanks! Your request was successfully submitted.',
    error: 'There was a problem with sending GDPR',
  },
  documents: {
    title: 'Documents &\nAdvanced Information',
    topInfo:
      'These documents will be sent to your emergency contacts when you trigger an emergency ',
    addDocument: 'Add document',
    headers: {
      directive: 'Medical directive',
      lastWill: 'Last will',
      other: 'Other',
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
  },
  deleteAccount: {
    title: 'Delete Account',
    description: 'Delete all data.\nThis can not be undone.',
    successMessage: 'Account successfully deleted.\n You are logged out.',
  },
  lostConnection: {
    text1: 'You have lost your internet connection.',
    text2:
      'Please connect to the internet for the application to work properly.',
  },
  healthConditionError: {
    text0: 'Emergency triggered.',
    text1: 'We have detected health issues.',
    text2: 'Are you OK?',
    startEmergency: 'No, Start emergency',
  },
  confirmAlert: {
    title: 'Confirm action',
    text: 'Are you sure to confirm this action?',
  },
  pulseCheck: {
    messages: {
      unableToSendEmergency: 'Unable to send emergency',
      airPlaneOff: 'Please turn Airplane Mode OFF',
      networkError: 'Network error',
      checkConnection: 'Please check your internet connection',
      offline: 'You are offline',
      pleaseComeBackOnline: 'Please come back online to send OK status',
      connectToSendEmergency: 'Please connect to send emergency!',
      automatedEmergency: 'Automated Emergency',
      infoSend: 'Positive info send',
    },
  },
};

export default translations;
