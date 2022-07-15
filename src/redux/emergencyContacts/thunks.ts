import {createAsyncThunk} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import API from '~/services/API.service';
import NotificationService from '~/services/NotificationService';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from './emergencyContacts.slice';

export type IUpdateEmergencyActiveStatus = {
  contact: IEmergencyContactResponse;
  active: boolean;
};

export type IUpdateEmergencyContact = {
  id: string;
  contact: IEmergencyContact;
  onSuccess: () => void;
};

export const getEmergencyContacts = createAsyncThunk(
  'emergencyContacts/get',
  async () => {
    const response = await API.getEmergencyContacts();
    return response.data;
  },
);

export const updateActiveEmergencyContactStatus = createAsyncThunk(
  'emergencyContacts/updateActiveStatus',
  async ({contact, active}: IUpdateEmergencyActiveStatus) => {
    const response = await API.updateEmergencyContact(contact.id, {
      active,
    });
    return response.data;
  },
);
export const addEmergencyContact = createAsyncThunk(
  'emergencyContacts/add',
  async (contact: IEmergencyContact, thunkApi) => {
    const response = await API.addEmergencyContact(contact).catch(error => {
      const {code} = error.response.data.error;
      const {details} = error.response.data.message;
      const isPhone = details.find(item => item.context.key === 'phone');
      if ((code === 'E0003' || code === 'E0021') && isPhone) {
        NotificationService.error(i18n.t('validation.number.incorrectFormat'));
      }
    });
    thunkApi.dispatch(getEmergencyContacts());
    return response.data;
  },
);

export const updateEmergencyContact = createAsyncThunk(
  'emergencyContacts/update',
  async ({id, contact, onSuccess}: IUpdateEmergencyContact, thunkApi) => {
    return await API.updateEmergencyContact(id, contact)
      .then(async response => {
        await thunkApi.dispatch(getEmergencyContacts());
        onSuccess();
        return response.data;
      })
      .catch(error => {
        NotificationService.error(
          i18n.t('emergencyContacts.addNewEdit.errorDuringUpdate'),
        );
        console.log(error);
        return null;
      });
  },
);

export const deleteEmergencyContact = createAsyncThunk(
  'emergencyContacts/delete',
  async (id: string, thunkApi) => {
    const response = await API.deleteEmergencyContact(id);
    thunkApi.dispatch(getEmergencyContacts());
    return response.data;
  },
);
