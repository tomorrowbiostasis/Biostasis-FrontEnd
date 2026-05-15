import React, {useCallback} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Screens} from '~/models/Navigation.model';
import {clearDataAndSignOut} from '~/redux/store/utils';
import {ClearDataTypes} from '~/services/ClearData.types';
import ScreenHeader from '~/components/ScreenHeader';
import {
  UserPlusIcon,
  EmergencySystemIcon,
  UserCheckIcon,
  ScrollTextIcon,
  ShieldTickIcon,
} from '~/assets/icons/AppIcons';
import SettingsRow from './components/SettingsRow';
import styles from './styles';

const ICON_SIZE = 18;

const SettingsScreen = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const insets = useSafeAreaInsets();

  const go = useCallback(
    (screen: Screens) => () => navigate(screen as never),
    [navigate],
  );

  const openWebView = useCallback(
    (url: string, title: string) => () =>
      navigate(
        Screens.WebView as never,
        {url, title} as never,
      ),
    [navigate],
  );

  const handleLogout = useCallback(
    () => clearDataAndSignOut(ClearDataTypes.LOGOUT),
    [],
  );

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('settings.title')} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.group}>
          <SettingsRow
            icon={<UserPlusIcon size={ICON_SIZE} color="#7A4CC2" />}
            iconBackground="rgba(228, 219, 247, 0.6)"
            label={t('settings.emergencyContact')}
            onPress={go(Screens.EmergencyContactSettings)}
          />
          <SettingsRow
            icon={<EmergencySystemIcon size={ICON_SIZE} color="#2F9E7A" />}
            iconBackground="rgba(207, 233, 223, 0.5)"
            label={t('settings.emergencySystem')}
            onPress={go(Screens.AutomatedEmergencySettings)}
          />
          <SettingsRow
            icon={<UserCheckIcon size={ICON_SIZE} color="#3B5BDB" />}
            iconBackground="#F5F7FD"
            label={t('settings.tomorrowBio')}
            onPress={go(Screens.SignUpForCryopreservation)}
          />
        </View>

        <View style={styles.group}>
          <SettingsRow
            icon={<ScrollTextIcon size={ICON_SIZE} color="#2B6E99" />}
            iconBackground="rgba(214, 230, 242, 0.6)"
            label={t('settings.termsOfService')}
            onPress={openWebView(
              t('settings.termsUrl'),
              t('settings.termsOfService'),
            )}
          />
          <SettingsRow
            icon={<ShieldTickIcon size={ICON_SIZE} color="#7B4BB7" />}
            iconBackground="rgba(228, 219, 247, 0.5)"
            label={t('settings.privacyStatements')}
            onPress={openWebView(
              t('settings.privacyUrl'),
              t('settings.privacyStatements'),
            )}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 16}]}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel={t('settings.logOut')}>
          <Text style={styles.logoutText}>{t('settings.logOut')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
