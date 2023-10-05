import {createAsyncThunk} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import API from '~/services/API.service';
import ToastService from '~/services/Toast.service';
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
    })
      .then(() => {
        if (active) {
          ToastService.success(
            i18n.t('emergencyContactsSettings.addNewEdit.activateContact'),
          );
        } else {
          ToastService.success(
            i18n.t('emergencyContactsSettings.addNewEdit.deactivateContact'),
          );
        }
      })
      .catch(() =>
        ToastService.error(
          i18n.t('emergencyContactsSettings.addNewEdit.errorActivate'),
        ),
      );
    return response.data;
  },
);
export const AddNewEmergencyContact = createAsyncThunk(
  'emergencyContacts/add',
  async (contact: IEmergencyContact, thunkApi) => {
    return await API.AddNewEmergencyContact(contact)
      .then(async response => {
        await thunkApi
          .dispatch(getEmergencyContacts())
          .then(() =>
            ToastService.success(
              i18n.t('emergencyContactsSettings.addNewEdit.addContact'),
            ),
          )
          .catch(() =>
            ToastService.error(
              i18n.t('emergencyContactsSettings.addNewEdit.errorAddContact'),
            ),
          );
        return response.data;
      })
      .catch(error => {
        const {code} = error.response.data.error;
        const {details} = error.response.data.message;
        const isPhone = details.find(item => item.context.key === 'phone');
        if ((code === 'E0003' || code === 'E0021') && isPhone) {
          ToastService.error(i18n.t('validation.number.incorrectFormat'));
        } else {
          ToastService.error(
            i18n.t('emergencyContactsSettings.addNewEdit.errorAddContact'),
          );
        }
        return null;
      });
  },
);

export const updateEmergencyContact = createAsyncThunk(
  'emergencyContacts/update',
  async ({id, contact, onSuccess}: IUpdateEmergencyContact, thunkApi) => {
    return await API.updateEmergencyContact(id, contact)
      .then(async response => {
        await thunkApi
          .dispatch(getEmergencyContacts())
          .then(() =>
            ToastService.success(
              i18n.t('emergencyContactsSettings.addNewEdit.updateContact'),
            ),
          )
          .catch(() =>
            ToastService.error(
              i18n.t('emergencyContactsSettings.addNewEdit.errorUpdateContact'),
            ),
          );
        onSuccess();
        return response.data;
      })
      .catch(error => {
        ToastService.error(
          i18n.t('emergencyContactsSettings.addNewEdit.errorDuringUpdate'),
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
    thunkApi
      .dispatch(getEmergencyContacts())
      .then(() =>
        ToastService.success(
          i18n.t('emergencyContactsSettings.addNewEdit.deleteContact'),
        ),
      )
      .catch(() =>
        ToastService.error(
          i18n.t('emergencyContactsSettings.addNewEdit.errorDeleteContact'),
        ),
      );
    return response.data;
  },
);
