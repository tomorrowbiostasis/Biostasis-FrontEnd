import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {useAppSelector} from '~/redux/store/hooks';

/**
 * When a user wants to add the first emergency contact, explanations should be displayed before that
 * @returns screen name
 */
export const useNavigateToAddEmergencyContactScreenName = () => {
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  if (hasContacts && areContactsEnabled) {
    return 'AddNewEmergencyContact';
  } else if (hasContacts && !areContactsEnabled) {
    return 'EmergencyContactList';
  }
  return 'EmergencyContactExplanations';
};
