import {Screens} from '~/models/Navigation.model';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {useAppSelector} from '~/redux/store/hooks';

/**
 * When a user wants to add the first emergency contact, explanations should be displayed before that
 * @returns screen name
 */
export const useNavigateToAddNewEmergencyContactScreenName = () => {
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  if (hasContacts && areContactsEnabled) {
    return Screens.AddNewEmergencyContact;
  } else if (hasContacts && !areContactsEnabled) {
    return Screens.EmergencyContactSettings;
  }
  return Screens.EmergencyContactExplanations;
};
