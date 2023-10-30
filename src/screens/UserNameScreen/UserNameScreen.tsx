import {Button, Text, View} from 'native-base';
import React, {useCallback} from 'react';
import {Formik} from 'formik';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import Container from '~/components/Container';
import Input from '~/components/Input';
import {useUserNameValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {useNavigation} from '@react-navigation/native';
import {updateUser} from '~/redux/user/thunks';
import styles from './styles';
import {Screens} from '~/models/Navigation.model';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Keyboard} from 'react-native';
import {userLoading} from '~/redux/user/selectors';

type NameFormFields = {
  firstName: string;
  lastName: string;
};

export const UserNameScreen = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const userNameValidationSchema = useUserNameValidationSchema();
  const pending = useAppSelector(userLoading);

  const handleContinuePress = useCallback(
    async ({firstName, lastName}: NameFormFields) => {
      dispatch(
        updateUser({
          name: firstName,
          surname: lastName,
        }),
      );
      navigate(Screens.UserPhone as never);
    },
    [dispatch, navigate],
  );

  return (
    <Container
      containerStyle={styles.container}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <IconMaterialCommunityIcons
            name={'pencil-outline'}
            size={26}
            style={styles.icon}
          />
          <Text fontSize={'md'} fontWeight={700}>
            {t('userName.title')}
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.panelBody}>
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
              isValid,
              dirty,
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
                  onSubmitEditing={() => {
                    if (
                      !errors.firstName &&
                      !errors.lastName &&
                      isValid &&
                      dirty
                    ) {
                      Keyboard.dismiss();
                      handleSubmit();
                    }
                  }}
                />
                <Button
                  variant={'solid'}
                  disabled={
                    !!errors.firstName ||
                    !!errors.lastName ||
                    !(isValid && dirty)
                  }
                  isLoading={pending}
                  style={styles.submitButton}
                  onPress={() => handleSubmit()}>
                  {t('common.continue')}
                </Button>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Container>
  );
};
export default UserNameScreen;
