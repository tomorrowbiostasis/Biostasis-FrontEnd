import {ActionReducerMapBuilder, SerializedError} from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import i18n from '~/i18n/i18n';
import NotificationService from '~/services/NotificationService';
import {IGDPRState} from './gdpr.slice';
import {sendGDPR} from './thunks';

const pendingSendGDPR = (state: IGDPRState) => {
  state.gdprStatus = null;
};

const fulfilledSendGDPR = (state: IGDPRState) => {
  state.gdprStatus = 'success';
  Toast.show({
    text1: i18n.t('gdpr.notification'),
    type: 'biostasis_success',
  });
};

const rejectedSendGDPR = (
  state: IGDPRState,
  {error}: {error: SerializedError},
) => {
  state.gdprStatus = 'error';
  Toast.show({
    text1: i18n.t('gdpr.error'),
    type: 'biostasis_error',
  });
  NotificationService.error('common.error');
  console.log(`error when sending gdpr: ${error.message}`);
};

export const extraReducersBuilder = (
  builder: ActionReducerMapBuilder<IGDPRState>,
) => {
  builder.addCase(sendGDPR.pending, pendingSendGDPR);
  builder.addCase(sendGDPR.fulfilled, fulfilledSendGDPR);
  builder.addCase(sendGDPR.rejected, rejectedSendGDPR);
};

export default extraReducersBuilder;
