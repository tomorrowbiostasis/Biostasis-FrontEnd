import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Text, Button} from 'native-base';
import {View} from 'react-native';
import {Formik, FormikErrors, FormikProps, FormikTouched} from 'formik';

import {AppleButton} from '~/components/AuthButtons/AppleButton';
import {GoogleButton} from '~/components/AuthButtons/GoogleButton';
import AuthInput from '~/components/AuthInput';

import styles from './styles';
import TermsAgree from './components/TermsAgree';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useSignUpValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {getSignUpParams} from '~/redux/auth/selectors';
import {signUp} from '~/redux/auth/thunks';
import Alert from '~/components/Alert';
import {appleSignIn, googleSignIn} from '~/services/Amazon.service';

type RegisterFormFields = {
  email: string;
  password: string;
  termsAccepted: boolean;
};

const Register: FC = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const signUpValidationSchema = useSignUpValidationSchema();
  const {message, pending, formFieldError} = useAppSelector(getSignUpParams);
  const formRef = useRef<FormikProps<RegisterFormFields> | null>(null);
  useEffect(() => {
    if (message?.success) {
      formRef.current?.resetForm();
    }
  }, [message?.success]);

  useEffect(() => {
    if (formFieldError) {
      formRef.current?.setFieldError(
        formFieldError.key,
        t(formFieldError.messageKey),
      );
    }
  }, [formFieldError, t]);

  const onSignUpPress = useCallback(
    async (
      values: RegisterFormFields,
      // formikHelpers: FormikHelpers<RegisterFormFields>,
    ) => {
      dispatch(signUp(values));
    },
    [dispatch],
  );

  const getErrorMessage = useCallback(
    (
      name: keyof RegisterFormFields,
      errors: FormikErrors<RegisterFormFields>,
      touched: FormikTouched<RegisterFormFields>,
    ): string | undefined => {
      return errors[name] && touched[name] ? errors[name] : undefined;
    },
    [],
  );
  return (
    <View>
      {message && (
        <View style={styles.alertContainer}>
          <Alert label={t(message.messageKey)} error={!message.success} />
        </View>
      )}

      <AppleButton
        text={t('signUp.apple')}
        disabled={pending}
        onClick={appleSignIn}
      />
      <GoogleButton
        text={t('signUp.google')}
        style={styles.separator}
        onClick={googleSignIn}
        disabled={pending}
      />
      <Text style={styles.orSeparator}>{t('common.or')}</Text>
      <Formik<RegisterFormFields>
        innerRef={formRef}
        initialValues={{
          email: '',
          password: '',
          termsAccepted: false,
        }}
        onSubmit={onSignUpPress}
        validationSchema={signUpValidationSchema}
        validateOnBlur={true}
        validateOnChange={true}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          setFieldValue,
          validateField,
          dirty,
          isValid,
        }) => {
          return (
            <>
              <AuthInput
                type={'email'}
                containerStyle={styles.authInputTopSpace}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                errorMessage={getErrorMessage('email', errors, touched)}
              />
              <AuthInput
                type={'password'}
                containerStyle={styles.separator}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errorMessage={getErrorMessage('password', errors, touched)}
              />
              <View style={styles.bottomContainer}>
                <TermsAgree
                  value={values.termsAccepted}
                  onValueChange={value => {
                    setFieldValue('termsAccepted', value);
                    validateField('termsAccepted');
                  }}
                />
                <Button
                  disabled={!(isValid && dirty) || pending}
                  isLoading={pending}
                  onPress={handleSubmit}
                  style={styles.button}>
                  {t('signUp.signUp')}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default Register;
