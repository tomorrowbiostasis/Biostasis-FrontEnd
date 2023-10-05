import {useNavigation} from '@react-navigation/core';
import {Formik} from 'formik';
import {Button, View} from 'native-base';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {parsePhoneNumber} from 'react-phone-number-input';

import Container from '~/components/Container';
import Input from '~/components/Input';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';
import {updateUser} from '~/redux/user/thunks';
import {IUser} from '~/redux/user/user.slice';
import {useEditProfileValidationSchema} from '~/services/Validation.service';

import {MaskedDateInput} from '../DateOfBirthScreen/components/MaskedDateInput/MaskedDateInput';
import {useDataValidState} from './hooks/UseDataValidState';

import styles from './styles';
import {Screens} from '~/models/Navigation.model';
import ToastService from '~/services/Toast.service';

export type ProfileEditFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
};

const ProfileEditScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dateOfBirthState = useDataValidState<string>(user.dateOfBirth);
  const phoneNumberState = useDataValidState<IPhoneNumber>(
    {
      phone: user.phone || '',
      prefix: user.prefix || 0,
      countryCode:
        user.phone && user.prefix
          ? parsePhoneNumber(`+${user.prefix}${user.phone}`)?.country
          : '',
    },
    true,
  );

  const handleSave = useCallback(
    ({firstName, email, lastName, address}: ProfileEditFormFields) => {
      const userToUpdate: IUser = {
        name: firstName,
        surname: lastName,
        email,
        address,
        prefix: phoneNumberState.value?.prefix,
        phone: phoneNumberState.value?.phone,
        dateOfBirth: dateOfBirthState.value,
        countryCode: phoneNumberState.value?.countryCode,
      };
      setIsSubmitted(true);
      // @ts-ignore
      dispatch(updateUser(userToUpdate)).then((response: {error: string}) => {
        setIsSubmitted(false);
        if (!response.error) {
          navigate(Screens.ProfileDefault as never);
          ToastService.success(t('user.updatedSuccessfully'));
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      phoneNumberState.value?.prefix,
      phoneNumberState.value?.phone,
      phoneNumberState.value?.countryCode,
      dateOfBirthState.value,
      dispatch,
      navigate,
    ],
  );

  return (
    <>
      <Container
        title={t('profileEdit.title')}
        contentContainerStyle={styles.contentContainer}
        type={'keyboardAvoidingScrollView'}
        showBackIcon
        showDrawerIcon>
        <Formik<ProfileEditFormFields>
          initialValues={{
            firstName: user.name || '',
            lastName: user.surname || '',
            email: user.email || '',
            address: user.address || '',
          }}
          onSubmit={handleSave}
          validationSchema={useEditProfileValidationSchema()}
          validateOnChange={true}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isValid,
          }) => (
            <View style={styles.panel}>
              <View style={styles.panelBody}>
                <View style={styles.inputWrapper}>
                  <Input
                    type="firstName"
                    label={t('profileEdit.firstName')}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    errorMessage={
                      errors.firstName && touched.firstName
                        ? errors.firstName
                        : undefined
                    }
                    isValid={!errors.firstName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Input
                    type="lastName"
                    label={t('profileEdit.lastName')}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    isValid={!errors.lastName}
                    errorMessage={
                      errors.lastName && touched.lastName
                        ? errors.lastName
                        : undefined
                    }
                  />
                </View>
                {/* <View style={styles.inputWrapper}>
                  <Input
                    type="email"
                    label={t('profileEdit.email')}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    isValid={!errors.email}
                    errorMessage={
                      errors.email && touched.email ? errors.email : undefined
                    }
                  />
                </View> */}
                <View style={styles.inputWrapper}>
                  <PhoneNumberPicker
                    label={t('profileEdit.phoneNumber')}
                    initialPhone={phoneNumberState.value?.phone}
                    initialPrefix={phoneNumberState.value?.prefix}
                    onCheckIfValid={phoneNumberState.setIsValid}
                    onChangePhoneNumber={phoneNumberState.setValue}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <MaskedDateInput
                    label={t('profileEdit.dateOfBirth')}
                    initialValue={dateOfBirthState.value}
                    onChangeValue={dateOfBirthState.setValue}
                    onChangeValidation={dateOfBirthState.setIsValid}
                    type="birth"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Input
                    type="address"
                    label={t('profileEdit.address')}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    value={values.address}
                    isValid={!errors.address}
                    errorMessage={
                      errors.address && touched.address
                        ? errors.address
                        : undefined
                    }
                  />
                </View>
                <View style={styles.panelFooter}>
                  <Button
                    variant={'solid'}
                    disabled={
                      !(
                        isValid &&
                        phoneNumberState.isValid &&
                        dateOfBirthState.isValid &&
                        !isSubmitted
                      )
                    }
                    style={styles.saveButton}
                    onPress={() => handleSubmit()}>
                    {t('common.save')}
                  </Button>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default ProfileEditScreen;
