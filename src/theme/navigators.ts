import {StackNavigationOptions} from '@react-navigation/stack';
import LogoutTrigger from '~/components/LogoutTrigger';
import colors from './colors';

export const headerStyle: StackNavigationOptions = {
  headerShown: true,
  headerTitle: '',
  headerStyle: {
    backgroundColor: colors.gray[50],
    elevation: 0,
    shadowOpacity: 0,
    height: 100,
  },
};

export const homeScreenOptions: StackNavigationOptions = {
  headerShown: false,
};

export const logoutScreenOptions: StackNavigationOptions = {
  headerLeft: LogoutTrigger,
  ...headerStyle,
  headerLeftContainerStyle: {
    position: 'absolute',
    padding: 20,
  },
};
