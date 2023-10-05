import React, {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'native-base';
import {Formik} from 'formik';

import Container from '~/components/Container';
import AuthInput from '~/components/AuthInput';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from './styles';
import {useConfirmPasswordValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {forgotPasswordSetNewPassword} from '~/redux/auth/thunks';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Screens, ScreensNavigationParamsList} from '~/models/Navigation.model';
import {getForgotPasswordParams} from '~/redux/auth/selectors';
import Alert from '~/components/Alert';
import {
  setForgotPasswordEmailMessage,
  setShouldBackToAuthScreen,
} from '~/redux/auth/auth.slice';

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
    <Container
      containerStyle={styles.container}
      contentContainerStyle={styles.containerContent}
      type={'keyboardAvoidingScrollView'}
    >
      {newPasswordMessage && (
        <Alert
          label={t(newPasswordMessage.messageKey)}
          error={!newPasswordMessage.success}
        />
      )}
      <Text fontSize={'xl'} textAlign={'center'} pb={5} fontWeight={'600'}>
        {t('auth.welcomeTo')}
      </Text>
      <View style={styles.panel}>
        <Text style={[styles.description, styles.panelHeader]}>
          {t('forgotPassword.enterNewPasswordForEmail')}
        </Text>
        <View style={styles.panelBody}>
          <Formik<NewPasswordFormFields>
            initialValues={{password: '', confirmPassword: ''}}
            onSubmit={handleContinue}
            validationSchema={confirmPasswordValidationSchema}
            validateOnChange={true}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
              dirty,
              isValid,
            }) => (
              <>
                <AuthInput
                  type={'password'}
                  placeholder={t('placeholder.newPassword')}
                  containerStyle={styles.passwordInput}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  errorMessage={
                    errors.password && touched.password
                      ? errors.password
                      : undefined
                  }
                />
                <AuthInput
                  type={'password'}
                  placeholder={t('placeholder.confirmNewPassword')}
                  containerStyle={styles.confirmPasswordInput}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  errorMessage={
                    errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : undefined
                  }
                />
                <View style={styles.buttonContainer}>
                  <Button
                    disabled={!(isValid && dirty) || pending}
                    isLoading={pending}
                    style={styles.button}
                    onPress={() => handleSubmit()}
                  >
                    {t('common.continue')}
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Container>
  );
};

export default NewPasswordScreen;
