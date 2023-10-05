import React, {useState, useEffect} from 'react';
import {Center, Spinner} from 'native-base';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import {AuthStackNavigatorParamList, Screens} from '~/models/Navigation.model';
import AuthScreen from '~/screens/AuthScreen';
import OnboardingScreen from '~/screens/OnboardingScreen';
import {homeScreenOptions, headerStyle} from '~/theme/navigators';
import ForgotPasswordScreen from '~/screens/ForgotPasswordScreen';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import NewPasswordScreen from '~/screens/NewPasswordScreen';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

const Stack = createStackNavigator<AuthStackNavigatorParamList>();

export const AuthStack = () => {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const {t} = useAppTranslation();
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
    const abortController = new AbortController();
    /*
     * Postponing setup , waiting for Async storage cleanup while login out scenario
     */
    setup();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner />
      </Center>
    );
  }

  return (
    <Stack.Navigator screenOptions={homeScreenOptions}>
      {!hasSeenOnboarding && (
        <Stack.Screen
          name={Screens.onboarding as never}
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
      )}
      <Stack.Screen
        name={Screens.Auth as never}
        component={AuthScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.ForgotPassword as never}
        component={ForgotPasswordScreen}
        options={
          {
            ...headerStyle,
            headerTitle: t('forgotPassword.screenName'),
          } as StackNavigationOptions
        }
      />
      <Stack.Screen
        name={Screens.NewPassword as never}
        component={NewPasswordScreen}
        options={
          {
            ...headerStyle,
            headerTitle: t('forgotPassword.newPassword'),
          } as StackNavigationOptions
        }
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
