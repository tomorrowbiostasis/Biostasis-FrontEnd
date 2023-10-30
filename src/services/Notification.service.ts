import notifee, {
  AndroidCategory,
  AndroidStyle,
  EventType,
  // NativeAndroidChannel,
  Notification,
} from '@notifee/react-native';
import {isIOS} from '~/utils';
import {
  channelGroupConfig,
  emergencyChannelConfig,
  emergencyNotification,
  normalChannelConfig,
  normalNotification,
  notificationGroupId,
  NotificationTypesEnum,
  regularCheckChannelConfig,
  regularCheckNotification,
} from '~/constants/notification.constants';
import i18n from 'i18next';
import {getUserPersistedSettings} from './AsyncStorage.service/helpers';
import API from './API.service';
import {startBioCheck} from './BioCheck.service';
import colors from '~/theme/colors';
import {scheduleEvent} from './Background.service';
import {BackgroundEventsEnum} from './Background.types';
import {navigate} from '~/navigators';
import {Screens} from '~/models/Navigation.model';
import {AsyncStorageService} from './AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';
import SoundService from './Alert.service';
/**
 * local Notification Android
 **/

export const createNotificationChannels = async () => {
  await notifee.createChannelGroup(channelGroupConfig);
  await notifee
    .createChannels([
      normalChannelConfig,
      regularCheckChannelConfig,
      emergencyChannelConfig,
    ])
    .then(() => {
      console.log('notification channel created');
    })
    .catch((e: any) => console.log('Error: Notification channel creation', e));
};

export const updateNotification = async (
  title: string,
  text: string,
  type?: NotificationTypesEnum,
) => {
  const notification: Notification = await createNotificationBasedOnType(
    title,
    text,
    type,
  );

  await notifee.cancelAllNotifications([
    normalNotification.id,
    regularCheckNotification.id,
    emergencyNotification.id,
  ]);

  notifee.onBackgroundEvent(handleNotificationEvents);

  await notifee
    .displayNotification(notification)
    .then(() => {
      console.log('notification updated successfully');
    })
    .catch((e: any) => console.log('update notification error', e));
};

export const handleNotificationEvents = async ({type, detail}: any) => {
  try {
    if (type === EventType.ACTION_PRESS) {
      const {pressAction} = detail;
      return handleActionPress(pressAction?.id);
    }
  } catch (error: any) {
    console.log('Error: Fetch listeners', error.message);
  }
};

export const stopForegroundFetch = async () => {
  try {
    await notifee.stopForegroundService().then(async () => {
      await notifee
        .cancelAllNotifications([
          normalNotification.id,
          regularCheckNotification.id,
          emergencyNotification.id,
        ])
        .then(async () => {
          await notifee.deleteChannelGroup(notificationGroupId);
          console.log('notification channels deleted');
        });
    });
    console.log('Foreground fetch stopped');
  } catch (error: any) {
    console.log('Error: Stopping foreground fetch ', error.message);
  }
};

const handleActionPress = async (id: string) => {
  switch (id) {
    case 'send-signal':
      const {positiveInfoPeriod} = await getUserPersistedSettings();
      await updateNotification(
        i18n.t('bioCheck.messages.refresh'),
        '',
        NotificationTypesEnum.WaitRefresh,
      ).then(async () => {
        await API.positiveInfo(positiveInfoPeriod).then(async () => {
          console.log('user sent positive signal');
          await updateNotification(
            i18n.t('bioCheck.messages.automatedEmergency'),
            i18n.t('bioCheck.messages.userSendSignal'),
          );
        });
        systemReset();
      });
      break;

    case 'bio-refresh':
      await updateNotification(
        i18n.t('bioCheck.messages.refresh'),
        '',
        NotificationTypesEnum.WaitRefresh,
      ).then(
        async () =>
          await startBioCheck().then(() => {
            console.log('user refresh bio data manually');
          }),
      );
      break;
    case 'start-emergency':
      await updateNotification(
        i18n.t('automatedEmergencyStatus.emergency'),
        '',
        NotificationTypesEnum.WaitEmergencyAlert,
      );
      await scheduleEvent(BackgroundEventsEnum.EmergencyRetryMechanism, 0)
        .then(() => console.log('first retry task set'))
        .catch(e => {
          console.log('task not scheduled', e);
        });

      await API.updateUser({automatedEmergency: false});
      systemReset();
  }
};

const createNotificationBasedOnType = async (
  title: string,
  text: string,
  type?: NotificationTypesEnum,
): Promise<Notification> => {
  let notification: Notification;

  switch (type) {
    case NotificationTypesEnum.NoDataFound:
      notification = {
        id: emergencyNotification.id,
        title: `<p style="color: ${colors.magenta[200]}"><b>${title}</b></p>`,
        subtitle: new Date().toLocaleTimeString(),
        body: text,
        data: {type},
        android: {
          channelId: emergencyNotification.channelId,
          category: AndroidCategory.ALARM,
          pressAction: {
            id: 'default',
          },
          autoCancel: false,
          actions: [
            {
              title: `<p style="color: ${colors.red[400]}">❌ ${i18n.t(
                'common.startEmergency',
              )}</p>`,
              pressAction: {
                id: 'start-emergency',
              },
            },
            {
              title: `<p style="color: ${colors.green[800]}">${i18n.t(
                'common.fine',
              )} ✔️</p>`,
              pressAction: {
                id: 'send-signal',
              },
            },
          ],
          ongoing: true,
          color: '#0096FF',
          largeIcon: 'ic_stat_notification',
          style: {type: AndroidStyle.BIGTEXT, text},
        },
      };
      break;
    case NotificationTypesEnum.EmergencyHealthCheck:
    case NotificationTypesEnum.EmergencyAlert:
      notification = {
        id: emergencyNotification.id,
        title: isIOS
          ? title
          : `<p style="color: ${colors.magenta[200]}"><b>${title}
                </b></p>`,
        subtitle: new Date().toLocaleTimeString(),
        body: text,
        data: {type},
        android: {
          channelId: emergencyNotification.channelId,
          category: AndroidCategory.ALARM,
          fullScreenAction: {
            id: 'emergency-notification',
            mainComponent: `${navigate(Screens.HealthConditionError as never)}`,
          },
          autoCancel: false,
          actions: [
            {
              title: `<p style="color: ${colors.red[400]}">❌ ${i18n.t(
                'common.startEmergency',
              )}</p>`,
              pressAction: {
                id: 'start-emergency',
              },
            },
            {
              title: `<p style="color: ${colors.green[800]}">${i18n.t(
                'common.fine',
              )} ✔️</p>`,
              pressAction: {
                id: 'send-signal',
              },
            },
          ],
          ongoing: true,
          color: '#0096FF',
          largeIcon: 'ic_stat_notification',
          style: {type: AndroidStyle.BIGTEXT, text},
        },
        ios: {
          interruptionLevel: 'timeSensitive',
          sound: 'default',
          critical: true,
          categoryId: 'emergency',
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            list: true,
          },
        },
      };
      break;
    case NotificationTypesEnum.EmergencyRegularCheck:
      notification = {
        id: emergencyNotification.id,
        title: isIOS
          ? title
          : `<p style="color: ${colors.magenta[200]}"><b>${title}</b></p>`,
        subtitle: new Date().toLocaleTimeString(),
        body: text,
        data: {type},
        android: {
          channelId: emergencyNotification.channelId,
          category: AndroidCategory.ALARM,
          fullScreenAction: {
            id: 'emergency-notification',
            mainComponent: `${navigate(Screens.HealthConditionError as never, {
              regularCheck: true,
            })}`,
          },
          autoCancel: false,
          actions: [
            {
              title: `<p style="color: ${colors.red[400]}">❌ ${i18n.t(
                'common.startEmergency',
              )}</p>`,
              pressAction: {
                id: 'start-emergency',
              },
            },
            {
              title: `<p style="color: ${colors.green[800]}">${i18n.t(
                'common.fine',
              )} ✔️</p>`,
              pressAction: {
                id: 'send-signal',
              },
            },
          ],
          ongoing: true,
          color: '#0096FF',
          largeIcon: 'ic_stat_notification',
          style: {type: AndroidStyle.BIGTEXT, text},
        },
        ios: {
          interruptionLevel: 'timeSensitive',
          sound: 'default',
          categoryId: 'emergency',
          critical: true,
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            list: true,
          },
        },
      };
      break;
    case NotificationTypesEnum.WaitEmergencyAlert:
      notification = {
        id: emergencyNotification.id,
        title: title,
        subtitle: new Date().toLocaleTimeString(),
        android: {
          channelId: regularCheckNotification.channelId,
          autoCancel: false,
          progress: {
            indeterminate: true,
          },
          ongoing: true,
          color: '#0096FF',
          largeIcon: 'ic_stat_notification',
        },
        ios: {
          critical: true,
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            list: true,
          },
        },
      };
      break;
    case NotificationTypesEnum.WaitRefresh:
      notification = {
        id: regularCheckNotification.id,
        title: title,
        subtitle: new Date().toLocaleTimeString(),
        android: {
          channelId: regularCheckNotification.channelId,
          autoCancel: false,
          progress: {
            indeterminate: true,
          },
          ongoing: true,
          color: '#0096FF',
          largeIcon: 'ic_stat_notification',
        },
        ios: {
          critical: true,
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            list: true,
          },
        },
      };
      break;
    case NotificationTypesEnum.BioCheck:
      notification = {
        id: regularCheckNotification.id,
        title: `<p style="color: ${colors.magenta[200]}"><b>${title}</b></p>`,
        subtitle: new Date().toLocaleTimeString(),
        body: text,
        android: {
          channelId: regularCheckNotification.channelId,
          pressAction: {
            id: 'default',
          },
          autoCancel: false,
          actions: [
            {
              title: `<p style="color: ${colors.green[200]}">↻ ${i18n.t(
                'common.refresh',
              )}</p>`,
              pressAction: {
                id: 'bio-refresh',
              },
            },
          ],
          ongoing: true,
          color: '#0096FF',
          largeIcon: 'ic_stat_notification',
          style: {type: AndroidStyle.BIGTEXT, text},
        },
      };
      break;
    default:
      notification = {
        id: normalNotification.id,
        title: isIOS
          ? title
          : `<p style="color: ${colors.magenta[200]}"><b>${title}</b></p>`,
        subtitle: new Date().toLocaleTimeString(),
        body: text,
        android: {
          channelId: normalNotification.channelId,
          pressAction: {
            id: 'default',
          },
          autoCancel: false,
          ongoing: false,
          color: '#0096FF',
          largeIcon: 'ic_stat_notification',
          style: {type: AndroidStyle.BIGTEXT, text},
        },
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            list: true,
          },
        },
      };
  }
  return notification;
};

const systemReset = () => {
  SoundService.resetAllSounds();
  AsyncStorageService.setItem(AsyncStorageEnum.TimeTrigger, 'false');
  AsyncStorageService.setItem(AsyncStorageEnum.HealthTrigger, 'false');
  navigate(Screens.Home as never);
};
