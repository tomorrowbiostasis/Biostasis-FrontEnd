import {Button, Text, View} from 'native-base';
import React, {useCallback} from 'react';
import {Formik} from 'formik';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Container from '~/components/Container';
import Input from '~/components/Input';

import {useUserNameValidationSchema} from '~/services/Validation.service';
import {useAppDispatch} from '~/redux/store/hooks';
import {useNavigation} from '@react-navigation/native';
import {updateUser} from '~/redux/user/thunks';
import styles from './styles';

type NameFormFields = {
  firstName: string;
  lastName: string;
};

export const UserNameScreen = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const userNameValidationSchema = useUserNameValidationSchema();

  const handleContinuePress = useCallback(
    async ({firstName, lastName}: NameFormFields) => {
      dispatch(
        updateUser({
          name: firstName,
          surname: lastName,
        }),
      );
      navigate('UserPhone');
    },
    [dispatch, navigate],
  );

  return (
    <Container
      title={t('auth.welcomeTo')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.content}>
        <View style={styles.text}>
          <Text fontSize={'xl'}>{t('userName.title')}</Text>
        </View>

        <Formik<NameFormFields>
          initialValues={{firstName: '', lastName: ''}}
          onSubmit={handleContinuePress}
          validationSchema={userNameValidationSchema}
          validateOnChange={true}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <>
              <View style={styles.space}>
                <Input
                  type="firstName"
                  label={t('userName.firstName')}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                  errorMessage={
                    errors.firstName && touched.firstName
                      ? errors.firstName
                      : undefined
                  }
                  isValid={!errors.firstName && touched.firstName}
                />
              </View>
              <Input
                type="lastName"
                label={t('userName.lastName')}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
                isValid={!errors.lastName && touched.lastName}
                errorMessage={
                  errors.lastName && touched.lastName
                    ? errors.lastName
                    : undefined
                }
              />
              <Button
                variant={'solid'}
                disabled={!!errors.firstName || !!errors.lastName}
                style={styles.submitButton}
                onPress={handleSubmit}>
                {t('common.continue')}
              </Button>
            </>
          )}
        </Formik>
      </View>
    </Container>
  );
};
export default UserNameScreen;
