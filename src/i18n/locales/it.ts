import {ITranslation} from '../interfaces/Translation.interface';

const translations: ITranslation = {
  appName: 'Biostasis',
  onboarding: {
    title: 'App di emergenza Biostasi',
    // slogan: "Ottieni la migliore biostasi medica possibile",
    alreadyUser: 'Sei già un utente Biostasis?',
    slogan:
      'Fornire assistenza e supporto avanzati alla biostasi per un futuro sicuro',
    slide1: {
      label: 'Garantire la sicurezza del vostro viaggio nella biostasi',
      text: 'Con questa app gli altri possono essere avvisati rapidamente se si ha bisogno di crioconservazione, con una risposta più rapida in standby',
    },
    slide2: {
      label:
        'Costruite il vostro sistema di notifica di emergenza personalizzato',
      text: 'Crea contatti di emergenza, personalizza il tuo messaggio di emergenza, carica documenti, configura un sistema di emergenza automatico e altro ancora',
    },
  },
  common: {
    or: 'o',
    and: 'e',
    continue: 'Continua',
    save: 'Salvare',
    confirm: 'Conferma',
    cancel: 'Annulla',
    delete: 'Cancellare',
    welcome: 'Benvenuto {{username}}',
    setUp: 'Impostazione',
    message: 'Messaggio',
    logOut: 'Disconnettersi',
    submit: 'Inviare',
    ok: 'OK',
    retry: 'Riprova',
    yes: 'Sì',
    no: 'No',
    refresh: 'Rinfrescare',
    fine: 'Sto bene',
    startEmergency: "Avvio dell'emergenza",
    setUpPauseTimes: 'Impostazione dei tempi di pausa',
    error: 'Abbiamo alcuni problemi con il nostro servizio',
    errorNetwork: 'Probabilmente sei offline, per favore riconnettiti',
  },
  headers: {
    welcome: 'Benvenuto',
    welcomeUsername: 'Benvenuto, \n{{username}}',
  },
  drawer: {
    logOut: 'Disconnettersi',
    dashboard: 'Cruscotto',
    profile: 'Profilo',
    accountSettings: "Impostazioni dell'account",
    automatedEmergency: 'Impostazioni del sistema di emergenza',
    termsLabel: 'Termini di servizio',
    termsUrl: 'https://www.tomorrow.bio/it/termini-e-condizioni',
    privacyLabel: 'Dichiarazioni sulla privacy',
    privacyUrl: 'https://www.tomorrow.bio/it/privacy',
    uploadDocuments: 'Caricare i documenti',
    AddNewEmergencyContact: 'Aggiungi contatto di emergenza',
    debugInfo: 'Informazioni di debug',
    emergencyContactSettings: 'Impostazioni del contatto di emergenza',
    pauseTimes: 'Pausa del sistema di emergenza',
    signUpForCryopreservation: 'Iscriviti con Tomorrow Bio',
  },
  signUpForTomorrow: {
    title: 'Iscriviti con Tomorrow Bio',
    signUpUrl: 'https://tomorrowbiostasis.com/it/signup/',
    internetError: {
      title: 'Nessuna connessione a Internet',
      description: 'Questa pagina richiede una connessione a Internet!',
    },
  },
  socialMediaUrls: {
    website: 'https://www.tomorrow.bio/it/',
    twitter: 'https://twitter.com/tomorrowbio',
    instagram: 'https://www.instagram.com/tomorrowbio/',
    youtube: 'https://www.youtube.com/channel/UCO-RhsVpguwTJuntw_US0Mw',
  },
  user: {
    updatedSuccessfully: 'I dati sono stati aggiornati con successo',
  },
  LogIn: {
    apple: 'Accedi con Apple',
    google: 'Accedi con Google',
    LogIn: 'Accedi',
    emailTitleLogIn: 'Accedi con il tuo indirizzo email:',
    emailTitleSignUp: 'Iscriviti con la tua email:',
  },
  signUp: {
    apple: 'Iscriviti a Apple',
    google: 'Iscriviti a Google',
    signUp: 'Iscriviti',
    createAccount: 'Crea un nuovo account',
  },
  signOut: {
    disabledAutomatedEmergencyContinue: 'Vuoi continuare?',
    disabledAutomatedEmergency:
      "L'emergenza automatica sarà disattivata dopo il logout!",
  },
  termsAgree: {
    agreeToThe: "Sono d'accordo con il",
    terms: 'Termini',
    privacyPolicy: 'Informativa sulla privacy',
  },
  forgotPassword: {
    screenName: 'Password dimenticata',
    title: 'Hai dimenticato la password?',
    doNotRememberPassword: 'Non ricordi la tua password?',
    enterEmail:
      "Inserisci il tuo indirizzo e-mail. Le invieremo un'e-mail per reimpostare la password",
    enterNewPasswordForEmail: 'Inserisci una nuova password',
    emailSent:
      "Le abbiamo appena inviato un'e-mail per reimpostare la sua password. Controlla la tua casella di posta e apri il link su un dispositivo mobile con l'app Biostasis installata",
    passwordChanged: 'Password aggiornata. Si prega di accedere.',
    resetLinkExpired:
      'Il link per la reimpostazione della password è scaduto.\nPer favore riprova.',
    newPassword: 'Nuova password',
    warning:
      "Assicurarsi di avere già un account registrato utilizzando l'e-mail personalizzata. Si noti che le registrazioni effettuate tramite Apple e Google non funzioneranno",
  },
  placeholder: {
    password: 'la tua password',
    newPassword: 'la tua nuova password',
    confirmNewPassword: 'conferma la nuova password',
    email: 'yours@example.com',
  },
  auth: {
    welcomeTo: 'Benvenuti in Biostasis',
    accountWasCreated:
      "Il vostro account è stato creato. Per attivarlo, controllate la vostra casella di posta e aprite il link su un dispositivo mobile con l'app Biostasis installata",
    invalidCredentials: 'Nome utente o password errati',
    linkExpired: 'Il link è scaduto. Si prega di riprovare',
    accountActivated: 'Il tuo account è stato attivato. Ora puoi accedere',
  },
  defaultError: "L'operazione non è andata a buon fine",
  validation: {
    fieldRequired: 'Questo campo è obbligatorio',
    invalidEmail: 'Indirizzo e-mail non valido',
    email: {
      invalid: 'Indirizzo e-mail non valido',
      accountAlreadyExist: "Esiste già un account con l'e-mail indicata",
    },
    password: {
      tooShort: 'La password è troppo corta',
      whiteSpace: 'La password non può contenere spazi bianchi',
      minLength: 'La password deve contenere almeno 8 caratteri',
    },
    userName: {
      minLength: 'Il nome deve contenere almeno 2 caratteri',
      maxLength: 'Il nome non può essere più lungo di 50 caratteri',
      restrictions: 'Il nome può contenere solo lettere, trattini e spazi',
    },
    emergencySettings: {
      minMaxLength: 'Il testo deve essere lungo 10-1000 caratteri',
    },
    number: {
      incorrectFormat:
        'Il numero di telefono non è corretto. Inserire un numero valido e riprovare',
    },
  },
  userName: {
    title: 'Qual è il suo nome completo?',
    firstName: 'Nome',
    lastName: 'Cognome',
  },
  userPhone: {
    title: 'Qual è il suo numero di telefono?',
    phoneNumber: 'Numero di telefono',
    invalidPhoneNumber: 'Numero di telefono non valido',
  },
  selectAction: {
    whatToDo: 'Cosa vorresti fare?',
    signUpForTheCryopreservation: {
      title: 'Voglio sottoscrivere un contratto di crioconservazione',
      description:
        "Iscriviti al contatto di crioconservazione in soli 15 minuti e completamente online e imposta l'allarme di emergenza",
    },
    storeCryopreservationContract: {
      title: 'Ho già un contratto di crioconservazione e voglio aggiungerlo',
      description:
        'Conservate il contratto di crioconservazione e le direttive anticipate in un luogo sicuro e stabilite i contatti di emergenza',
    },
    useAppForEmergencyManagement: {
      title: "Voglio solo usare l'app per la gestione delle emergenze",
      description:
        'Stabilite i contatti da avvisare in caso di emergenza medica e preparate tutti i documenti di cui potrebbero aver bisogno',
    },
  },
  userDateOfBirth: {
    title: 'Qual è la sua data di nascita?',
    invalidDate: 'Data non valida',
    invalidUserAge: 'Devi avere almeno 18 anni',
    selectDate: 'Seleziona la data',
    label: 'Compleanno:',
  },
  userAddress: {
    title: 'Qual è il suo indirizzo completo?',
    street: 'Via:',
    city: 'Città:',
    country: 'Paese:',
    zipCode: 'Codice postale:',
    currentLocation: 'Posizione attuale',
    wrongAddress:
      "Indirizzo errato, assicurarsi di inserire l'indirizzo esistente",
  },
  emergencyContactsSettings: {
    title: 'Impostazioni dei contatti di emergenza',
    emergencyList: 'Elenco contatti di emergenza',
    emergencyAndSettings: 'Contatti di emergenza e impostazioni',
    makeSureToTestEmergencyContact:
      "Assicuratevi di testare l'attivazione di emergenza con il vostro nuovo contatto, in modo che impari come funziona",
    AddNewEmergencyContact: 'Aggiungi contatto di emergenza',
    emergencyButtonSettings: 'Impostazioni dei messaggi di emergenza',
    addNewEdit: {
      title: 'Informazioni di contatto:',
      firstName: 'Nome (contatto di emergenza)',
      lastName: 'Cognome (contatto di emergenza)',
      email: 'Email (contatto di emergenza)',
      phoneNumber: 'Numero di telefono (contatto di emergenza)',
      errorDuringUpdate:
        "C'è un problema con i dati del modulo. Si prega di controllare la correttezza dei dati e di salvarli nuovamente",
      activateContact: 'Il contatto è stato attivato con successo',
      deactivateContact: 'Il contatto è stato disattivato con successo',
      errorActivate: 'Impossibile attivare il contatto',
      addContact: 'Il contatto è stato aggiunto con successo',
      errorAddContact: 'Impossibile aggiungere il nuovo contatto',
      updateContact: 'Il contatto è stato aggiornato con successo',
      errorUpdateContact:
        'Qualcosa è andato storto. Impossibile aggiornare il contatto',
      deleteContact: 'Il contatto è stato cancellato con successo',
      errorDeleteContact:
        'Qualcosa è andato storto. Impossibile eliminare il contatto',
      alert: {
        title: 'Elimina contatto',
        description: 'Sei sicuro di voler cancellare questo contatto?',
      },
    },
    explanations: {
      description1:
        'Qui è possibile impostare i contatti di emergenza che verranno avvisati in caso di emergenza. È possibile configurare le informazioni da inviare in caso di emergenza, tra cui messaggi di testo/email, posizione e documenti',
      description2:
        "È sempre possibile modificare l'elenco dei contatti di emergenza e il tipo di informazioni/notifiche che devono ricevere",
    },
    settings: {
      disclaimer:
        "Quando viene attivata un'emergenza, vengono inviati un'e-mail e un messaggio di testo a tutti i contatti di emergenza",
      sendEmailAndTextMessage: 'Invia e-mail e messaggio di testo',
      includeInfo: 'Includi queste informazioni:',
      location: 'Posizione',
      uploadedDocuments: 'Documenti caricati',
      sendTestEmail: "Inviami un'e-mail di prova",
      defaultMessage:
        'Questo è un segnale di emergenza da parte di {{username}}. Stai ricevendo questo messaggio perché potrei aver bisogno di una crioconservazione Informazioni aggiuntive qui e in allegato',
      testMessageSent:
        'Email di prova inviata. Controlla la tua casella di posta.',
    },
    documents: {
      title: 'Documenti',
      topInfo:
        "Questi documenti saranno inviati ai vostri contatti di emergenza quando scatterà un'emergenza",
      addDocument: 'Aggiungi documento',
      headers: {
        directive: 'direttiva medica',
        lastWill: 'Ultime volontà',
        other: 'Altro',
      },
      upload: {
        directive: 'Carica direttiva medica',
        lastWill: 'Carica le ultime volontà',
        other: 'Carica un altro documento',
      },
      messages: {
        errors: {
          upload: 'Errore durante il caricamento: {{error}}',
          fileWrongType: 'Il file è danneggiato o in formato errato',
          fetching: 'Errore durante il recupero dei documenti: {{error}}',
          remove: 'Errore durante la cancellazione del documento: {{error}}',
        },
        success: {
          upload: 'Il documento è stato salvato con successo',
          remove: 'Il documento è stato eliminato con successo',
        },
        uploadStarted: 'Caricamento file avviato',
      },
      alert: {
        title: 'Elimina documento',
        description: 'Sei sicuro di voler cancellare questo documento?',
      },
    },
    confirmationModal: {
      title: 'Conferma la cancellazione. Sei sicuro?',
    },
    automatedEmergencySettings: {
      title: 'Impostazioni di emergenza',
      enableSystemTitle: 'Impostazioni automatiche di emergenza',
      instructions: 'Leggere le istruzioni',
      compatibleSmartDeviceConnected: 'Smartdevice compatibile connesso',
      pleaseReadManual:
        'Leggere il manuale del sistema di emergenza automatizzato prima di attivare il sistema',
      systemDescription:
        'Questo sistema invia automaticamente un segnale di emergenza in base a una serie di dati provenienti da uno smartdevice con dati sulla salute',
      manualDescription: 'Manuale del sistema di emergenza automatizzato',
      confirmReadManual: 'Conferma la lettura del manuale',
      enableAutomatedEmergency: "Abilita l'emergenza automatica",
      setUpSmartDevice: 'Imposta dispositivo intelligente',
      connectedSmartDevice: 'Connesso con {{device}}',
      pauseAutomatedEmergency: 'Pause Automated Emergency',
      setUpSpecificTimes: 'Imposta orari specifici {{specificTimes}}',
      automatedEmergencyDisabledFor:
        "L'emergenza automatica è disabilitata per {{pauseTime}}",
      cancelEmergencyPause: 'Annulla la pausa di emergenza automatica',
      youStillHavePause:
        "La pausa è ancora attiva. Ricordare che se si abilita l'emergenza automatica, la pausa verrà mantenuta per {{pauseTime}}",
      frequencySet: 'Frequenza impostata con successo su',
      bioTrigger: {
        title: 'Innesco a base biologica',
        permissions: {
          title: 'Dai permessi alla salute',
          alertTitle: 'Autorizzazioni sanitarie',
          alertDescription:
            'Vi verrà chiesto di autorizzare Biostasis ad accedere ai vostri dati sanitari. Si prega di confermare',
        },
        turnOn: 'Bio-based',
        warning: "L'attivazione di biobase disabilita l'innesco a tempo!",
        appleWatch: {
          title: "L'Apple Watch è accoppiato",
          description:
            "Utilizziamo il vostro Apple Watch (grazie all'integrazione con HealthKit) per recuperare i vostri dati sulla salute. Se non ne usi uno, scegli invece il sistema di attivazione basato sul tempo",
          alertTitle: 'Accoppiamento Apple Watch',
          alertDescription:
            "Per sincronizzare i dati sanitari, l'Apple Watch deve essere associato all'iPhone. Assicurarsi che sia accoppiato correttamente. In caso contrario, seguire le istruzioni dell'app Watch iOS",
        },
        googleFit: {
          title: 'Autentica Google Fit',
          description:
            "Utilizziamo Google Fit per recuperare i dati sulla salute. Autenticare e configurare l'app companion del dispositivo. Alcuni dispositivi non sono in grado di sincronizzarsi con Google Fit. In questo caso, scegliere il sistema di attivazione basato sul tempo",
          connect: "Connetti l'app a Google Fit",
          alertTitle1: 'Authenticate',
          alertDescription1:
            "Autenticare Google Fit per consentire a Biostasis di accedere ai dati sanitari del registratore. Se non avete installato l'app Google Fit, installatela prima da Google Play",
          alertTitle2: 'Aggiungi Google Fit',
          alertDescription2:
            "Aprire la sezione Preferenze nell'applicazione companion dell'orologio o del fitness band. Trovare la sezione Aggiungi account o una sezione simile. Scegliere Google Fit e superare la procedura di autorizzazione",
        },
        backgroundModes: {
          title: 'Abilita le modalità di sfondo',
          alertTitle: 'Abilita le modalità di sfondo',
          alertDescription:
            "Aprire la sezione Preferenze nell'applicazione companion dell'orologio o del fitness band. Trovare quindi una sezione con la dicitura Autorizzazioni o simili. Individuare le modalità di sfondo e attivarle",
        },
        frequency: 'Tempo di attivazione di emergenza:',
      },
      systemOff: 'Il sistema è spento',
      systemOn: 'Il sistema è acceso',
      systemOffMessage:
        'Sistema di emergenza automatizzato disattivato con successo',
      timeTrigger: {
        title: 'Innesco a tempo',
        description:
          'Invieremo notifiche ogni tot di tempo. Nel caso in cui non si risponda a una di esse, verrà attivato il sistema di emergenza. La notte (dalle 22 alle 6) è esclusa',
        frequency: 'Tempo di attivazione di emergenza:',
        systemStart: 'Il sistema automatico a tempo è in funzione',
        turnOn: 'Time-based',
        warning:
          "L'attivazione del tempo disabilita l'innesco a base biologica!",
      },
      pauseTime: {
        title: 'Impostazione dei tempi di pausa del sistema',
        description:
          'Impedire che il sistema di emergenza si attivi per periodi di tempo ricorrenti o temporanei',
      },
      time: {
        hours: '{{count}} ore',
        hoursDefault: '{{count}} ore (predefinito)',
        minutes: '{{count}} minuti',
        minutesDefault: '{{count}} minuti (predefinito)',
        minutesDev: '{{count}} minuti (dev)',
      },
      interval: {
        title: "Scegliere l'intervallo",
      },
      readLess: 'Read Less',
      readMore: 'Leggi di più',
      seeAll: 'Vedi tutti',
      collapse: 'Collasso',
    },
    dayTimePicker: {
      invalidDate: 'Data non valida',
      dateFormat24: 'La data deve essere in formato 24h',
      dateFormat12: 'La data deve essere in formato 12h',
    },
  },
  dashboard: {
    title: 'Biostasi medica a portata di mano',
    profile: {
      title: 'Profilo e informazioni mediche',
      description:
        'Assicuratevi che le vostre informazioni vitali siano sempre aggiornate e facilmente accessibili',
    },
    contacts: {
      title: 'Gestione delle impostazioni di emergenza',
      description:
        'Configurate i vostri contatti di emergenza e scegliete come notificarli in caso di emergenza',
      notActive: 'Impostare i contatti di emergenza',
      active: 'Impostazione completata',
    },
    automatedEmergency: {
      title: 'Sistema di emergenza automatizzato',
      description:
        "Impostare e attivare un sistema di emergenza automatizzato per controllare l'utente utilizzando diversi fattori di emergenza",
      active: {
        bioTrigger: 'Innesco a base biologica',
        timeTrigger: 'Innesco a tempo',
      },
      notActive: 'Imposta sistema automatico',
      recommendationDaysLeft:
        'Il sistema di raccomandazioni analizza i dati sulla salute e fornisce raccomandazioni personalizzate ogni settimana. La prossima raccomandazione è tra {{daysLeft}}. ',
      days: 'giorni',
      day: 'giorno',
      recommendationMessage:
        "In base ai suoi dati sanitari, le consigliamo di scegliere le ore di {{recommendedPeriod}} come periodo di attivazione dell'emergenza",
    },
    documents: {
      title: 'Documenti',
      description:
        'Caricare documenti essenziali come le ultime volontà, le direttive anticipate del paziente e altro ancora',
    },
    signUpForCryopreservation: {
      tomorrowBio: {
        title: 'Iscriviti con Tomorrow Bio',
        description: 'Provider europeo con una forte infrastruttura SST',
        footer: 'Per saperne di più e iscriversi',
      },
      alcor: {
        title: 'Iscriviti ad Alcor',
        description:
          'Fornitore negli Stati Uniti con esperienza a lungo termine',
        footer: 'Per saperne di più',
      },
      cryonicsInstitute: {
        title: 'Iscriviti al Cryonics Institute',
        description:
          "Un'organizzazione membro che fornisce servizi di crionica",
      },
      southernCryonics: {
        title: 'Iscriviti a Southern Cryonics',
        description:
          "Un'organizzazione senza scopo di lucro gestisce la prima struttura di stoccaggio criogenico dell'Australia",
      },
    },
    customizeMessage: {
      title: 'Personalizza messaggio di emergenza',
      description:
        "Modificare il messaggio e l'e-mail inviati ai propri contatti durante una situazione di emergenza",
    },
    emergency: {
      countdown: 'EMERGENZA',
      countdownSent: 'EMERGENZA INVIATA',
      countdownRetrying: 'quasi arrivato',
      countdownCanceled: 'EMERGENZA ANNULLATA',
      countdownSubtitleHold: 'Attendere per attivare',
      countdownSubtitleBeing: 'Si stanno inviando informazioni',
      countdownSubtitleDone: 'ALL DONE',
      countdownSubtitleRetrying: 'WORKING...',
      setUpContacts: 'IMPOSTA CONTATTI DI EMERGENZA',
      cancel: 'Annulla',
      ok: 'OK',
      enableContacts: 'Abilita i contatti di emergenza',
      error: 'Si è verificato un problema con il servizio. Riprovare',
      noContacts: 'Non hai aggiunto alcun contatto',
    },
    sections: {
      userProfile: 'I miei dati',
      emergencySystem: 'Impostazioni del sistema di emergenza',
      signUp: 'Iscriviti alla crioconservazione',
    },
  },
  location: {
    location: 'Posizione',
    locationPermissionDenied: 'Autorizzazione alla localizzazione negata',
    unableToOpenSettings: 'Impossibile aprire le impostazioni',
    turnOnLocationFromSettings:
      'Attivare i servizi di localizzazione per consentire a "Biostasis" di determinare la vostra posizione',
    goToSettings: 'Vai alle impostazioni',
    notEnoughsPermissions:
      'L\'applicazione Biostasis richiede costantemente informazioni sulla posizione. Per consentire l\'uso della vostra posizione, andate nelle impostazioni della privacy e selezionate "sempre"',
  },
  notifications: {
    goToSettings: 'Vai alle impostazioni',
    permissionsError:
      'La funzione Biostasis richiede le autorizzazioni per le notifiche push',
  },
  time: {
    short: {
      m: 'min',
      h: 'h',
    },
    lessThanMinute: 'meno di un minuto',
    m: '1 minuto',
    mm: '{{m}} minuti',
    h: '1 ora{{secondPrecision}}',
    hh: '{{h}} ore{{secondPrecision}}',
    d: '1 giorno{{secondPrecision}}',
    dd: '{{d}} giorni{{secondPrecision}}',
  },
  specificTimesScreen: {
    title: 'Sistema di emergenza in pausa',
    pauseNow: {
      title: 'Metti subito in pausa il sistema di emergenza',
      description:
        "È possibile mettere temporaneamente in pausa il sistema automatico di emergenza dal momento attuale fino a un'ora specifica di vostra scelta",
      cancelMessage:
        'La messa in pausa del sistema di emergenza automatico è stata annullata con successo',
      startDisclaimer: 'Toccare qui per mettere subito in pausa il sistema',
      pausedDisclaimer:
        'Il sistema è in pausa ora. Toccare di nuovo qui per annullare la pausa',
    },
    specificTimes: {
      title: 'Impostazione di orari specifici',
      description:
        'Disattivare ripetutamente il sistema automatico in determinati periodi della settimana/giorni',
      start: 'Inizio:',
      end: 'Fine:',
      addAdditionalTime: 'Aggiungi tempo supplementare',
      startSection: {
        pickDay: 'Scegliere il giorno o i giorni di inizio',
        pickTime: "Imposta l'ora di inizio",
      },
      endSection: {
        pickDay: 'Scegliere il giorno o i giorni finali',
        pickTime: 'Imposta ora di fine',
      },
      daysFullName: {
        everyday: 'Tutti i giorni',
        monday: 'Lunedì',
        tuesday: 'Martedì',
        wednesday: 'Mercoledì',
        thursday: 'Giovedì',
        friday: 'Venerdì',
        saturday: 'Sabato',
        sunday: 'Domenica',
      },
      daysShortName: {
        everyday: 'Tutti i giorni',
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mer',
        thursday: 'Gio',
        friday: 'Veb',
        saturday: 'Sab',
        sunday: 'Dom',
      },
      changeSettings: "Impostazioni dell'ora modificate con successo",
    },
  },
  profileDefault: {
    title: 'Profilo e informazioni mediche',
    medicalInfo: {
      title: 'Informazioni mediche',
      description:
        'Tenere aggiornate le informazioni mediche può contribuire a migliorare la qualità della crioconservazione',
      footer: 'Modifica informazioni mediche',
    },
    editProfile: {
      title: 'Profilo e dati utente',
      description:
        "È possibile aggiornare e modificare le proprie informazioni in qualsiasi momento, garantendo l'invio di dati accurati ai contatti di emergenza designati",
      footer: 'Modifica profilo',
    },
    accountSettings: {
      title: 'Impostazioni account',
      description:
        "Gestire e personalizzare le impostazioni del proprio account per garantire un'esperienza personalizzata in base alle proprie preferenze ed esigenze",
      footer: 'Modifica impostazioni',
    },
  },
  accountSettings: {
    title: "Impostazioni dell'account",
    allowNotifications: 'Consenti notifiche',
    receiveTipsAndTricks: 'Ricevi suggerimenti e trucchi',
    GDPR: {
      title: 'Richiesta di dati salvati (GDPR)',
      description:
        'Richiedi una copia dei tuoi dati salvati in conformità alle norme GDPR per garantire la trasparenza e la sicurezza delle tue informazioni',
      label:
        "Indicare l'indirizzo e-mail al quale si desidera che vengano inviati i dati",
      notification: 'Grazie! La richiesta è stata inoltrata con successo',
      error: "Si è verificato un problema con l'invio del GDPR",
    },
    deleteAccount: {
      title: 'Elimina il mio account',
      description:
        'Rimuove definitivamente tutti i dati. Questa azione non può essere annullata',
      confirmMessage: 'Sei sicuro di voler cancellare il tuo account?',
      successMessage: 'Account cancellato con successo.\n Ti sei disconnesso.',
    },
    notificationOff: 'Notifica disattivata con successo',
    notificationOn: 'Notifica attivata con successo',
  },

  profileEdit: {
    title: 'Modifica profilo',
    firstName: 'Nome',
    lastName: 'Cognome',
    email: 'Email',
    phoneNumber: 'Numero di telefono',
    dateOfBirth: 'Data di nascita',
    address:
      'indirizzo: Indirizzo completo (via, città, paese, codice postale)',
  },
  profileMedicalInfo: {
    title: 'Modifica/Aggiungi informazioni mediche',
    primaryPhysician: 'Nome del medico di base',
    primaryPhysicianAddress:
      'Indirizzo completo del medico di base (via, città, paese)',
    switchLabel: 'Ha mai avuto problemi medici gravi?',
    mostRecentDiagnosis: 'Qual è stata la sua diagnosi più recente?',
    lastHospitalVisit: "Data dell'ultima visita in ospedale?",
  },
  lostConnection: {
    text1: 'Nessuna connessione a Internet',
    text2: 'Si prega di connettersi a Internet per evitare false emergenze',
  },
  airplaneMode: {
    text1: 'La modalità aereo è attiva',
    text2:
      'Connettetevi di nuovo a Internet e assicuratevi di disattivare il sistema di emergenza automatico per evitare falsi allarmi',
  },
  healthConditionError: {
    title: 'Controllo automatico dello stato di salute',
    text0:
      'Abbiamo rilevato un problema di salute, perché non sono stati inviati dati sanitari',
    text1:
      'Il sistema di emergenza automatico monitora regolarmente il vostro benessere in base alla frequenza da voi scelta',
    text3: 'Stai bene?',
    startEmergency: "No, avviare l'emergenza",
    success:
      'Il segnale positivo che indica che siete ancora vivi è stato inviato con successo',
  },
  healthCheck: {
    title: 'Controllo automatico dello stato di salute',
    message: 'Segnale positivo inviato con successo ✅.',
  },
  confirmAlert: {
    title: "Conferma l'azione",
    text: 'Sei sicuro di voler confermare questa azione?',
  },
  warningFrequencyMessage: {
    android: {
      title: 'Avviso ⚠️',
      description:
        'Potrebbe essere necessario mettere in pausa il sistema mentre si dorme. Inoltre, alcuni smartwatch non sincronizzano direttamente i dati sulla salute, il che può portare a falsi segnali di emergenza',
    },
    ios: {
      title: 'Avviso ⚠️',
      description:
        'Alcuni orologi intelligenti non Sono sicuro di confermare questa azione?',
    },
  },
  bioCheck: {
    messages: {
      unableToSendEmergency: "Impossibile inviare l'emergenza",
      airPlaneOff: 'Disattivare la modalità aereo',
      networkError: 'Errore di rete',
      checkConnection: 'Controlla la tua connessione a Internet',
      offline: 'Sei offline',
      pleaseComeBackOnline:
        'Controlla la tua connessione a Internet per assicurarti di essere ancora vivo',
      connectToSendEmergency:
        "Si prega di connettersi per inviare l'emergenza!",
      automatedEmergency: 'Controllo biologico automatizzato',
      infoSend: 'Invio di informazioni sanitarie positive',
      heartRate: 'Frequenza cardiaca: ',
      restingHeartRate: 'Frequenza cardiaca a riposo: ',
      movement: {
        title: 'Movimento: ',
        unit: 'passi',
      },
      noDataUnit: 'nessun dato',
      noData: '⚠️ Nessun dato trovato, controllare la fonte dei dati sanitari',
      refresh: 'Aggiornamento dei dati sanitari...',
      userSendSignal:
        'Segnale positivo inviato con successo ✅. Assicurarsi di controllare la fonte dei dati sanitari!',
    },
  },
  automatedEmergencyStatus: {
    start: {
      title: 'Controllo automatico dello stato di salute',
      describe: "L'App Biostasis Emergency controlla i vostri dati sanitari",
    },
    emergency: 'Avvio del processo di emergenza...',
    restart: 'Sistema automatico di emergenza riavviato',
    failed:
      'Il controllo automatico dello stato di salute non è stato avviato! Controllare le impostazioni di emergenza',
    stop: {
      title: 'Controllo sanitario automatizzato interrotto',
      describe:
        "L'App Biostasis Emergency è stata interrotta a causa di una situazione di emergenza",
    },
  },
  cryopreservationCompaniesUrls: {
    alcor: 'https://www.alcor.org/',
    cryonicsInstitute: 'https://cryonics.org/',
    southernCryonics: 'https://southerncryonics.com/',
  },
  languages: {
    title: 'Cambia lingua:',
    english: 'Inglese',
    spanish: 'Spanish',
    german: 'Tedesco',
    french: 'Francese',
    italian: 'Italiano',
  },
};

export default translations;
