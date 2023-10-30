import React, {FC, useCallback, useState} from 'react';
import {TouchableOpacity, Linking} from 'react-native';
import {Text, Box, Divider, ScrollView} from 'native-base';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import EnvConfig from '~/services/Env.service';
import {Screens} from '~/models/Navigation.model';
import styles from './styles';
import Icon from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '~/theme/colors';
import {shareLog} from '~/services/Logger.service';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {navigationRef} from '~/navigators';
import {useFocusEffect} from '@react-navigation/native';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import LogoutTrigger from '../LogoutTrigger/LogoutTrigger';

const DrawerContent: FC<
  DrawerContentComponentProps & {
    navigation: DrawerNavigationHelpers & {navigate: (route: Screens) => void};
  }
> = ({navigation, ...rest}) => {
  const {t} = useAppTranslation();

  const [activeItem, setActiveItem] = useState<Screens>(Screens.Home);

  const drawerScreens = [
    Screens.Home,
    Screens.ProfileDefault,
    Screens.AccountSettings,
    Screens.AutomatedEmergencySettings,
    Screens.EmergencyContactSettings,
    Screens.SignUpForCryopreservation,
    Screens.SpecificTimePaused,
  ];

  useFocusEffect(() => {
    const currentScreenName = navigationRef.getCurrentRoute()?.name as Screens;
    if (drawerScreens.includes(currentScreenName)) {
      setActiveItem(currentScreenName);
    }
  });

  const navigateToPrivacyStatements = () => {
    Linking.openURL(t('drawer.privacyUrl'));
  };

  const navigateToTermsOfService = () => {
    Linking.openURL(t('drawer.termsUrl'));
  };

  const openWebsite = () => {
    Linking.openURL(t('socialMediaUrls.website'));
  };

  const openTwitter = () => {
    Linking.openURL(t('socialMediaUrls.twitter'));
  };

  const openYouTube = () => {
    Linking.openURL(t('socialMediaUrls.youtube'));
  };

  const openInstagram = () => {
    Linking.openURL(t('socialMediaUrls.instagram'));
  };

  const handleMenuItemPress = useCallback(
    (screen: Screens) => {
      navigation.navigate(screen);
    },
    [navigation],
  );

  return (
    <ScrollView style={styles.container}>
      <DrawerContentScrollView
        {...rest}
        contentContainerStyle={styles.drawerContent}>
        <Box p={4}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItem === Screens.Home && styles.activeMenuItem,
            ]}
            onPress={() => handleMenuItemPress(Screens.Home)}>
            <Icon name="home" size={20} color={colors.white} />
            <Text style={styles.menuText}>{t('drawer.dashboard')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItem === Screens.ProfileDefault && styles.activeMenuItem,
            ]}
            onPress={() => handleMenuItemPress(Screens.ProfileDefault)}>
            <Icon name="user" size={20} color={colors.white} />
            <Text style={styles.menuText}>{t('drawer.profile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItem === Screens.AccountSettings && styles.activeMenuItem,
            ]}
            onPress={() => handleMenuItemPress(Screens.AccountSettings)}>
            <Icon name="settings" size={20} color={colors.white} />
            <Text style={styles.menuText}>{t('drawer.accountSettings')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItem === Screens.EmergencyContactSettings &&
                styles.activeMenuItem,
            ]}
            onPress={() =>
              handleMenuItemPress(Screens.EmergencyContactSettings)
            }>
            <IconMaterialIcons name="contacts" size={20} color={colors.white} />
            <Text style={styles.menuText}>
              {t('drawer.emergencyContactSettings')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItem === Screens.AutomatedEmergencySettings &&
                styles.activeMenuItem,
            ]}
            onPress={() =>
              handleMenuItemPress(Screens.AutomatedEmergencySettings)
            }>
            <Icon name="alert-circle" size={20} color={colors.white} />
            <Text style={styles.menuText}>
              {t('drawer.automatedEmergency')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItem === Screens.SpecificTimePaused &&
                styles.activeMenuItem,
            ]}
            onPress={() => handleMenuItemPress(Screens.SpecificTimePaused)}>
            <Icon name="pause-circle" size={20} color={colors.white} />
            <Text style={styles.menuText}>{t('drawer.pauseTimes')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeItem === Screens.SignUpForCryopreservation &&
                styles.activeMenuItem,
            ]}
            onPress={() =>
              handleMenuItemPress(Screens.SignUpForCryopreservation)
            }>
            <Icon name="user-plus" size={20} color={colors.white} />
            <Text style={styles.menuText}>
              {t('drawer.signUpForCryopreservation')}
            </Text>
          </TouchableOpacity>
          <Divider my={3} style={styles.spacer} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToTermsOfService}>
            <Icon name="link" size={20} color={colors.white} />
            <Text style={styles.menuText}>{t('drawer.termsLabel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToPrivacyStatements}>
            <Icon name="link" size={20} color={colors.white} />
            <Text style={styles.menuText}>{t('drawer.privacyLabel')}</Text>
          </TouchableOpacity>
          <Divider my={3} style={styles.spacer} />

          <Box style={styles.socialMedia}>
            <TouchableOpacity onPress={openWebsite}>
              <Icon name="globe" size={25} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTwitter}>
              <Icon name="twitter" size={25} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openYouTube}>
              <Icon name="youtube" size={25} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openInstagram}>
              <Icon name="instagram" size={25} color={colors.white} />
            </TouchableOpacity>
          </Box>
          <Divider my={3} style={styles.spacer} />
          <Box style={styles.menuItem}>
            <LogoutTrigger />
          </Box>
          {EnvConfig.DEV && (
            <TouchableOpacity style={styles.menuItem} onPress={shareLog}>
              <Icon name="info" size={20} color={colors.white} />
              <Text style={styles.menuText}>{t('drawer.debugInfo')}</Text>
            </TouchableOpacity>
          )}
        </Box>
      </DrawerContentScrollView>
    </ScrollView>
  );
};

export default DrawerContent;
