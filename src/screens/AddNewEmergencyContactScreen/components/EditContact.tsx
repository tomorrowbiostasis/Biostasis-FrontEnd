import React, {FC, useCallback, useState} from 'react';
import {Button, Text, View} from 'native-base';
import {Formik} from 'formik';

import {useAddNewEmergencyContactValidationSchema} from '~/services/Validation.service';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Input from '~/components/Input';

import styles from '../styles';
import {AddNewEmergencyContactFormFields} from '../AddNewEmergencyContactScreen';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';
import colors from '~/theme/colors';

interface IEditContactProps {
  contact: IEmergencyContactResponse;
  onSavePress: (contact: IEmergencyContact) => void;
}

export const EditContact: FC<IEditContactProps> = ({contact, onSavePress}) => {
  const {t} = useAppTranslation();
  const [phoneData, setPhoneData] = useState<IPhoneNumber>();
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneTouched, setIsPhoneTouched] = useState(false);

  const AddNewEmergencyContactValidationSchema =
    useAddNewEmergencyContactValidationSchema();

  const handleEditPress = useCallback(
    ({firstName, lastName, email}: AddNewEmergencyContactFormFields) => {
      const {active} = contact;
      let emergencyContact: IEmergencyContact = {
        name: firstName,
        surname: lastName,
        email,
        active,
      };
      if (phoneData?.phone) {
        emergencyContact = {
          ...emergencyContact,
          prefix: phoneData?.prefix,
          phone: phoneData?.phone,
          countryCode: phoneData?.countryCode,
        };
      }
      onSavePress(emergencyContact);
    },
    [
      contact,
      onSavePress,
      phoneData?.countryCode,
      phoneData?.phone,
      phoneData?.prefix,
    ],
  );

  const handlePhoneInputTouched = useCallback(() => {
    setIsPhoneTouched(true);
  }, []);

  return (
    <View style={styles.content}>
      <Formik<AddNewEmergencyContactFormFields>
        initialValues={{
          firstName: contact.name,
          lastName: contact.surname,
          email: contact.email,
        }}
        onSubmit={handleEditPress}
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
                label={t('emergencyContactsSettings.addNewEdit.firstName', {
                  number: contact.id,
                })}
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
                label={t('emergencyContactsSettings.addNewEdit.lastName', {
                  number: contact.id,
                })}
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
            <View style={styles.inputWrapper}>
              <Input
                type="email"
                label={t('emergencyContactsSettings.addNewEdit.email', {
                  number: contact.id,
                })}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                isValid={!errors.email}
                errorMessage={
                  errors.email && touched.email ? errors.email : undefined
                }
              />
            </View>
            <View style={styles.inputWrapper}>
              <PhoneNumberPicker
                label={t('emergencyContactsSettings.addNewEdit.phoneNumber', {
                  number: contact.id,
                })}
                initialPhone={contact.phone}
                initialPrefix={contact.prefix}
                onCheckIfValid={setIsPhoneValid}
                onChangePhoneNumber={setPhoneData}
                onTouched={handlePhoneInputTouched}
              />
            </View>

            <Button
              variant={'solid'}
              disabled={!(isValid && isPhoneValid && (dirty || isPhoneTouched))}
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
