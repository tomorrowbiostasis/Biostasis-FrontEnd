import {ActionReducerMapBuilder, SerializedError} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import ToastService from '~/services/Toast.service';
import {IGDPRState} from './gdpr.slice';
import {sendGDPR} from './thunks';

const pendingSendGDPR = (state: IGDPRState) => {
  state.gdprStatus = null;
};

const fulfilledSendGDPR = (state: IGDPRState) => {
  state.gdprStatus = 'success';
  ToastService.success(i18n.t('accountSettings.GDPR.notification'));
};

const rejectedSendGDPR = (
  state: IGDPRState,
  {error}: {error: SerializedError},
) => {
  state.gdprStatus = 'error';
  ToastService.error(i18n.t('accountSettings.GDPR.error'));
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
