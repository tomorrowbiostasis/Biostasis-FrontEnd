import React, {FC, useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';

import FormInput from '~/components/FormInput';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {useAddNewEmergencyContactValidationSchema} from '~/services/Validation.service';
import {getVisibleFormError} from '~/utils';
import {semanticColors, typography} from '~/theme/tokens';

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

interface EmergencyContactFormCardProps {
  contact?: IEmergencyContactResponse | null;
  onCancel: () => void;
  onSubmit: (contact: IEmergencyContact) => void;
}

const EmergencyContactFormCard: FC<EmergencyContactFormCardProps> = ({
  contact,
  onCancel,
  onSubmit,
}) => {
  const {t} = useAppTranslation();
  const validationSchema = useAddNewEmergencyContactValidationSchema();
  const [phoneData, setPhoneData] = useState<IPhoneNumber>();
  const [isPhoneValid, setIsPhoneValid] = useState(
    !!(contact?.phone || contact?.prefix),
  );
  const [isPhoneTouched, setIsPhoneTouched] = useState(false);
  const isEditing = !!contact;

  const initialValues = useMemo(
    () => ({
      firstName: contact?.name || '',
      lastName: contact?.surname || '',
      email: contact?.email || '',
    }),
    [contact?.email, contact?.name, contact?.surname],
  );

  const handleSubmit = useCallback(
    ({firstName, lastName, email}: ContactFormValues) => {
      const nextContact: IEmergencyContact = {
        name: firstName,
        surname: lastName,
        email,
        active: contact?.active ?? true,
      };

      if (phoneData?.phone) {
        nextContact.phone = phoneData.phone;
        nextContact.prefix = phoneData.prefix;
        nextContact.countryCode = phoneData.countryCode;
      } else if (!isEditing) {
        nextContact.phone = '';
        nextContact.prefix = 0;
        nextContact.countryCode = '';
      }

      onSubmit(nextContact);
    },
    [contact?.active, isEditing, onSubmit, phoneData],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {isEditing
          ? t('emergencyContactsSettings.editEmergencyContact')
          : t('emergencyContactsSettings.AddNewEmergencyContact')}
      </Text>

      <Formik<ContactFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
        enableReinitialize>
        {({
          handleBlur,
          handleChange,
          handleSubmit: submitForm,
          values,
          touched,
          errors,
          isValid,
          dirty,
          submitCount,
        }) => {
          const canSubmit = isEditing
            ? isValid && isPhoneValid && (dirty || isPhoneTouched)
            : isValid && dirty && isPhoneValid;

          return (
            <View style={styles.form}>
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
                  errors.lastName && touched.lastName
                    ? errors.lastName
                    : undefined
                }
              />
              <FormInput
                label={t('emergencyContactsSettings.addNewEdit.email')}
                placeholder={t(
                  'emergencyContactsSettings.addNewEdit.emailPlaceholder',
                )}
                type="email"
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
                initialPhone={contact?.phone}
                initialPrefix={contact?.prefix}
                onCheckIfValid={setIsPhoneValid}
                onChangePhoneNumber={setPhoneData}
                onTouched={() => setIsPhoneTouched(true)}
              />
              <View style={styles.actions}>
                <AnimatedSubmitButton
                  variant={'figmaFormSecondary' as never}
                  disabled={false}
                  style={styles.secondaryAction}
                  onPress={onCancel}>
                  {t('common.cancel')}
                </AnimatedSubmitButton>
                <AnimatedSubmitButton
                  variant={'figmaFormPrimary' as never}
                  disabled={!canSubmit}
                  style={styles.primaryAction}
                  onPress={() => submitForm()}>
                  {t('emergencyContactsSettings.saveChanges')}
                </AnimatedSubmitButton>
              </View>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#DDE6EF',
    borderRadius: 18,
  },
  title: {
    ...typography.rowTitle,
    color: semanticColors.primary,
    fontSize: 18,
    lineHeight: 24,
  },
  form: {
    gap: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 6,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
  },
});

export default EmergencyContactFormCard;
