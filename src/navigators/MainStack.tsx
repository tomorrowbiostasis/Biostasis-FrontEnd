import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {MainStackNavigatorParamList, Screens} from '~/models/Navigation.model';
import {homeScreenOptions} from '~/theme/navigators';

import Dashboard from '~/screens/Dashboard/Dashboard';

import EmergencyContactExplanationsScreen from '~/screens/EmergencyContactExplanationsScreen';
import AddNewEmergencyContactScreen from '~/screens/AddNewEmergencyContactScreen/AddNewEmergencyContactScreen';
import AutomatedEmergencySettingsScreen from '~/screens/AutomatedEmergencySettingsScreen';
import SpecificTimePaused from '~/screens/SpecificTimePausedScreen/SpecificTimePausedScreen';
import ProfileDefaultScreen from '~/screens/ProfileDefaultScreen';
import AccountSettingsScreen from '~/screens/AccountSettingsScreen';
import ProfileEditScreen from '~/screens/ProfileEditScreen';
import ProfileAddMedicalInfoScreen from '~/screens/MedicalInfoScreen';
import SignUpForCryopreservation from '~/screens/SignUpForCryopreservation';
import EmergencyContactsSettingsScreen from '~/screens/EmergencyContactsSettingsScreen';

const Stack = createStackNavigator<MainStackNavigatorParamList>();

export const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Screens.Home}
        component={Dashboard}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.EmergencyContactSettings as never}
        component={EmergencyContactsSettingsScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.AddNewEmergencyContact as never}
        component={AddNewEmergencyContactScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.EmergencyContactExplanations as never}
        component={EmergencyContactExplanationsScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.AutomatedEmergencySettings as never}
        component={AutomatedEmergencySettingsScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.SpecificTimePaused as never}
        component={SpecificTimePaused}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.ProfileDefault as never}
        component={ProfileDefaultScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.AccountSettings as never}
        component={AccountSettingsScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.SignUpForCryopreservation as never}
        component={SignUpForCryopreservation}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.ProfileEdit as never}
        component={ProfileEditScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.ProfileMedicalInfo as never}
        component={ProfileAddMedicalInfoScreen}
        options={homeScreenOptions as StackNavigationOptions}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
