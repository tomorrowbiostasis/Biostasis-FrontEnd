import React, {FC, useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import {Button} from 'native-base';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import FormInput from '~/components/FormInput';
import Alert from '~/components/Alert';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {isIOS, updateDataCollectionStatus} from '~/utils';
import {useSignInValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {signIn} from '~/redux/auth/thunks';
import {getSignInParams} from '~/redux/auth/selectors';
import {Screens} from '~/models/Navigation.model';

import styles from './styles';

type LoginFormFields = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const signInValidationSchema = useSignInValidationSchema();
  const {message, pending} = useAppSelector(getSignInParams);
  const {navigate} = useNavigation();

  const onForgotPasswordPress = useCallback(() => {
    // @ts-ignore — Screens enum lookup
    navigate(Screens.ForgotPassword);
  }, [navigate]);

  const onSubmit = useCallback(
    async ({email, password}: LoginFormFields) => {
      dispatch(signIn({email, password})).then(() => {
        isIOS && updateDataCollectionStatus();
      });
    },
    [dispatch],
  );

  return (
    <View style={styles.container}>
      {message && (
        <View style={styles.alertContainer}>
          <Alert label={t(message.messageKey)} error={!message.success} />
        </View>
      )}
      <Formik<LoginFormFields>
        initialValues={{email: '', password: ''}}
        onSubmit={onSubmit}
        validationSchema={signInValidationSchema}
        validateOnChange>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
          dirty,
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
              <FormInput
                label={t('authScreen.passwordLabel')}
                type="password"
                placeholder={t('authScreen.signIn.passwordPlaceholder')}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errorMessage={
                  errors.password && touched.password
                    ? errors.password
                    : undefined
                }
              />
              <View style={styles.forgotPasswordContainer}>
                <Pressable
                  onPress={onForgotPasswordPress}
                  style={styles.forgotPasswordButton}
                  hitSlop={8}>
                  <Text style={styles.forgotPasswordText}>
                    {t('authScreen.signIn.forgotPassword')}
                  </Text>
                </Pressable>
              </View>
              <Button
                variant={'figmaPrimary' as never}
                h={44}
                isDisabled={!canSubmit}
                isLoading={pending}
                onPress={() => handleSubmit()}
                style={styles.submitButton}>
                {t('authScreen.signIn.cta')}
              </Button>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default Login;
