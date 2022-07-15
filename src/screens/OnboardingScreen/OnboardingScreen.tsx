import React, {FC, useCallback, useState} from 'react';
import {View, Image} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import OnboardingSlide from './components/OnboardingSlide';
import OnboardingSummarySlide from './components/OnboardingSummarySlide';

import colors from '~/theme/colors';
import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

const backgroundShape = require('~/assets/images/onboarding/OnboardingBackgroundShape.png');
const slideImage1 = require('~/assets/images/onboarding/OnboardingImage1.png');
const slideImage2 = require('~/assets/images/onboarding/OnboardingImage2.png');

const OnboardingScreen: FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const {t} = useAppTranslation();

  const isLastSlide = useCallback(
    () => activeSlideIndex < 2,
    [activeSlideIndex],
  );

  return (
    <View style={styles.container}>
      <Image
        alt={' '}
        source={backgroundShape}
        style={styles.backgroundShapeImage}
        resizeMode={'stretch'}
      />
      <SafeAreaView style={styles.safeAreaContainer}>
        <Swiper
          showsButtons={false}
          loop={false}
          dotStyle={styles.paginationDot}
          activeDotStyle={styles.paginationDot}
          activeDotColor={colors.sea[400]}
          dotColor={colors.gray[350]}
          onIndexChanged={index => setActiveSlideIndex(index)}
          scrollEnabled={isLastSlide()}
          showsPagination={isLastSlide()}>
          <OnboardingSlide
            key={'slide-1'}
            image={slideImage1}
            label={t('onboarding.slide1.label')}
            text={t('onboarding.slide1.text')}
            imageStyle={styles.slide1Image}
          />
          <OnboardingSlide
            key={'slide-2'}
            image={slideImage2}
            label={t('onboarding.slide2.label')}
            text={t('onboarding.slide2.text')}
          />
          <OnboardingSummarySlide key={'slide-summary'} />
        </Swiper>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;
