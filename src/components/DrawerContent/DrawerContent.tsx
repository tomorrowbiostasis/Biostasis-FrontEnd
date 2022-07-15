import {DrawerNavigationHelpers} from '@react-navigation/drawer/src/types';
import React, {FC} from 'react';
import {TouchableOpacity, Linking} from 'react-native';
import {Text, Box} from 'native-base';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import EnvConfig from '~/services/Env.service';
import i18n from '~/i18n/i18n';
import {Screens} from '~/models/Navigation.model';
import styles from './styles';
import Icon from 'react-native-vector-icons/Feather';
import colors from '~/theme/colors';
import {shareLog} from '~/services/Logger.service';

const DrawerContent: FC<
  DrawerContentComponentProps & {
    navigation: DrawerNavigationHelpers & {navigate: (route: Screens) => void};
  }
> = ({navigation, ...rest}) => {
  const navigateToSignUp = () => {
    Linking.openURL(i18n.t('drawer.signUpUrl'));
  };

  const navigateToPrivacyStatements = () => {
    Linking.openURL(i18n.t('drawer.privacyUrl'));
  };

  const navigateToTermsOfService = () => {
    Linking.openURL(i18n.t('drawer.termsUrl'));
  };

  return (
    <DrawerContentScrollView {...rest}>
      <Box p={6}>
        <TouchableOpacity onPress={() => navigation.navigate(Screens.Home)}>
          <Text fontSize={18} mx={5} my={4}>
            {i18n.t('drawer.dashboard')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.AccountSettings)}>
          <Text fontSize={18} mx={5} my={4}>
            {i18n.t('drawer.accountSettings')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Screens.AutomatedEmergencySettings)
          }>
          <Text fontSize={18} mx={5} my={4}>
            {i18n.t('drawer.automatedEmergency')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.textWithIcon}
          onPress={navigateToSignUp}>
          <Text fontSize={18} mx={5} my={4}>
            {i18n.t('drawer.signUpForCryopreservation')}
          </Text>
          <Icon name="link" color={colors.black} size={20} />
        </TouchableOpacity>
        <Box my={4} style={styles.spacer} />
        <TouchableOpacity
          style={styles.textWithIcon}
          onPress={navigateToTermsOfService}>
          <Text fontSize={18} mx={5} my={4}>
            {i18n.t('drawer.termsLabel')}
          </Text>
          <Icon name="link" color={colors.black} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.textWithIcon}
          onPress={navigateToPrivacyStatements}>
          <Text fontSize={18} mx={5} my={4}>
            {i18n.t('drawer.privacyLabel')}
          </Text>
          <Icon name="link" color={colors.black} size={20} />
        </TouchableOpacity>
        <Box my={4} style={styles.spacer} />
        {EnvConfig.DEV && (
          <TouchableOpacity style={styles.textWithIcon} onPress={shareLog}>
            <Text fontSize={18} mx={5} my={4}>
              {i18n.t('drawer.debugInfo')}
            </Text>
          </TouchableOpacity>
        )}
      </Box>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
