import React, {useCallback, useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRoute, RouteProp} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import AuthHeader from '~/components/AuthHeader';
import SegmentedControl from '~/components/SegmentedControl';
import {AppleButton} from '~/components/AuthButtons/AppleButton';
import {GoogleButton} from '~/components/AuthButtons/GoogleButton';
import OrDivider from '~/components/OrDivider';
import Login from './components/Login';
import Register from './components/Register';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {appleSignIn, googleSignIn} from '~/services/Amazon.service';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {confirmSignUp} from '~/redux/auth/thunks';
import {getSignInParams, getSignUpParams} from '~/redux/auth/selectors';

import styles from './styles';

const SIGN_IN = 0;
const SIGN_UP = 1;

const getTabIndexByParam = (param?: string): number =>
  param === 'SIGN_UP' ? SIGN_UP : SIGN_IN;

const AuthScreen = () => {
  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'AuthScreen'>>();
  const navigation =
    useNavigation<
      StackNavigationProp<ScreensNavigationParamsList, 'AuthScreen'>
    >();
  const dispatch = useAppDispatch();
  const {t} = useAppTranslation();

  const [activeIndex, setActiveIndex] = useState(
    getTabIndexByParam(params?.action),
  );

  const {pending: signInPending} = useAppSelector(getSignInParams);
  const {pending: signUpPending} = useAppSelector(getSignUpParams);
  const socialPending = signInPending || signUpPending;

  const isSignUp = activeIndex === SIGN_UP;

  useEffect(() => {
    if (params?.email && params?.code) {
      setActiveIndex(SIGN_IN);
      dispatch(
        confirmSignUp({email: params.email, code: params.code}),
      );
      navigation.setParams({email: undefined, code: undefined});
    }
  }, [dispatch, navigation, params]);

  const handleApple = useCallback(() => {
    appleSignIn();
  }, []);
  const handleGoogle = useCallback(() => {
    googleSignIn();
  }, []);

  return (
    <View style={styles.root}>
      <AuthHeader
        title={
          isSignUp
            ? t('authScreen.signUp.title')
            : t('authScreen.signIn.title')
        }
        subtitle={
          isSignUp
            ? t('authScreen.signUp.subtitle')
            : t('authScreen.signIn.subtitle')
        }
        eyebrow={t('welcome.eyebrow')}
        showBack={false}
      />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <SegmentedControl
          segments={[t('authScreen.tabSignIn'), t('authScreen.tabSignUp')]}
          selectedIndex={activeIndex}
          onChange={setActiveIndex}
          style={styles.segmentedControl}
        />
        <AppleButton
          text={t('authScreen.appleCta')}
          onClick={handleApple}
          disabled={socialPending}
          style={styles.socialButton}
        />
        <GoogleButton
          text={t('authScreen.googleCta')}
          onClick={handleGoogle}
          disabled={socialPending}
          style={styles.socialButton}
        />
        <View style={styles.dividerWrap}>
          <OrDivider
            label={
              isSignUp
                ? t('authScreen.signUp.dividerLabel')
                : t('authScreen.signIn.dividerLabel')
            }
          />
        </View>
        {isSignUp ? <Register /> : <Login />}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AuthScreen;
