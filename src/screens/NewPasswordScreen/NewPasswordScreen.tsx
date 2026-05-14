import React, {useCallback, useEffect} from 'react';
import {Platform, View} from 'react-native';
import {Button} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import AuthHeader from '~/components/AuthHeader';
import FormInput from '~/components/FormInput';
import Alert from '~/components/Alert';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useConfirmPasswordValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {forgotPasswordSetNewPassword} from '~/redux/auth/thunks';
import {Screens, ScreensNavigationParamsList} from '~/models/Navigation.model';
import {getForgotPasswordParams} from '~/redux/auth/selectors';
import {
  setForgotPasswordEmailMessage,
  setShouldBackToAuthScreen,
} from '~/redux/auth/auth.slice';
import {semanticColors} from '~/theme/tokens';

import styles from './styles';

type NewPasswordFormFields = {
  password: string;
  confirmPassword: string;
};

const NewPasswordScreen = () => {
  const {t} = useAppTranslation();
  const confirmPasswordValidationSchema = useConfirmPasswordValidationSchema();
  const dispatch = useAppDispatch();
  const {reset} = useNavigation();

  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, Screens.NewPassword>>();

  const {pending, newPasswordMessage, shouldBackToAuthScreen} = useAppSelector(
    getForgotPasswordParams,
  );

  useEffect(() => {
    const clearMessage = () => {
      dispatch(setForgotPasswordEmailMessage(undefined));
    };
    clearMessage();
    return clearMessage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldBackToAuthScreen) {
      reset({
        index: 1,
        routes: [{name: Screens.Auth as never}],
      });
    }
    return () => {
      dispatch(setShouldBackToAuthScreen(false));
    };
  }, [dispatch, reset, shouldBackToAuthScreen]);

  const handleContinue = useCallback(
    ({password}: NewPasswordFormFields) => {
      if (params.email && params.code) {
        dispatch(
          forgotPasswordSetNewPassword({
            email: params.email,
            newPassword: password,
            code: params.code,
          }),
        );
      }
    },
    [dispatch, params?.code, params?.email],
  );

  return (
    <View style={styles.root}>
      <AuthHeader
        title={t('forgotPassword.newPasswordTitle')}
        subtitle={t('forgotPassword.newPasswordSubtitle')}
        eyebrow={t('welcome.eyebrow')}
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
        {newPasswordMessage && (
          <View style={styles.alertContainer}>
            <Alert
              label={t(newPasswordMessage.messageKey)}
              error={!newPasswordMessage.success}
            />
          </View>
        )}
        <Formik<NewPasswordFormFields>
          initialValues={{password: '', confirmPassword: ''}}
          onSubmit={handleContinue}
          validationSchema={confirmPasswordValidationSchema}
          validateOnChange>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            dirty,
            isValid,
          }) => {
            const canSubmit = isValid && dirty && !pending;
            return (
              <>
                <FormInput
                  label={t('authScreen.passwordLabel')}
                  type="password"
                  placeholder={t('placeholder.newPassword')}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  errorMessage={
                    errors.password && touched.password
                      ? errors.password
                      : undefined
                  }
                />
                <FormInput
                  label={t('forgotPassword.confirmPasswordLabel')}
                  type="password"
                  placeholder={t('placeholder.confirmNewPassword')}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  errorMessage={
                    errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : undefined
                  }
                />
                <Button
                  variant={'figmaPrimary' as never}
                  bg={semanticColors.primaryDeep}
                  _pressed={{bg: semanticColors.primary}}
                  h={44}
                  opacity={canSubmit ? 1 : 0.4}
                  isDisabled={!canSubmit}
                  isLoading={pending}
                  onPress={() => handleSubmit()}
                  style={styles.submitButton}>
                  {t('common.continue')}
                </Button>
              </>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default NewPasswordScreen;
