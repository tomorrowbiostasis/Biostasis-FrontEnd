import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import {MainStackNavigatorParamList, Screens} from '~/models/Navigation.model';
import {homeScreenOptions} from '~/theme/navigators';

import BottomTabs from './BottomTabs';

import EmergencyContactExplanationsScreen from '~/screens/EmergencyContactExplanationsScreen';
import AddNewEmergencyContactScreen from '~/screens/AddNewEmergencyContactScreen/AddNewEmergencyContactScreen';
import AutomatedEmergencySettingsScreen from '~/screens/AutomatedEmergencySettingsScreen';
import SpecificTimePaused from '~/screens/SpecificTimePausedScreen/SpecificTimePausedScreen';
import AccountSettingsScreen from '~/screens/AccountSettingsScreen';
import ProfileEditScreen from '~/screens/ProfileEditScreen';
import ProfileAddMedicalInfoScreen from '~/screens/MedicalInfoScreen';
import SignUpForCryopreservation from '~/screens/SignUpForCryopreservation';
import EmergencyContactsSettingsScreen from '~/screens/EmergencyContactsSettingsScreen';
import CurrentHealthLogScreen from '~/screens/CurrentHealthLogScreen';
import HistoryLogsScreen from '~/screens/HistoryLogsScreen';
import EmergencyConfirmationScreen from '~/screens/EmergencyConfirmationScreen';
import DevLogsScreen from '~/screens/DevLogs/DevLogsScreen';
import DevHistoryLogsScreen from '~/screens/DevHistoryLogs/DevHistoryLogsScreen';
import DevPushLogsScreen from '~/screens/DevPushLogs/DevPushLogsScreen';

const Stack = createStackNavigator<MainStackNavigatorParamList>();

const stackOptions = homeScreenOptions as StackNavigationOptions;

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name={Screens.Tabs} component={BottomTabs} />
      <Stack.Screen
        name={Screens.EmergencyConfirmation as never}
        component={EmergencyConfirmationScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          cardOverlayEnabled: false,
          ...TransitionPresets.ModalFadeTransition,
        }}
      />
      <Stack.Screen
        name={Screens.CurrentHealthLog as never}
        component={CurrentHealthLogScreen}
      />
      <Stack.Screen
        name={Screens.HistoryLogs as never}
        component={HistoryLogsScreen}
      />
      <Stack.Screen
        name={Screens.EmergencyContactSettings as never}
        component={EmergencyContactsSettingsScreen}
      />
      <Stack.Screen
        name={Screens.AddNewEmergencyContact as never}
        component={AddNewEmergencyContactScreen}
      />
      <Stack.Screen
        name={Screens.EmergencyContactExplanations as never}
        component={EmergencyContactExplanationsScreen}
      />
      <Stack.Screen
        name={Screens.AutomatedEmergencySettings as never}
        component={AutomatedEmergencySettingsScreen}
      />
      <Stack.Screen
        name={Screens.SpecificTimePaused as never}
        component={SpecificTimePaused}
      />
      <Stack.Screen
        name={Screens.AccountSettings as never}
        component={AccountSettingsScreen}
      />
      <Stack.Screen
        name={Screens.SignUpForCryopreservation as never}
        component={SignUpForCryopreservation}
      />
      <Stack.Screen
        name={Screens.ProfileEdit as never}
        component={ProfileEditScreen}
      />
      <Stack.Screen
        name={Screens.ProfileMedicalInfo as never}
        component={ProfileAddMedicalInfoScreen}
      />
      <Stack.Screen name={Screens.DevLogs as never} component={DevLogsScreen} />
      <Stack.Screen
        name={Screens.DevHistoryLogs as never}
        component={DevHistoryLogsScreen}
      />
      <Stack.Screen
        name={Screens.DevPushLogs as never}
        component={DevPushLogsScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
