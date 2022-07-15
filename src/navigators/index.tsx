import React, {useState} from 'react';
import {
  createNavigationContainerRef,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import AuthStack from './AuthStack';
import Drawer from './Drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {useAppSelector} from '~/redux/store/hooks';
import {
  NavigationRouteName,
  RootStackParamList,
  Routes,
} from '~/models/Navigation.model';
import Toast from 'react-native-toast-message';
import {toastConfig} from '~/theme/toast';
import {isAuthed} from '~/redux/auth/selectors';
import {configSelector} from '~/redux/config/config.slice';
import Loader from '~/components/Loader';
import CancelEmergencyPopup from '~/screens/CancelEmergencyPopup';
import LostConnectionScreen from '~/screens/LostConnectionScreen';
import HealthConditionErrorScreen from '~/screens/HealthConditionErrorScreen';
import NotificationListener from '~/providers/NotificationListener';

const Stack = createStackNavigator<RootStackParamList>();

const linkingOptions: LinkingOptions<{}> = {
  prefixes: ['biostasis://'],
  config: {
    screens: {
      AuthStack: {
        screens: {
          Auth: 'auth/:email/:code',
          ForgotPasswordNewPassword: 'forgot-password/:email/:code',
        },
      },
      HealthConditionError: 'are-you-ok',
    },
  },
};

export const navigationRef = createNavigationContainerRef<Routes>();
//TODO fix typing
export function navigate(
  route: NavigationRouteName | keyof RootStackParamList,
  params?: any,
) {
  console.log('navigating from handler');
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(route as keyof Routes, params);
  }
}

const Container = () => {
  const isLogged = useAppSelector(isAuthed);
  const {loadingInitData} = useAppSelector(configSelector);
  const [isReady, setIsReady] = useState(false);

  return (
    <NavigationContainer
      ref={navigationRef as never}
      linking={linkingOptions}
      onReady={() => setIsReady(true)}>
      {isReady && (
        <>
          <NotificationListener />
          {isLogged && <CancelEmergencyPopup />}
        </>
      )}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isReady && isLogged ? (
          <>
            <Stack.Screen name="MainStack" component={Drawer} />
            <Stack.Screen
              options={{gestureEnabled: false}}
              name="HealthConditionError"
              component={HealthConditionErrorScreen}
            />
          </>
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
        <Stack.Screen name="LostConnection" component={LostConnectionScreen} />
      </Stack.Navigator>
      <Toast ref={ref => Toast.setRef(ref)} config={toastConfig} />
      {loadingInitData && <Loader absolute />}
    </NavigationContainer>
  );
};

export default Container;
