const translations = {
  appName: 'Biostasis',
  onboarding: {
    title: 'Biostasis Emergency App',
    // slogan: `Get the best${'\n'}medical biostasis possible`,
    alreadyUser: 'Already a Biostasis user?',
    slogan:
      'Delivering advanced biostasis care and support for a secure future.',
    slide1: {
      label: 'Ensuring the Security of Your Biostasis Journey',
      text: 'With this app others can be quickly notified if you are in need of cryopreservation, leading to faster standby response.',
    },
    slide2: {
      label: 'Build Your Personalized Emergency Notification System',
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
    title: 'What is your full name?',
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
    label: 'Birthday:',
  },
  userAddress: {
    title: 'What is your complete address?',
    street: 'Street:',
    city: 'City:',
    country: 'Country:',
    zipCode: 'Zip/Postal Code:',
    currentLocation: 'Current Location',
    wrongAddress: 'Wrong Address, Please make sure to enter existing address',
  },
  emergencyContactsSettings: {
    title: 'Emergency Contacts Settings',
    emergencyList: 'Emergency Contact List',
    emergencyAndSettings: 'Emergency Contacts\nand Settings',
    makeSureToTestEmergencyContact:
      'Make sure to test your emergency trigger with your new contact so they learn how it works.',
    AddNewEmergencyContact: 'Add Emergency Contact',
    emergencyButtonSettings: 'Emergency Message Settings',
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
      instructions: 'Read instructions',
      compatibleSmartDeviceConnected: 'Compatible smartdevice connected',
      pleaseReadManual:
        'Please read the Automated Emergency System Manual before activating the system',
      systemDescription:
        'This system will automatically send an emergency signal based on a variety of data point from a smartdevice with health data.\nLearn more about how the system works in detail here:',
      manualDescription: 'Automated Emergency System Manual',
      confirmReadManual: 'Confirm reading the manual',
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
          title: 'Apple Watch is paired',
          description:
            "We use your Apple Watch (thanks to HealthKit integration) to retrieve your health data. If you don't use one, please choose the time-based trigger system instead.",
          alertTitle: 'Pair Apple Watch',
          alertDescription:
            "Your Apple Watch should be paired with your iPhone in order to sync your health data. Please make sure it's properly paired. If not, follow the instructions in the Watch iOS app.",
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
          "We will send notifications every chosen amount of time. In case you don't respond to one of them, the emergency system will be triggered. Night (10pm - 6am) is excluded.",
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
      title: 'Pause Emergency System Now',
      description:
        'You can temporarily pause the automated emergency system from the current moment until a specific time of your choice.',
      cancelMessage:
        'Pausing the automated emergency system has been successfully canceled.',
      startDisclaimer: 'Tap here to pause the system now',
      pausedDisclaimer:
        'The system is pause now\nTap here again to cancel the pause.',
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
};

export default translations;
