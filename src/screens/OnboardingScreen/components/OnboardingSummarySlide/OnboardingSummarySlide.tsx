import React, {FC, useCallback} from 'react';
import {View} from 'react-native';
import {Button, Image, Heading, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import styles from './styles';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {Screens} from '~/models/Navigation.model';
import colors from '~/theme/colors';

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
      //@ts-ignore
      navigate(Screens.Auth, {action: 'SIGN_IN'});
    });
  }, [saveOnboardingState, navigate]);

  const handleSignup = useCallback(async () => {
    await saveOnboardingState(() => {
      //@ts-ignore
      navigate(Screens.Auth, {action: 'SIGN_UP'});
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
      <Heading size={'md'} style={styles.margin20}>
        {t('onboarding.title')}
      </Heading>
      <Text fontSize={'sm'} style={styles.margin20}>
        {t('onboarding.slogan')}
      </Text>
      <View style={styles.buttonsBox}>
        <Button
          variant={'ghost'}
          style={styles.buttonSignUp}
          onPress={handleSignup}>
          <Text color={colors.white} fontWeight={'bold'} fontSize={15}>
            {t('signUp.createAccount')}
          </Text>
        </Button>
        <Button
          variant={'ghost'}
          style={styles.buttonLogin}
          onPress={handleLogin}>
          <Text color={colors.white} fontWeight={'700'} fontSize={15}>
            {t('LogIn.LogIn')}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default OnboardingSummarySlide;
