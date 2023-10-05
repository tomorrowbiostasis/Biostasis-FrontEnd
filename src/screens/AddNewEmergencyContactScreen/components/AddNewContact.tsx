import React, {FC, useCallback, useState} from 'react';
import {Button, Text, View} from 'native-base';
import {Formik} from 'formik';

import {useAddNewEmergencyContactValidationSchema} from '~/services/Validation.service';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Input from '~/components/Input';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';

import styles from '../styles';
import {AddNewEmergencyContactFormFields} from '../AddNewEmergencyContactScreen';
import {IEmergencyContact} from '~/redux/emergencyContacts/emergencyContacts.slice';
import colors from '~/theme/colors';

interface IAddNewContactProps {
  onSavePress: (contact: IEmergencyContact) => void;
}

export const AddNewContact: FC<IAddNewContactProps> = ({onSavePress}) => {
  const {t} = useAppTranslation();
  const [phoneData, setPhoneData] = useState<IPhoneNumber>();
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const AddNewEmergencyContactValidationSchema =
    useAddNewEmergencyContactValidationSchema();

  const handleSavePress = useCallback(
    ({firstName, lastName, email}: AddNewEmergencyContactFormFields) => {
      const emergencyContact: IEmergencyContact = {
        name: firstName,
        surname: lastName,
        email,
        prefix: phoneData?.prefix || 0,
        phone: phoneData?.phone || '',
        countryCode: phoneData?.countryCode || '',
        active: true,
      };
      onSavePress(emergencyContact);
    },
    [onSavePress, phoneData?.countryCode, phoneData?.phone, phoneData?.prefix],
  );

  return (
    <View style={styles.content}>
      <Formik<AddNewEmergencyContactFormFields>
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        onSubmit={handleSavePress}
        validationSchema={AddNewEmergencyContactValidationSchema}
        validateOnChange={true}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
          dirty,
        }) => (
          <>
            <View style={styles.inputWrapper}>
              <Input
                type="firstName"
                label={t('emergencyContactsSettings.addNewEdit.firstName')}
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
            <View style={styles.inputWrapper}>
              <Input
                type="lastName"
                label={t('emergencyContactsSettings.addNewEdit.lastName')}
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
            </View>
            <View style={styles.inputWrapper}>
              <Input
                type="email"
                label={t('emergencyContactsSettings.addNewEdit.email')}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                isValid={!errors.email && touched.email}
                errorMessage={
                  errors.email && touched.email ? errors.email : undefined
                }
              />
            </View>
            <View style={styles.inputWrapper}>
              <PhoneNumberPicker
                label={t('emergencyContactsSettings.addNewEdit.phoneNumber')}
                onCheckIfValid={setIsPhoneValid}
                onChangePhoneNumber={setPhoneData}
              />
            </View>

            <Button
              variant={'solid'}
              disabled={!isValid || !dirty || !isPhoneValid}
              style={styles.saveButton}
              onPress={() => handleSubmit()}>
              <Text color={colors.white} fontSize={'md'} fontWeight={700}>
                {t('common.save')}
              </Text>
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};
