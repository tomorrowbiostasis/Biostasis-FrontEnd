import React, {FC, useCallback} from 'react';
import {View} from 'react-native';
import {Button, Image, Heading, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import styles from './styles';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';

const slideImage = require('~/assets/images/onboarding/OnboardingImage3.png');

const OnboardingSummarySlide: FC = () => {
  const {navigate} = useNavigation();
  const {t} = useAppTranslation();

  const saveOnboardingState = useCallback(async onFinish => {
    try {
      await AsyncStorageService.setItem(
        AsyncStorageEnum.HasSeenOnboarding,
        'true',
      );
      onFinish();
    } catch (e) {
      console.warn('Error when saving onboarding state', e);
      onFinish();
    }
  }, []);

  const handleLogin = useCallback(async () => {
    await saveOnboardingState(() => {
      navigate('Auth', {action: 'SIGN_IN'});
    });
  }, [saveOnboardingState, navigate]);

  const handleSignup = useCallback(async () => {
    await saveOnboardingState(() => {
      navigate('Auth', {action: 'SIGN_UP'});
    });
  }, [saveOnboardingState, navigate]);

  return (
    <View style={styles.container}>
      <View style={styles.slideImageContainer}>
        <Image
          alt={'onboaring'}
          source={slideImage}
          style={styles.slideImage}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.bottomContentContainer}>
        <View style={styles.centerContentContainer}>
          <Heading size="xl" style={styles.header}>
            {t('onboarding.title')}
          </Heading>
          <Text fontSize={'lg'} style={styles.description}>
            {t('onboarding.slogan')}
          </Text>
        </View>
        <Button style={styles.button} onPress={handleSignup}>
          {t('signUp.signUp')}
        </Button>
        <Button variant="outline" style={styles.button} onPress={handleLogin}>
          {t('signIn.signIn')}
        </Button>
      </View>
    </View>
  );
};

export default OnboardingSummarySlide;
