import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'native-base';
import {Formik} from 'formik';

import Container from '~/components/Container';
import AuthInput from '~/components/AuthInput';

import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useEmailValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {forgotPassword} from '~/redux/auth/thunks';
import {getForgotPasswordParams} from '~/redux/auth/selectors';
import Alert from '~/components/Alert';

const ForgotPasswordScreen = () => {
  const {t} = useAppTranslation();
  const emailValidationSchema = useEmailValidationSchema();
  const dispatch = useAppDispatch();
  const {pending, emailMessage} = useAppSelector(getForgotPasswordParams);

  const handleContinue = useCallback(
    values => {
      dispatch(forgotPassword(values));
    },
    [dispatch],
  );

  return (
    <Container type={'keyboardAvoidingScrollView'}>
      {emailMessage && (
        <View>
          <Alert
            label={t(emailMessage.messageKey)}
            error={!emailMessage.success}
          />
        </View>
      )}
      <View style={styles.container}>
        <Text style={styles.description}>{t('forgotPassword.enterEmail')}</Text>
        <Formik
          initialValues={{email: ''}}
          onSubmit={handleContinue}
          validationSchema={emailValidationSchema}
          validateOnChange={true}>
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
                type={'email'}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                errorMessage={
                  errors.email && touched.email ? errors.email : undefined
                }
              />
              <View style={styles.buttonContainer}>
                <Button
                  disabled={!(isValid && dirty) || pending}
                  isLoading={pending}
                  style={styles.button}
                  onPress={handleSubmit}>
                  {t('common.continue')}
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
    </Container>
  );
};

export default ForgotPasswordScreen;
