import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRoute, RouteProp} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import AuthHeader from '~/components/AuthHeader';
import SegmentedControl from '~/components/SegmentedControl';
import {AppleButton} from '~/components/AuthButtons/AppleButton';
import {GoogleButton} from '~/components/AuthButtons/GoogleButton';
import OrDivider from '~/components/OrDivider';
import Login, {LoginFormFields} from './components/Login';
import Register, {RegisterFormFields} from './components/Register';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {appleSignIn, googleSignIn} from '~/services/Amazon.service';
import {AuthStackNavigatorParamList, Screens} from '~/models/Navigation.model';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {confirmSignUp} from '~/redux/auth/thunks';
import {getSignInParams, getSignUpParams} from '~/redux/auth/selectors';

import styles from './styles';

const SIGN_IN = 0;
const SIGN_UP = 1;

const getTabIndexByParam = (param?: string): number =>
  param === 'SIGN_UP' ? SIGN_UP : SIGN_IN;

const normalizeEmailParam = (email: string): string =>
  email.trim().toLowerCase();

const AuthScreen = () => {
  const {params} =
    useRoute<RouteProp<AuthStackNavigatorParamList, Screens.Auth>>();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AuthStackNavigatorParamList, Screens.Auth>
    >();
  const dispatch = useAppDispatch();
  const {t} = useAppTranslation();

  const [activeIndex, setActiveIndex] = useState(
    getTabIndexByParam(params?.action),
  );
  const [authValues, setAuthValues] = useState<LoginFormFields>({
    email: '',
    password: '',
  });
  const [loginFormRevision, setLoginFormRevision] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {pending: signInPending} = useAppSelector(getSignInParams);
  const {pending: signUpPending} = useAppSelector(getSignUpParams);
  const socialPending = signInPending || signUpPending;

  const isSignUp = activeIndex === SIGN_UP;
  const routeEmail = params?.email;
  const routeCode = params?.code;

  useEffect(() => {
    if (!routeEmail) {
      return;
    }

    const email = normalizeEmailParam(routeEmail);

    setActiveIndex(SIGN_IN);
    setAuthValues({email, password: ''});
    setLoginFormRevision(revision => revision + 1);

    if (routeCode) {
      dispatch(
        confirmSignUp({email, code: routeCode}),
      );
    }

    navigation.setParams({email: undefined, code: undefined});
  }, [dispatch, navigation, routeCode, routeEmail]);

  const handleApple = useCallback(() => {
    appleSignIn();
  }, []);
  const handleGoogle = useCallback(() => {
    googleSignIn();
  }, []);

  const handleModeChange = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndex) {
        return;
      }

      setActiveIndex(nextIndex);
    },
    [activeIndex],
  );

  const signUpValues = useMemo<RegisterFormFields>(
    () => ({
      ...authValues,
      termsAccepted,
    }),
    [authValues, termsAccepted],
  );

  const handleLoginValuesChange = useCallback((values: LoginFormFields) => {
    setAuthValues(values);
  }, []);

  const handleRegisterValuesChange = useCallback(
    ({email, password, termsAccepted: nextTermsAccepted}: RegisterFormFields) => {
      setAuthValues({email, password});
      setTermsAccepted(nextTermsAccepted);
    },
    [],
  );

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
          onChange={handleModeChange}
          style={styles.segmentedControl}
        />
        <AppleButton
          text={isSignUp ? t('signUp.apple') : t('LogIn.apple')}
          onClick={handleApple}
          disabled={socialPending}
          style={styles.socialButton}
        />
        <GoogleButton
          text={isSignUp ? t('signUp.google') : t('LogIn.google')}
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
        {isSignUp ? (
          <Register
            initialValues={signUpValues}
            onValuesChange={handleRegisterValuesChange}
          />
        ) : (
          <Login
            key={`login-${loginFormRevision}`}
            initialValues={authValues}
            onValuesChange={handleLoginValuesChange}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AuthScreen;
