import React, {useEffect, useRef, useState} from 'react';
import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from '~/redux/store/hooks';
import {
  NavigationRouteName,
  RootStackParamList,
  Routes,
} from '~/models/Navigation.model';
import Toast from 'react-native-toast-message';
import {toastConfig} from '~/theme/toast';
import {isAuthed, isAuthSessionResolved} from '~/redux/auth/selectors';
import {configSelector} from '~/redux/config/config.slice';
import CancelEmergencyPopup from '~/screens/CancelEmergencyPopup';
import LostConnectionScreen from '~/screens/LostConnectionScreen';
import HealthConditionErrorScreen from '~/screens/HealthConditionErrorScreen';
import NotificationListener from '~/providers/NotificationListener';
import LostConnection from './helper/LostConnection';
import {userInitializedSelector} from '~/redux/user/selectors';
import SignUpStack from './SignUpStack';
import {navigationRef} from './navigationContainerRef';
import {semanticColors} from '~/theme/tokens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export {navigationRef};

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: semanticColors.primary,
    card: semanticColors.primary,
  },
};

const linkingOptions: LinkingOptions<{}> = {
  prefixes: ['biostasis://', 'tomorrowbio://'],
  config: {
    screens: {
      AuthStack: {
        screens: {
          Auth: 'auth/:email/:code',
          NewPassword: 'forgot-password/:email/:code',
        },
      },
      HealthConditionError: 'are-you-ok',
    },
  },
};

//TODO fix typing
export function navigate(
  route: NavigationRouteName | keyof RootStackParamList,
  params?: any,
) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(route as keyof Routes, params);
  }
}

const Container = () => {
  const isLogged = useAppSelector(isAuthed);
  const authSessionResolved = useAppSelector(isAuthSessionResolved);
  const {loadingInitData} = useAppSelector(configSelector);
  const [isReady, setIsReady] = useState(false);
  const isInitialized = useAppSelector(userInitializedSelector);
  const splashHiddenRef = useRef(false);

  const showAuthenticatedShell =
    isReady && isLogged && !loadingInitData;

  useEffect(() => {
    if (splashHiddenRef.current || !isReady || !authSessionResolved) {
      return;
    }
    const loggedInReady = isLogged && !loadingInitData;
    const loggedOutReady = !isLogged;
    if (loggedInReady || loggedOutReady) {
      SplashScreen.hide();
      splashHiddenRef.current = true;
    }
  }, [isReady, authSessionResolved, isLogged, loadingInitData]);

  return (
    <NavigationContainer
      ref={navigationRef as never}
      linking={linkingOptions}
      theme={navigationTheme}
      onReady={() => setIsReady(true)}>
      {isReady && (
        <>
          <NotificationListener />
          {showAuthenticatedShell && <CancelEmergencyPopup />}
        </>
      )}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true,
          contentStyle: {
            backgroundColor: semanticColors.primary,
          },
        }}>
        <Stack.Screen name="LostConnection" component={LostConnectionScreen} />
        {showAuthenticatedShell ? (
          isInitialized ? (
            <>
              <Stack.Screen name="MainStack" component={MainStack} />
              <Stack.Screen
                options={{gestureEnabled: false}}
                name="HealthConditionError"
                component={HealthConditionErrorScreen}
              />
            </>
          ) : (
            <Stack.Screen name="SignUpStack" component={SignUpStack} />
          )
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
      <LostConnection />
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

export default Container;
