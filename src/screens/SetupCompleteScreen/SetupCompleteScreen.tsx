import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, BackHandler, Easing, StatusBar, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import SetupCompleteShield from '~/assets/illustrations/onboarding/SetupCompleteShield';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch} from '~/redux/store/hooks';
import {setSetupCompletePending} from '~/redux/user/user.slice';

import styles from './styles';

const TITLE_SWAP_AT = 2000;
const FINISH_AT = 3000;
const FADE_DURATION = 400;
const PULSE_LEG_DURATION = 700;
const PULSE_MAX_SCALE = 1.08;

const SetupCompleteScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const completeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => sub.remove();
    }, []),
  );

  useEffect(() => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();

    Animated.timing(completeOpacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: PULSE_MAX_SCALE,
          duration: PULSE_LEG_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: PULSE_LEG_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(completeOpacity, {
            toValue: 0,
            duration: FADE_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(welcomeOpacity, {
            toValue: 1,
            duration: FADE_DURATION,
            useNativeDriver: true,
          }),
        ]).start();
      }, TITLE_SWAP_AT),
    );

    timers.push(
      setTimeout(() => {
        dispatch(setSetupCompletePending(false));
      }, FINISH_AT),
    );

    return () => {
      pulse.stop();
      timers.forEach(clearTimeout);
    };
  }, [logoOpacity, completeOpacity, welcomeOpacity, logoScale, dispatch]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoArea}>
        <Animated.View
          style={[
            styles.logoBlock,
            {opacity: logoOpacity, transform: [{scale: logoScale}]},
          ]}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <View style={styles.logoCenter}>
                <SetupCompleteShield width={36} height={38} />
              </View>
            </View>
          </View>
          <Text style={styles.brand}>BIOSTASIS</Text>
        </Animated.View>
      </View>

      <View style={styles.titleArea}>
        <Animated.Text style={[styles.title, {opacity: completeOpacity}]}>
          {t('setupComplete.title')}
        </Animated.Text>
        <Animated.Text
          style={[styles.title, styles.titleAbsolute, {opacity: welcomeOpacity}]}>
          {t('setupComplete.welcome')}
        </Animated.Text>
      </View>
    </View>
  );
};

export default SetupCompleteScreen;
