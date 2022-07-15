import {RootState} from '../store';
import {IUser, IUserState} from './user.slice';

export type EmergencyButtonSettings = Pick<
  IUser,
  | 'emergencyEmailAndSms'
  | 'locationAccess'
  | 'uploadedDocumentsAccess'
  | 'emergencyMessage'
>;

export type AccountSettings = Pick<
  IUser,
  'allowNotifications' | 'tipsAndTricks'
>;

export type AutomatedEmergencySettings = Pick<
  IUser,
  | 'automatedEmergency'
  | 'readManual'
  | 'regularPushNotification'
  | 'pulseBasedTriggerGoogleFitAuthenticated'
  | 'frequencyOfRegularNotification'
  | 'positiveInfoPeriod'
>;

export const userSelector = (state: RootState): IUserState => state.user;

export const userInitializedSelector = (state: RootState): boolean =>
  checkIfInitialized(state.user);

const checkIfInitialized = (userState: IUserState): boolean => {
  const {
    user: {name, surname, phone, dateOfBirth, address},
  } = userState;
  return !!name && !!surname && !!phone && !!dateOfBirth && !!address;
};

export const selectEmergencyButtonSettings = (
  state: RootState,
): EmergencyButtonSettings => {
  const {
    emergencyEmailAndSms,
    locationAccess,
    uploadedDocumentsAccess,
    emergencyMessage,
  } = state.user.user;
  return {
    emergencyEmailAndSms,
    locationAccess,
    uploadedDocumentsAccess,
    emergencyMessage,
  };
};

export const testMessageSelector = (
  state: RootState,
): IUserState['testMessage'] => state.user.testMessage;

export const automatedEmergencySettingsSelector = (
  state: RootState,
): AutomatedEmergencySettings => {
  const {
    automatedEmergency,
    regularPushNotification,
    readManual,
    positiveInfoPeriod,
    frequencyOfRegularNotification,
  } = state.user.user;

  return {
    frequencyOfRegularNotification,
    positiveInfoPeriod,
    automatedEmergency,
    regularPushNotification,
    readManual,
  };
};

export const accountSettingsSelector = (state: RootState): AccountSettings => {
  const {allowNotifications, tipsAndTricks} = state.user.user;
  return {allowNotifications, tipsAndTricks};
};

export const userLoading = (state: RootState): boolean => {
  const {pending} = state.user;
  return pending;
};
