import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Linking, Text, View} from 'react-native';
import {Formik, FormikProps} from 'formik';

import FormInput from '~/components/FormInput';
import Switch from '~/components/Switch';
import Alert from '~/components/Alert';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useSignUpValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {getSignUpParams} from '~/redux/auth/selectors';
import {signUp} from '~/redux/auth/thunks';
import {getVisibleFormError} from '~/utils';

import styles from './styles';

export type RegisterFormFields = {
  email: string;
  password: string;
  termsAccepted: boolean;
};

const TERMS_URL = 'https://tomorrowbiostasis.com/terms-conditions/';

type RegisterProps = {
  initialValues: RegisterFormFields;
  onValuesChange: (values: RegisterFormFields) => void;
};

const Register: FC<RegisterProps> = ({initialValues, onValuesChange}) => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const signUpValidationSchema = useSignUpValidationSchema();
  const {message, pending, formFieldError} = useAppSelector(getSignUpParams);
  const formRef = useRef<FormikProps<RegisterFormFields> | null>(null);

  useEffect(() => {
    if (message?.success) {
      const emptyValues = {email: '', password: '', termsAccepted: false};
      formRef.current?.resetForm({values: emptyValues});
      onValuesChange(emptyValues);
    }
  }, [message?.success, onValuesChange]);

  useEffect(() => {
    if (formFieldError) {
      formRef.current?.setFieldTouched(formFieldError.key, true, false);
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
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={signUpValidationSchema}
        validateOnMount
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
          isValid,
          submitCount,
        }) => {
          const canSubmit =
            isValid &&
            values.email.trim().length > 0 &&
            values.password.length > 0 &&
            values.termsAccepted &&
            !pending;
          const handleFieldChange =
            (field: keyof RegisterFormFields) => (value: string) => {
              const nextValues = {...values, [field]: value};
              handleChange(field)(value);
              onValuesChange(nextValues);
            };

          const handleTermsChange = (value: boolean) => {
            setFieldValue('termsAccepted', value);
            validateField('termsAccepted');
            onValuesChange({...values, termsAccepted: value});
          };

          return (
            <>
              <FormInput
                label={t('authScreen.emailLabel')}
                type="email"
                placeholder={t('authScreen.emailPlaceholder')}
                onChangeText={handleFieldChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                errorMessage={getVisibleFormError({
                  error: errors.email,
                  submitCount,
                  touched: touched.email,
                  value: values.email,
                })}
              />
              <FormInput
                label={t('authScreen.passwordLabel')}
                type="password"
                placeholder={t('authScreen.signUp.passwordPlaceholder')}
                onChangeText={handleFieldChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errorMessage={getVisibleFormError({
                  error: errors.password,
                  submitCount,
                  touched: touched.password,
                  value: values.password,
                })}
              />
              <View style={styles.termsRow}>
                <Switch
                  value={values.termsAccepted}
                  onValueChange={handleTermsChange}
                />
                <Text style={styles.termsText}>
                  {t('authScreen.termsAgree')}{' '}
                  <Text style={styles.termsLink} onPress={openTerms}>
                    {t('authScreen.terms')}
                  </Text>
                </Text>
              </View>
              <AnimatedSubmitButton
                variant={'figmaFormPrimary' as never}
                disabled={!canSubmit}
                isLoading={pending}
                onPress={() => handleSubmit()}
                style={styles.submitButton}>
                {t('authScreen.signUp.cta')}
              </AnimatedSubmitButton>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default Register;
