import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackNavigatorParamList, Screens} from '~/models/Navigation.model';
import AuthScreen from '~/screens/AuthScreen';
import OnboardingScreen from '~/screens/OnboardingScreen';
import WelcomeScreen from '~/screens/WelcomeScreen';
import {homeScreenOptions} from '~/theme/navigators';
import ForgotPasswordScreen from '~/screens/ForgotPasswordScreen';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import NewPasswordScreen from '~/screens/NewPasswordScreen';
import {useAppSelector} from '~/redux/store/hooks';
import {isAuthed, isAuthSessionResolved} from '~/redux/auth/selectors';
import {configSelector} from '~/redux/config/config.slice';
import AuthBootstrapLoading from '~/components/AuthBootstrapLoading';

const Stack = createStackNavigator<AuthStackNavigatorParamList>();

export const AuthStack = () => {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const authSessionResolved = useAppSelector(isAuthSessionResolved);
  const isLogged = useAppSelector(isAuthed);
  const {loadingInitData} = useAppSelector(configSelector);

  const showBootstrapLoading =
    loading ||
    !authSessionResolved ||
    (isLogged && loadingInitData);
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

  if (showBootstrapLoading) {
    return <AuthBootstrapLoading />;
  }

  return (
    <Stack.Navigator screenOptions={homeScreenOptions}>
      {!hasSeenOnboarding && (
        <>
          <Stack.Screen
            name={Screens.onboarding as never}
            component={OnboardingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={Screens.Welcome as never}
            component={WelcomeScreen}
            options={{headerShown: false}}
          />
        </>
      )}
      <Stack.Screen
        name={Screens.Auth as never}
        component={AuthScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.ForgotPassword as never}
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.NewPassword as never}
        component={NewPasswordScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
