import React, {FC, useCallback, useMemo, useState} from 'react';
import {View, Text} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import OnboardingSlide from './components/OnboardingSlide';
import OnboardingSummarySlide from './components/OnboardingSummarySlide';

import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '~/models/Navigation.model';

const slideImage1 = require('~/assets/images/onboarding/OnboardingImage1.png');
const slideImage2 = require('~/assets/images/onboarding/OnboardingImage2.png');

const OnboardingScreen: FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();

  const isNotLastSlide = useMemo(
    () => activeSlideIndex < 2,
    [activeSlideIndex],
  );

  const handleLogin = useCallback(async () => {
    //@ts-ignore
    navigate(Screens.Auth, {action: 'SIGN_IN'});
  }, [navigate]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <Swiper
          loop={false}
          dotStyle={styles.paginationDot}
          activeDotStyle={styles.activePaginationDot}
          onIndexChanged={index => setActiveSlideIndex(index)}>
          <OnboardingSlide
            key={'slide-1'}
            image={slideImage1}
            label={t('onboarding.slide1.label')}
            text={t('onboarding.slide1.text')}
          />
          <OnboardingSlide
            key={'slide-2'}
            image={slideImage2}
            label={t('onboarding.slide2.label')}
            text={t('onboarding.slide2.text')}
          />
          <OnboardingSummarySlide key={'slide-summary'} />
        </Swiper>
        {isNotLastSlide && (
          <View style={styles.alreadyUserBox}>
            <Text fontSize={'md'}>{t('onboarding.alreadyUser')}</Text>
            <TouchableOpacity onPress={handleLogin} style={styles.logInBox}>
              <Text style={styles.logInText} underline>
                {t('LogIn.LogIn')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;
