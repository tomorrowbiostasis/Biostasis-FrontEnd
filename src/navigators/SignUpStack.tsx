import React from 'react';

import UserNameScreen from '~/screens/UserNameScreen';
import PhoneNumberScreen from '~/screens/PhoneNumberScreen';
import AddressScreen from '~/screens/AddressScreen/AddressScreen';
import SetupCompleteScreen from '~/screens/SetupCompleteScreen';
import {View} from 'react-native';
import {logoutScreenOptions} from '~/theme/navigators';
import {useAppSelector} from '~/redux/store/hooks';
import {
  Screens,
  SignUpStackNavigatorParamList,
} from '~/models/Navigation.model';
import {createStackNavigator} from '@react-navigation/stack';
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
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.UserPhone}
        component={PhoneNumberScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.UserAddress}
        component={AddressScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.SetupComplete}
        component={SetupCompleteScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default SignUpStack;
