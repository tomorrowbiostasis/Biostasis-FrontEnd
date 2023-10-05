import React from 'react';

import UserNameScreen from '~/screens/UserNameScreen';
import PhoneNumberScreen from '~/screens/PhoneNumberScreen';
import DateOfBirthScreen from '~/screens/DateOfBirthScreen';
import AddressScreen from '~/screens/AddressScreen/AddressScreen';
import {View} from 'react-native';
import {logoutScreenOptions} from '~/theme/navigators';
import {useAppSelector} from '~/redux/store/hooks';
import {
  Screens,
  SignUpStackNavigatorParamList,
} from '~/models/Navigation.model';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import colors from '~/theme/colors';
import {configInitData} from '~/redux/config/config.slice';

const Stack = createStackNavigator<SignUpStackNavigatorParamList>();

export const SignUpStack = () => {
  const loading = useAppSelector(configInitData);

  return (
    <Stack.Navigator>
      {loading && (
        /*
         *This one is used to get rid of showing unnecessary
         * Fill Profile screen while getting user
         */
        <Stack.Screen name={'Void'} options={logoutScreenOptions}>
          {() => (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{flex: 1, backgroundColor: colors.gray[50]}} />
          )}
        </Stack.Screen>
      )}
      <Stack.Screen
        name={Screens.UserName}
        component={UserNameScreen}
        options={logoutScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.UserPhone}
        component={PhoneNumberScreen}
        options={logoutScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.UserDateOfBirth}
        component={DateOfBirthScreen}
        options={logoutScreenOptions as StackNavigationOptions}
      />
      <Stack.Screen
        name={Screens.UserAddress}
        component={AddressScreen}
        options={logoutScreenOptions as StackNavigationOptions}
      />
    </Stack.Navigator>
  );
};

export default SignUpStack;
