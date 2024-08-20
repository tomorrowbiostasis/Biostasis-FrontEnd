import {ITranslation} from '../interfaces/Translation.interface';

const translations: ITranslation = {
  appName: 'Biostasis',
  onboarding: {
    title: 'Biostasis Notfall-App',
    // slogan: 'Holen Sie sich die bestmögliche$ medizinische Biostase',
    alreadyUser: 'Bereits ein Biostasis-Benutzer?',
    slogan:
      'Fortschrittliche Biostasenpflege und Unterstützung für eine sichere Zukunft.',
    slide1: {
      label: 'Die Sicherheit Ihrer Biostasis-Reise gewährleisten',
      text: 'Mit dieser App können andere schnell benachrichtigt werden, wenn Sie eine Kryokonservierung benötigen, was zu einer schnelleren Bereitschaftsreaktion führt.',
    },
    slide2: {
      label: 'Erstellen Sie Ihr persönliches Notfall-Benachrichtigungssystem',
      text: 'Erstellen Sie Notfallkontakte, passen Sie Ihre Notfallnachricht an, laden Sie Dokumente hoch, konfigurieren Sie ein automatisches Notfallsystem und vieles mehr.',
    },
  },
  common: {
    or: 'oder',
    and: 'und',
    continue: 'Weiter',
    save: 'Speichern',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    welcome: 'Willkommen {{username}}',
    setUp: 'Einrichten',
    message: 'Nachricht',
    logOut: 'Abmelden',
    submit: 'Abschicken',
    ok: 'OK',
    retry: 'Erneut versuchen',
    yes: 'Ja',
    no: 'Nein',
    refresh: 'Aktualisieren',
    fine: 'Mir geht es gut',
    startEmergency: 'Notfall starten',
    setUpPauseTimes: 'Pausenzeiten einrichten',
    error: 'Wir haben einige Probleme mit unserem Dienst',
    errorNetwork:
      'Wahrscheinlich sind Sie offline, bitte stellen Sie die Verbindung wieder her.',
  },
  headers: {
    welcome: 'Willkommen',
    welcomeUsername: 'Willkommen,\n{{username}}',
  },
  drawer: {
    logOut: 'Abmelden',
    dashboard: 'Home',
    profile: 'Profil',
    accountSettings: 'Kontoeinstellungen',
    automatedEmergency: 'Einstellungen für das Notfallsystem',
    termsLabel: 'Allgemeine Geschäftsbedingungen',
    termsUrl: 'https://tomorrowbiostasis.com/de/terms-conditions/',
    privacyLabel: 'Datenschutzbestimmungen',
    privacyUrl: 'https://tomorrowbiostasis.com/de/privacy/',
    uploadDocuments: 'Dokumente hochladen',
    AddNewEmergencyContact: 'Notfallkontakt hinzufügen',
    debugInfo: 'Debug-Informationen',
    emergencyContactSettings: 'Notfallkontakt-Einstellungen',
    pauseTimes: 'Notfallsystem pausieren',
    signUpForCryopreservation: 'Melden Sie sich bei Tomorrow Bio an',
  },
  signUpForTomorrow: {
    title: 'Melden Sie sich bei Tomorrow Bio an',
    signUpUrl: 'https://tomorrowbiostasis.com/de/signup/',
    internetError: {
      title: 'Keine Internetverbindung',
      description: 'Diese Seite benötigt eine Internetverbindung!',
    },
  },
  socialMediaUrls: {
    website: 'https://www.tomorrow.bio/de/',
    twitter: 'https://twitter.com/tomorrowbio',
    instagram: 'https://www.instagram.com/tomorrowbio/',
    youtube: 'https://www.youtube.com/channel/UCO-RhsVpguwTJuntw_US0Mw',
  },
  user: {
    updatedSuccessfully: 'Ihre Daten wurden erfolgreich aktualisiert',
  },
  LogIn: {
    apple: 'Mit Apple anmelden',
    google: 'Mit Google anmelden',
    LogIn: 'Anmelden',
    emailTitleLogIn: 'Melden Sie sich mit Ihrer E-Mail an:',
    emailTitleSignUp: 'Melden Sie sich mit Ihrer E-Mail an:',
  },
  signUp: {
    apple: 'Bei Apple anmelden',
    google: 'Bei Google anmelden',
    signUp: 'Registrieren',
    createAccount: 'Erstellen Sie ein neues Konto',
  },
  signOut: {
    disabledAutomatedEmergencyContinue: 'Möchten Sie fortfahren?',
    disabledAutomatedEmergency:
      'Der automatische Notruf wird nach der Abmeldung ausgeschaltet!',
  },
  termsAgree: {
    agreeToThe: 'Ich stimme den Bedingungen zu',
    terms: 'Bedingungen',
    privacyPolicy: 'Datenschutzbestimmungen',
  },
  forgotPassword: {
    screenName: 'Passwort vergessen',
    title: 'Haben Sie Ihr Passwort vergessen?',
    doNotRememberPassword: 'Erinnern Sie sich nicht mehr an Ihr Passwort?',
    enterEmail:
      'Bitte geben Sie Ihre E-Mail-Adresse ein. Wir werden Ihnen eine E-Mail schicken, um Ihr Passwort zurückzusetzen.',
    enterNewPasswordForEmail: 'Geben Sie ein neues Passwort ein',
    emailSent:
      'Wir haben Ihnen soeben eine E-Mail zum Zurücksetzen Ihres Passworts geschickt. Überprüfen Sie Ihren Posteingang und öffnen Sie den Link auf einem mobilen Gerät, auf dem die Biostasis-App installiert ist.',
    passwordChanged: 'Passwort aktualisiert. Bitte melden Sie sich an.',
    resetLinkExpired:
      'Link zum Zurücksetzen des Passworts ist abgelaufen.Bitte versuchen Sie es erneut.',
    newPassword: 'Neues Passwort',
    warning:
      'Stellen Sie sicher, dass Sie bereits ein Konto mit Ihrer benutzerdefinierten E-Mail-Adresse registriert haben. Beachten Sie, dass über Apple und Google vorgenommene Registrierungen nicht funktionieren.',
  },
  placeholder: {
    password: 'Ihr Passwort',
    newPassword: 'Ihr neues Passwort',
    confirmNewPassword: 'Bestätigen Sie Ihr neues Passwort',
    email: 'yours@example.com',
  },
  auth: {
    welcomeTo: 'Willkommen bei Biostasis',
    accountWasCreated:
      'Ihr Konto wurde erstellt. Um es zu aktivieren, überprüfen Sie Ihren Posteingang und öffnen Sie den Link auf einem mobilen Gerät, auf dem die Biostasis-App installiert ist.',
    invalidCredentials: 'Falscher Benutzername oder falsches Passwort',
    linkExpired: 'Link has expired. Bitte versuchen Sie es erneut',
    accountActivated:
      'Ihr Konto wurde aktiviert. Sie können sich jetzt anmelden.',
  },
  defaultError: 'Der Vorgang war nicht erfolgreich',
  validation: {
    fieldRequired: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Ungültige E-Mail Adresse',
    email: {
      invalid: 'Ungültige E-Mail-Adresse',
      accountAlreadyExist:
        'Ein Konto mit der angegebenen E-Mail-Adresse existiert bereits',
    },
    password: {
      tooShort: 'Passwort ist zu kurz',
      whiteSpace: 'Passwort darf keine Leerzeichen enthalten',
      minLength: 'Das Kennwort muss mindestens 8 Zeichen enthalten',
    },
    userName: {
      minLength: 'Der Name muss mindestens 2 Zeichen enthalten',
      maxLength: 'Der Name darf nicht länger als 50 Zeichen sein',
      restrictions:
        'Der Name darf nur Buchstaben, Bindestriche und Leerzeichen enthalten',
    },
    emergencySettings: {
      minMaxLength: 'Der Text sollte 10-1000 Zeichen lang sein',
    },
    number: {
      incorrectFormat:
        'Die Rufnummer ist nicht korrekt. Bitte geben Sie eine gültige Nummer ein und versuchen Sie es erneut',
    },
  },
  userName: {
    title: 'Wie lautet Ihr vollständiger Name?',
    firstName: 'Vorname',
    lastName: 'Nachname',
  },
  userPhone: {
    title: 'Wie lautet Ihre Telefonnummer?',
    phoneNumber: 'Telefonnummer',
    invalidPhoneNumber: 'Ungültige Telefonnummer',
  },
  selectAction: {
    whatToDo: 'Was würden Sie gerne tun?',
    signUpForTheCryopreservation: {
      title: 'Ich möchte mich für einen Kryokonservierungsvertrag anmelden',
      description:
        'Melden Sie sich in nur 15 Minuten und vollständig online für den Kryokonservierungsvertrag an und richten Sie einen Notfallalarm ein',
    },
    storeCryopreservationContract: {
      title:
        'Ich habe bereits einen Kryokonservierungsvertrag und möchte ihn hinzufügen',
      description:
        'Speichern Sie Ihren Kryokonservierungsvertrag und Ihre Patientenverfügung an einem sicheren Ort und richten Sie Notfallkontakte ein',
    },
    useAppForEmergencyManagement: {
      title: 'Ich möchte die App nur für das Notfallmanagement verwenden',
      description:
        'Legen Sie die Kontakte fest, die im Falle eines medizinischen Notfalls benachrichtigt werden sollen, und bereiten Sie alle Dokumente vor, die sie benötigen könnten',
    },
  },
  userDateOfBirth: {
    title: 'Wie lautet Ihr Geburtsdatum?',
    invalidDate: 'Ungültiges Datum',
    invalidUserAge: 'Sie müssen mindestens 18 Jahre alt sein',
    selectDate: 'Datum auswählen',
    label: 'Geburtstag:',
  },
  userAddress: {
    title: 'Wie lautet Ihre vollständige Adresse?',
    street: 'Straße:',
    city: 'Stadt:',
    country: 'Land:',
    zipCode: 'Postleitzahl:',
    currentLocation: 'Aktueller Standort',
    wrongAddress:
      'Falsche Adresse, bitte geben Sie eine vorhandene Adresse ein',
  },
  emergencyContactsSettings: {
    title: 'Einstellungen für Notfallkontakte',
    emergencyList: 'Notfallkontaktliste',
    emergencyAndSettings:
      'Einstellungen für Notfallkontakte\nand Einstellungen',
    makeSureToTestEmergencyContact:
      'Stellen Sie sicher, dass Sie Ihren Notfallauslöser mit Ihrem neuen Kontakt testen, damit er lernt, wie er funktioniert.',
    AddNewEmergencyContact: 'Notfallkontakt hinzufügen',
    emergencyButtonSettings: 'Einstellungen für Notfallnachrichten',
    addNewEdit: {
      title: 'Kontaktinformationen:',
      firstName: 'Vorname (Notfallkontakt)',
      lastName: 'Nachname (Notfallkontakt)',
      email: 'E-Mail (Notfallkontakt)',
      phoneNumber: 'Telefonnummer (Notfallkontakt)',
      errorDuringUpdate:
        'Es gibt ein Problem mit den Daten im Formular. Bitte überprüfen Sie die Korrektheit der Daten und speichern Sie sie erneut.',
      activateContact: 'Der Kontakt wurde erfolgreich aktiviert',
      deactivateContact: 'Kontakt wurde erfolgreich deaktiviert',
      errorActivate: 'Kontakt konnte nicht aktiviert werden',
      addContact: 'Kontakt wurde erfolgreich hinzugefügt',
      errorAddContact: 'Konnte den neuen Kontakt nicht hinzufügen',
      updateContact: 'Der Kontakt wurde erfolgreich aktualisiert',
      errorUpdateContact:
        'Etwas ist schief gelaufen. Der Kontakt konnte nicht aktualisiert werden',
      deleteContact: 'Der Kontakt wurde erfolgreich gelöscht',
      errorDeleteContact:
        'Es ist etwas schief gelaufen. Kontakt konnte nicht gelöscht werden',
      alert: {
        title: 'Kontakt löschen',
        description: 'Sind Sie sicher, dass Sie diesen Kontakt löschen wollen?',
      },
    },
    explanations: {
      description1:
        'Hier können Sie die Notfallkontakte einrichten, die im Falle eines Notfalls benachrichtigt werden sollen. Sie können konfigurieren, welche Informationen im Notfall gesendet werden sollen, einschließlich Text-/E-Mail-Nachrichten, Standort und Dokumente.',
      description2:
        'Sie können die Liste der Notfallkontakte und die Art der Informationen/Benachrichtigungen, die sie erhalten sollen, jederzeit bearbeiten.',
    },
    settings: {
      disclaimer:
        'Eine E-Mail und eine Textnachricht wird an alle Notfallkontakte gesendet, wenn ein Notfall ausgelöst wird',
      sendEmailAndTextMessage: 'E-Mail und Textnachricht senden',
      includeInfo: 'Diese Information einschließen:',
      location: 'Standort',
      uploadedDocuments: 'Hochgeladene Dokumente',
      sendTestEmail: 'Sende mir eine Test-E-Mail',
      defaultMessage:
        'Dies ist ein Notruf von {{username}}. Sie erhalten diese Nachricht, weil ich möglicherweise eine Kryokonservierung benötige Zusätzliche Informationen hier und im Anhang.',
      testMessageSent:
        'Test-E-Mail gesendet. Bitte prüfen Sie Ihren Posteingang.',
    },
    documents: {
      title: 'Dokumente',
      topInfo:
        'Diese Dokumente werden an Ihre Notfallkontakte gesendet, wenn Sie einen Notfall auslösen ',
      addDocument: 'Dokument hinzufügen',
      headers: {
        directive: 'Medizinische Anweisung',
        lastWill: 'Letzter Wille',
        other: 'Sonstiges',
      },
      upload: {
        directive: 'Medizinische Anweisung hochladen',
        lastWill: 'Letzter Wille hochladen',
        other: 'Anderes Dokument hochladen',
      },
      messages: {
        errors: {
          upload: 'Fehler beim Hochladen: {{error}}',
          fileWrongType: 'Die Datei ist beschädigt oder hat das falsche Format',
          fetching: 'Fehler beim Abrufen von Dokumenten: {{error}}',
          remove: 'Fehler beim Löschen des Dokuments: {{error}}',
        },
        success: {
          upload: 'Das Dokument wurde erfolgreich gespeichert',
          remove: 'Das Dokument wurde erfolgreich gelöscht',
        },
        uploadStarted: 'Der Datei-Upload wurde gestartet',
      },
      alert: {
        title: 'Dokument löschen',
        description:
          'Sind Sie sicher, dass Sie dieses Dokument löschen wollen?',
      },
    },
    confirmationModal: {
      title: 'Bestätigen Sie die Löschung. Sind Sie sicher?',
    },
    automatedEmergencySettings: {
      title: 'Notfall-Einstellungen',
      enableSystemTitle: 'Automatisierte Notfalleinstellungen',
      instructions: 'Anweisungen lesen',
      compatibleSmartDeviceConnected: 'Kompatibles Smartdevice angeschlossen',
      pleaseReadManual:
        'Bitte lesen Sie das Handbuch für das automatisierte Notfallsystem, bevor Sie das System aktivieren',
      systemDescription:
        'Dieses System sendet automatisch ein Notfallsignal auf der Grundlage einer Vielzahl von Datenpunkten von einem Smartdevice mit Gesundheitsdaten.\nErfahren Sie hier mehr darüber, wie das System im Detail funktioniert:',
      manualDescription: 'Handbuch für das automatisierte Notfallsystem',
      confirmReadManual: 'Bestätigen Sie das Lesen des Handbuchs',
      enableAutomatedEmergency: 'Automatisierten Notfall aktivieren',
      setUpSmartDevice: 'Smart-Gerät einrichten',
      connectedSmartDevice: 'Verbunden mit {{device}}',
      pauseAutomatedEmergency: 'Automatisierten Notfall anhalten',
      setUpSpecificTimes: 'Spezielle Zeiten einrichten {{specificTimes}}',
      automatedEmergencyDisabledFor:
        'Automatischer Notruf ist für {{pauseTime}} deaktiviert',
      cancelEmergencyPause: 'Automatische Notrufpause abbrechen',
      youStillHavePause:
        'Die Pause ist noch aktiv. Denken Sie daran, dass der automatische Notruf, wenn Sie ihn aktivieren, für {{pauseTime}} pausiert wird',
      frequencySet: 'Frequenz erfolgreich eingestellt auf',
      bioTrigger: {
        title: 'Biobasierter Auslöser',
        permissions: {
          title: 'Gesundheitsberechtigungen erteilen',
          alertTitle: 'Gesundheitserlaubnisse',
          alertDescription:
            'Sie werden aufgefordert, Biostasis den Zugriff auf Ihre Gesundheitsdaten zu erlauben. Bitte bestätigen Sie.',
        },
        turnOn: 'Biobasiert',
        warning:
          'Das Einschalten von Biostasis deaktiviert den zeitbasierten Auslöser!',
        appleWatch: {
          title: 'Apple Watch ist gekoppelt',
          description:
            'Wir verwenden Ihre Apple Watch (dank der HealthKit-Integration), um Ihre Gesundheitsdaten abzurufen. Wenn Sie keine verwenden, wählen Sie bitte stattdessen das zeitbasierte Trigger-System.',
          alertTitle: 'Apple Watch koppeln',
          alertDescription:
            'Ihre Apple Watch sollte mit Ihrem iPhone gekoppelt sein, um Ihre Gesundheitsdaten zu synchronisieren. Bitte stellen Sie sicher, dass sie richtig gekoppelt ist. Falls nicht, folgen Sie den Anweisungen in der iOS-App der Uhr.',
        },
        googleFit: {
          title: 'Google Fit authentifizieren',
          description:
            'Wir verwenden Google Fit, um Ihre Gesundheitsdaten abzurufen. Bitte authentifizieren Sie sich und konfigurieren Sie die Begleit-App des Geräts. Einige Geräte können nicht mit Google Fit synchronisiert werden. Bitte wählen Sie in diesem Fall das zeitbasierte Auslösesystem.',
          connect: 'App mit Google Fit verbinden',
          alertTitle1: 'Authentifizieren',
          alertDescription1:
            'Bitte authentifizieren Sie Google Fit, damit Biostasis auf die Gesundheitsdaten Ihres Rekorders zugreifen kann. Wenn Sie die Google Fit App nicht installiert haben, installieren Sie sie bitte zuerst von Google Play.',
          alertTitle2: 'Google Fit hinzufügen',
          alertDescription2:
            'Bitte öffnen Sie den Abschnitt Einstellungen in Ihrer Uhr/Fitnessband-Begleit-App. Suchen Sie dann den Abschnitt Konten hinzufügen oder einen ähnlichen Abschnitt. Wählen Sie Google Fit und durchlaufen Sie dann den Autorisierungsprozess.',
        },
        backgroundModes: {
          title: 'Hintergrundmodi aktivieren',
          alertTitle: 'Hintergrundmodi aktivieren',
          alertDescription:
            'Bitte öffnen Sie den Abschnitt Einstellungen in Ihrer Uhr/Fitnessband-Begleit-App. Suchen Sie dann einen Abschnitt mit der Aufschrift Berechtigungen oder ähnlichem. Suchen Sie Background Modes und aktivieren Sie es.',
        },
        frequency: 'Notfall-Auslöser Zeitrahmen:',
      },
      systemOff: 'System ist ausgeschaltet',
      systemOn: 'System ist eingeschaltet',
      systemOffMessage:
        'Automatisches Notfallsystem wurde erfolgreich ausgeschaltet',
      timeTrigger: {
        title: 'Zeitbasierter Auslöser',
        description:
          'Wir werden nach einer bestimmten Zeitspanne Benachrichtigungen senden. Falls Sie auf eine dieser Benachrichtigungen nicht reagieren, wird das Notfallsystem ausgelöst. Die Nacht (22 Uhr - 6 Uhr) ist davon ausgenommen.',
        frequency: 'Notfall-Auslöser Zeitrahmen:',
        systemStart: 'Zeitbasiertes automatisches System läuft',
        turnOn: 'Zeitbasiert',
        warning:
          'Das Einschalten des zeitbasierten Systems wird den biobasierten Auslöser deaktivieren!',
      },
      pauseTime: {
        title: 'System-Pausenzeiten einrichten',
        description:
          'Unterbinden Sie die Auslösung des Notfallsystems für wiederkehrende oder vorübergehende Zeiträume.',
      },
      time: {
        hours: '{{count}} Stunden',
        hoursDefault: '{{count}} Stunden (Standard)',
        minutes: '{{count}} Minuten',
        minutesDefault: '{{count}} Minuten (Standard)',
        minutesDev: '{{count}} Minuten (dev)',
      },
      interval: {
        title: 'Intervall wählen',
      },
      readLess: 'Weniger lesen',
      readMore: 'Mehr lesen',
      seeAll: 'Alles sehen',
      collapse: 'Zusammenklappen',
    },
    dayTimePicker: {
      invalidDate: 'Ungültiges Datum',
      dateFormat24: 'Datum sollte im 24h Format sein',
      dateFormat12: 'Das Datum sollte im 12-Stunden-Format sein',
    },
  },
  dashboard: {
    title: 'Medizinische Biostase\nAt Your Fingertips',
    profile: {
      title: 'Profil und medizinische Informationen',
      description:
        'Sorgen Sie dafür, dass Ihre wichtigen Informationen immer auf dem neuesten Stand und leicht zugänglich sind',
    },
    contacts: {
      title: 'Notfall-Einstellungen verwalten',
      description:
        'Konfigurieren Sie Ihre Notfallkontakte und wählen Sie aus, wie sie in Notfällen benachrichtigt werden sollen',
      notActive: 'Notfallkontakte einrichten',
      active: 'Einrichtung abgeschlossen',
    },
    automatedEmergency: {
      title: 'Automatisiertes Notfallsystem',
      description:
        'Automatisches Notfallsystem einrichten und aktivieren, um Sie anhand verschiedener Notfallauslöser zu überprüfen',
      active: {
        bioTrigger: 'Biobasierter Auslöser',
        timeTrigger: 'Zeitabhängiger Auslöser',
      },
      notActive: 'Automatisches System einrichten',
      recommendationDaysLeft:
        'Das Empfehlungssystem analysiert Ihre Gesundheitsdaten und gibt jede Woche personalisierte Empfehlungen ab. Ihre nächste Empfehlung ist in {{daysLeft}} ',
      days: 'Tage',
      day: 'Tag',
      recommendationMessage:
        'Auf der Grundlage Ihrer Gesundheitsdaten empfehlen wir Ihnen, {{recommendedPeriod}} Stunden als Zeitrahmen für die Auslösung des Notfalls zu wählen',
    },
    documents: {
      title: 'Dokumente',
      description:
        'Laden Sie wichtige Dokumente wie Ihren letzten Willen und Ihr Testament, Ihre Patientenverfügung und vieles mehr hoch',
    },
    signUpForCryopreservation: {
      tomorrowBio: {
        title: 'Anmelden mit Tomorrow Bio',
        description: 'Europäischer Anbieter mit starker SST-Infrastruktur',
        footer: 'Mehr erfahren und anmelden',
      },
      alcor: {
        title: 'Melden Sie sich bei Alcor an',
        description: 'Anbieter in den USA mit langfristiger Erfolgsbilanz',
        footer: 'Mehr erfahren',
      },
      cryonicsInstitute: {
        title: 'Anmeldung beim Cryonics Institute',
        description:
          'Eine Mitgliedsorganisation, die kryonische Dienstleistungen anbietet',
      },
      southernCryonics: {
        title: 'Melden Sie sich bei Southern Cryonics an',
        description:
          'Eine Non-Profit-Organisation betreibt Australiens erste kryonische Lagereinrichtung',
      },
    },
    customizeMessage: {
      title: 'Notfallnachricht anpassen',
      description:
        'Ändern Sie die Nachricht und die E-Mail, die in einer Notfallsituation an Ihre Kontakte gesendet werden',
    },
    emergency: {
      countdown: ' NOTFALL',
      countdownSent: 'NOTFALL GESENDET',
      countdownRetrying: 'KAUM DA',
      countdownCanceled: 'NOTFALL\nABGEBROCHEN',
      countdownSubtitleHold: 'Zum Aktivieren halten.',
      countdownSubtitleBeing: 'DIE INFORMATIONEN WERDEN GESENDET.',
      countdownSubtitleDone: 'ALLES ERLEDIGT',
      countdownSubtitleRetrying: 'ARBEITEN...',
      setUpContacts: 'NOTFALLKONTAKT EINRICHTEN',
      cancel: 'Abbrechen',
      ok: 'OK',
      enableContacts: 'Notfallkontakte aktivieren',
      error:
        'Es gab ein Problem mit unserem Dienst. Bitte versuchen Sie es erneut.',
      noContacts: 'Sie haben keine Kontakte hinzugefügt',
    },
    sections: {
      userProfile: 'Meine Daten',
      emergencySystem: 'Einstellungen des Notfallsystems',
      signUp: 'Anmeldung zur Kryokonservierung',
    },
  },
  location: {
    location: 'Standort',
    locationPermissionDenied: 'Standortgenehmigung verweigert',
    unableToOpenSettings: 'Die Einstellungen können nicht geöffnet werden',
    turnOnLocationFromSettings:
      'Aktivieren Sie die Standortdienste, damit "Biostasis" Ihren Standort bestimmen kann',
    goToSettings: 'Zu den Einstellungen gehen',
    notEnoughsPermissions:
      'Die Biostasis-Anwendung benötigt ständig Standortinformationen. Um die Verwendung Ihres Standorts zuzulassen, gehen Sie zu den Datenschutzeinstellungen für den Standort und wählen Sie "immer"',
  },
  notifications: {
    goToSettings: 'Zu den Einstellungen gehen',
    permissionsError:
      'Die Biostasis-Funktion erfordert die Berechtigung für Push-Benachrichtigungen.',
  },
  time: {
    short: {
      m: 'min',
      h: 'h',
    },
    lessThanMinute: 'weniger als eine Minute',
    m: '1 Minute',
    mm: '{{m}} Minuten',
    h: '1 Stunde{{secondPrecision}}',
    hh: '{{h}} Stunden{{secondPrecision}}',
    d: '1 Tag{{secondPrecision}}',
    dd: '{{d}} Tage{{secondPrecision}}',
  },
  specificTimesScreen: {
    title: 'Pause Notfallsystem',
    pauseNow: {
      title: 'Notfallsystem jetzt anhalten',
      description:
        'Sie können das automatische Notrufsystem von diesem Moment an bis zu einem bestimmten Zeitpunkt Ihrer Wahl vorübergehend anhalten',
      cancelMessage:
        'Die Unterbrechung des automatischen Notrufsystems wurde erfolgreich abgebrochen',
      startDisclaimer: 'Tippen Sie hier, um das System jetzt anzuhalten',
      pausedDisclaimer:
        'Das System wird jetzt angehalten\nTippen Sie hier erneut, um die Pause aufzuheben',
    },
    specificTimes: {
      title: 'Besondere Zeiten einrichten',
      description:
        'Deaktivieren Sie das automatische System wiederholt zu bestimmten Zeiten der Woche/Tage',
      start: 'Start:',
      end: 'Ende:',
      addAdditionalTime: 'Zusätzliche Zeit hinzufügen',
      startSection: {
        pickDay: 'Starttag(e) auswählen',
        pickTime: 'Startzeit einstellen',
      },
      endSection: {
        pickDay: 'Endtag(e) auswählen',
        pickTime: 'Endzeitpunkt festlegen',
      },
      daysFullName: {
        everyday: 'Alltäglich',
        monday: 'Montag',
        tuesday: 'Dienstag',
        wednesday: 'Mittwoch',
        thursday: 'Donnerstag',
        friday: 'Freitag',
        saturday: 'Samstag',
        sunday: 'Sonntag',
      },
      daysShortName: {
        everyday: 'Alltäglich',
        monday: 'Mon',
        tuesday: 'Di',
        wednesday: 'Mi',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sonne',
      },
      changeSettings: 'Zeiteinstellungen erfolgreich geändert',
    },
  },
  profileDefault: {
    title: 'Profil und medizinische Informationen',
    medicalInfo: {
      title: 'Medizinische Informationen',
      description:
        'Wenn Sie Ihre medizinischen Informationen auf dem neuesten Stand halten, können Sie die Qualität Ihrer Kryokonservierung verbessern',
      footer: 'Medizinische Informationen bearbeiten',
    },
    editProfile: {
      title: 'Profil & Benutzerdaten',
      description:
        'Sie haben die Möglichkeit, Ihre Daten jederzeit zu aktualisieren und zu ändern, um sicherzustellen, dass korrekte Angaben an die von Ihnen angegebenen Notfallkontakte gesendet werden',
      footer: 'Profil bearbeiten',
    },
    accountSettings: {
      title: 'Kontoeinstellungen',
      description:
        'Verwalten Sie Ihre Kontoeinstellungen und passen Sie sie an, um ein individuelles Erlebnis zu gewährleisten, das auf Ihre Vorlieben und Bedürfnisse zugeschnitten ist',
      footer: 'Einstellungen ändern',
    },
  },
  accountSettings: {
    title: 'Kontoeinstellungen',
    allowNotifications: 'Benachrichtigungen zulassen',
    receiveTipsAndTricks: 'Tipps und Tricks erhalten',
    GDPR: {
      title: 'Anfrage gespeicherte Daten (GDPR)',
      description:
        'Fordern Sie eine Kopie Ihrer gespeicherten Daten in Übereinstimmung mit den GDPR-Vorschriften an, um die Transparenz und Sicherheit Ihrer Informationen zu gewährleisten',
      label:
        'Geben Sie bitte die E-Mail-Adresse an, an die Ihre Daten gesendet werden sollen.',
      notification: 'Danke! Ihre Anfrage wurde erfolgreich übermittelt.',
      error: 'Es gab ein Problem beim Senden der GDPR',
    },
    deleteAccount: {
      title: 'Mein Konto löschen',
      description:
        'Alle Ihre Daten werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
      confirmMessage: 'Sind Sie sicher, dass Sie Ihr Konto löschen wollen?',
      successMessage: 'Konto erfolgreich gelöscht.\n Sie sind abgemeldet.',
    },
    notificationOff: 'Benachrichtigung erfolgreich ausgeschaltet',
    notificationOn: 'Die Benachrichtigung wurde erfolgreich eingeschaltet',
  },

  profileEdit: {
    title: 'Profil bearbeiten',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'EMail',
    phoneNumber: 'Telefonnummer',
    dateOfBirth: 'Geburtsdatum',
    address: 'Vollständige Anschrift\n(Straße, Stadt, Land, Postleitzahl)',
  },
  profileMedicalInfo: {
    title: 'Medizinische Informationen bearbeiten/hinzufügen',
    primaryPhysician: 'Name Ihres Hausarztes',
    primaryPhysicianAddress:
      'Vollständige Adresse Ihres Hausarztes (Straße, Stadt, Land)',
    switchLabel: 'Hatten Sie jemals ernsthafte medizinische Probleme?',
    mostRecentDiagnosis: 'Was war Ihre letzte Diagnose?',
    lastHospitalVisit: 'Datum des letzten Krankenhausbesuchs?',
  },
  lostConnection: {
    text1: 'Keine Internetverbindung',
    text2:
      'Bitte stellen Sie eine Internetverbindung her, um falsche Notfallauslösungen zu vermeiden.',
  },
  airplaneMode: {
    text1: 'Flugzeugmodus ist eingeschaltet',
    text2:
      'Bitte stellen Sie erneut eine Verbindung zum Internet her und stellen Sie sicher, dass das automatische Notfallsystem ausgeschaltet ist, um falsche Notfallauslöser zu vermeiden',
  },
  healthConditionError: {
    title: 'Automatisierter Gesundheitscheck',
    text0:
      'Wir haben ein Gesundheitsproblem festgestellt, weil keine Gesundheitsdaten gesendet wurden.',
    text1:
      'Das automatische Notfallsystem überwacht regelmäßig Ihr Wohlbefinden entsprechend der von Ihnen gewählten Frequenz',
    text3: 'Alles in Ordnung?',
    startEmergency: 'Nein, Notfall starten',
    success:
      'Das positive Signal, dass Sie noch am Leben sind, wurde erfolgreich gesendet',
  },
  healthCheck: {
    title: 'Automatisierter Gesundheitscheck',
    message: 'Positives Signal erfolgreich gesendet ✅.',
  },
  confirmAlert: {
    title: 'Aktion bestätigen',
    text: 'Sind Sie sicher, dass Sie diese Aktion bestätigen wollen?',
  },
  warningFrequencyMessage: {
    android: {
      title: 'Warnung ⚠️ ',
      description:
        'Sie müssen das System möglicherweise anhalten, während Sie schlafen. Außerdem synchronisieren einige Smartwatches Ihre Gesundheitsdaten nicht direkt, was zu falschen Notfallauslösungen führen kann.\n\nSind Sie sicher, dass Sie fortfahren möchten?',
    },
    ios: {
      title: 'Warnung ⚠️ ',
      description:
        'Einige Smartwatches funktionieren nicht Sind Sie sicher, dass Sie diese Aktion bestätigen wollen?',
    },
  },
  bioCheck: {
    messages: {
      unableToSendEmergency: 'Notruf kann nicht gesendet werden',
      airPlaneOff: 'Bitte schalten Sie den Flugzeugmodus aus',
      networkError: 'Netzwerkfehler',
      checkConnection: 'Bitte überprüfen Sie Ihre Internetverbindung',
      offline: 'Sie sind offline',
      pleaseComeBackOnline:
        'Überprüfen Sie bitte Ihre Internetverbindung, um sicherzustellen, dass Sie noch am Leben sind',
      connectToSendEmergency:
        'Bitte verbinden Sie sich, um den Notfall zu senden!',
      automatedEmergency: 'Automatisierter Bio-Check',
      infoSend: 'Positive Gesundheitsinformation gesendet',
      heartRate: 'Herzfrequenz: ',
      restingHeartRate: 'Ruheherzfrequenz: ',
      movement: {
        title: 'Bewegung: ',
        unit: 'Schritte',
      },
      noDataUnit: 'keine Daten',
      noData:
        '⚠️ Keine Daten gefunden, bitte überprüfen Sie Ihre Gesundheitsdatenquelle',
      refresh: 'Aktualisieren Ihrer Gesundheitsdaten...',
      userSendSignal:
        'Positives Signal erfolgreich gesendet ✅. Stellen Sie sicher, dass Sie Ihre Gesundheitsdatenquelle überprüfen!',
    },
  },
  automatedEmergencyStatus: {
    start: {
      title: 'Automatisierter Gesundheitscheck',
      describe: 'Die Biostasis Emergency App prüft Ihre Gesundheitsdaten',
    },
    emergency: 'Notfallprozess starten...',
    restart: 'Automatisiertes Notfallsystem neu gestartet',
    failed:
      'Automatischer Gesundheitscheck wurde nicht gestartet! Bitte überprüfen Sie Ihre Notfalleinstellungen.',
    stop: {
      title: 'Automatischer Gesundheitscheck gestoppt',
      describe:
        'Die Biostasis-Notfall-App wurde aufgrund einer Notfallsituation gestoppt!',
    },
  },
  cryopreservationCompaniesUrls: {
    alcor: 'https://www.alcor.org/',
    cryonicsInstitute: 'https://cryonics.org/',
    southernCryonics: 'https://southerncryonics.com/',
  },
  languages: {
    title: 'Sprache ändern:',
    english: 'Englisch',
    spanish: 'Spanisch',
    german: 'Deutsch',
    french: 'Französisch',
    italian: 'Italienisch',
  },
};

export default translations;
