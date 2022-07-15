import {StackNavigationOptions} from '@react-navigation/stack';
import colors from '~/theme/colors';
import DrawerTrigger from '~/components/DrawerTrigger';
import BackButtonIcon from '~/components/assets/Icons/BackButtonIcon';
import LogoutTrigger from '~/components/LogoutTrigger';

export const commonScreenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: colors.gray['200'],
    elevation: 0,
    shadowOpacity: 0,
    height: 110,
  },
  headerLeftContainerStyle: {
    paddingLeft: 20,
  },
  headerTitle: '',
  headerBackTitleVisible: true,
  headerBackImage: BackButtonIcon,
  headerBackTitle: 'Back', // TODO: take value from i18next
  headerBackTitleStyle: {marginLeft: 22},
  headerTintColor: colors.gray['800'],
};

export const homeScreenOptions = {
  ...commonScreenOptions,
  headerRightContainerStyle: {
    paddingRight: 20,
  },
  headerRight: DrawerTrigger,
};

export const welcomeScreenOptions = {
  headerTitle: 'Welcome', // TODO: take default value from i18next
  headerTitleAlign: 'left',
  headerTitleStyle: {fontWeight: '400', fontSize: 18, fontFamily: 'Roboto'},
};

export const noHamburgerScreenOptions = {
  headerRight: null,
};

export const logoutScreenOptions: StackNavigationOptions = {
  headerRight: LogoutTrigger,
};
