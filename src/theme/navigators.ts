import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import LogoutTrigger from '~/components/LogoutTrigger';
import colors from './colors';
import {semanticColors} from './tokens';

export const headerStyle: NativeStackNavigationOptions = {
  headerShown: true,
  headerTitle: '',
  headerStyle: {
    backgroundColor: colors.gray[50],
  },
  headerShadowVisible: false,
};

export const homeScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  freezeOnBlur: true,
  contentStyle: {
    backgroundColor: semanticColors.primary,
  },
};

export const logoutScreenOptions: NativeStackNavigationOptions = {
  headerLeft: LogoutTrigger,
  ...headerStyle,
};
