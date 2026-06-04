import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

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
  Welcome: undefined;
  Auth:
    | {
        action?: string;
        code?: string;
        email?: string;
      }
    | undefined;
  AuthSample: undefined;
  ForgotPassword: {email?: string} | undefined;
  NewPassword:
    | {
        code?: string;
        email?: string;
      }
    | undefined;
};

export type SignUpStackNavigatorParamList = {
  UserName: undefined;
  UserPhone: undefined;
  UserAddress: undefined;
  SetupComplete: undefined;
  Void: undefined;
};

export type MainStackNavigatorParamList = {
  Tabs: undefined;
  Home:
    | {
        emergencySetupPromptId?: number;
        emergencySetupPromptReason?: 'contacts' | 'monitoring';
      }
    | undefined;
  EmergencyConfirmation: undefined;
  CurrentHealthLog: undefined;
  HistoryLogs: undefined;
  EmergencyContactList: undefined;
  AddNewEmergencyContact: undefined;
  AutomatedEmergencySettings: undefined;
  EmergencyContactSettings: undefined;
  SelectSmartDevice: undefined;
  SpecificTimePaused: undefined;
  AddTimeBlock: undefined;
  Documents: undefined;
  ProfileDefault: undefined;
  AccountSettings: undefined;
  ProfileEdit: undefined;
  ProfileMedicalInfo: undefined;
  GDPR: undefined;
  DeleteAccount: undefined;
  SignUpForCryopreservation: undefined;
  Settings: undefined;
  WebView: undefined;
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
  navigation: NativeStackNavigationProp<NavigationRouteParamList, T>;
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
  WebView: {
    url: string;
    title: string;
    injectedJavaScript?: string;
  };
  AddTimeBlock: {
    id?: number;
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
  UserAddress = 'UserAddress',
  UserPhone = 'UserPhone',
  UserName = 'UserName',
  SetupComplete = 'SetupComplete',
  AccountSettings = 'AccountSettings',
  Settings = 'Settings',
  WebView = 'WebView',
  EditEmergencyContact = 'EditEmergencyContact',
  AutomatedEmergencySettings = 'Automated Emergency Settings',
  SignUpForCryopreservation = 'Sign up for cryopreservation',
  Home = 'Home',
  Tabs = 'Tabs',
  EmergencyConfirmation = 'EmergencyConfirmation',
  CurrentHealthLog = 'CurrentHealthLog',
  HistoryLogs = 'HistoryLogs',
  AddNewEmergencyContact = 'EmergencyContact',
  EmergencyContactSettings = 'EmergencyContactSettings',
  SpecificTimePaused = 'SpecificTimePaused',
  AddTimeBlock = 'AddTimeBlock',
  ProfileDefault = 'Profile&MedicalInformation',
  ProfileEdit = 'EditProfile',
  ProfileMedicalInfo = 'MedicalInformation',
  GDPR = 'GDPR',
  DeleteAccount = 'DeleteAccount',
  ForgotPassword = 'ForgotPassword',
  NewPassword = 'NewPassword',
  onboarding = 'onboarding',
  Welcome = 'Welcome',
  Auth = 'Auth',
  DevLogs = 'DevLogs',
  DevHistoryLogs = 'DevHistoryLogs',
  DevPushLogs = 'DevPushLogs',
}

export type Routes = keyof RootStackParamList;
