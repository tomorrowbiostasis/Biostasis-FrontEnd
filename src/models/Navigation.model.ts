/* eslint-disable no-shadow */
import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackNavigatorParamList>;
  MainStack: NavigatorScreenParams<MainStackNavigatorParamList>;
  SignUpStack: NavigatorScreenParams<SignUpStackNavigatorParamList>;
  LostConnection: undefined;
  HealthConditionError: NavigatorScreenParams<{backendTriggered?: Boolean}>;
};

export type AuthStackNavigatorParamList = {
  Onboarding: undefined;
  Auth: undefined;
  AuthSample: undefined;
  ForgotPassword: undefined;
  NewPassword: undefined;
};

export type SignUpStackNavigatorParamList = {
  UserName: undefined;
  UserPhone: undefined;
  UserDateOfBirth: undefined;
  UserAddress: undefined;
  Void: undefined;
};

export type MainStackNavigatorParamList = {
  Home: undefined;
  EmergencyContactList: undefined;
  EmergencyContactExplanations: undefined;
  AddNewEmergencyContact: undefined;
  AutomatedEmergencySettings: undefined;
  EmergencyContactSettings: undefined;
  SelectSmartDevice: undefined;
  SpecificTimePaused: undefined;
  Documents: undefined;
  ProfileDefault: undefined;
  AccountSettings: undefined;
  ProfileEdit: undefined;
  ProfileMedicalInfo: undefined;
  GDPR: undefined;
  DeleteAccount: undefined;
  SignUpForCryopreservation: undefined;
};

export type NavigationRouteName =
  | keyof AuthStackNavigatorParamList
  | keyof MainStackNavigatorParamList
  | keyof SignUpStackNavigatorParamList;

export type NavigationRouteParamList = AuthStackNavigatorParamList &
  MainStackNavigatorParamList &
  SignUpStackNavigatorParamList;

/**
 * Generic type to get navigation params.
 * @param T name of the screen
 *
 * If you want to add new stack
 * 1. Add new type with all screens that containing this stack
 * 2. Add type to **NavigationRouteName** union
 * 3. Add type to the NavigationRouteParamList sum
 */
export type NavigationProps<T extends NavigationRouteName> = {
  route: RouteProp<NavigationRouteParamList, T>;
  navigation: StackNavigationProp<NavigationRouteParamList, T>;
};

export type ScreensNavigationParamsList = {
  AuthScreen: {
    action: string | undefined;
    code?: string;
    email?: string;
  };
  NewPassword: {
    code?: string;
    email?: string;
  };
  EditEmergencyContact: {
    contactId: string;
  };
  AccountSettings: {
    showSuccessMessage: boolean;
  };
  HealthConditionError: {
    regularCheck: boolean;
    healthCheck: boolean;
  };
};

export enum Screens {
  LostConnection = 'LostConnection',
  HealthConditionError = 'HealthConditionError',
  UserSelectAction = 'UserSelectAction',
  UserDateOfBirth = 'UserDateOfBirth',
  UserAddress = 'UserAddress',
  UserPhone = 'UserPhone',
  UserName = 'UserName',
  AccountSettings = 'AccountSettings',
  EditEmergencyContact = 'EditEmergencyContact',
  AutomatedEmergencySettings = 'Automated Emergency Settings',
  SignUpForCryopreservation = 'Sign up for cryopreservation',
  Home = 'Home',
  AddNewEmergencyContact = 'EmergencyContact',
  EmergencyContactExplanations = 'EmergencyContactExplanations',
  EmergencyContactSettings = 'EmergencyContactSettings',
  SpecificTimePaused = 'SpecificTimePaused',
  ProfileDefault = 'Profile&MedicalInformation',
  ProfileEdit = 'EditProfile',
  ProfileMedicalInfo = 'MedicalInformation',
  GDPR = 'GDPR',
  DeleteAccount = 'DeleteAccount',
  ForgotPassword = 'ForgotPassword',
  NewPassword = 'NewPassword',
  onboarding = 'onboarding',
  Auth = 'Auth',
}

export type Routes = keyof RootStackParamList;
