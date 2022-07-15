export enum BackgroundEventsEnum {
  EmergencyRetryMechanism = 'emergency-retry-mechanism',
  ReactNativeBackgroundFetch = 'react-native-background-fetch',
  AlarmBeforeEmergency = 'alarm-before-emergency',
}

export enum NotificationTypesEnum {
  EmergencyOffline = 'EMERGENCY_OFFLINE',
  EmergencyAreYouOk = 'EMERGENCY_PULSE_BASED_CHECK',
  EmergencyRegularCheck = 'EMERGENCY_TIME_BASED_CHECK',
  EmergencyAlert = 'EMERGENCY_ALERT',
  TimeSlotNotification = 'TIME_SLOT_NOTIFICATION',
}
