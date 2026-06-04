import {Screens} from '~/models/Navigation.model';
/** Emergency contact setup should always enter through the real settings hub. */
export const useNavigateToAddNewEmergencyContactScreenName = () => {
  return Screens.EmergencyContactSettings;
};
