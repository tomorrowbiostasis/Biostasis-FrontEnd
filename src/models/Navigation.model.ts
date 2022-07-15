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
  LostConnection: undefined;
  HealthConditionError: NavigatorScreenParams<{backendTriggered?: Boolean}>;
};

export type AuthStackNavigatorParamList = {
  Onboarding: undefined;
  Auth: undefined;
  AuthSample: undefined;
  ForgotPassword: undefined;
  ForgotPasswordNewPassword: undefined;
};

export type MainStackNavigatorParamList = {
  UserName: undefined;
  UserPhone: undefined;
  UserDateOfBirth: undefined;
  UserAddress: undefined;
  UserSelectAction: undefined;
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
  Void: undefined;
};

export type NavigationRouteName =
  | keyof AuthStackNavigatorParamList
  | keyof MainStackNavigatorParamList;

export type NavigationRouteParamList = AuthStackNavigatorParamList &
  MainStackNavigatorParamList;

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
  ForgotPasswordNewPassword: {
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
    regular: boolean;
    backendTriggered: boolean;
  };
};
//TODO fill this and exchange in navigation handlers
export enum Screens {
  LostConnection = 'LostConnection',
  HealthConditionError = 'HealthConditionError',
  AccountSettings = 'AccountSettings',
  EditEmergencyContact = 'EditEmergencyContact',
  AutomatedEmergencySettings = 'AutomatedEmergencySettings',
  Home = 'Home',
}

export type Routes = keyof RootStackParamList;
