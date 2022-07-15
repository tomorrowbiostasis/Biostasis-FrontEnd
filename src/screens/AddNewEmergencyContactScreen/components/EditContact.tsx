import React, {FC, useCallback, useState} from 'react';
import {Button, View} from 'native-base';
import {Formik} from 'formik';

import {useAddNewEmergencyContactValidationSchema} from '~/services/Validation.service';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Input from '~/components/Input';

import styles from '../styles';
import {AddEmergencyContactFormFields} from '../AddNewEmergencyContactScreen';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';

interface IEditContactProps {
  contact: IEmergencyContactResponse;
  onSavePress: (contact: IEmergencyContact) => void;
  onDeletePress: () => void;
}

export const EditContact: FC<IEditContactProps> = ({
  contact,
  onDeletePress,
  onSavePress,
}) => {
  const {t} = useAppTranslation();
  const [phoneData, setPhoneData] = useState<IPhoneNumber>();
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneTouched, setIsPhoneTouched] = useState(false);

  const addNewEmergencyContactValidationSchema =
    useAddNewEmergencyContactValidationSchema();

  const handleEditPress = useCallback(
    ({firstName, lastName, email}: AddEmergencyContactFormFields) => {
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
      <Formik<AddEmergencyContactFormFields>
        initialValues={{
          firstName: contact.name,
          lastName: contact.surname,
          email: contact.email,
        }}
        onSubmit={handleEditPress}
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
                label={t('emergencyContacts.addNewEdit.firstName', {
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
                label={t('emergencyContacts.addNewEdit.lastName', {
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
                label={t('emergencyContacts.addNewEdit.email', {
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
                label={t('emergencyContacts.addNewEdit.phoneNumber', {
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
              variant={'outline'}
              style={styles.editButtons}
              onPress={onDeletePress}>
              {t('common.delete')}
            </Button>

            <Button
              variant={'solid'}
              disabled={!(isValid && isPhoneValid && (dirty || isPhoneTouched))}
              style={styles.editButtons}
              onPress={handleSubmit}>
              {t('common.save')}
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};
