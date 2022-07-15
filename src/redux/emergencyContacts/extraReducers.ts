import {
  ActionReducerMapBuilder,
  CaseReducer,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import NotificationService from '~/services/NotificationService';

import {
  IEmergencyContactResponse,
  IEmergencyContactsState,
} from './emergencyContacts.slice';
import {
  addEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  IUpdateEmergencyActiveStatus,
  updateActiveEmergencyContactStatus,
  updateEmergencyContact,
} from './thunks';

const findEmergencyContactIndex = (
  contactList: IEmergencyContactResponse[],
  contact: IEmergencyContactResponse,
) => contactList.findIndex(item => item.id === contact.id);

type PendingUpdateActiveEmergencyContactStatus = CaseReducer<
  IEmergencyContactsState,
  PayloadAction<
    undefined,
    string,
    {
      arg: IUpdateEmergencyActiveStatus;
      requestId: string;
      requestStatus: 'pending';
    },
    never
  >
>;

const pendingGetEmergencyContacts = (state: IEmergencyContactsState) => {
  state.pending = true;
};

const fulfilledGetEmergencyContacts = (
  state: IEmergencyContactsState,
  {payload}: PayloadAction<IEmergencyContactResponse[]>,
) => {
  state.pending = false;
  state.emergencyContacts = payload;
};

const rejectedGetEmergencyContacts = (
  state: IEmergencyContactsState,
  {error}: {error: SerializedError},
) => {
  state.pending = false;
  NotificationService.error(i18n.t('common.error'));
  console.log(`error when fetching emergency contacts: ${error.message}`);
};

const pendingAddEmergencyContacts = (state: IEmergencyContactsState) => {
  state.pending = true;
};

const fulfilledAddEmergencyContacts = (state: IEmergencyContactsState) => {
  state.pending = false;
};

const rejectedAddEmergencyContacts = (
  state: IEmergencyContactsState,
  {error}: {error: SerializedError},
) => {
  state.pending = false;
  NotificationService.error(i18n.t('common.error'));
  console.log(`error when adding emergency contact: ${error.message}`);
};
const pendingDeleteEmergencyContacts = (state: IEmergencyContactsState) => {
  state.pending = true;
};

const fulfilledDeleteEmergencyContacts = (state: IEmergencyContactsState) => {
  state.pending = false;
};

const rejectedDeleteEmergencyContacts = (
  state: IEmergencyContactsState,
  {error}: {error: SerializedError},
) => {
  state.pending = false;
  NotificationService.error(i18n.t('common.error'));
  console.log(`error when deleting emergency contact: ${error.message}`);
};

const pendingUpdateEmergencyContacts = (state: IEmergencyContactsState) => {
  state.pending = true;
};

const fulfilledUpdateEmergencyContacts = (state: IEmergencyContactsState) => {
  state.pending = false;
};

const rejectedUpdateEmergencyContacts = (
  state: IEmergencyContactsState,
  {error}: {error: SerializedError},
) => {
  state.pending = false;
  NotificationService.error(i18n.t('common.error'));
  console.log(`error when updating emergency contact: ${error.message}`);
};

const pendingUpdateActiveEmergencyContactStatus: PendingUpdateActiveEmergencyContactStatus =
  (state: IEmergencyContactsState, {meta}) => {
    const {contact, active} = meta.arg;
    state.pending = false;
    const contactIndex = findEmergencyContactIndex(
      state.emergencyContacts,
      contact,
    );

    if (contactIndex !== -1) {
      state.emergencyContacts[contactIndex].active = active;
    }
  };

const fulfilledUpdateActiveEmergencyContactStatus = (
  state: IEmergencyContactsState,
  {payload}: PayloadAction<IEmergencyContactResponse>,
) => {
  state.pending = false;
  const contactIndex = findEmergencyContactIndex(
    state.emergencyContacts,
    payload,
  );

  if (contactIndex !== -1) {
    state.emergencyContacts[contactIndex] = payload;
  }
};

const rejectedUpdateActiveEmergencyContactStatus = (
  state: IEmergencyContactsState,
  {error}: {error: SerializedError},
) => {
  state.pending = false;
  console.log('Error during update active emergency contact status', error);
};

export const extraReducersBuilder = (
  builder: ActionReducerMapBuilder<IEmergencyContactsState>,
) => {
  builder.addCase(getEmergencyContacts.pending, pendingGetEmergencyContacts);
  builder.addCase(
    getEmergencyContacts.fulfilled,
    fulfilledGetEmergencyContacts,
  );
  builder.addCase(getEmergencyContacts.rejected, rejectedGetEmergencyContacts);

  builder.addCase(
    updateActiveEmergencyContactStatus.pending,
    pendingUpdateActiveEmergencyContactStatus,
  );
  builder.addCase(
    updateActiveEmergencyContactStatus.fulfilled,
    fulfilledUpdateActiveEmergencyContactStatus,
  );
  builder.addCase(
    updateActiveEmergencyContactStatus.rejected,
    rejectedUpdateActiveEmergencyContactStatus,
  );
  builder.addCase(addEmergencyContact.pending, pendingAddEmergencyContacts);
  builder.addCase(addEmergencyContact.fulfilled, fulfilledAddEmergencyContacts);
  builder.addCase(addEmergencyContact.rejected, rejectedAddEmergencyContacts);
  builder.addCase(
    updateEmergencyContact.pending,
    pendingUpdateEmergencyContacts,
  );
  builder.addCase(
    updateEmergencyContact.fulfilled,
    fulfilledUpdateEmergencyContacts,
  );
  builder.addCase(
    updateEmergencyContact.rejected,
    rejectedUpdateEmergencyContacts,
  );
  builder.addCase(
    deleteEmergencyContact.pending,
    pendingDeleteEmergencyContacts,
  );
  builder.addCase(
    deleteEmergencyContact.fulfilled,
    fulfilledDeleteEmergencyContacts,
  );
  builder.addCase(
    deleteEmergencyContact.rejected,
    rejectedDeleteEmergencyContacts,
  );
};

export default extraReducersBuilder;
