import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Linking, Pressable, Text, View} from 'react-native';
import {Button} from 'native-base';
import {Formik, FormikProps} from 'formik';

import FormInput from '~/components/FormInput';
import Switch from '~/components/Switch';
import Alert from '~/components/Alert';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useSignUpValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {getSignUpParams} from '~/redux/auth/selectors';
import {signUp} from '~/redux/auth/thunks';
import {semanticColors} from '~/theme/tokens';

import styles from './styles';

type RegisterFormFields = {
  email: string;
  password: string;
  termsAccepted: boolean;
};

const TERMS_URL = 'https://tomorrowbiostasis.com/terms-conditions/';

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

  const onSubmit = useCallback(
    async (values: RegisterFormFields) => {
      dispatch(signUp(values));
    },
    [dispatch],
  );

  const openTerms = useCallback(() => {
    Linking.openURL(TERMS_URL);
  }, []);

  return (
    <View style={styles.container}>
      {message && (
        <View style={styles.alertContainer}>
          <Alert label={t(message.messageKey)} error={!message.success} />
        </View>
      )}
      <Formik<RegisterFormFields>
        innerRef={formRef}
        initialValues={{email: '', password: '', termsAccepted: false}}
        onSubmit={onSubmit}
        validationSchema={signUpValidationSchema}
        validateOnBlur
        validateOnChange>
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
          const canSubmit =
            isValid && dirty && values.termsAccepted && !pending;
          return (
            <>
              <FormInput
                label={t('authScreen.emailLabel')}
                type="email"
                placeholder={t('authScreen.emailPlaceholder')}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                errorMessage={
                  errors.email && touched.email ? errors.email : undefined
                }
              />
              <FormInput
                label={t('authScreen.passwordLabel')}
                type="password"
                placeholder={t('authScreen.signUp.passwordPlaceholder')}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errorMessage={
                  errors.password && touched.password
                    ? errors.password
                    : undefined
                }
              />
              <View style={styles.termsRow}>
                <Switch
                  value={values.termsAccepted}
                  onValueChange={value => {
                    setFieldValue('termsAccepted', value);
                    validateField('termsAccepted');
                  }}
                />
                <Text style={styles.termsText}>
                  {t('authScreen.termsAgree')}{' '}
                  <Text style={styles.termsLink} onPress={openTerms}>
                    {t('authScreen.terms')}
                  </Text>
                </Text>
              </View>
              <Button
                variant={'figmaPrimary' as never}
                bg={
                  canSubmit
                    ? semanticColors.primaryDeep
                    : semanticColors.primary
                }
                _pressed={{bg: semanticColors.primary}}
                h={44}
                opacity={canSubmit ? 1 : 0.4}
                isDisabled={!canSubmit}
                isLoading={pending}
                onPress={() => handleSubmit()}
                style={styles.submitButton}>
                {t('authScreen.signUp.cta')}
              </Button>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default Register;
