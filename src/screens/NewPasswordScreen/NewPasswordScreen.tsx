import React, {useCallback, useEffect} from 'react';
import {Platform, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import AuthHeader from '~/components/AuthHeader';
import FormInput from '~/components/FormInput';
import Alert from '~/components/Alert';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useConfirmPasswordValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {forgotPasswordSetNewPassword} from '~/redux/auth/thunks';
import {AuthStackNavigatorParamList, Screens} from '~/models/Navigation.model';
import {getForgotPasswordParams} from '~/redux/auth/selectors';
import {
  setForgotPasswordEmailMessage,
  setShouldBackToAuthScreen,
} from '~/redux/auth/auth.slice';
import {getVisibleFormError} from '~/utils';

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
    useRoute<RouteProp<AuthStackNavigatorParamList, Screens.NewPassword>>();

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
        index: 0,
        routes: [
          {
            name: Screens.Auth as never,
            params: params?.email ? {email: params.email} : undefined,
          },
        ],
      });
    }
    return () => {
      dispatch(setShouldBackToAuthScreen(false));
    };
  }, [dispatch, params?.email, reset, shouldBackToAuthScreen]);

  const handleContinue = useCallback(
    ({password}: NewPasswordFormFields) => {
      if (params?.email && params?.code) {
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
          validateOnMount
          validateOnChange>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isValid,
            submitCount,
          }) => {
            const canSubmit =
              isValid &&
              values.password.length > 0 &&
              values.confirmPassword.length > 0 &&
              !pending;
            return (
              <>
                <FormInput
                  label={t('authScreen.passwordLabel')}
                  type="password"
                  placeholder={t('placeholder.newPassword')}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  errorMessage={getVisibleFormError({
                    error: errors.password,
                    submitCount,
                    touched: touched.password,
                    value: values.password,
                  })}
                />
                <FormInput
                  label={t('forgotPassword.confirmPasswordLabel')}
                  type="password"
                  placeholder={t('placeholder.confirmNewPassword')}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  errorMessage={getVisibleFormError({
                    error: errors.confirmPassword,
                    submitCount,
                    touched: touched.confirmPassword,
                    value: values.confirmPassword,
                  })}
                />
                <AnimatedSubmitButton
                  variant={'figmaFormPrimary' as never}
                  disabled={!canSubmit}
                  isLoading={pending}
                  onPress={() => handleSubmit()}
                  style={styles.submitButton}>
                  {t('common.continue')}
                </AnimatedSubmitButton>
              </>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default NewPasswordScreen;
