import React, {FC, useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import FormInput from '~/components/FormInput';
import Alert from '~/components/Alert';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {getVisibleFormError, isIOS, updateDataCollectionStatus} from '~/utils';
import {useSignInValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {signIn} from '~/redux/auth/thunks';
import {getSignInParams} from '~/redux/auth/selectors';
import {AuthStackNavigatorParamList, Screens} from '~/models/Navigation.model';

import styles from './styles';

export type LoginFormFields = {
  email: string;
  password: string;
};

type LoginProps = {
  initialValues: LoginFormFields;
  onValuesChange: (values: LoginFormFields) => void;
};

const Login: FC<LoginProps> = ({initialValues, onValuesChange}) => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const signInValidationSchema = useSignInValidationSchema();
  const {message, pending} = useAppSelector(getSignInParams);
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<AuthStackNavigatorParamList, Screens.Auth>
    >();

  const onForgotPasswordPress = useCallback((email?: string) => {
    navigate(Screens.ForgotPassword, {email});
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
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={signInValidationSchema}
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
            values.email.trim().length > 0 &&
            values.password.length > 0 &&
            !pending;
          const handleFieldChange =
            (field: keyof LoginFormFields) => (value: string) => {
              handleChange(field)(value);
              onValuesChange({...values, [field]: value});
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
                placeholder={t('authScreen.signIn.passwordPlaceholder')}
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
              <AnimatedSubmitButton
                variant={'figmaFormPrimary' as never}
                disabled={!canSubmit}
                isLoading={pending}
                onPress={() => handleSubmit()}
                style={styles.submitButton}>
                {t('authScreen.signIn.cta')}
              </AnimatedSubmitButton>
              <View style={styles.forgotPasswordContainer}>
                <Pressable
                  onPress={() => onForgotPasswordPress(values.email)}
                  style={styles.forgotPasswordButton}
                  hitSlop={8}>
                  <Text style={styles.forgotPasswordText}>
                    {t('authScreen.signIn.forgotPassword')}
                  </Text>
                </Pressable>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default Login;
