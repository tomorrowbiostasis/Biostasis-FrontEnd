import {RootState} from '../store';
import {IEmergencyContactsState} from './emergencyContacts.slice';

interface IContactsInfo {
  hasContacts: boolean;
  areContactsEnabled: boolean;
}

export const selectEmergencyContacts = (
  state: RootState,
): IEmergencyContactsState['emergencyContacts'] =>
  state.emergencyContacts.emergencyContacts;

export const selectContactsInfo = (state: RootState): IContactsInfo => {
  const {emergencyContacts} = state.emergencyContacts;
  return {
    areContactsEnabled: !!emergencyContacts.find(contact => contact.active),
    hasContacts: !!emergencyContacts?.length,
  };
};
