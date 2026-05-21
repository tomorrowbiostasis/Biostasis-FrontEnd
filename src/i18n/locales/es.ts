import {ITranslation} from '../interfaces/Translation.interface';

const translations: ITranslation = {
  appName: 'Biostasis',
  settings: {
    title: 'Ajustes',
    emergencyContact: 'Configuración de contactos de emergencia',
    emergencySystem: 'Configuración del sistema de emergencia',
    tomorrowBio: 'Registrarse en Tomorrow Bio',
    termsOfService: 'Términos del servicio',
    privacyStatements: 'Declaraciones de privacidad',
    logOut: 'Cerrar sesión',
    termsUrl: 'https://tomorrowbiostasis.com/terms-conditions/',
    privacyUrl: 'https://tomorrowbiostasis.com/privacy/',
  },
  onboarding: {
    next: 'Siguiente',
    getStarted: 'Comenzar',
    skipIntro: 'Omitir intro',
    slide1: {
      badge: 'SEGURIDAD BIOSTASIS',
      title: 'Tu emergencia, nuestra prioridad.',
      body: 'Si alguna vez necesitas atención de criopreservación, esta aplicación garantiza que las personas adecuadas sean notificadas al instante — logrando una respuesta más rápida.',
    },
    slide2: {
      badge: 'ALERTAS DE EMERGENCIA',
      title: 'Construye tu red de notificaciones.',
      body: 'Añade contactos de emergencia, define mensajes personalizados, sube documentos y configura activadores automáticos — todo en un solo lugar.',
    },
    slide3: {
      badge: 'RESPUESTA RÁPIDA',
      title: 'Atención avanzada, lista cuando importa.',
      body: 'Biostasis te conecta con equipos de respuesta de emergencia capacitados para un soporte de criopreservación más rápido y coordinado.',
    },
  },
  welcome: {
    eyebrow: 'BIOSTASIS',
    title: 'Atención de emergencia, al alcance de tu mano.',
    tagline:
      'Alertas instantáneas. Sistemas automatizados. Tranquilidad cuando más importa.',
    createAccount: 'Crear una cuenta',
    logIn: 'Iniciar sesión',
    termsPrefix: 'Al continuar, aceptas nuestros',
    terms: 'Términos del Servicio',
    and: '&',
    privacy: 'Política de Privacidad',
  },
  common: {
    or: 'o',
    and: 'y',
    continue: 'Continuar',
    save: 'Guardar',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    delete: 'Suprimir',
    welcome: 'Bienvenido {{username}}',
    setUp: 'Configurar',
    message: 'Mensaje',
    logOut: 'Cerrar sesión',
    submit: 'Enviar',
    ok: 'OK',
    retry: 'Reintentar',
    yes: 'Sí',
    no: 'No',
    refresh: 'Actualizar',
    fine: 'Estoy bien',
    startEmergency: 'Iniciar Emergencia',
    setUpPauseTimes: 'Establecer tiempos de pausa',
    error: 'Tenemos algunos problemas con nuestro servicio',
    errorNetwork:
      'Probablemente está desconectado, por favor vuelva a conectarse',
  },
  headers: {
    welcome: 'Bienvenido',
    welcomeUsername: 'Bienvenido,\n{{username}}',
  },
  drawer: {
    logOut: 'Cerrar sesión',
    dashboard: 'Inicio',
    profile: 'Perfil',
    accountSettings: 'Configuración de la cuenta',
    automatedEmergency: 'Ajustes del sistema de emergencia',
    termsLabel: 'Condiciones del servicio',
    termsUrl: 'https://www.tomorrow.bio/es/condiciones/',
    privacyLabel: 'Declaraciones de privacidad',
    privacyUrl: 'https://www.tomorrow.bio/es/privacidad',
    uploadDocuments: 'SubirDocumentos',
    AddNewEmergencyContact: 'Añadir contacto de emergencia',
    debugInfo: 'Información de depuración',
    emergencyContactSettings: 'Configuración de contactos de emergencia',
    pauseTimes: 'Pausa Sistema de Emergencia',
    signUpForCryopreservation: 'Inscríbete con Tomorrow Bio',
    devLogs: 'Registro de salud actual',
    devHistoryLogs: 'Registro de salud anterior',
    devPushLogs: 'Registro de push actual'
  },
  signUpForTomorrow: {
    title: 'Regístrate con Tomorrow Bio',
    signUpUrl: 'https://member.tomorrow.bio/es/signup/start/',
    internetError: {
      title: 'No hay conexión a Internet',
      description: '¡Esta página requiere conexión a Internet!',
    },
  },
  socialMediaUrls: {
    website: 'https://www.tomorrow.bio/es/',
    twitter: 'https://twitter.com/tomorrowbio',
    instagram: 'https://www.instagram.com/tomorrowbio/',
    youtube: 'https://www.youtube.com/channel/UCO-RhsVpguwTJuntw_US0Mw',
  },
  user: {
    updatedSuccessfully: 'Sus datos se han actualizado correctamente',
  },
  LogIn: {
    apple: 'Iniciar sesión con Apple',
    google: 'Iniciar sesión con Google',
    LogIn: 'Conectarse',
    emailTitleLogIn: 'Inicie sesión con su correo electrónico:',
    emailTitleSignUp: 'Regístrate con tu correo electrónico:',
  },
  signUp: {
    apple: 'Regístrate con Apple',
    google: 'Regístrate con Google',
    signUp: 'Regístrate',
    steps: {
      eyebrow: 'PASO {{current}} DE {{total}}',
    },
    common: {
      next: 'Siguiente',
    },
    createAccount: 'Crear una nueva cuenta',
  },
  signOut: {
    disabledAutomatedEmergencyContinue: '¿Quiere continuar?',
    disabledAutomatedEmergency:
      'La emergencia automática se desactivará cuando cierres la sesión',
  },
  termsAgree: {
    agreeToThe: 'Estoy de acuerdo con el',
    terms: 'Términos',
    privacyPolicy: 'Política de privacidad',
  },
  forgotPassword: {
    screenName: 'Olvidé mi contraseña',
    title: '¿Ha olvidado su contraseña?',
    doNotRememberPassword: '¿No recuerdas tu contraseña?',
    enterEmail:
      'Introduzca su dirección de correo electrónico. Te enviaremos un correo electrónico para restablecer tu contraseña',
    enterNewPasswordForEmail: 'Introduzca una nueva contraseña',
    emailSent:
      'Acabamos de enviarte un correo electrónico para restablecer tu contraseña. Comprueba tu bandeja de entrada y abre el enlace en un dispositivo móvil con la app Biostasis instalada',
    passwordChanged: 'Contraseña actualizada. Por favor, inicie sesión',
    resetLinkExpired:
      'Enlace de restablecimiento de contraseña caducado. Por favor, inténtelo de nuevo',
    newPassword: 'Nueva Contraseña',
    warning:
      'Asegúrate de que ya tienes una cuenta registrada con tu correo electrónico personalizado. Tenga en cuenta que los registros realizados a través de Apple y Google no serán funcionales',
    subtitle: 'Le enviaremos un enlace de restablecimiento por correo.',
    newPasswordTitle: 'Crear nueva contraseña',
    newPasswordSubtitle: 'Elija una contraseña segura para su cuenta.',
    confirmPasswordLabel: 'Confirmar contraseña',
  },
  placeholder: {
    password: 'tu contraseña',
    newPassword: 'tu nueva contraseña',
    confirmNewPassword: 'confirma tu nueva contraseña',
    email: 'yours@example.com',
  },
  auth: {
    welcomeTo: 'Bienvenido a Biostasis',
    accountWasCreated:
      'Su cuenta ha sido creada. Para activarla, comprueba tu bandeja de entrada y abre el enlace en un dispositivo móvil con la app Biostasis instalada',
    invalidCredentials: 'Nombre de usuario o contraseña incorrectos',
    linkExpired: 'El enlace ha caducado. Inténtelo de nuevo',
    accountActivated: 'Su cuenta ha sido activada. Ya puede iniciar sesión',
  },
  authScreen: {
    tabSignIn: 'Iniciar sesión',
    tabSignUp: 'Registrarse',
    appleCta: 'Continuar con Apple',
    googleCta: 'Continuar con Google',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tuyo@ejemplo.com',
    passwordLabel: 'Contraseña',
    termsAgree: 'Acepto los',
    terms: 'Términos del Servicio',
    signIn: {
      title: 'Bienvenido de nuevo.',
      subtitle: 'Inicia sesión en tu cuenta de Biostasis.',
      cta: 'Iniciar sesión',
      dividerLabel: 'o inicia sesión con correo',
      passwordPlaceholder: 'Tu contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
    },
    signUp: {
      title: 'Crear cuenta',
      subtitle: 'Únete a Biostasis para gestionar tu preparación ante emergencias.',
      cta: 'Crear cuenta',
      dividerLabel: 'o regístrate con correo',
      passwordPlaceholder: 'Crea una contraseña',
    },
  },
  defaultError: 'La operación no tuvo éxito',
  validation: {
    fieldRequired: 'Este campo es obligatorio',
    invalidEmail: 'Dirección de correo electrónico no válida',
    email: {
      invalid: 'Dirección de correo electrónico no válida',
      accountAlreadyExist:
        'Ya existe una cuenta con el correo electrónico indicado',
    },
    password: {
      tooShort: 'La contraseña es demasiado corta',
      whiteSpace: 'La contraseña no puede contener espacios en blanco',
      minLength: 'La contraseña debe contener al menos 8 caracteres',
    },
    userName: {
      minLength: 'El nombre debe contener al menos 2 caracteres',
      maxLength: 'El nombre no puede tener más de 50 caracteres',
      restrictions: 'El nombre sólo puede contener letras, guiones y espacios',
    },
    emergencySettings: {
      minMaxLength: 'El texto debe tener entre 10 y 1000 caracteres',
    },
    number: {
      incorrectFormat:
        'El número de teléfono no es correcto. Por favor, introduce un número válido e inténtalo de nuevo',
    },
  },
  userName: {
    title: '¿Cuál es su nombre completo?',
    subtitle:
      'Aparecerá en las notificaciones de emergencia enviadas a sus contactos.',
    firstName: 'Nombre',
    lastName: 'Apellido',
    firstNamePlaceholder: 'p. ej. Pedro',
    lastNamePlaceholder: 'p. ej. García',
  },
  userPhone: {
    title: '¿Cuál es su número de teléfono?',
    combinedTitle: 'Teléfono y nacimiento',
    combinedSubtitle:
      'Se usa para la seguridad de la cuenta y verificar la edad.',
    phoneNumber: 'Número de teléfono',
    invalidPhoneNumber: 'Número de teléfono no válido',
  },
  selectAction: {
    whatToDo: '¿Qué te gustaría hacer?',
    signUpForTheCryopreservation: {
      title: 'Quiero suscribir un contrato de crioconservación',
      description:
        'Apúntate al contacto de criopreservación en sólo 15 minutos y completamente online y configura la alerta de emergencia',
    },
    storeCryopreservationContract: {
      title: 'Ya tengo un contrato de crioconservación y quiero añadirlo',
      description:
        'Guarda tu contrato de criopreservación y tu documento de voluntades anticipadas en un lugar seguro y establece contactos de emergencia',
    },
    useAppForEmergencyManagement: {
      title:
        'Sólo quiero utilizar la aplicación para la gestión de emergencias',
      description:
        'Establece los contactos que deben ser notificados en caso de emergencia médica y prepara todos los documentos que puedan necesitar',
    },
  },
  userDateOfBirth: {
    title: '¿Cuál es su fecha de nacimiento?',
    invalidDate: 'Fecha no válida',
    invalidUserAge: 'Debes tener al menos 18 años',
    selectDate: 'Seleccionar fecha',
    label: 'Fecha de nacimiento',
    placeholder: 'dd/mm/aa',
  },
  setupComplete: {
    welcome: 'Bienvenido',
    title: 'Configuración completada',
  },
  userAddress: {
    title: 'Su dirección',
    subtitle:
      'Se usa cuando los equipos de emergencia deben localizarle rápidamente.',
    street: 'Calle',
    city: 'Ciudad',
    country: 'País',
    zipCode: 'CP',
    currentLocation: 'Usar mi ubicación actual',
    wrongAddress:
      'Dirección incorrecta, por favor asegúrese de introducir la dirección existente',
  },
  emergencyContactsSettings: {
    title: 'Contactos de emergencia',
    emergencyList: 'Lista de contactos de emergencia',
    emergencyAndSettings: 'Contactos de emergencia y configuración',
    makeSureToTestEmergencyContact:
      'Prueba tu disparador de emergencia con cada contacto para que sepan cómo funciona.',
    AddNewEmergencyContact: 'Añadir contacto de emergencia',
    editEmergencyContact: 'Editar contacto de emergencia',
    emergencyButtonSettings: 'Configuración de mensajes de emergencia',
    yourContacts: 'Tus contactos',
    includeWithMessage: 'Incluir con el mensaje',
    emergencyMessageLabel: 'Mensaje de emergencia',
    emergencyMessageHelper:
      'Este mensaje se envía por correo electrónico y mensaje de texto a todos los contactos cuando se activa una emergencia.',
    saveChanges: 'Guardar cambios',
    sendTestMessage: 'Enviar mensaje de prueba',
    addNewEdit: {
      title: 'Información de contacto:',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electrónico',
      phoneNumber: 'Número de teléfono',
      firstNamePlaceholder: 'p. ej. Petar',
      lastNamePlaceholder: 'p. ej. Petrov',
      emailPlaceholder: 'p. ej. mail@gmail.com',
      errorDuringUpdate:
        'Hay un problema con los datos del formulario. Por favor, compruebe que los datos son correctos y vuelva a guardarlos',
      activateContact: 'El contacto se ha activado correctamente',
      deactivateContact: 'El contacto se ha desactivado correctamente',
      errorActivate: 'No se ha podido activar el contacto',
      addContact: 'El contacto se ha añadido correctamente',
      errorAddContact: 'No se ha podido añadir el nuevo contacto',
      updateContact: 'El contacto se ha actualizado correctamente',
      errorUpdateContact:
        'Algo salió mal. No se ha podido actualizar el contacto',
      deleteContact: 'El contacto se ha eliminado correctamente',
      errorDeleteContact:
        'Algo salió mal. No se ha podido eliminar el contacto',
      alert: {
        title: 'Borrar contacto',
        description: '¿Está seguro de que desea eliminar este contacto?',
      },
    },
    explanations: {
      description1:
        'Aquí puedes configurar los contactos de emergencia que serán notificados en caso de emergencia. Puedes configurar qué información debe enviarse en caso de emergencia, incluidos mensajes de texto/correo electrónico, ubicación y documentos',
      description2:
        'Siempre puedes editar la lista de contactos de emergencia y el tipo de información/notificación que deben recibir',
    },
    settings: {
      disclaimer:
        'Se enviará un correo electrónico y un mensaje de texto a todos los contactos de emergencia cuando se active una emergencia',
      sendEmailAndTextMessage: 'Enviar correo electrónico y mensaje de texto',
      includeInfo: 'Incluir esta información:',
      location: 'Ubicación',
      uploadedDocuments: 'Documentos Cargados',
      sendTestEmail: 'Envíame un correo de prueba',
      defaultMessage:
        'Esta es una señal de emergencia de {{username}}. Está recibiendo este mensaje porque puede que necesite una criopreservación Información adicional aquí y adjunta',
      testMessageSent:
        'Mensaje de prueba enviado. Compruebe su bandeja de entrada',
    },
    documents: {
      title: 'Documentos',
      topInfo:
        'Se envían automáticamente a todos los contactos cuando se activa una emergencia.',
      tapToUpload: 'Toca para subir',
      addDocument: 'Añadir documento',
      headers: {
        directive: 'Directiva médica',
        lastWill: 'Última voluntad',
        other: 'Otro documento',
      },
      upload: {
        directive: 'Cargar directiva médica',
        lastWill: 'Cargar última voluntad',
        other: 'Cargar otro documento',
      },
      messages: {
        errors: {
          upload: 'Error durante la carga: {{error}}',
          fileWrongType: 'El archivo está dañado o tiene un formato incorrecto',
          fetching: 'Error durante la obtención de documentos: {{error}}',
          remove: 'Error al borrar documento: {{error}}',
        },
        success: {
          upload: 'El documento se ha guardado correctamente',
          remove: 'El documento se ha eliminado correctamente',
        },
        uploadStarted: 'Subida de archivos iniciada',
      },
      alert: {
        title: 'Eliminar documento',
        description: '¿Está seguro de que desea eliminar este documento?',
      },
    },
    confirmationModal: {
      title: 'Confirmar borrado. ¿Está seguro?',
    },
    automatedEmergencySettings: {
      title: 'Ajustes de emergencia',
      enableSystemTitle: 'Ajustes de emergencia automatizados',
      compatibleSmartDeviceConnected:
        'Dispositivo inteligente compatible conectado',
      confirmReadManual: 'Entiendo cómo funciona este sistema',
      howItWorks: {
        title: 'Cómo funciona',
        intro:
          'El sistema monitorea tus datos de salud y alerta a tus contactos si dejas de responder.',
        step1Title: 'Conectar',
        step1Desc:
          'Vincula tu wearable o usa los sensores integrados de tu teléfono (pasos, frecuencia cardíaca).',
        step2Title: 'Monitorear',
        step2Desc:
          'La app revisa tus datos de salud regularmente. Si no se detecta señal, recibirás primero una notificación de advertencia.',
        step3Title: 'Emergencia',
        step3Desc:
          'Si aún no hay respuesta, el sistema activa una alerta a tus contactos de emergencia.',
      },
      enableAutomatedEmergency: 'Activar la monitorización automática de emergencias',
      setUpSmartDevice: 'Configurar dispositivo inteligente',
      connectedSmartDevice: 'Conectado con {{device}}',
      pauseAutomatedEmergency: 'Pausar Emergencia Automatizada',
      setUpSpecificTimes: 'Configurar horas específicas {{specificTimes}}',
      automatedEmergencyDisabledFor:
        'La emergencia automática está desactivada para {{pauseTime}}',
      cancelEmergencyPause: 'Cancelar pausa de emergencia automatizada',
      youStillHavePause:
        'La pausa sigue activa. Recuerda que si activas la emergencia automática, se pausará durante {{pauseTime}}',
      frequencySet: 'Frecuencia ajustada correctamente a',
      bioTrigger: {
        title: 'Activador de base biológica',
        permissions: {
          title: 'Dar permisos a Sanidad',
          alertTitle: 'Permisos sanitarios',
          alertDescription:
            'Se le pedirá que permita a Biostasis acceder a sus datos de salud. Por favor, confirme',
        },
        turnOn: 'De base biológica',
        warning:
          '¡Activar la base biológica desactivará el activador basado en el tiempo!',
        appleWatch: {
          title: 'Dispositivo portátil conectado',
          description:
            "Usamos tu dispositivo portátil (gracias a la integración con HealthKit) para recuperar tus datos de salud. Si no usas uno, por favor elige el sistema de activación basado en tiempo.",
          alertTitle: 'Emparejar dispositivo portátil',
          alertDescription:
            "Tu dispositivo portátil debe estar emparejado con tu iPhone para sincronizar tus datos de salud. Asegúrate de que esté correctamente emparejado. Si no lo está, sigue las instrucciones en la aplicación complementaria del dispositivo.",
        },
        googleFit: {
          title: 'Autenticar Google Fit',
          description:
            'Utilizamos Google Fit para recuperar tus datos de salud. Autentifícate y configura la aplicación complementaria del dispositivo. Algunos dispositivos no pueden sincronizarse con Google Fit. En tal caso, selecciona el sistema de activación basado en el tiempo',
          connect: 'Conectar aplicación a Google Fit',
          alertTitle1: 'Autenticar',
          alertDescription1:
            'Por favor, autentifica Google Fit para permitir que Biostasis acceda a los datos de salud de tu grabadora. Si no tiene instalada la aplicación Google Fit, instálela primero desde Google Play',
          alertTitle2: 'Añadir Google Fit',
          alertDescription2:
            'Abre la sección Preferencias de la aplicación complementaria de tu reloj o pulsera de fitness. A continuación, busca una sección que diga Añadir cuentas o similar. Elige Google Fit y pasa el proceso de autorización',
        },
        backgroundModes: {
          title: 'Activar modos de fondo',
          alertTitle: 'Activar modos de fondo',
          alertDescription:
            'Abre la sección Preferencias de la aplicación complementaria de tu reloj/banda de fitness. Busca la sección Permisos o similar. Busca Modos en segundo plano y actívalo',
        },
        frequency: 'Tiempo de activación de emergencia:',
      },
      systemOff: 'El sistema está apagado',
      systemOn: 'El sistema está encendido',
      systemOffMessage: 'Sistema de Emergencia Automatizado apagado con éxito',
      timeTrigger: {
        title: 'Activador temporal',
        description:
          'Enviaremos notificaciones cada cierto tiempo. Si no respondes a una de ellas, se activará el sistema de emergencia. Tus horas de sueño se excluyen automáticamente.',
        frequency: 'Tiempo de activación de emergencia:',
        systemStart: 'La automatización horaria está en marcha',
        turnOn: 'Basado en el tiempo',
        warning:
          '¡Activar la activación por tiempo desactivará la activación por bio!',
      },
      sleepSchedule: {
        title: 'Horario de sueño',
        description:
          'Pausa automáticamente el sistema de emergencia durante tus horas habituales de sueño para evitar falsas alarmas.',
        enableSchedule: 'Activar horario de sueño',
        bedtime: 'Hora de dormir',
        wakeTime: 'Hora de despertar',
        sleepWindow:
          'El sistema se pausa cada noche de {{bedtime}} a {{wakeTime}}',
      },
      sleepScheduleSheet: {
        title: 'Configura tu horario de sueño',
        description:
          'El sistema de emergencia necesita saber cuándo duermes para no activar falsas alarmas durante la noche.',
        hint: 'Toca una hora para ajustarla',
        save: 'Activar horario de sueño',
        skip: 'Omitir por ahora',
      },
      pauseTime: {
        title: 'Configurar tiempos de pausa del sistema',
        description:
          'Impedir que el sistema de emergencia se active durante periodos de tiempo recurrentes o temporales',
      },
      time: {
        hours: '{{count}} horas',
        hoursDefault: '{{count}} horas (por defecto)',
        minutes: '{{count}} minutos',
        minutesDefault: '{{count}} minutos (por defecto)',
        minutesDev: '{{count}} minutos (dev)',
      },
      interval: {
        title: 'Elegir intervalo',
      },
      readLess: 'Leer menos',
      readMore: 'LeerMás',
      seeAll: 'Ver todos',
      collapse: 'Colapso',
    },
    dayTimePicker: {
      invalidDate: 'Fecha no válida',
      dateFormat24: 'La fecha debe estar en formato 24h',
      dateFormat12: 'La fecha debe estar en formato 12h',
    },
  },
  dashboard: {
    title: 'La bioestasis médica al alcance de la mano',
    profile: {
      title: 'Perfil e información médica',
      description:
        'Asegúrese de que su información vital está siempre actualizada y fácilmente accesible',
    },
    contacts: {
      title: 'Gestionar los ajustes de emergencia',
      description:
        'Configura tus contactos de emergencia y elige cómo serán notificados en caso de emergencia',
      notActive: 'Configurar contactos de emergencia',
      active: 'Configuración completada',
    },
    automatedEmergency: {
      title: 'Sistema automatizado de emergencia',
      description:
        'Configura y activa un sistema de emergencia automatizado que te controle mediante diferentes activadores de emergencia',
      active: {
        bioTrigger: 'Activador de base biológica',
        timeTrigger: 'Disparador basado en el tiempo',
      },
      notActive: 'Configurar sistema automatizado',
      recommendationDaysLeft:
        'El sistema de recomendaciones analizará tus datos de salud y te ofrecerá recomendaciones personalizadas cada semana. Tu próxima recomendación será en {{daysLeft}}. ',
      days: 'días',
      day: 'día',
      recommendationMessage:
        'Basándonos en sus datos de salud, le recomendamos que elija {{recommendedPeriod}} horas como marco temporal de activación de emergencias',
    },
    documents: {
      title: 'Documentos',
      description:
        'Sube documentos esenciales como tu testamento, las voluntades anticipadas del paciente, etc.',
    },
    signUpForCryopreservation: {
      tomorrowBio: {
        title: 'Inscríbete con Tomorrow Bio',
        description: 'Proveedor europeo con una sólida infraestructura de TSM',
        footer: 'Más información y registro',
      },
      alcor: {
        title: 'Inscríbete en Alcor',
        description: 'Proveedor estadounidense con una larga trayectoria',
        footer: 'Más información',
      },
      cryonicsInstitute: {
        title: 'Inscríbete en el Cryonics Institute',
        description: 'Organización miembro que presta servicios de criogenia',
      },
      southernCryonics: {
        title: 'Inscríbete en Southern Cryonics',
        description:
          'Una organización sin ánimo de lucro gestiona la primera instalación de almacenamiento criónico de Australia',
      },
    },
    customizeMessage: {
      title: 'Personalizar mensaje de emergencia',
      description:
        'Modificar el mensaje y el correo electrónico enviado a sus contactos durante una situación de emergencia',
    },
    emergency: {
      countdown: 'EMERGENCIA',
      countdownSent: 'EMERGENCIA ENVIADA',
      countdownRetrying: 'CASI LLEGAMOS',
      countdownCanceled: 'EMERGENCIA\nCANCELADO',
      countdownSubtitleHold: 'Mantener para activar',
      countdownSubtitleBeing: 'SE ESTÁ ENVIANDO INFORMACIÓN',
      countdownSubtitleDone: 'TODOHECHO',
      countdownSubtitleRetrying: 'TRABAJANDO...',
      setUpContacts: 'ESTABLECER CONTACTO DE EMERGENCIA',
      cancel: 'cancelado',
      ok: 'OK',
      enableContacts: 'Habilitar contactos de emergencia',
      error:
        'Se ha producido un problema en nuestro servicio. Vuelva a intentarlo',
      noContacts: 'No has añadido ningún contacto',
    },
    sections: {
      userProfile: 'Mis Datos',
      emergencySystem: 'Ajustes del sistema de emergencia',
      signUp: 'Inscribirse en la crioconservación',
    },
  },
  location: {
    location: 'Ubicación',
    locationPermissionDenied: 'Permiso de ubicación denegado',
    unableToOpenSettings: 'No se ha podido abrir la configuración',
    turnOnLocationFromSettings:
      'Activa los Servicios de Localización para permitir que "Biostasis" determine tu ubicación',
    goToSettings: 'Ir a Ajustes',
    notEnoughsPermissions:
      'La aplicación Biostasis requiere información de localización constante. Para permitir el uso de su ubicación, vaya a la configuración de privacidad de ubicación y seleccione "siempre"',
  },
  notifications: {
    goToSettings: 'Ir a Ajustes',
    permissionsError:
      'La función Biostasis requiere permisos de notificaciones push',
  },
  time: {
    short: {
      m: 'min',
      h: 'h',
    },
    lessThanMinute: 'menos de un minuto',
    m: '1 minuto',
    mm: '{{m}} minutos',
    h: '1 hora{{secondPrecision}}',
    hh: '{{h}} horas{{secondPrecision}}',
    d: '1 día{{secondPrecision}}',
    dd: '{{d}} días{{secondPrecision}}',
  },
  specificTimesScreen: {
    title: 'Pausa del sistema de emergencia',
    pauseNow: {
      title: 'Pausar sistema de emergencia',
      description:
        'Desactiva temporalmente la monitorización hasta una hora específica que elijas.',
      cancelMessage: 'Pausa cancelada. El sistema está activo de nuevo.',
      pauseConfirmed: 'Sistema pausado hasta {{time}}',
      startDisclaimer: 'Pausar el sistema',
      choosePauseDuration: 'Elegir duración de la pausa',
      systemPaused: 'Sistema en pausa',
      pausedUntil: 'Pausado hasta {{time}}',
      cancelPause: 'Cancelar pausa',
    },
    addTimeBlock: {
      title: 'Añadir bloque de tiempo',
      save: 'Guardar bloque de tiempo',
    },
    specificTimes: {
      title: 'Establecer tiempos específicos',
      description:
        'Desactiva automáticamente la monitorización durante franjas horarias recurrentes.',
      start: 'Inicio',
      end: 'Fin',
      addAdditionalTime: 'Añadir un bloque de tiempo',
      startSection: {
        pickDay: 'Elegir día(s) de inicio',
        pickTime: 'Establecer hora de inicio',
      },
      endSection: {
        pickDay: 'Elegir día(s) final(es)',
        pickTime: 'Fijar hora final',
      },
      daysFullName: {
        everyday: 'Todos los días',
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
      },
      daysShortName: {
        everyday: 'Todos los días',
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mié',
        thursday: 'Jue',
        friday: 'Vie',
        saturday: 'Sáb',
        sunday: 'Dom',
      },
      changeSettings: 'Ajustes de tiempo cambiados con éxito',
      active: 'Activo',
      inactive: 'Inactivo',
    },
  },
  profileDefault: {
    title: 'Perfil e información médica',
    medicalInfo: {
      title: 'Información médica',
      description:
        'Mantener actualizada la información médica puede ayudar a mejorar la calidad de la criopreservación',
      footer: 'Editar información médica',
    },
    editProfile: {
      title: 'Perfil y datos de usuario',
      description:
        'Tienes la flexibilidad de actualizar y modificar tu información en cualquier momento, asegurándote de que se envían detalles precisos a tus contactos de emergencia designados',
      footer: 'Editar perfil',
    },
    accountSettings: {
      title: 'Configuración de la cuenta',
      description:
        'Gestione y personalice la configuración de su cuenta para garantizar una experiencia personalizada adaptada a sus preferencias y necesidades',
      footer: 'Cambiar configuración',
    },
  },
  accountSettings: {
    title: 'Configuración de la cuenta',
    allowNotifications: 'Permitir Notificaciones',
    receiveTipsAndTricks: 'Recibir Consejos y Trucos',
    GDPR: {
      title: 'Solicitud de datos guardados (GDPR)',
      description:
        'Solicita una copia de tus datos guardados de acuerdo con la normativa GDPR para garantizar la transparencia y seguridad de tu información.',
      label:
        'Indique la dirección de correo electrónico a la que desea que se envíen sus datos',
      notification: '¡Gracias! Su solicitud se ha enviado correctamente',
      error: 'Hubo un problema con el envío de GDPR',
    },
    deleteAccount: {
      title: 'Eliminar mi cuenta',
      description:
        'Elimina permanentemente todos tus datos. Esta acción no se puede revertir',
      confirmMessage: '¿Seguro que quieres eliminar tu cuenta?',
      successMessage: 'Cuenta eliminada con éxito.\nHa cerrado la sesión.',
    },
    notificationOff: 'Notificación desactivada correctamente',
    notificationOn: 'Notificación activada correctamente',
  },

  profileEdit: {
    title: 'Editar perfil',
    firstName: 'First Name',
    lastName: 'Apellido',
    email: 'Email',
    phoneNumber: 'Número de teléfono',
    dateOfBirth: 'Fecha de nacimiento',
    address: 'Dirección completa (calle, ciudad, país, código postal)',
  },
  profileMedicalInfo: {
    title: 'Editar / Añadir información médica',
    primaryPhysician: 'Nombre de su médico de cabecera',
    primaryPhysicianAddress:
      'Dirección completa de su médico de cabecera (calle, ciudad, país)',
    switchLabel: '¿Ha tenido alguna vez problemas médicos graves?',
    mostRecentDiagnosis: '¿Cuál fue su diagnóstico más reciente?',
    lastHospitalVisit: '¿Fecha de la última visita al hospital?',
  },
  lostConnection: {
    text1: 'No hay conexión a Internet',
    text2:
      'Por favor, conéctese a internet para evitar falsos disparos de emergencia',
  },
  airplaneMode: {
    text1: 'Modo avión activado',
    text2:
      'Por favor, conéctate de nuevo a internet y asegúrate de apagar el sistema automático de emergencia para evitar falsos disparos de emergencia',
  },
  healthConditionError: {
    title: 'Chequeo automatizado',
    text0:
      'Hemos detectado un problema de salud, porque no se han enviado datos sanitarios',
    text1:
      'El sistema automatizado de emergencia controla regularmente tu bienestar según la frecuencia que hayas elegido',
    text3: '¿Estás bien?',
    confirmOk: 'Sí, estoy bien',
    startEmergency: 'No, Iniciar emergencia',
    success:
      'Señal positiva que indica que sigues vivo ha sido enviada con éxito',
  },
  healthCheck: {
    title: 'Chequeo automatizado',
    message: 'Señal positiva enviada con éxito ✅.',
  },
  confirmAlert: {
    title: 'Confirmar acción',
    text: '¿Está seguro de confirmar esta acción?',
  },
  warningFrequencyMessage: {
    android: {
      title: 'Advertencia ⚠️ ',
      description:
        'Puede que necesites pausar el sistema mientras duermes. Además, algunos smartwatches no sincronizan directamente tus datos de salud, lo que puede provocar falsas activaciones de emergencia',
    },
    ios: {
      title: 'Advertencia ⚠️ ',
      description:
        'Algún reloj inteligente no ¿Está seguro de confirmar esta acción?',
    },
  },
  bioCheck: {
    messages: {
      unableToSendEmergency: 'Imposible enviar emergencia',
      airPlaneOff: 'Por favor, desactiva el modo avión',
      networkError: 'Error de red',
      checkConnection: 'Compruebe su conexión a Internet',
      offline: 'Estás desconectado',
      pleaseComeBackOnline:
        'Por favor, comprueba tu conexión a Internet para asegurarte de que sigues vivo',
      connectToSendEmergency: 'Por favor, conéctese para enviar emergencia',
      automatedEmergency: 'Comprobación biológica automatizada',
      infoSend: 'Información sanitaria positiva enviada',
      heartRate: 'Frecuencia Cardíaca: ',
      restingHeartRate: 'Frecuencia Cardíaca en reposo: ',
      movement: {
        title: 'Movimiento: ',
        unit: 'pasos',
      },
      noDataUnit: 'no-data',
      noData:
        '⚠️ No se han encontrado datos, por favor compruebe su fuente de datos sanitarios',
      wearableSyncWarning: 'No se han recibido datos de salud recientes',
      wearableSyncWarningBody:
        'Por favor, abre la app de tu wearable para sincronizar tus datos de salud. Si esto persiste, se realizará una verificación de emergencia.',
      refresh: 'Actualizando sus datos sanitarios...',
      userSendSignal:
        'Señal positiva enviada con éxito ✅. Asegúrese de comprobar su fuente de datos sanitarios',
    },
  },
  automatedEmergencyStatus: {
    start: {
      title: 'Chequeo automatizado',
      describe: 'La App Biostasis Emergency comprueba tus datos de salud',
    },
    emergency: 'Iniciando proceso de emergencia...',
    restart: 'Sistema de emergencia automatizado reiniciado',
    failed:
      'El chequeo automático no se ha iniciado. Compruebe la configuración de emergencia',
    stop: {
      title: 'Comprobación de salud automatizada detenida',
      describe:
        'La aplicación Biostasis Emergency se detuvo debido a una situación de emergencia',
    },
  },
  cryopreservationCompaniesUrls: {
    alcor: 'https://www.alcor.org/',
    cryonicsInstitute: 'https://cryonics.org/',
    southernCryonics: 'https://southerncryonics.com/',
  },
  languages: {
    title: 'Cambiar idioma:',
    english: 'inglés',
    spanish: 'Español',
    german: 'Alemán',
    french: 'Francés',
    italian: 'Italiano',
  },
  devLogs: {
  title: 'Registro de salud actual',
  description: 'Esta pantalla es para que los desarrolladores registren y rastreen problemas. No está destinada a los usuarios finales.',
  logs: 'Registros',
  noLogs: 'No hay registros disponibles',
  error: 'Error al cargar los registros',
  retry: 'Reintentar cargar los registros',
},
devHistoryLogs: {
  title: 'Historial de registros de desarrollo',
  description: 'Esta pantalla es para que los desarrolladores registren y rastreen problemas. No está destinada a los usuarios finales.',
  logs: 'Registros',
  noLogs: 'No hay registros disponibles',
  error: 'Error al cargar los registros',
  retry: 'Reintentar cargar los registros',
},
devPushLogs: {
  title: 'Registro de push actual',
  description: 'Esta pantalla es para que los desarrolladores registren y rastreen problemas con las notificaciones push. No está destinada a los usuarios finales.',
  logs: 'Registros',
  noLogs: 'No hay registros disponibles',
  error: 'Error al cargar los registros',
  retry: 'Reintentar cargar los registros',
}

};

export default translations;
