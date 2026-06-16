import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {RouteProp, useRoute} from '@react-navigation/native';

import AuthHeader from '~/components/AuthHeader';
import FormInput from '~/components/FormInput';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useMessageToast} from '~/hooks/UseMessageToast.hook';
import {useEmailValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {forgotPassword} from '~/redux/auth/thunks';
import {getForgotPasswordParams} from '~/redux/auth/selectors';
import {setForgotPasswordEmailMessage} from '~/redux/auth/auth.slice';
import {AuthStackNavigatorParamList, Screens} from '~/models/Navigation.model';
import {getVisibleFormError} from '~/utils';

import styles from './styles';

type ForgotPasswordFormFields = {
  email: string;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const ForgotPasswordScreen = () => {
  const {t} = useAppTranslation();
  const emailValidationSchema = useEmailValidationSchema();
  const dispatch = useAppDispatch();
  const {pending, emailMessage} = useAppSelector(getForgotPasswordParams);
  const [sentEmail, setSentEmail] = useState<string | undefined>();
  const inFlightEmailRef = useRef<string | undefined>();
  const {params} =
    useRoute<
      RouteProp<AuthStackNavigatorParamList, Screens.ForgotPassword>
    >();
  const initialValues = useMemo(
    () => ({email: params?.email ?? ''}),
    [params?.email],
  );
  useMessageToast(emailMessage);

  useEffect(() => {
    dispatch(setForgotPasswordEmailMessage(undefined));
  }, [dispatch]);

  const handleContinue = useCallback(
    (values: ForgotPasswordFormFields) => {
      const email = normalizeEmail(values.email);
      if (pending || inFlightEmailRef.current || email === sentEmail) {
        return;
      }

      inFlightEmailRef.current = email;
      dispatch(forgotPassword({email}))
        .unwrap()
        .then(() => {
          setSentEmail(email);
        })
        .catch(() => undefined)
        .finally(() => {
          inFlightEmailRef.current = undefined;
        });
    },
    [dispatch, pending, sentEmail],
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
        <Formik<ForgotPasswordFormFields>
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleContinue}
          validationSchema={emailValidationSchema}
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
            const normalizedEmail = normalizeEmail(values.email);
            const resetAlreadySent = normalizedEmail === sentEmail;
            const canSubmit =
              isValid &&
              normalizedEmail.length > 0 &&
              !pending &&
              !resetAlreadySent;
            return (
              <>
                <FormInput
                  label={t('authScreen.emailLabel')}
                  type="email"
                  placeholder={t('authScreen.emailPlaceholder')}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  errorMessage={getVisibleFormError({
                    error: errors.email,
                    submitCount,
                    touched: touched.email,
                    value: values.email,
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

export default ForgotPasswordScreen;
