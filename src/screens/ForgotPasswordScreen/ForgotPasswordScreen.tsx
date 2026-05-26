import React, {useCallback} from 'react';
import {Platform, View} from 'react-native';
import {Button} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';

import AuthHeader from '~/components/AuthHeader';
import FormInput from '~/components/FormInput';
import Alert from '~/components/Alert';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useEmailValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {forgotPassword} from '~/redux/auth/thunks';
import {getForgotPasswordParams} from '~/redux/auth/selectors';

import styles from './styles';

type ForgotPasswordFormFields = {
  email: string;
};

const ForgotPasswordScreen = () => {
  const {t} = useAppTranslation();
  const emailValidationSchema = useEmailValidationSchema();
  const dispatch = useAppDispatch();
  const {pending, emailMessage} = useAppSelector(getForgotPasswordParams);

  const handleContinue = useCallback(
    (values: ForgotPasswordFormFields) => {
      dispatch(forgotPassword(values));
    },
    [dispatch],
  );

  return (
    <View style={styles.root}>
      <AuthHeader
        title={t('forgotPassword.title')}
        subtitle={t('forgotPassword.subtitle')}
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
        {emailMessage && (
          <View style={styles.alertContainer}>
            <Alert
              label={t(emailMessage.messageKey)}
              error={!emailMessage.success}
            />
          </View>
        )}
        <Formik<ForgotPasswordFormFields>
          initialValues={{email: ''}}
          onSubmit={handleContinue}
          validationSchema={emailValidationSchema}
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
                <Button
                  variant={'figmaPrimary' as never}
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

export default ForgotPasswordScreen;
