import React, {FC, useCallback, useState} from 'react';
import {Button, View} from 'native-base';
import {Formik} from 'formik';

import {useAddNewEmergencyContactValidationSchema} from '~/services/Validation.service';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Input from '~/components/Input';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';

import styles from '../styles';
import {AddEmergencyContactFormFields} from '../AddNewEmergencyContactScreen';
import {IEmergencyContact} from '~/redux/emergencyContacts/emergencyContacts.slice';

interface IAddNewContactProps {
  onSavePress: (contact: IEmergencyContact) => void;
}

export const AddNewContact: FC<IAddNewContactProps> = ({onSavePress}) => {
  const {t} = useAppTranslation();
  const [phoneData, setPhoneData] = useState<IPhoneNumber>();
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const addNewEmergencyContactValidationSchema =
    useAddNewEmergencyContactValidationSchema();

  const handleSavePress = useCallback(
    ({firstName, lastName, email}: AddEmergencyContactFormFields) => {
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
      <Formik<AddEmergencyContactFormFields>
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        onSubmit={handleSavePress}
        validationSchema={addNewEmergencyContactValidationSchema}
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
                label={t('emergencyContacts.addNewEdit.firstName')}
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
                label={t('emergencyContacts.addNewEdit.lastName')}
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
                label={t('emergencyContacts.addNewEdit.email')}
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
                label={t('emergencyContacts.addNewEdit.phoneNumber')}
                onCheckIfValid={setIsPhoneValid}
                onChangePhoneNumber={setPhoneData}
              />
            </View>

            <Button
              variant={'solid'}
              disabled={!isValid || !dirty || !isPhoneValid}
              style={styles.submitButton}
              onPress={handleSubmit}>
              {t('common.save')}
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};
