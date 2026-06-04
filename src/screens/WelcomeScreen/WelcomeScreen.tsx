import React, {FC, useCallback} from 'react';
import {Linking, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import WelcomeHero from '~/assets/illustrations/onboarding/WelcomeHero';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Screens} from '~/models/Navigation.model';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';

import styles from './styles';

const TERMS_URL = 'https://tomorrowbiostasis.com/terms-conditions/';
const PRIVACY_URL = 'https://tomorrowbiostasis.com/privacy/';

const WelcomeScreen: FC = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();

  const persistAndNavigate = useCallback(
    async (action: 'SIGN_IN' | 'SIGN_UP') => {
      try {
        await AsyncStorageService.setItem(
          AsyncStorageEnum.HasSeenOnboarding,
          'true',
        );
      } catch (e) {
        console.warn('Error when saving onboarding state', e);
      }
      // @ts-ignore — Screens enum lookup
      navigate(Screens.Auth, {action});
    },
    [navigate],
  );

  const handleCreateAccount = useCallback(
    () => persistAndNavigate('SIGN_UP'),
    [persistAndNavigate],
  );
  const handleLogin = useCallback(
    () => persistAndNavigate('SIGN_IN'),
    [persistAndNavigate],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.hero}>
        <Text style={styles.eyebrow}>{t('welcome.eyebrow')}</Text>
        <View style={styles.illustrationHolder}>
          <WelcomeHero />
        </View>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.description}>{t('welcome.tagline')}</Text>
      </SafeAreaView>

      <View style={styles.actions}>
        <Button
          variant={'figmaFormPrimary' as never}
          onPress={handleCreateAccount}>
          {t('welcome.createAccount')}
        </Button>
        <Button
          variant={'figmaFormSecondary' as never}
          borderColor={'rgba(11, 31, 58, 0.18)'}
          onPress={handleLogin}>
          {t('welcome.logIn')}
        </Button>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.footerWrap}>
        <Text style={styles.footerText}>
          {t('welcome.termsPrefix')}
          {'\n'}
          <Text
            style={styles.footerLink}
            onPress={() => Linking.openURL(TERMS_URL)}>
            {t('welcome.terms')}
          </Text>
          {' '}{t('welcome.and')}{' '}
          <Text
            style={styles.footerLink}
            onPress={() => Linking.openURL(PRIVACY_URL)}>
            {t('welcome.privacy')}
          </Text>
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
