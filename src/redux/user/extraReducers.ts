import {
  ActionReducerMapBuilder,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import ToastService from '~/services/Toast.service';
import {IUser, IUserState} from './user.slice';
import {
  getUser,
  cancelEmergency,
  updateUser,
  updateEmergencyButtonSettings,
  sendTestMessage,
  deleteUser,
  logOutUser,
} from './thunks';

const pendingGetUser = (state: IUserState) => {
  state.pending = true;
};

const fulfilledGetUser = (
  state: IUserState,
  {payload}: PayloadAction<IUser>,
) => {
  state.pending = false;
  state.isOffline = false;
  state.user = payload;
};

const rejectedGetUser = (
  state: IUserState,
  {error}: {error: SerializedError},
) => {
  state.pending = false;
  state.isOffline = true;
  ToastService.error(i18n.t('common.error'));
  console.log(`error when fetching user: ${error.message}`);
};

const pendingCancelEmergency = () => {};

const fulfilledCancelEmergency = () => {};

const rejectedCancelEmergency = () => {};

const pendingDeleteUser = (state: IUserState) => {
  state.pending = true;
};

const fulfilledDeleteUser = (state: IUserState) => {
  state.pending = false;
};

const rejectedDeleteUser = (
  state: IUserState,
  {error}: {error: SerializedError},
) => {
  state.pending = false;
  ToastService.error(i18n.t('common.error'));
  console.log(`error when deleting user: ${error.message}`);
};

const pendingLogOutUser = (state: IUserState) => {
  state.pending = true;
};

const fulfilledLogOutUser = (state: IUserState) => {
  state.pending = false;
};

const rejectedLogOutUser = (state: IUserState) => {
  state.pending = false;
};

const fulfilledUpdateActiveEmergencyContactStatus = (
  state: IUserState,
  action: PayloadAction<IUser>,
) => {
  fulfilledGetUser(state, action);
  state.emergencyButtonSettingsUpdated = true;
};

const pendingSendTestMessage = (state: IUserState) => {
  state.testMessage.pending = true;
};

const fulfilledSendTestMessage = (state: IUserState) => {
  state.testMessage.pending = false;
  ToastService.success(
    i18n.t('emergencyContactsSettings.settings.testMessageSent'),
  );
};

const rejectedSendTestMessage = (
  state: IUserState,
  {error}: {error: SerializedError},
) => {
  state.testMessage.pending = false;
  ToastService.error(i18n.t('common.error'));
  console.log(`error when sending test message: ${error.message}`);
};

export const extraReducersBuilder = (
  builder: ActionReducerMapBuilder<IUserState>,
) => {
  builder.addCase(getUser.pending, pendingGetUser);
  builder.addCase(getUser.fulfilled, fulfilledGetUser);
  builder.addCase(getUser.rejected, rejectedGetUser);

  builder.addCase(cancelEmergency.pending, pendingCancelEmergency);
  builder.addCase(cancelEmergency.fulfilled, fulfilledCancelEmergency);
  builder.addCase(cancelEmergency.rejected, rejectedCancelEmergency);

  builder.addCase(updateUser.pending, pendingGetUser);
  builder.addCase(updateUser.fulfilled, fulfilledGetUser);
  builder.addCase(updateUser.rejected, rejectedGetUser);

  builder.addCase(updateEmergencyButtonSettings.pending, pendingGetUser);
  builder.addCase(
    updateEmergencyButtonSettings.fulfilled,
    fulfilledUpdateActiveEmergencyContactStatus,
  );
  builder.addCase(updateEmergencyButtonSettings.rejected, rejectedGetUser);

  builder.addCase(sendTestMessage.pending, pendingSendTestMessage);
  builder.addCase(sendTestMessage.fulfilled, fulfilledSendTestMessage);
  builder.addCase(sendTestMessage.rejected, rejectedSendTestMessage);

  builder.addCase(deleteUser.pending, pendingDeleteUser);
  builder.addCase(deleteUser.fulfilled, fulfilledDeleteUser);
  builder.addCase(deleteUser.rejected, rejectedDeleteUser);

  builder.addCase(logOutUser.pending, pendingLogOutUser);
  builder.addCase(logOutUser.fulfilled, fulfilledLogOutUser);
  builder.addCase(logOutUser.rejected, rejectedLogOutUser);
};

export default extraReducersBuilder;
