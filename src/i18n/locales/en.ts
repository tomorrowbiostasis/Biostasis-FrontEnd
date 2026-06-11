const translations = {
  appName: 'Tomorrow.bio',
  bottomTab: {
    home: 'Home',
    profile: 'Profile',
    activate: 'ACTIVATE',
    emergency: 'Emergency',
    activateA11y: 'Activate emergency',
    setupRequired: 'Setup required',
    setupRequiredA11y: 'Emergency setup required',
  },
  dashboardHome: {
    banner: {
      active: 'System active · Monitoring',
      noContacts: 'No emergency contacts added',
      systemOff: 'Emergency system is off',
      addContact: 'Add contact',
      openSettings: 'Open settings',
    },
    greeting: {
      morning: 'Good morning,',
      afternoon: 'Good afternoon,',
      evening: 'Good evening,',
    },
    collectedAt: 'Health data from {{time}}',
    collectedAtNone: 'No health data collected yet',
    sectionEmergencySystem: 'Emergency system',
    sectionHealthLogs: 'Health logs',
    sectionQuickActions: 'Quick actions',
    emergencySetupPrompt: {
      title: 'Emergency setup required',
      description:
        'The emergency button will work once your protection setup is complete.',
      contacts: {
        title: 'Emergency setup required',
        description:
          'Add an emergency contact before the emergency button can be used.',
      },
      monitoring: {
        title: 'Emergency monitoring required',
        description:
          'Enable emergency monitoring before the emergency button can be used.',
      },
    },
    readiness: {
      eyebrow: 'Protection status',
      states: {
        incomplete: {
          title: 'Add an emergency contact first',
          subtitle:
            'Emergency monitoring can only be enabled after you add at least one person who should be notified.',
        },
        inactive: {
          title: 'Emergency monitoring is off',
          subtitle:
            'Your contacts are saved. Enable monitoring so the mobile app can detect when help may be needed.',
        },
        active: {
          title: 'Emergency protection active',
          subtitleTime: 'Time-based check-ins are active.',
          subtitleBio: 'Bio-based emergency monitoring is active.',
          subtitleGeneric: 'Emergency monitoring is active.',
        },
      },
      actions: {
        complete: 'Complete emergency setup',
        addContact: 'Add emergency contact',
        enableMonitoring: 'Enable emergency monitoring',
        activate: 'Enable emergency monitoring',
        viewSettings: 'View emergency settings',
      },
      status: {
        active: 'Active',
        needsAttention: 'Needs attention',
        setupRequired: 'Setup required',
      },
      items: {
        contacts: 'Emergency contacts',
        monitoring: 'Emergency monitoring',
      },
      contacts: {
        added: 'Added',
        missing: 'Missing',
      },
      monitoring: {
        active: 'Active',
        bioActive: 'Active · Bio-based',
        timeActive: 'Active · Time-based',
        inactive: 'Not active',
        off: 'Off',
        setupRequired: 'Setup required',
      },
      modes: {
        time: 'Time-based',
        bio: 'Bio-based',
        both: 'Time + bio',
        active: 'Active',
        inactive: 'Not active',
      },
    },
    healthData: {
      title: 'Health data',
      emptyTitle: 'No recent health data',
      emptySubtitle:
        'We checked for the latest available data. If you use Apple Health, make sure Tomorrow.bio is allowed to read it.',
      checking: 'Checking health data…',
      checked: 'Checked just now',
      unavailableHelper:
        'No recent health data available. Tap refresh to check again.',
      lastCheckedLabel: 'Last checked:',
      lastChecked: 'Last checked: {{time}}',
      latestData: 'Latest data from {{time}}',
      refresh: 'Refresh',
      refreshA11y: 'Refresh health data',
      usedForMonitoring: 'Used only if your emergency system is active.',
    },
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
        description:
          'Set up contacts and health sharing so your emergency contacts will be notified in an emergency.',
        active: 'Emergency monitoring enabled',
        inactive: 'Inactive · Tap to enable',
        status: {
          monitoringBio: 'Monitoring via bio-based health data',
          monitoringTime: 'Monitoring via time-based check-ins',
          contactsMissing: 'Add emergency contacts to complete setup',
          inactive: 'Monitoring not active',
          monitoring: 'Active · Monitoring',
          waitingForData: 'Active · Waiting for health data',
          setupNeeded: 'Setup needed · Not fully protected',
          off: 'Off · Not monitoring',
        },
        mode: {
          bio: 'Health app monitoring',
          time: 'Check-in monitoring',
          inactive: 'Monitoring not active',
          setup: 'Setup required',
        },
        live: {
          activeTitle: 'Protection active',
          activeBioDescription: 'Health and movement signals are being checked.',
          activeTimeDescription: 'Scheduled check-ins are enabled.',
          setupTitle: 'Setup required',
          setupDescription:
            'Add contacts and enable monitoring to activate emergency protection.',
          inactiveTitle: 'Setup required',
          inactiveDescription: 'Complete setup to activate monitoring.',
          pausedTitle: 'Monitoring paused',
          pausedDescription: 'Monitoring will resume in {{time}}.',
        },
        badge: {
          enabled: 'Enabled',
          monitoring: 'Monitoring',
          needsSetup: 'Needs setup',
          setup: 'Set up',
          waitingForData: 'Waiting',
          setupNeeded: 'Set up',
          off: 'Off',
        },
        actions: {
          complete: 'Complete setup →',
          enable: 'Enable monitoring →',
          view: 'View settings →',
        },
      },
      healthLogs: {
        title: 'Health Logs',
        subtitle: 'Health logs and history logs',
      },
      manageSettings: {
        title: 'Emergency Settings',
        subtitle: 'Manage monitoring and emergency preferences',
        subtitleEmpty: 'Add emergency contacts',
      },
      contacts: {
        title: 'Emergency Contacts',
        ready: 'At least one active contact is available',
        missing:
          'Add at least one person who should be notified in an emergency.',
        badgeReady: 'Ready',
        badgeMissing: 'Missing',
        actions: {
          add: 'Add contact →',
          manage: 'Manage contacts →',
        },
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
      'Hold the button for 3 seconds to trigger an emergency. Here is what will happen:',
    locationTitle: 'Current location',
    locationReady: 'This location will be used for the emergency response.',
    locationLoading: 'Refreshing your current location…',
    locationUnavailable: 'Current location is unavailable right now.',
    locationPreviewUnavailable:
      'Location captured. Map preview is unavailable right now.',
    openMap: 'Open map',
    step1: 'Your emergency contacts will be notified',
    step2:
      'They will reach out to you and the cryopreservation team to coordinate the emergency response',
    hold: 'HOLD 3 SECONDS TO TRIGGER EMERGENCY',
    holdInstruction: 'Hold to trigger emergency',
    seconds: 'seconds',
    sending: 'Sending emergency…',
    cancel: 'Cancel',
    sentTitle: 'Emergency signal sent',
    sentSubtitle: 'This is being handled as an urgent emergency signal.',
    sentDetailsTitle: 'What happens now',
    sentDetails:
      'We have received your location and are contacting the medical on-site team to prepare an emergency response. Your emergency contacts are being contacted at the same time. Keep your phone nearby and stay reachable if you can.',
    done: 'Done',
    failedTitle: 'Emergency not sent',
    failedSubtitle: 'Something went wrong. Please try again.',
    retry: 'Retry',
  },
  profileHub: {
    title: 'Profile',
    sections: {
      account: {
        title: 'Account',
        description: 'Manage your personal details and app preferences.',
      },
      health: {
        title: 'Health records',
        description: 'Review the data used for emergency monitoring.',
      },
    },
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
    snapshotTitle: 'Current snapshot',
    snapshotDescription:
      'Latest health and movement values available to the mobile app.',
    emptySnapshotDescription:
      'No recent health data is available yet. Connect Health app access and refresh from the dashboard.',
    latestReadings: 'Latest readings',
    lastChecked: 'Last checked',
    historyDays: 'Days in history',
    heartRate: 'Heart Rate',
    steps: 'Steps',
    stepsToday: 'Steps today',
    totalSteps: 'Total Steps',
    totalMovement: 'Total movement',
    currentDay: 'Current day',
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
    stats: {
      title: 'Stats overview',
      daysTracked: 'Days tracked',
      totalSteps: 'Total steps',
      averageSteps: 'Avg steps/day',
      bestDay: 'Best day',
    },
    samples: '{{count}} records collected',
    totalSteps: 'Total steps',
    latestHeartRate: 'Latest heart rate',
    averageHeartRate: 'Average heart rate',
    hrEndDate: 'Heart rate end date',
    stepsEndDate: 'Steps end date',
    restingHrEndDate: 'Resting heart end date',
    empty: 'No history logs yet.',
  },
  settings: {
    title: 'Settings',
    sections: {
      emergency: 'Emergency system',
      signUp: 'Sign up',
      legal: 'Legal',
    },
    emergencyContact: 'Emergency Contact Settings',
    emergencySystem: 'Emergency System Settings',
    tomorrowBio: 'Sign up with Tomorrow.bio',
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
      body: 'Tomorrow.bio helps you prepare emergency information and connect with trained response support for more coordinated cryopreservation workflows.',
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
    signUpForCryopreservation: 'Sign Up with Tomorrow.bio',
    devLogs: 'Current Health Log',
    devHistoryLogs: 'Dev History Logs',
    devPushLogs: 'Dev Push Logs',
  },
  signUpForTomorrow: {
    title: 'Sign up with Tomorrow.bio',
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
    createAccount: 'Create a new account',
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
    title: 'Forgot your password?',
    doNotRememberPassword: "Don't remember your password?",
    enterEmail:
      'Please enter your email address. We will send you an email to reset your password.',
    enterNewPasswordForEmail: 'Enter a new password',
    emailSent:
      'Reset link sent. Check your inbox and open the link on your mobile device.',
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
    password: 'Your password',
    newPassword: 'Your new password',
    confirmNewPassword: 'Confirm your new password',
    email: 'you@example.com',
  },
  auth: {
    welcomeTo: 'Welcome to Tomorrow.bio',
    accountWasCreated:
      'Account created. Check your inbox and open the activation link on your mobile device.',
    invalidCredentials: 'Incorrect email or password',
    linkExpired: 'Link expired. Please try again.',
    accountActivated: 'Your account has been activated. You can now sign in.',
  },
  authScreen: {
    tabSignIn: 'Log in',
    tabSignUp: 'Sign up',
    appleCta: 'Continue with Apple',
    googleCta: 'Continue with Google',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    termsAgree: 'I agree to the',
    terms: 'Terms of Service',
    signIn: {
      title: 'Welcome back.',
      subtitle: 'Log in to your tomorrow.bio account.',
      cta: 'Log in',
      dividerLabel: 'or log in with email',
      passwordPlaceholder: 'Your password',
      forgotPassword: 'Forgot password?',
    },
    signUp: {
      title: 'Create account',
      subtitle: 'Join Tomorrow.bio to manage your emergency preparedness.',
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
      accountAlreadyExist: 'An account with this email already exists.',
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
    subtitle: 'This appears in emergency notifications sent to your contacts.',
    firstName: 'First name',
    lastName: 'Last name',
    firstNamePlaceholder: 'Enter first name',
    lastNamePlaceholder: 'Enter last name',
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
    editEmergencyContact: 'Edit Emergency Contact',
    emergencyButtonSettings: 'Emergency Message Settings',
    yourContacts: 'Your Contacts',
    contactToggleHelper: 'Use this contact for emergency alerts and test messages',
    includeWithMessage: 'Include with message',
    emergencyMessageLabel: 'Emergency Message',
    emergencyMessageEditHelper:
      'Edit the message your contacts will receive during an emergency.',
    emergencyMessageHelper:
      'This message will be sent by text and email to your emergency contacts when your emergency flow is triggered.',
    saveChanges: 'Save changes',
    savedChanges: 'Changes saved',
    saveError: "Couldn't save changes. Try again.",
    sendTestMessage: 'Send test message',
    addNewEdit: {
      title: 'Contact Information:',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      phoneNumber: 'Phone number',
      firstNamePlaceholder: 'Enter first name',
      lastNamePlaceholder: 'Enter last name',
      emailPlaceholder: 'name@example.com',
      phonePlaceholder: 'Enter phone number',
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
      testMessageLocationError:
        "Couldn't get your current location. Turn on precise location and try again.",
    },
    documents: {
      title: 'Documents',
      topInfo:
        'Upload important documents your emergency contacts may need. Accepted formats: PDF, DOC, DOCX, JPG, or PNG.',
      tapToUpload: 'Tap to upload',
      formatsAction: 'PDF, DOC, DOCX, JPG, or PNG · Tap to upload',
      uploadDocument: 'Upload document',
      uploadedFile: 'Uploaded · {{fileName}}',
      addDocument: 'Add document',
      actions: {
        upload: 'Upload file',
        remove: 'Remove file',
      },
      status: {
        uploaded: 'Uploaded',
        acceptedFormats: 'PDF, DOC, DOCX, JPG, PNG',
      },
      headers: {
        directive: 'Medical directive',
        lastWill: 'Last will',
        other: 'Other document',
      },
      descriptions: {
        directive:
          'Instructions for your medical care if you cannot speak for yourself.',
        lastWill:
          'A document that explains how your belongings and wishes should be handled.',
        other:
          'Upload any other important file your emergency contacts may need.',
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
      confirmReadManual: 'I understand how this system works',
      guidance: {
        contactsRequired: {
          title: 'Emergency contact required',
          subtitle:
            'Add at least one emergency contact before enabling monitoring.',
        },
        status: {
          eyebrow: 'Setup status',
          contacts: {
            title: 'Add an emergency contact first',
            subtitle:
              'Emergency monitoring can only be enabled after you add at least one person who should be notified.',
            action: 'Add emergency contact',
          },
          understand: {
            title: 'Understand emergency monitoring',
            subtitle:
              'Before activating monitoring, review how the mobile app detects risk and alerts your contacts.',
            action: 'Review and confirm',
          },
          ready: {
            title: 'Set up emergency monitoring',
            subtitle:
              'Review how monitoring works, then finish the setup to turn it on.',
            action: 'Start setup',
          },
          choose: {
            title: 'Choose your monitoring type',
            subtitle:
              'Select bio-based monitoring if you use a wearable, or time-based monitoring if you prefer regular check-ins.',
            action: 'Choose monitoring type',
          },
          active: {
            title: 'Emergency monitoring is active',
            subtitleBio: 'Bio-based monitoring is active.',
            subtitleTime: 'Time-based check-ins are active.',
            turnOff: 'Turn off monitoring',
          },
        },
        activeSummary: {
          sourceLabel: 'Monitoring source',
          sourceBio: 'Health app',
          sourceBioIos: 'Apple Health',
          sourceBioAndroid: 'Google Fit',
          healthDataLabel: 'Data status',
          healthDataConnected: 'Receiving recent data',
          healthDataMissing: 'Waiting for recent data',
        },
        activeActions: {
          switchToTime: 'Switch to time-based check-ins',
          switchToBio: 'Switch to bio-based monitoring',
          switchedToTime: 'Switched to time-based check-ins',
          switchedToBio: 'Switched to bio-based monitoring',
          bioUnavailableTitle: 'Health app data not available',
          bioUnavailableMessage:
            'Bio-based monitoring can be enabled once the app is receiving recent health data.',
        },
        howCompleted: 'How emergency monitoring works',
        howCompletedSubtitle:
          'You can review the emergency flow again anytime.',
        readAgain: 'Review',
        enableHelperContactsLocked:
          'Add an emergency contact before enabling monitoring.',
        enableHelperLocked:
          'Please confirm that you understand the emergency flow before enabling monitoring.',
        enableHelperReady:
          'Turn this on when you are ready for the mobile app to monitor for emergency risk.',
        monitoringCardTitle: 'Emergency monitoring',
        monitoringCardSubtitle:
          'Turn monitoring on or off and choose how the mobile app should monitor for emergency risk.',
        monitoringToggleLabel: 'Monitoring',
        monitoringOffHelper:
          'Turn this on to choose a monitoring type. Your selected monitoring type is saved, but it is not currently active.',
        monitoringTypeTitle: 'Monitoring type',
        monitoringTypeSubtitle:
          'Choose one monitoring type. Only one can be active at a time.',
        monitoringUnavailable: 'Monitoring unavailable',
        monitoringUnavailableHelper:
          'Add at least one emergency contact to turn this on.',
        chooseTitle: 'Choose monitoring type',
        chooseSubtitle:
          'Select one way the mobile app should monitor your safety. Only one monitoring type can be active at a time.',
        bioChoice: {
          title: 'Bio-based monitoring',
          subtitle:
            'Uses available health data from a wearable or HealthKit-connected device.',
          support:
            'Choose this if your phone can receive recent health data from your wearable or Health app.',
          action: 'Select',
        },
        timeChoice: {
          title: 'Time-based check-ins',
          subtitle: 'Sends regular check-in notifications.',
          support: 'If you do not respond, your emergency flow can start.',
          action: 'Select',
        },
        statusLabels: {
          active: 'Active',
          off: 'Off',
          selected: 'Selected',
          select: 'Select',
          connected: 'Connected',
          notConnected: 'Not connected',
          monitoringActive: 'Monitoring active',
          monitoringInactive: 'Monitoring not active',
        },
      },
      howItWorks: {
        title: 'How emergency monitoring works',
        intro:
          'Before you enable monitoring, review how the mobile app checks recent signals and what happens if you do not respond.',
        step1Title: 'Connect signals',
        step1Desc:
          'Allow notifications, location, and Health app access so monitoring can work.',
        step2Title: 'Monitor',
        step2Desc:
          'The mobile app uses recent health and movement signals when they are available.',
        step3Title: 'Alert',
        step3Desc:
          'If you become unresponsive, your emergency contacts will be notified.',
      },
      setupFlow: {
        stepLabel: 'Step {{step}} of {{total}}',
        back: 'Back',
        continue: 'Continue',
        enableMonitoring: 'Enable emergency monitoring',
        enabledToast: 'Emergency monitoring is active',
        permissions: {
          title: 'Permissions & readiness',
          subtitle:
            'Allow notifications, location, and Health app access before you continue.',
          notificationsTitle: 'Notifications',
          notificationsSubtitle:
            'Needed so the mobile app can send check-ins and emergency alerts.',
          locationTitle: 'Location',
          locationSubtitle:
            'Needed so your current location can be shared during an emergency.',
          healthTitle: 'Health data',
          healthSubtitleIos:
            'Connect Apple Health so the mobile app can verify recent health and movement signals.',
          healthSubtitleAndroid:
            'Connect Google Fit so the mobile app can verify recent health and movement signals.',
          healthOptionalHint:
            'You can continue after Health app access is connected, even if recent data has not appeared yet.',
          required: 'Required',
          optional: 'Optional',
          allowed: 'Allowed',
          connected: 'Connected',
          allowAction: 'Allow',
          connectAction: 'Connect',
          checkHealthAction: 'Check health access',
          healthCheckSuccess: 'Health access confirmed',
          healthCheckFailed:
            "We couldn't confirm Health app access yet. Check permissions and try again.",
          allowedAction: 'Allowed',
          connectedAction: 'Connected',
          allSetTitle: 'Required permissions are already in place',
          allSetSubtitle:
            'You can continue and set your sleep schedule before turning on monitoring.',
        },
        choose: {
          title: 'Choose monitoring type',
          subtitle:
            'Select how the mobile app should monitor for emergency risk.',
          bioSubtitle:
            'For this to work, your wearable must be connected to {{source}} and share at least heart rate and steps.',
          timeSubtitle:
            'Uses fixed check-ins every 8 hours if you are not using bio-based monitoring.',
          timeMovementNote:
            'Even with time-based check-ins, the mobile app can still show live movement while it is open.',
        },
        bio: {
          title: 'Set up bio-based monitoring',
          subtitle:
            'The mobile app uses recent health data from your wearable or Health app to check for emergency risk.',
          connected: 'Health data connected',
          connectedNoData: 'Health access connected',
          notConnected: 'Health data not available',
          connectedHelper:
            'Health data is connected and the app is receiving data.',
          connectedNoDataHelper:
            'Health access is connected. Recent samples may take a moment to appear.',
          missingHelper:
            'We are not receiving health data from your device yet.',
          checkConnection: 'Check connection',
        },
        time: {
          title: 'Set up time-based check-ins',
          subtitle:
            'The mobile app will send check-in notifications every 8 hours. If you do not respond, your emergency flow can start.',
          fixedIntervalTitle: '8-hour check-ins',
          fixedIntervalDescription:
            'There is no interval to choose. Time-based monitoring always checks in every 8 hours.',
          movementTitle: 'Live movement while using the app',
          movementDescription:
            'When the app is on screen, it can show movement and step changes for feedback. Scheduled check-ins still run separately.',
          helper: 'Continue when you are ready to set your sleep schedule.',
          devHelper:
            'Development builds use minute-based intervals for faster testing.',
        },
        sleep: {
          title: 'Set up your sleep schedule',
          subtitle:
            'Add your approximate sleep and wake times so the mobile app can align its monitoring logic with your daily rhythm.',
          enable: 'Enable sleep schedule',
          enableSubtitle:
            'Use the default 10:00 PM to 7:00 AM schedule. You can adjust it later.',
          required:
            'Sleep schedule is required before emergency monitoring can be enabled.',
        },
        final: {
          title: 'Ready to enable monitoring',
          subtitleBio:
            'Bio-based monitoring is ready. You can now enable emergency monitoring.',
          subtitleTime:
            'Time-based check-ins are ready. You can now enable emergency monitoring.',
          sleepEnabled: 'Sleep schedule is enabled.',
        },
      },
      enableAutomatedEmergency: 'Enable automated emergency monitoring',
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
        title: 'Bio-based monitoring',
        configurationTitle: 'Bio-based configuration',
        permissions: {
          title: 'Give Health permissions',
          alertTitle: 'Health Permissions',
          alertDescription:
            'You will be prompted to allow Tomorrow.bio to access your health data. Please confirm.',
        },
        turnOn: 'Use bio-based monitoring',
        warning:
          'Only one monitoring type can be active at a time. This will use bio-based monitoring instead of time-based check-ins.',
        appleWatch: {
          title: 'Health data connection',
          description:
            'Uses health data from your wearable or HealthKit-connected device.',
          alertTitle: 'Pair Wearable Device',
          alertDescription:
            "Your wearable device should be paired with your iPhone in order to sync your health data. Please make sure it's properly paired. If not, follow the instructions in the device's companion app.",
        },
        googleFit: {
          title: 'Authenticate Google Fit',
          description:
            'Uses health data from Google Fit or a connected wearable.',
          connect: 'Connect app to Google Fit',
          alertTitle1: 'Authenticate',
          alertDescription1:
            "Please authenticate Google Fit to let Tomorrow.bio access recent health data. If you don't have Google Fit installed, please install it first from Google Play.",
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
      systemOff: 'Monitoring is off',
      systemOn: 'Monitoring is on',
      systemOffMessage: 'Emergency monitoring turned off successfully',
      timeTrigger: {
        title: 'Time-based check-ins',
        configurationTitle: 'Time-based configuration',
        description:
          'We send check-in notifications every 8 hours. If you do not respond, your emergency flow can start.',
        frequency: 'Check-in interval',
        fixedInterval: 'Every 8 hours',
        movementNote:
          'When the app is open, it can still show live movement and step changes for visual feedback.',
        systemStart: 'Time-based automated system is running',
        turnOn: 'Use time-based check-ins',
        warning:
          'Only one monitoring type can be active at a time. This will use time-based check-ins instead of bio-based monitoring.',
      },
      pauseTime: {
        title: 'Set-up System Pause Times',
        description:
          'Stop the emergency system from triggering for recurring or temporary time frames.',
      },
      sleepSchedule: {
        title: 'Sleep Schedule',
        description: 'Set sleep hours to avoid false alarms at night.',
        requiredDescription:
          'Adjust the sleep hours used by your active emergency monitoring.',
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
        useChargingDescription: 'Treat nighttime charging as a sleep signal.',
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
    title: 'Emergency Preparedness\nAt Your Fingertips',
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
        title: 'Sign Up with Tomorrow.bio',
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
      'Turn on Location Services to allow Tomorrow.bio to determine your location.',
    goToSettings: 'Go to Settings',
    notEnoughsPermissions:
      'Tomorrow.bio requires location access for emergency monitoring workflows. To allow this, go to location privacy settings and select "Always".',
  },
  notifications: {
    goToSettings: 'Go to Settings',
    permissionsError:
      'Tomorrow.bio requires push notification permissions for emergency monitoring check-ins and alerts.',
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
        'Temporarily disable monitoring until a specific time you choose.',
      cancelMessage: 'Pause has been cancelled. The system is active again.',
      pauseConfirmed: 'System paused until {{time}}',
      startDisclaimer: 'Pause the system',
      choosePauseDuration: 'Choose pause duration',
      systemPaused: 'System is paused',
      pausedUntil: 'Paused until {{time}}',
      cancelPause: 'Cancel pause',
    },
    addTimeBlock: {
      title: 'Add Time Block',
      save: 'Save Time Block',
    },
    specificTimes: {
      title: 'Set-up Specific Times',
      description:
        'Automatically disable monitoring during recurring time slots.',
      start: 'Start',
      end: 'End',
      addAdditionalTime: 'Add a time block',
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
    confirmOk: "Yes, I'm OK",
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
      describe: 'Tomorrow.bio is checking recent health data',
    },
    emergency: 'Starting Emergency Process...',
    restart: 'Automated emergency system restarted',
    failed:
      'Automated Health Check did not start! Please, Check your emergency settings.',
    stop: {
      title: 'Automated Health Check Stopped',
      describe:
        'Tomorrow.bio emergency monitoring stopped because an emergency flow started.',
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
