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
  BioSettingsFillBook,
  BioSettingsFillBroadcastSignal,
  BioSettingsFillShieldCheck,
  BioSettingsFillUserAdd,
  BioSettingsFillUserVerified,
} from '~/assets/icons/BiostasisIcons';
import SettingsRow from './components/SettingsRow';
import styles from './styles';

/* Blends the embedded Tomorrow Bio page background into the redesigned screen. */
const TOMORROW_BIO_INJECTED_JS = `(function() {
  var style = document.createElement('style');
  style.innerHTML = '.light-gray{background-color:#F5F6F8 !important;}.html-embed-23{background-color:#F5F6F8 !important;}';
  document.head.appendChild(style);
})();
true;`;

const SettingsScreen = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const insets = useSafeAreaInsets();

  const go = useCallback(
    (screen: Screens) => () => navigate(screen as never),
    [navigate],
  );

  const openWebView = useCallback(
    (url: string, title: string, injectedJavaScript?: string) => () =>
      navigate(
        Screens.WebView as never,
        {url, title, injectedJavaScript} as never,
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
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {t('settings.sections.emergency')}
          </Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<BioSettingsFillUserAdd />}
              label={t('settings.emergencyContact')}
              onPress={go(Screens.EmergencyContactSettings)}
            />
            <SettingsRow
              icon={<BioSettingsFillBroadcastSignal />}
              label={t('settings.emergencySystem')}
              onPress={go(Screens.AutomatedEmergencySettings)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {t('settings.sections.signUp')}
          </Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<BioSettingsFillUserVerified />}
              label={t('settings.tomorrowBio')}
              onPress={openWebView(
                t('signUpForTomorrow.signUpUrl'),
                t('settings.tomorrowBio'),
                TOMORROW_BIO_INJECTED_JS,
              )}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {t('settings.sections.legal')}
          </Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<BioSettingsFillBook />}
              label={t('settings.termsOfService')}
              onPress={openWebView(
                t('settings.termsUrl'),
                t('settings.termsOfService'),
              )}
            />
            <SettingsRow
              icon={<BioSettingsFillShieldCheck />}
              label={t('settings.privacyStatements')}
              onPress={openWebView(
                t('settings.privacyUrl'),
                t('settings.privacyStatements'),
              )}
            />
          </View>
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
