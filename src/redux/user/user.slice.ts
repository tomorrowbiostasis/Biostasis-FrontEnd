import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {extraReducersBuilder} from '~/redux/user/extraReducers';
import {IToastMessage} from '~/models/Message.model';

export interface IUser {
  userId?: string;
  address?: string;
  name?: string;
  surname?: string;
  phone?: string;
  prefix?: number;
  countryCode?: string;
  email?: string;
  dateOfBirth?: string;
  primaryPhysician?: string;
  primaryPhysicianAddress?: string;
  seriousMedicalIssues?: boolean;
  mostRecentDiagnosis?: string;
  lastHospitalVisit?: string | null;
  allowNotifications?: boolean;
  tipsAndTricks?: boolean;
  emergencyEmailAndSms?: boolean;
  locationAccess?: boolean;
  uploadedDocumentsAccess?: boolean;
  emergencyMessage?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  role?: number;
  fillLevel?: number;
  readManual?: boolean;
  automatedEmergency?: boolean; // info only for mobile app, tells that the switch is ON
  isEmergencyTriggerActive?: boolean; // true = emergency info sent to contacts
  regularPushNotification?: boolean; // false = backend waiting for positive info, true = backend sending regular pushes
  frequencyOfRegularNotification?: number; // setting for regular push messages
  positiveInfoPeriod?: number; // setting for positive info driven trigger
  pulseBasedTriggerIOSHealthPermissions?: boolean;
  pulseBasedTriggerIOSAppleWatchPaired?: boolean;
  pulseBasedTriggerConnectedToGoogleFit?: boolean;
  pulseBasedTriggerBackgroundModesEnabled?: boolean;
  pulseBasedTriggerGoogleFitAuthenticated?: boolean;
  location?: string;
  timezone?: string;
}

export interface IUserState {
  user: IUser;
  pending: boolean;
  isOffline: boolean;
  emergencyButtonSettingsToastMessage?: IToastMessage;
  emergencyButtonSettingsUpdated: boolean;
  testMessage: {
    pending: boolean;
    sentMessage: IToastMessage | null;
  };
}

export const initialState: IUserState = {
  user: {},
  pending: false,
  isOffline: false,
  emergencyButtonSettingsToastMessage: undefined,
  emergencyButtonSettingsUpdated: false,
  testMessage: {
    pending: false,
    sentMessage: null,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: IUserState, action: PayloadAction<IUserState>) => {
      state.user = action.payload.user;
    },
    clearUser: (state: IUserState) => {
      state.user = initialState.user;
    },
    setEmergencyButtonSettingsUpdated: (
      state: IUserState,
      action: PayloadAction<IUserState['emergencyButtonSettingsUpdated']>,
    ) => {
      state.emergencyButtonSettingsUpdated = action.payload;
    },
    setTestMessageSentMessage: (
      state: IUserState,
      {payload}: PayloadAction<IUserState['testMessage']['sentMessage']>,
    ) => {
      state.testMessage.sentMessage = payload;
    },
  },
  extraReducers: extraReducersBuilder,
});

export const {
  setUser,
  clearUser,
  setEmergencyButtonSettingsUpdated,
  setTestMessageSentMessage,
} = userSlice.actions;

export default userSlice.reducer;
