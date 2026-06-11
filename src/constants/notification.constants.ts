import {
  AndroidChannel,
  AndroidChannelGroup,
  AndroidColor,
  AndroidImportance,
} from '@notifee/react-native';

// eslint-disable-next-line no-shadow
export enum NotificationTypesEnum {
  EmergencyOffline = 'EMERGENCY_OFFLINE',
  EmergencyHealthCheck = 'EMERGENCY_PULSE_BASED_CHECK',
  EmergencyRegularCheck = 'EMERGENCY_TIME_BASED_CHECK',
  EmergencyAlert = 'EMERGENCY_ALERT',
  TimeSlotNotification = 'TIME_SLOT_NOTIFICATION',
  PositiveSignal = 'POSITIVE_SIGNAL',
  NoDataFound = 'NO_DATA_FOUND',
  BioCheck = 'BIO_CHECK',
  StopEmergencyAlert = 'STOP_EMERGENCY_ALERT',
  WaitEmergencyAlert = 'WAIT_EMERGENCY_ALERT',
  WaitRefresh = 'WAIT_REFRESH',
  StartAutomatedSystem = 'START_AUTOMATED_SYSTEM',
  WearableSyncWarning = 'WEARABLE_SYNC_WARNING',
}

export const notificationGroupId = 'biostasis';

export const channelGroupConfig: AndroidChannelGroup = {
  id: notificationGroupId,
  name: 'Tomorrow.bio',
  description:
    'Notification channels used by Tomorrow.bio on Android.',
};
export const normalNotification = {
  id: '4',
  channelId: 'biostasis-channel',
};

export const regularCheckNotification = {
  id: '5',
  channelId: 'biostasis-regular-check-channel',
};

export const emergencyNotification = {
  id: '6',
  channelId: 'biostasis-emergency-channel',
};

export const normalChannelConfig: AndroidChannel = {
  id: normalNotification.channelId,
  groupId: notificationGroupId,
  name: 'Tomorrow.bio info',
  description: 'General Tomorrow.bio notifications.',
  badge: true,
  vibration: true,
  lights: false,
  importance: AndroidImportance.HIGH,
};

export const regularCheckChannelConfig: AndroidChannel = {
  id: regularCheckNotification.channelId,
  groupId: notificationGroupId,
  name: 'Tomorrow.bio check-ins',
  description: 'Emergency monitoring check-in notifications.',
  badge: true,
  vibration: false,
  lights: false,
  importance: AndroidImportance.DEFAULT,
};

export const emergencyChannelConfig: AndroidChannel = {
  id: emergencyNotification.channelId,
  groupId: notificationGroupId,
  name: 'Tomorrow.bio emergency',
  description: 'Urgent emergency workflow notifications.',
  badge: true,
  vibration: true,
  lights: true,
  vibrationPattern: [1300, 1500],
  lightColor: AndroidColor.RED,
  importance: AndroidImportance.HIGH,
};
