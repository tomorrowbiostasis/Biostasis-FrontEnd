import React, {FC, useCallback, useState} from 'react';
import {View} from 'react-native';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useAddNewEmergencyContactValidationSchema} from '~/services/Validation.service';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import FormInput from '~/components/FormInput';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {getVisibleFormError} from '~/utils';

import styles from '../styles';
import {AddNewEmergencyContactFormFields} from '../AddNewEmergencyContactScreen';

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
    <Formik<AddNewEmergencyContactFormFields>
      initialValues={{
        firstName: contact.name,
        lastName: contact.surname,
        email: contact.email,
      }}
      onSubmit={handleEditPress}
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
        submitCount,
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
            errorMessage={getVisibleFormError({
              error: errors.email,
              submitCount,
              touched: touched.email,
              value: values.email,
            })}
          />
          <PhoneNumberPicker
            variant="figma"
            label={t('emergencyContactsSettings.addNewEdit.phoneNumber')}
            placeholder={t(
              'emergencyContactsSettings.addNewEdit.phonePlaceholder',
            )}
            initialPhone={contact.phone}
            initialPrefix={contact.prefix}
            onCheckIfValid={setIsPhoneValid}
            onChangePhoneNumber={setPhoneData}
            onTouched={handlePhoneInputTouched}
          />

          <View style={styles.buttonWrap}>
            <AnimatedSubmitButton
              variant={'figmaFormPrimary' as never}
              disabled={
                !(isValid && isPhoneValid && (dirty || isPhoneTouched))
              }
              onPress={() => handleSubmit()}>
              {t('emergencyContactsSettings.saveChanges')}
            </AnimatedSubmitButton>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  );
};
