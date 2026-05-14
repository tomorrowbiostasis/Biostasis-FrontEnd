import {ITranslation} from '../interfaces/Translation.interface';

const translations: ITranslation = {
  appName: 'Biostasis',
  onboarding: {
    next: 'Suivant',
    getStarted: 'Commencer',
    skipIntro: "Passer l'intro",
    slide1: {
      badge: 'SÉCURITÉ BIOSTASIS',
      title: 'Votre urgence, notre priorité.',
      body: "Si vous avez un jour besoin d'une cryopréservation, cette application garantit que les bonnes personnes sont prévenues immédiatement — pour une intervention plus rapide.",
    },
    slide2: {
      badge: "ALERTES D'URGENCE",
      title: 'Construisez votre réseau de notifications.',
      body: "Ajoutez des contacts d'urgence, définissez des messages personnalisés, téléversez des documents et configurez des déclencheurs automatiques — le tout au même endroit.",
    },
    slide3: {
      badge: 'RÉPONSE RAPIDE',
      title: 'Soins avancés, prêts quand cela compte.',
      body: "Biostasis vous met en relation avec des équipes d'intervention d'urgence formées pour un soutien à la cryopréservation plus rapide et mieux coordonné.",
    },
  },
  welcome: {
    eyebrow: 'BIOSTASIS',
    title: "Soins d'urgence, à portée de main.",
    tagline:
      "Alertes instantanées. Systèmes automatisés. Tranquillité d'esprit quand cela compte le plus.",
    createAccount: 'Créer un compte',
    logIn: 'Se connecter',
    termsPrefix: 'En continuant, vous acceptez nos',
    terms: "Conditions d'utilisation",
    and: '&',
    privacy: 'Politique de confidentialité',
  },
  common: {
    or: 'ou',
    and: 'et',
    continue: 'Continuer',
    save: 'sauver',
    confirm: 'Confirmación',
    cancel: 'Annuler',
    delete: 'Supprimer',
    welcome: 'Bienvenue {{username}}',
    setUp: 'Mise en place',
    message: 'Message',
    logOut: 'Déconnexion',
    submit: 'Soumettre',
    ok: 'OK',
    retry: 'Réessayer',
    yes: 'Oui',
    no: 'Non',
    refresh: 'Rafraîchir',
    fine: 'Je vais bien',
    startEmergency: "Démarrer l'urgence",
    setUpPauseTimes: 'Temps de pause',
    error: 'Nous avons des problèmes avec notre service',
    errorNetwork:
      'Vous êtes probablement hors ligne, veuillez vous reconnecter',
  },
  headers: {
    welcome: 'Bienvenue',
    welcomeUsername: 'Bienvenue,\n{{username}}',
  },
  drawer: {
    logOut: 'Déconnexion',
    dashboard: 'Accueil',
    profile: 'Profil',
    accountSettings: 'Paramètres du compte',
    automatedEmergency: "Paramètres du système d'urgence",
    termsLabel: 'Conditions de service',
    termsUrl: 'https://www.tomorrow.bio/fr/conditions-générales',
    privacyLabel: 'Déclarations de confidentialité',
    privacyUrl: 'https://www.tomorrow.bio/fr/vie-privée',
    uploadDocuments: 'Télécharger des documents',
    AddNewEmergencyContact: "Ajouter un contact d'urgence",
    debugInfo: 'Debug Info',
    emergencyContactSettings: "Paramètres de contact d'urgence",
    pauseTimes: "Mise en pause du système d'urgence",
    signUpForCryopreservation: "S'inscrire avec Tomorrow Bio",
    devLogs: 'Journal de santé actuel',
    devHistoryLogs: 'Journal de santé précédent',
    devPushLogs: 'Journal de push actuel'
  },
  signUpForTomorrow: {
    title: "S'inscrire avec Tomorrow Bio",
    signUpUrl: 'https://member.tomorrow.bio/fr/signup/start',
    internetError: {
      title: 'Pas de connexion internet',
      description: 'Cette page nécessite une connexion internet',
    },
  },
  socialMediaUrls: {
    website: 'https://www.tomorrow.bio/fr/',
    twitter: 'https://twitter.com/tomorrowbio',
    instagram: 'https://www.instagram.com/tomorrowbio/',
    youtube: 'https://www.youtube.com/channel/UCO-RhsVpguwTJuntw_US0Mw',
  },
  user: {
    updatedSuccessfully: 'Vos données ont été mises à jour avec succès',
  },
  LogIn: {
    apple: 'Se connecter avec Apple',
    google: 'Se connecter avec Google',
    LogIn: 'Se connecter',
    emailTitleLogIn: 'Connectez-vous avec votre email:',
    emailTitleSignUp: 'Inscrivez-vous avec votre e-mail :',
  },
  signUp: {
    apple: "S'inscrire auprès d'Apple",
    google: "S'inscrire avec Google",
    signUp: "S'inscrire",
    createAccount: 'Créer un nouveau compte',
  },
  signOut: {
    disabledAutomatedEmergencyContinue: 'Voulez-vous continuer ?',
    disabledAutomatedEmergency:
      'urgence automatisée sera désactivée après votre déconnexion',
  },
  termsAgree: {
    agreeToThe: "Je suis d'accord avec le",
    terms: 'Termes',
    privacyPolicy: 'Politique de confidentialité',
  },
  forgotPassword: {
    screenName: 'Mot de passe oublié',
    title: 'Vous avez oublié votre mot de passe ?',
    doNotRememberPassword: 'Vous ne vous souvenez pas de votre mot de passe ?',
    enterEmail:
      'Veuillez saisir votre adresse e-mail. Nous vous enverrons un courriel pour réinitialiser votre mot de passe',
    enterNewPasswordForEmail: 'Entrez un nouveau mot de passe',
    emailSent:
      "Nous venons de vous envoyer un e-mail pour réinitialiser votre mot de passe. Vérifiez votre boîte de réception et ouvrez le lien sur un appareil mobile avec l'application Biostasis installée",
    passwordChanged: 'Mot de passe mis à jour. Veuillez vous connecter',
    resetLinkExpired: 'Le lien de réinitialisation du mot de passe a expiré.',
    newPassword: 'Nouveau mot de passe',
    warning:
      "Assurez-vous que vous avez déjà un compte enregistré en utilisant votre courriel personnalisé. Notez que les enregistrements effectués par l'intermédiaire d'Apple et de Google ne seront pas fonctionnels",
  },
  placeholder: {
    password: 'votre mot de passe',
    newPassword: 'votre nouveau mot de passe',
    confirmNewPassword: 'confirmez votre nouveau mot de passe',
    email: 'yours@example.com',
  },
  auth: {
    welcomeTo: 'Bienvenue à Biostasis',
    accountWasCreated:
      "Votre compte a été créé. Pour l'activer, vérifiez votre boîte de réception et ouvrez le lien sur un appareil mobile avec l'application Biostasis installée",
    invalidCredentials: "Nom d'utilisateur ou mot de passe incorrect",
    linkExpired: 'Le lien a expiré. Veuillez réessayer',
    accountActivated:
      'Votre compte a été activé. Vous pouvez maintenant vous connecter',
  },
  defaultError: "L'opération n'a pas abouti",
  validation: {
    fieldRequired: 'Ce champ est obligatoire',
    invalidEmail: 'Adresse électronique non valide',
    email: {
      invalid: 'Adresse électronique non valide',
      accountAlreadyExist: "Un compte avec l'email donné existe déjà",
    },
    password: {
      tooShort: 'Le mot de passe est trop court',
      whiteSpace: "Le mot de passe ne peut pas contenir d'espace blanc",
      minLength: 'Le mot de passe doit contenir au moins 8 caractères',
    },
    userName: {
      minLength: 'Le nom doit contenir au moins 2 caractères',
      maxLength: 'Le nom ne peut pas dépasser 50 caractères',
      restrictions:
        "Le nom ne peut contenir que des lettres, des traits d'union et des espaces",
    },
    emergencySettings: {
      minMaxLength: 'Le texte doit comporter entre 10 et 1000 caractères',
    },
    number: {
      incorrectFormat:
        "Le numéro de téléphone n'est pas correct. Veuillez saisir un numéro valide et réessayer",
    },
  },
  userName: {
    title: 'Quel est votre nom complet ?',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
  },
  userPhone: {
    title: 'Quel est votre numéro de téléphone ?',
    phoneNumber: 'Numéro de téléphone',
    invalidPhoneNumber: 'Numéro de téléphone non valide',
  },
  selectAction: {
    whatToDo: "Qu'aimeriez-vous faire ?",
    signUpForTheCryopreservation: {
      title: 'Je veux souscrire un contrat de cryoconservation',
      description:
        "S'inscrire au contact de cryoconservation en seulement 15 minutes et entièrement en ligne et mettre en place une alerte d'urgence",
    },
    storeCryopreservationContract: {
      title: "J'ai déjà un contrat de cryoconservation et je veux l'ajouter",
      description:
        "Conservez votre contrat de cryoconservation et vos directives anticipées dans un endroit sûr et établissez des contacts en cas d'urgence",
    },
    useAppForEmergencyManagement: {
      title:
        "Je veux juste utiliser l'application pour la gestion des urgences",
      description:
        "Établissez les contacts à prévenir en cas d'urgence médicale et préparez tous les documents dont ils pourraient avoir besoin",
    },
  },
  userDateOfBirth: {
    title: 'Quelle est votre date de naissance ?',
    invalidDate: 'Date non valide',
    invalidUserAge: 'Vous devez avoir au moins 18 ans',
    selectDate: 'Sélectionner une date',
    label: 'Birthday:',
  },
  userAddress: {
    title: 'Quelle est votre adresse complète ?',
    street: 'Rue :',
    city: 'Ville :',
    country: 'Pays :',
    zipCode: 'Code postal:',
    currentLocation: 'Lieu actuel',
    wrongAddress: "Adresse erronée, veillez à saisir l'adresse existante",
  },
  emergencyContactsSettings: {
    title: "Paramètres des contacts d'urgence",
    emergencyList: "Liste des contacts en cas d'urgence",
    emergencyAndSettings: "Contacts d'urgence et paramètres",
    makeSureToTestEmergencyContact:
      "N'oubliez pas de tester votre déclencheur d'urgence avec votre nouveau contact pour qu'il apprenne comment il fonctionne",
    AddNewEmergencyContact: "Ajouter un contact d'urgence",
    emergencyButtonSettings: "Paramètres du message d'urgence",
    addNewEdit: {
      title: 'Informations de contact :',
      firstName: "Prénom (personne à contacter en cas d'urgence)",
      lastName: "Nom de famille (personne à contacter en cas d'urgence)",
      email: "Email (Contact d'urgence)",
      phoneNumber: "Numéro de téléphone (contact d'urgence)",
      errorDuringUpdate:
        "Il y a un problème avec les données du formulaire. Veuillez vérifier l'exactitude des données et les enregistrer à nouveau",
      activateContact: 'Le contact a été activé avec succès',
      deactivateContact: 'Le contact a été désactivé avec succès',
      errorActivate: "Impossible d'activer le contact",
      addContact: 'Le contact a été ajouté avec succès',
      errorAddContact: "Impossible d'ajouter le nouveau contact",
      updateContact: 'Le contact a été mis à jour avec succès',
      errorUpdateContact:
        "Quelque chose n'a pas fonctionné. Impossible de mettre à jour le contact",
      deleteContact: 'Le contact a été supprimé avec succès',
      errorDeleteContact:
        "Quelque chose n'a pas fonctionné. Impossible de supprimer le contact",
      alert: {
        title: 'Delete Contact',
        description: 'Êtes-vous sûr de vouloir supprimer ce contact ?',
      },
    },
    explanations: {
      description1:
        "Vous pouvez configurer ici les contacts d'urgence qui seront avertis en cas d'urgence. Vous pouvez configurer les informations à envoyer en cas d'urgence, y compris les messages texte/email, la localisation et les documents",
      description2:
        "Vous pouvez toujours modifier la liste des contacts d'urgence et le type d'informations/notifications qu'ils doivent recevoir",
    },
    settings: {
      disclaimer:
        "Un courriel et un SMS seront envoyés à tous les contacts d'urgence en cas de déclenchement d'une situation d'urgence",
      sendEmailAndTextMessage: 'Envoyer un courriel et un message texte',
      includeInfo: 'Inclure ces informations:',
      location: 'Emplacement',
      uploadedDocuments: 'Documents téléchargés',
      sendTestEmail: 'Envoyez-moi un courriel de test',
      defaultMessage:
        "Ceci est un signal d'urgence de la part de {{nomdutilisateur}}. Vous recevez ce message parce que je pourrais avoir besoin d'une cryoconservation Informations supplémentaires ici et en pièce jointe",
      testMessageSent:
        "Envoi d'un courriel de test. Veuillez vérifier votre boîte de réception",
    },
    documents: {
      title: 'Documents',
      topInfo:
        "Ces documents seront envoyés à vos contacts d'urgence lorsque vous déclencherez une situation d'urgence",
      addDocument: 'Ajouter un document',
      headers: {
        directive: 'Directive médicale',
        lastWill: 'Dernière volonté',
        other: 'Autre',
      },
      upload: {
        directive: 'Cargar la directiva médica',
        lastWill: 'Télécharger le dernier testament',
        other: 'Télécharger un autre document',
      },
      messages: {
        errors: {
          upload: 'Erreur lors du téléchargement : {{erreur}}',
          fileWrongType: 'Le fichier est corrompu ou dans le mauvais format',
          fetching: 'Erreur lors de la récupération des documents : {{erreur}}',
          remove: 'Erreur lors de la suppression du document : {{erreur}}',
        },
        success: {
          upload: 'Le document a été sauvegardé avec succès',
          remove: 'Le document a été supprimé avec succès',
        },
        uploadStarted: 'File upload started',
      },
      alert: {
        title: 'Delete Document',
        description: 'Êtes-vous sûr de vouloir supprimer ce document ?',
      },
    },
    confirmationModal: {
      title: 'Confirmation de la suppression. Êtes-vous sûr ?',
    },
    automatedEmergencySettings: {
      title: "Réglages d'urgence",
      enableSystemTitle: 'Ajustes automáticos de emergencia',
      compatibleSmartDeviceConnected:
        'Appareil intelligent compatible connecté',
      confirmReadManual: 'Je comprends comment ça fonctionne',
      howItWorks: {
        title: 'Comment ça fonctionne',
        step1Title: 'Connecter',
        step1Desc:
          'Associez votre wearable ou utilisez les capteurs intégrés de votre téléphone (pas, fréquence cardiaque).',
        step2Title: 'Surveiller',
        step2Desc:
          "L'application vérifie régulièrement vos données de santé. Si aucun signal n'est détecté, vous recevrez d'abord une notification d'avertissement.",
        step3Title: 'Urgence',
        step3Desc:
          "S'il n'y a toujours pas de réponse, le système déclenche une alerte à vos contacts d'urgence.",
      },
      enableAutomatedEmergency: "Activer l'urgence automatisée",
      setUpSmartDevice: 'Configurer un appareil intelligent',
      connectedSmartDevice: 'Connecté avec {{appareil}}',
      pauseAutomatedEmergency: "Mettre en pause l'urgence automatisée",
      setUpSpecificTimes: 'Configurer des heures spécifiques {{specificTimes}}',
      automatedEmergencyDisabledFor:
        "L'urgence automatisée est désactivée pour {{pauseTime}}",
      cancelEmergencyPause: "Annuler la pause d'urgence automatisée",
      youStillHavePause:
        "La pause est toujours active. N'oubliez pas que si vous activez l'urgence automatisée, elle sera mise en pause pendant {{pauseTime}}",
      frequencySet: 'Fréquence réglée avec succès sur',
      bioTrigger: {
        title: 'Déclencheur biosourcé',
        permissions: {
          title: 'Donner des autorisations en matière de santé',
          alertTitle: 'Permissions de santé',
          alertDescription:
            'Vous serez invité à autoriser Biostasis à accéder à vos données de santé. Veuillez confirmer',
        },
        turnOn: 'Biologique',
        warning:
          "L'activation de la base biologique désactivera le déclencheur temporel",
        appleWatch: {
          title: 'Appareil portable connecté',
          description:
            "Nous utilisons votre appareil portable (grâce à l’intégration de HealthKit) pour récupérer vos données de santé. Si vous n’en utilisez pas, veuillez choisir plutôt le système de déclenchement basé sur le temps.",
          alertTitle: 'Appairer l’appareil portable',
          alertDescription:
            "Votre appareil portable doit être appairé avec votre iPhone afin de synchroniser vos données de santé. Veuillez vérifier qu’il est bien appairé. Sinon, suivez les instructions dans l’application compagnon de l’appareil.",
        },
        googleFit: {
          title: 'Authentifier Google Fit',
          description:
            "Nous utilisons Google Fit pour récupérer vos données de santé. Veuillez vous authentifier et configurer l'application compagnon de l'appareil. Certains appareils ne peuvent pas se synchroniser avec Google Fit. Dans ce cas, veuillez choisir le système de déclenchement basé sur le temps",
          connect: "Connecter l'application à Google Fit",
          alertTitle1: 'Authentifier',
          alertDescription1:
            "Veuillez authentifier Google Fit pour permettre à Biostasis d'accéder aux données de santé de votre enregistreur. Si l'application Google Fit n'est pas installée sur votre ordinateur, veuillez d'abord l'installer à partir de Google Play",
          alertTitle2: 'Ajouter Google Fit',
          alertDescription2:
            "Veuillez ouvrir la section Préférences dans l'application compagnon de votre montre/bandeau de fitness. Trouvez ensuite une section intitulée Ajouter des comptes ou similaire. Choisissez Google Fit et passez le processus d'autorisation",
        },
        backgroundModes: {
          title: "Activer les modes d'arrière-plan",
          alertTitle: "Activer les modes d'arrière-plan",
          alertDescription:
            "Veuillez ouvrir la section Préférences dans l'application compagnon de votre montre/bandeau de fitness. Trouvez ensuite une section intitulée Permissions ou similaire. Trouvez les Modes d'arrière-plan et activez-les",
        },
        frequency: "Cadre temporel du déclenchement d'urgence :",
      },
      systemOff: 'Le système est éteint',
      systemOn: 'Le système est en marche',
      systemOffMessage:
        "Le système d'urgence automatisé a été désactivé avec succès",
      timeTrigger: {
        title: 'Déclencheur temporel',
        description:
          "Nous enverrons des notifications à intervalles réguliers. Si vous ne répondez pas à l'une d'entre elles, le système d'urgence sera déclenché. Vos heures de sommeil sont automatiquement exclues.",
        frequency: "Cadre temporel du déclenchement d'urgence :",
        systemStart:
          "Le système automatisé basé sur le temps est en cours d'exécution",
        turnOn: 'Basé sur le temps',
        warning:
          "L'activation de la fonction temporelle désactivera le déclencheur biologique",
      },
      sleepSchedule: {
        title: 'Horaire de sommeil',
        description:
          'Met automatiquement en pause le système d\u2019urgence pendant vos heures de sommeil habituelles pour éviter les fausses alarmes.',
        enableSchedule: 'Activer l\u2019horaire de sommeil',
        bedtime: 'Heure du coucher',
        wakeTime: 'Heure du réveil',
        sleepWindow:
          'Le système se met en pause de {{bedtime}} à {{wakeTime}}',
      },
      sleepScheduleSheet: {
        title: 'Configurez votre horaire de sommeil',
        description:
          'Le système d\u2019urgence doit savoir quand vous dormez pour ne pas déclencher de fausses alarmes pendant la nuit.',
        hint: 'Appuyez sur une heure pour la modifier',
        save: 'Activer l\u2019horaire de sommeil',
        skip: 'Passer pour l\u2019instant',
      },
      pauseTime: {
        title: 'Réglage des temps de pause du système',
        description:
          "Empêcher le système d'urgence de se déclencher pour des périodes de temps récurrentes ou temporaires",
      },
      time: {
        hours: '{{count}} heures',
        hoursDefault: '{{count}} heures (par défaut)',
        minutes: '{{count}} minutes',
        minutesDefault: '{{count}} minutes (par défaut)',
        minutesDev: '{{count}} minutes (dev)',
      },
      interval: {
        title: "Choisissez l'intervalle",
      },
      readLess: 'Lire moins',
      readMore: 'Lire plus',
      seeAll: 'Voir tous',
      collapse: 'effondrement',
    },
    dayTimePicker: {
      invalidDate: 'Date non valide',
      dateFormat24: 'La date doit être au format 24h',
      dateFormat12: 'La date doit être au format 12h',
    },
  },
  dashboard: {
    title: 'La biostase médicale au bout des doigts',
    profile: {
      title: 'Profil et informations médicales',
      description:
        'Veillez à ce que vos informations vitales soient toujours à jour et facilement accessibles',
    },
    contacts: {
      title: "Gérer les paramètres d'urgence",
      description:
        "Configurez vos contacts d'urgence et choisissez comment ils seront informés en cas d'urgence",
      notActive: "Configurer les contacts d'urgence",
      active: 'Mise en place terminée',
    },
    automatedEmergency: {
      title: "Système d'urgence automatisé",
      description:
        "Configurez et activez un système d'urgence automatisé qui vous surveille en utilisant différents déclencheurs d'urgence",
      active: {
        bioTrigger: 'Déclencheur biologique',
        timeTrigger: 'Déclencheur basé sur le temps',
      },
      notActive: 'Mettre en place un système automatisé',
      recommendationDaysLeft:
        'Le système de recommandation analysera vos données de santé et vous fournira des recommandations personnalisées chaque semaine. Votre prochaine recommandation est dans {{daysLeft}} ',
      days: 'jours',
      day: 'jour',
      recommendationMessage:
        "Sur la base de vos données de santé, nous vous recommandons de choisir les heures {{recommendedPeriod}} comme période de déclenchement de l'urgence",
    },
    documents: {
      title: 'Documents',
      description:
        'Téléchargez des documents essentiels tels que vos dernières volontés et votre testament, les directives anticipées de votre patient, etc',
    },
    signUpForCryopreservation: {
      tomorrowBio: {
        title: "S'inscrire avec Tomorrow Bio",
        description:
          "Fournisseur européen disposant d'une solide infrastructure SST",
        footer: "En savoir plus et s'inscrire",
      },
      alcor: {
        title: "S'inscrire à Alcor",
        description:
          'Prestataire aux États-Unis avec une expérience à long terme',
        footer: 'En savoir plus',
      },
      cryonicsInstitute: {
        title: "S'inscrire à Cryonics Institute",
        description:
          'Une organisation membre fournissant des services de cryogénie',
      },
      southernCryonics: {
        title: "S'inscrire à Southern Cryonics",
        description:
          "Une organisation à but non lucratif gère le premier centre de stockage cryogénique d'Australie",
      },
    },
    customizeMessage: {
      title: "Personnaliser le message d'urgence",
      description:
        "Modifier le message et l'e-mail envoyés à vos contacts lors d'une situation d'urgence",
    },
    emergency: {
      countdown: 'URGENCE',
      countdownSent: 'URGENCE ENVOYÉE',
      countdownRetrying: 'PRESQUE LÀ',
      countdownCanceled: 'URGENCE ANNULÉE',
      countdownSubtitleHold: 'Maintenir pour activer',
      countdownSubtitleBeing: 'SE ENVÍA LA INFORMACIÓN.',
      countdownSubtitleDone: 'TOUT FAIT',
      countdownSubtitleRetrying: 'TRAVAILLER...',
      setUpContacts: "METTRE EN PLACE UN CONTACT D'URGENCE",
      cancel: 'Annuler',
      ok: 'OK',
      enableContacts: "Activer les contacts d'urgence",
      error: 'Il y a eu un problème avec notre service. Veuillez réessayer',
      noContacts: "Vous n'avez pas ajouté de contacts",
    },
    sections: {
      userProfile: 'Mes données',
      emergencySystem: "Paramètres du système d'urgence",
      signUp: "S'inscrire à la cryoconservation",
    },
  },
  location: {
    location: 'Emplacement',
    locationPermissionDenied: "Permission d'emplacement refusée",
    unableToOpenSettings: "Impossible d'ouvrir les paramètres",
    turnOnLocationFromSettings:
      'Activez les services de localisation pour permettre à "Biostasis" de déterminer votre position',
    goToSettings: 'Aller aux paramètres',
    notEnoughsPermissions:
      'L\'application Biostasis nécessite des informations de localisation constantes. Pour autoriser l\'utilisation de votre position, allez dans les paramètres de confidentialité de la position et sélectionnez "toujours"',
  },
  notifications: {
    goToSettings: 'Aller aux paramètres',
    permissionsError:
      'La fonction Biostasis nécessite des autorisations pour les notifications push',
  },
  time: {
    short: {
      m: 'min',
      h: 'h',
    },
    lessThanMinute: "moins d'une minute",
    m: '1 minute',
    mm: '{{m}} minutes',
    h: '1 heure{{secondPrecision}}',
    hh: '{{h}} heures{{{précision de seconde}}',
    d: '1 day{{secondPrecision}}',
    dd: '{{d}} jours{{{précisionsecondaire}}',
  },
  specificTimesScreen: {
    title: 'Pausa Sistema de Emergencia',
    pauseNow: {
      title: "Pause du système d'urgence",
      description:
        "Mettez temporairement en pause le système d'urgence automatisé jusqu'à l'heure de votre choix.",
      cancelMessage: 'Pause annulée. Le système est de nouveau actif.',
      pauseConfirmed: "Système en pause jusqu'à {{time}}",
      startDisclaimer: 'Mettre en pause',
      systemPaused: 'Système en pause',
      pausedUntil: "Le système d'urgence est en pause jusqu'à {{time}}.",
      cancelPause: 'Annuler la pause',
    },
    specificTimes: {
      title: 'Establecer horarios específicos',
      description:
        "Désactiver l'automatisme de manière répétée à certains moments de la semaine ou de la journée",
      start: 'Début:',
      end: 'Fin:',
      addAdditionalTime: 'Ajouter du temps supplémentaire',
      startSection: {
        pickDay: 'Choisir le(s) jour(s) de départ',
        pickTime: "Fixer l'heure de début",
      },
      endSection: {
        pickDay: 'Choisir le(s) jour(s) de fin',
        pickTime: "Fixer l'heure de fin",
      },
      daysFullName: {
        everyday: 'tous les jours',
        monday: ':undi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche',
      },
      daysShortName: {
        everyday: 'tous les jours',
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mer',
        thursday: 'Jeu',
        friday: 'Ven',
        saturday: 'Sam',
        sunday: 'Dim',
      },
      changeSettings: 'Les paramètres de temps ont été modifiés avec succès',
      active: 'Actif',
      inactive: 'Inactif',
    },
  },
  profileDefault: {
    title: 'Profil et informations médicales',
    medicalInfo: {
      title: 'Informations médicales',
      description:
        'La mise à jour de vos informations médicales peut contribuer à améliorer la qualité de votre cryoconservation',
      footer: 'Editar información médica',
    },
    editProfile: {
      title: 'Profil et données utilisateur',
      description:
        "Vous avez la possibilité de mettre à jour et de modifier vos informations à tout moment, en veillant à ce que des informations exactes soient envoyées aux personnes à contacter en cas d'urgence",
      footer: 'Modifier le profil',
    },
    accountSettings: {
      title: 'Paramètres du compte',
      description:
        'Gérer et personnaliser les paramètres de votre compte pour garantir une expérience personnalisée adaptée à vos préférences et à vos besoins',
      footer: 'Cambiar la configuración',
    },
  },
  accountSettings: {
    title: 'Paramètres du compte',
    allowNotifications: 'Autoriser les notifications',
    receiveTipsAndTricks: 'Recevoir des conseils et astuces',
    GDPR: {
      title: 'Demande de données sauvegardées (GDPR)',
      description:
        'Demandez une copie de vos données sauvegardées conformément à la réglementation GDPR afin de garantir la transparence et la sécurité de vos informations',
      label:
        "Veuillez indiquer l'adresse électronique à laquelle vous souhaitez que vos données soient envoyées",
      notification: 'Merci ! Votre demande a été soumise avec succès',
      error: "Il y a eu un problème avec l'envoi du GDPR",
    },
    deleteAccount: {
      title: 'Supprimer mon compte',
      description:
        'Supprimez définitivement toutes vos données. Cette action ne peut être annulée',
      confirmMessage: 'Êtes-vous sûr de vouloir supprimer votre compte ?',
      successMessage: 'Compte supprimé avec succès.\nVous êtes déconnecté',
    },
    notificationOff: 'Notification désactivée avec succès',
    notificationOn: 'Notification activée avec succès',
  },

  profileEdit: {
    title: 'Modifier le profil',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    email: 'Email',
    phoneNumber: 'Numéro de téléphone',
    dateOfBirth: 'Date de naissance',
    address: 'Adresse complète (rue, ville, pays, code postal)',
  },
  profileMedicalInfo: {
    title: 'Modifier / ajouter des informations médicales',
    primaryPhysician: 'Nom de votre médecin traitant',
    primaryPhysicianAddress:
      'Adresse complète de votre médecin traitant (rue, ville, pays)',
    switchLabel: 'Avez-vous déjà eu des problèmes médicaux graves ?',
    mostRecentDiagnosis: 'Quel a été votre diagnostic le plus récent ?',
    lastHospitalVisit: "Date de la dernière visite à l'hôpital",
  },
  lostConnection: {
    text1: 'Pas de connexion internet',
    text2:
      "Veuillez vous connecter à l'internet pour éviter les faux déclenchements d'urgence",
  },
  airplaneMode: {
    text1: 'Le mode avion est activé',
    text2:
      "Veuillez vous reconnecter à l'internet et veillez à désactiver le système d'urgence automatisé afin d'éviter les faux déclenchements d'urgence",
  },
  healthConditionError: {
    title: 'Bilan de santé automatisé',
    text0:
      "Nous avons détecté un problème de santé, mais aucune donnée de santé n'a été envoyée",
    text1:
      "Le système d'urgence automatisé contrôle régulièrement votre bien-être selon la fréquence que vous avez choisie",
    text3: 'Ça va ?',
    startEmergency: "Non, démarrer l'urgence",
    success:
      'Le signal positif indiquant que vous êtes toujours en vie a été envoyé avec succès',
  },
  healthCheck: {
    title: 'Bilan de santé automatisé',
    message: 'Signal positif envoyé avec succès ✅',
  },
  confirmAlert: {
    title: "Confirmer l'action",
    text: 'Are you sure to confirm this action ?',
  },
  warningFrequencyMessage: {
    android: {
      title: 'Avertissement ⚠️',
      description:
        "Il se peut que vous deviez mettre le système en pause pendant votre sommeil. De plus, certaines smartwatches ne synchronisent pas directement vos données de santé, ce qui peut entraîner de faux déclenchements d'urgence",
    },
    ios: {
      title: 'Avertissement ⚠️',
      description:
        'Certaines montres intelligentes ne sont pas sûres de confirmer cette action',
    },
  },
  bioCheck: {
    messages: {
      unableToSendEmergency: "Impossible d'envoyer une urgence",
      airPlaneOff: 'Veuillez désactiver le mode avion',
      networkError: 'Erreur de réseau',
      checkConnection: 'Veuillez vérifier votre connexion internet',
      offline: 'Vous êtes hors ligne',
      pleaseComeBackOnline:
        'Veuillez vérifier votre connexion Internet pour vous assurer que vous êtes toujours en vie',
      connectToSendEmergency:
        'Veuillez vous connecter pour envoyer une urgence',
      automatedEmergency: 'Contrôle biologique automatisé',
      infoSend: 'Informations positives sur la santé envoyées',
      heartRate: 'Fréquence cardiaque : ',
      restingHeartRate: 'Fréquence cardiaque au repos : ',
      movement: {
        title: 'Mouvement : ',
        unit: 'pas',
      },
      noDataUnit: 'pas de données',
      noData:
        '⚠️ Aucune donnée trouvée, veuillez vérifier votre source de données sur la santé',
      wearableSyncWarning: 'Aucune donnée de santé récente reçue',
      wearableSyncWarningBody:
        'Veuillez ouvrir votre application de wearable pour synchroniser vos données de santé. Si cela persiste, une vérification d\'urgence suivra.',
      refresh: 'Actualisation de vos données de santé...',
      userSendSignal:
        'Signal positif envoyé avec succès ✅. Assurez-vous de vérifier votre source de données de santé !',
    },
  },
  automatedEmergencyStatus: {
    start: {
      title: 'Bilan de santé automatisé',
      describe:
        "L'application d'urgence Biostasis vérifie vos données de santé",
    },
    emergency: "Démarrage du processus d'urgence...",
    restart: "Le système d'urgence automatisé a redémarré",
    failed:
      "Le bilan de santé automatisé n'a pas démarré ! Veuillez vérifier vos paramètres d'urgence",
    stop: {
      title: 'Automated Health Check Stopped',
      describe:
        "L'application d'urgence Biostasis s'est arrêtée en raison d'une situation d'urgence",
    },
  },
  cryopreservationCompaniesUrls: {
    alcor: 'https://www.alcor.org/',
    cryonicsInstitute: 'https://cryonics.org/',
    southernCryonics: 'https://southerncryonics.com/',
  },
  languages: {
    title: 'Changer de langue',
    english: 'Anglais',
    spanish: 'Espagnol',
    german: 'Allemand',
    french: 'Français',
    italian: 'Italien',
  },
  devLogs: {
  title: 'Journal de santé actuel',
  description: 'Cet écran est destiné aux développeurs pour enregistrer et suivre les problèmes. Il n’est pas destiné aux utilisateurs finaux.',
  logs: 'Journaux',
  noLogs: 'Aucun journal disponible',
  error: 'Erreur lors du chargement des journaux',
  retry: 'Réessayer de charger les journaux',
},
devHistoryLogs: {
  title: 'Historique des journaux de développement',
  description: 'Cet écran est destiné aux développeurs pour enregistrer et suivre les problèmes. Il n’est pas destiné aux utilisateurs finaux.',
  logs: 'Journaux',
  noLogs: 'Aucun journal disponible',
  error: 'Erreur lors du chargement des journaux',
  retry: 'Réessayer de charger les journaux',
},
devPushLogs: {
  title: 'Journal de push actuel',
  description: 'Cet écran est destiné aux développeurs pour enregistrer et suivre les problèmes liés aux notifications push. Il n’est pas destiné aux utilisateurs finaux.',
  logs: 'Journaux',
  noLogs: 'Aucun journal disponible',
  error: 'Erreur lors du chargement des journaux',
  retry: 'Réessayer de charger les journaux',
}

};

export default translations;
