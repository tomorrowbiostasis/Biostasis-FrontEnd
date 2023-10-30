import {createAsyncThunk} from '@reduxjs/toolkit';
// import {Notifications} from 'react-native-notifications';
import {RootState} from '~/redux/store';
import API from '~/services/API.service';
import i18n from '~/i18n/i18n';
import {IApiTimeSlot} from '~/services/API.types';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {stopBackgroundFetch} from '~/services/Background.service';
import ToastService from '~/services/Toast.service';
import {ApiToLocal, LocalToApi} from '~/services/TimeSlot.service';
import {isIOS} from '~/utils';
import {getUser, updateUser} from '../user/thunks';
import {
  IPausedDate,
  ISpecificPausedTime,
  setAutomatedEmergencyPause,
} from './automatedEmergency.slice';
// import {updateNotification} from '~/services/Notification.service';

export const startEmergency = createAsyncThunk(
  'automatedEmergency/startEmergency',
  async (_, thunkApi) => {
    try {
      //TODO after refactoring backend remove unnecessary params
      const response = await API.startEmergency({delayed: false});
      console.log('STARTING EMERGENCY');
      thunkApi.dispatch(getUser());
      await AsyncStorageService.setItem(
        AsyncStorageEnum.IsEmergencyEscalationStarted,
        'false',
      );
      return {
        data: response.data,
      };
    } catch (e) {
      ToastService.error(i18n.t('dashboard.emergency.error'));
    }
  },
);

export const getTimeSlot = createAsyncThunk('timeSlot/get', async () => {
  const response = await API.getTimeSlot();
  return ApiToLocal.mapApiToLocalData(response.data);
});

export const addPauseFromNow = createAsyncThunk(
  'timeSlotPauseFromNow/post',
  async (data: IPausedDate, thunkApi) => {
    let timeSlot = LocalToApi.mapLocalFromNowToApiTimeSLot(data?.timestamp);
    const response = await API.addTimeSlot(timeSlot);
    thunkApi.dispatch(getTimeSlot());
    /*
      For now setting proper values instead of temporary ids which cannot be deleted on backend side
     */
    thunkApi.dispatch(setAutomatedEmergencyPause({...data, ...response.data}));
    return response.data;
  },
);

export const addTimeSlot = createAsyncThunk(
  'timeSlot/post',
  async (data: ISpecificPausedTime, thunkApi) => {
    let timeSlot = LocalToApi.mapLocalSpecificPausedTimeToApiTimeSLot(data);
    const response = await API.addTimeSlot(timeSlot);
    thunkApi.dispatch(getTimeSlot());
    return response.data;
  },
);

export const deleteTimeSlot = createAsyncThunk(
  'timeSlot/delete',
  async (id: IApiTimeSlot['id'], thunkApi) => {
    await API.deleteTimeSlot(id);
    return thunkApi.dispatch(getTimeSlot());
  },
);

export const updateTimeSlot = createAsyncThunk(
  'timeSlot/patch',
  async ({id, data}: {id: IApiTimeSlot['id']; data: ISpecificPausedTime}) => {
    let timeSlot = LocalToApi.mapLocalSpecificPausedTimeToApiTimeSLot(data);
    const response = await API.updateTimeSlot(id, timeSlot);
    return ApiToLocal.mapApiToSpecificPausedTimesItem(response.data);
  },
);

export const pushPositiveResponse = createAsyncThunk<
  unknown,
  void,
  {state: RootState}
>('pushPositiveResponse', async (_, thunkApi) => {
  try {
    const {
      positiveInfoPeriod,
      regularPushNotification,
      frequencyOfRegularNotification,
    } = thunkApi.getState().user.user;

    const timeToNext = regularPushNotification
      ? frequencyOfRegularNotification
      : positiveInfoPeriod;

    const response = await API.positiveInfo(timeToNext!);
    // stopping automated emergency while escalation process is finished
    if (response.data.success === false) {
      thunkApi.dispatch(updateUser({automatedEmergency: false}));
      return isIOS ? null : await stopBackgroundFetch();
    }
    await API.cancelEmergency();
    await AsyncStorageService.setItem(
      AsyncStorageEnum.IsEmergencyEscalationStarted,
      'false',
    );
    // Clearing not opened notifications while triggering from Sticky local
    // Notifications.removeAllDeliveredNotifications();
    // const isPulse = !thunkApi.getState().user.user.regularPushNotification;
    // isPulse &&
    //   (await updateNotification(
    //     i18n.t('bioCheck.messages.automatedEmergency'),
    //     i18n.t('bioCheck.messages.userSendSignal'),
    //   ));
  } catch (error: any) {
    console.log(error.message);
    ToastService.error(
      'There was a problem with emergency cancellation. Please reload the app.',
    );
  }
});
