import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '~/services/API.service';
import {IUser} from './user.slice';
import NotificationService from '~/services/NotificationService';
import i18n from '~/i18n/i18n';

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await API.getUser();
  return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async () => {
  const response = await API.deleteUser();
  return response.data;
});

export const logOutUser = createAsyncThunk<void>(
  'user/logoutUser',
  async () => {
    await API.logOutUser();
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: IUser) => {
    try {
      const response = await API.updateUser(user);

      return response.data;
    } catch (error) {
      const {code} = error.response.data.error;
      const {details} = error.response.data.message;
      const isPhone = details.some((item: any) => item.context.key === 'phone');

      if ((code === 'E0003' || code === 'E0021') && isPhone) {
        NotificationService.error(i18n.t('validation.number.incorrectFormat'));
      }
      throw new Error(code);
    }
  },
);

export const updateEmergencyButtonSettings = createAsyncThunk(
  'user/updateEmergencyButtonSettings',
  async (user: IUser) => {
    const response = await API.updateUser(user);
    return response.data;
  },
);

export const sendTestMessage = createAsyncThunk(
  'user/sendTestMessage',
  async () => {
    const response = await API.sendTestMessage();
    return response.data;
  },
);

export const cancelEmergency = createAsyncThunk(
  'user/cancelEmergency',
  async () => {
    const response = await API.cancelEmergency();
    return response.data;
  },
);
