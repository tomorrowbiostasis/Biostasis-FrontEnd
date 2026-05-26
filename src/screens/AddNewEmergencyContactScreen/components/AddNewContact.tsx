import React, {FC, useCallback, useState} from 'react';
import {View} from 'react-native';
import {Button} from 'native-base';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useAddNewEmergencyContactValidationSchema} from '~/services/Validation.service';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import FormInput from '~/components/FormInput';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';
import {IEmergencyContact} from '~/redux/emergencyContacts/emergencyContacts.slice';

import styles from '../styles';
import {AddNewEmergencyContactFormFields} from '../AddNewEmergencyContactScreen';

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
    <Formik<AddNewEmergencyContactFormFields>
      initialValues={{firstName: '', lastName: '', email: ''}}
      onSubmit={handleSavePress}
      validationSchema={AddNewEmergencyContactValidationSchema}
      validateOnChange>
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
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid
          extraScrollHeight={20}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <FormInput
            label={t('emergencyContactsSettings.addNewEdit.firstName')}
            placeholder={t(
              'emergencyContactsSettings.addNewEdit.firstNamePlaceholder',
            )}
            value={values.firstName}
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            errorMessage={
              errors.firstName && touched.firstName
                ? errors.firstName
                : undefined
            }
          />
          <FormInput
            label={t('emergencyContactsSettings.addNewEdit.lastName')}
            placeholder={t(
              'emergencyContactsSettings.addNewEdit.lastNamePlaceholder',
            )}
            value={values.lastName}
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            errorMessage={
              errors.lastName && touched.lastName ? errors.lastName : undefined
            }
          />
          <FormInput
            label={t('emergencyContactsSettings.addNewEdit.email')}
            placeholder={t(
              'emergencyContactsSettings.addNewEdit.emailPlaceholder',
            )}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            errorMessage={
              errors.email && touched.email ? errors.email : undefined
            }
          />
          <PhoneNumberPicker
            variant="figma"
            label={t('emergencyContactsSettings.addNewEdit.phoneNumber')}
            onCheckIfValid={setIsPhoneValid}
            onChangePhoneNumber={setPhoneData}
          />

          <View style={styles.buttonWrap}>
            <Button
              variant={'figmaPrimary' as never}
              isDisabled={!isValid || !dirty || !isPhoneValid}
              onPress={() => handleSubmit()}>
              {t('emergencyContactsSettings.saveChanges')}
            </Button>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  );
};
