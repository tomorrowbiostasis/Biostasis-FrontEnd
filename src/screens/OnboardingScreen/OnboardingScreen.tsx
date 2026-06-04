import React, {FC, useCallback, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import {Button} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import Badge, {BadgeVariant} from '~/components/Badge';
import StepIndicator from '~/components/StepIndicator';
import OnboardingShield from '~/assets/illustrations/onboarding/OnboardingShield';
import OnboardingBell from '~/assets/illustrations/onboarding/OnboardingBell';
import OnboardingMedical from '~/assets/illustrations/onboarding/OnboardingMedical';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Screens} from '~/models/Navigation.model';

import styles from './styles';

type SlideContent = {
  badgeKey: string;
  titleKey: string;
  bodyKey: string;
  variant: BadgeVariant;
  illustration: React.ReactNode;
};

const SLIDES: SlideContent[] = [
  {
    badgeKey: 'onboarding.slide1.badge',
    titleKey: 'onboarding.slide1.title',
    bodyKey: 'onboarding.slide1.body',
    variant: 'info',
    illustration: <OnboardingShield width={240} height={218} />,
  },
  {
    badgeKey: 'onboarding.slide2.badge',
    titleKey: 'onboarding.slide2.title',
    bodyKey: 'onboarding.slide2.body',
    variant: 'danger',
    illustration: <OnboardingBell width={240} height={218} />,
  },
  {
    badgeKey: 'onboarding.slide3.badge',
    titleKey: 'onboarding.slide3.title',
    bodyKey: 'onboarding.slide3.body',
    variant: 'success',
    illustration: <OnboardingMedical width={240} height={218} />,
  },
];

const OnboardingScreen: FC = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const goToWelcome = useCallback(() => {
    // @ts-ignore — Screens enum lookup
    navigate(Screens.Welcome);
  }, [navigate]);

  const handleCTA = useCallback(() => {
    if (isLastSlide) {
      goToWelcome();
    } else {
      swiperRef.current?.scrollBy(1, true);
    }
  }, [isLastSlide, goToWelcome]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <StepIndicator total={SLIDES.length} currentIndex={activeIndex} />
        </View>

        <Swiper
          ref={swiperRef}
          loop={false}
          showsPagination={false}
          removeClippedSubviews={false}
          loadMinimal={false}
          onIndexChanged={setActiveIndex}>
          {SLIDES.map(slide => (
            <View style={styles.slide} key={slide.badgeKey}>
              <View style={styles.illustrationWrap}>{slide.illustration}</View>
              <Badge
                label={t(slide.badgeKey)}
                variant={slide.variant}
                style={styles.badgeSpacing}
              />
              <Text style={styles.title}>{t(slide.titleKey)}</Text>
              <Text style={styles.body}>{t(slide.bodyKey)}</Text>
            </View>
          ))}
        </Swiper>

        <View style={styles.footer}>
          <Button
            variant={'figmaFormPrimary' as never}
            onPress={handleCTA}>
            {isLastSlide
              ? t('onboarding.getStarted')
              : t('onboarding.next')}
          </Button>
          <Pressable
            onPress={goToWelcome}
            style={styles.skipButton}
            disabled={isLastSlide}>
            <Text
              style={[
                styles.skipText,
                isLastSlide && styles.skipTextHidden,
              ]}>
              {t('onboarding.skipIntro')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;
