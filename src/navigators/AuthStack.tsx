import React, {useState, useEffect} from 'react';
import {Center, Spinner} from 'native-base';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackNavigatorParamList} from '~/models/Navigation.model';
import AuthScreen from '~/screens/AuthScreen';
import OnboardingScreen from '~/screens/OnboardingScreen';
import {commonScreenOptions} from '~/theme/navigators';
import ForgotPasswordScreen from '~/screens/ForgotPasswordScreen';
import ForgotPasswordNewPasswordScreen from '~/screens/ForgotPasswordNewPasswordScreen';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';

const Stack = createStackNavigator<AuthStackNavigatorParamList>();

export const AuthStack = () => {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const setup = async () => {
    try {
      const savedValue = await AsyncStorageService.getItem(
        AsyncStorageEnum.HasSeenOnboarding,
      );
      if (savedValue === 'true') {
        setHasSeenOnboarding(true);
      }
    } catch (e) {
      console.warn('Error retrieving onboarding status', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /*
     * Postponing setup , waiting for Async storage cleanup while login out scenario
     */
    setTimeout(() => setup(), 0);
  }, []);

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner />
      </Center>
    );
  }

  return (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      {!hasSeenOnboarding && (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
      )}
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="ForgotPasswordNewPassword"
        component={ForgotPasswordNewPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
