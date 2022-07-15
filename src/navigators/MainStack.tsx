import React from 'react';

import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {View} from 'react-native';
import {MainStackNavigatorParamList} from '~/models/Navigation.model';
import {configInitData} from '~/redux/config/config.slice';
import {
  homeScreenOptions,
  logoutScreenOptions,
  welcomeScreenOptions,
} from '~/theme/navigators';

import Dashboard from '~/screens/Dashboard/Dashboard';
import EmergencyContactListScreen from '~/screens/EmergencyContactListScreen';
import EmergencyContactExplanationsScreen from '~/screens/EmergencyContactExplanationsScreen';
import AddNewEmergencyContactScreen from '~/screens/AddNewEmergencyContactScreen/AddNewEmergencyContactScreen';
import AutomatedEmergencySettingsScreen from '~/screens/AutomatedEmergencySettingsScreen';
import EmergencyContactsSettingsScreen from '~/screens/EmergencyContactsSettingsScreen';
import {useAppSelector} from '~/redux/store/hooks';
import UserNameScreen from '~/screens/UserNameScreen';
import PhoneNumberScreen from '~/screens/PhoneNumberScreen';
import DateOfBirthScreen from '~/screens/DateOfBirthScreen';
import AddressScreen from '~/screens/AddressScreen/AddressScreen';
import UserSelectActionScreen from '~/screens/UserSelectActionScreen';
import {userInitializedSelector} from '~/redux/user/selectors';
import SpecificTimePaused from '~/screens/SpecificTimePausedScreen/SpecificTimePausedScreen';
import DocumentsScreen from '~/screens/DocumentsScreen';
import ProfileDefaultScreen from '~/screens/ProfileDefaultScreen';
import AccountSettingsScreen from '~/screens/AccountSettingsScreen';
import ProfileEditScreen from '~/screens/ProfileEditScreen';
import ProfileAddMedicalInfoScreen from '~/screens/ProfileAddMedicalInfoScreen';
import GDPRScreen from '~/screens/GDPRScreen';
import DeleteAccountScreen from '~/screens/DeleteAccountScreen';

const Stack = createStackNavigator<MainStackNavigatorParamList>();

export const MainStack = () => {
  const isInitialized = useAppSelector(userInitializedSelector);
  const loading = useAppSelector(configInitData);

  return (
    <Stack.Navigator
      screenOptions={homeScreenOptions as StackNavigationOptions}>
      {!isInitialized ? (
        <>
          {loading && (
            /*
             *This one is used to get rid of showing unnecessary
             * Fill Profile screen while getting user
             */
            <Stack.Screen name={'Void'}>{() => <View />}</Stack.Screen>
          )}
          <Stack.Screen
            name="UserName"
            component={UserNameScreen}
            options={logoutScreenOptions}
          />
          <Stack.Screen
            name="UserPhone"
            component={PhoneNumberScreen}
            options={logoutScreenOptions}
          />
          <Stack.Screen
            name="UserDateOfBirth"
            component={DateOfBirthScreen}
            options={logoutScreenOptions}
          />
          <Stack.Screen
            name="UserAddress"
            component={AddressScreen}
            options={logoutScreenOptions}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={Dashboard}
            options={welcomeScreenOptions as StackNavigationOptions}
          />
          <Stack.Screen
            name="UserSelectAction"
            component={UserSelectActionScreen}
            options={logoutScreenOptions}
          />
          <Stack.Screen
            name="EmergencyContactList"
            component={EmergencyContactListScreen}
          />
          <Stack.Screen
            name="AddNewEmergencyContact"
            component={AddNewEmergencyContactScreen}
          />
          <Stack.Screen
            name="EmergencyContactExplanations"
            component={EmergencyContactExplanationsScreen}
          />
          <Stack.Screen
            name="EmergencyContactSettings"
            component={EmergencyContactsSettingsScreen}
          />
          <Stack.Screen
            name="AutomatedEmergencySettings"
            component={AutomatedEmergencySettingsScreen}
          />
          <Stack.Screen
            name="SpecificTimePaused"
            component={SpecificTimePaused}
          />
          <Stack.Screen name="Documents" component={DocumentsScreen} />
          <Stack.Screen
            name="ProfileDefault"
            component={ProfileDefaultScreen}
          />
          <Stack.Screen
            name="AccountSettings"
            component={AccountSettingsScreen}
          />
          <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          <Stack.Screen
            name="ProfileMedicalInfo"
            component={ProfileAddMedicalInfoScreen}
          />
          <Stack.Screen name="GDPR" component={GDPRScreen} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
