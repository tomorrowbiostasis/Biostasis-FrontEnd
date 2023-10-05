import React, {FC, useCallback} from 'react';
import {Text, Button} from 'native-base';
import {View} from 'react-native';
import {Formik} from 'formik';

import {AppleButton} from '~/components/AuthButtons/AppleButton';
import {GoogleButton} from '~/components/AuthButtons/GoogleButton';
import AuthInput from '~/components/AuthInput';
import Alert from '~/components/Alert';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {isIOS, updateDataCollectionStatus} from '~/utils';
import styles from './styles';
import {useSignInValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {signIn} from '~/redux/auth/thunks';
import {getSignInParams} from '~/redux/auth/selectors';
import {useNavigation} from '@react-navigation/native';
import {appleSignIn, googleSignIn} from '~/services/Amazon.service';
import {Screens} from '~/models/Navigation.model';
import colors from '~/theme/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
    navigate(Screens.ForgotPassword as never);
  }, [navigate]);

  const onSignInPress = async ({email, password}: LoginFormFields) => {
    dispatch(signIn({email, password})).then(() => {
      isIOS && updateDataCollectionStatus();
    });
  };

  return (
    <View style={styles.container}>
      {message && (
        <View style={styles.alertContainer}>
          <Alert label={t(message.messageKey)} error={!message.success} />
        </View>
      )}
      <AppleButton
        text={t('LogIn.apple')}
        onClick={appleSignIn}
        disabled={pending}
      />
      <GoogleButton
        text={t('LogIn.google')}
        style={styles.buttonSpace}
        onClick={googleSignIn}
        disabled={pending}
      />
      <View style={styles.lineStyle} />
      <Text pb={3} fontWeight={'700'}>
        {t('LogIn.emailTitleLogIn')}
      </Text>
      <Formik<LoginFormFields>
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={onSignInPress}
        validationSchema={signInValidationSchema}
        validateOnChange={true}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          isValid,
          dirty,
          errors,
        }) => (
          <>
            <AuthInput
              type={'email'}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              errorMessage={
                errors.email && touched.email ? errors.email : undefined
              }
            />
            <AuthInput
              type={'password'}
              containerStyle={styles.inputMargin}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              errorMessage={
                errors.password && touched.password
                  ? errors.password
                  : undefined
              }
            />
            <Button
              disabled={!(isValid && dirty) || pending}
              isLoading={pending}
              variant={'solid'}
              style={styles.loginButton}
              onPress={() => handleSubmit()}>
              <Text style={{color: colors.white}}>{t('LogIn.LogIn')}</Text>
            </Button>
            <TouchableOpacity onPress={onForgotPasswordPress}>
              <Text style={styles.forgotPasswordText}>
                {t('forgotPassword.doNotRememberPassword')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default Login;
