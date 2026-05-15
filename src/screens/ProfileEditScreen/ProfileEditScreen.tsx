import React, {useCallback, useMemo, useState} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import {Button} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/core';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {parsePhoneNumber} from 'react-phone-number-input';

import ScreenHeader from '~/components/ScreenHeader';
import FormInput from '~/components/FormInput';
import InlineCalendar from '~/components/InlineCalendar';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';
import {updateUser} from '~/redux/user/thunks';
import {IUser} from '~/redux/user/user.slice';
import {useEditProfileWithAddressValidationSchema} from '~/services/Validation.service';
import {Screens} from '~/models/Navigation.model';
import ToastService from '~/services/Toast.service';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

dayjs.extend(customParseFormat);

const DOB_FORMAT = 'DD/MM/YYYY';
const MIN_AGE = 18;

type ProfileFormFields = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
};

/** Best-effort split of the stored single `address` string. */
const splitAddress = (address?: string) => {
  const parts = (address || '').split(',').map(p => p.trim());
  if (parts.length >= 4) {
    return {
      street: parts[0],
      city: parts[1],
      country: parts[2],
      zipCode: parts.slice(3).join(', '),
    };
  }
  return {street: address || '', city: '', country: '', zipCode: ''};
};

const ProfileEditScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {goBack} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const validationSchema = useEditProfileWithAddressValidationSchema();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '');
  const [phoneData, setPhoneData] = useState<IPhoneNumber | undefined>({
    phone: user.phone || '',
    prefix: user.prefix || 0,
    countryCode:
      user.phone && user.prefix
        ? parsePhoneNumber(`+${user.prefix}${user.phone}`)?.country
        : '',
  });
  const [isPhoneValid, setIsPhoneValid] = useState(!!user.phone);

  const initialAddress = useMemo(
    () => splitAddress(user.address),
    [user.address],
  );

  const initialValues: ProfileFormFields = {
    firstName: user.name || '',
    lastName: user.surname || '',
    ...initialAddress,
  };

  const handleSave = useCallback(
    (values: ProfileFormFields) => {
      const address = `${values.street}, ${values.city}, ${values.country}, ${values.zipCode}`;
      const userToUpdate: IUser = {
        name: values.firstName,
        surname: values.lastName,
        address,
        prefix: phoneData?.prefix,
        phone: phoneData?.phone,
        dateOfBirth,
        countryCode: phoneData?.countryCode,
      };
      setIsSubmitted(true);
      // @ts-ignore - thunk dispatch typing
      dispatch(updateUser(userToUpdate)).then((response: {error: string}) => {
        setIsSubmitted(false);
        if (!response.error) {
          ToastService.success(t('user.updatedSuccessfully'));
          goBack();
        }
      });
    },
    [dispatch, goBack, phoneData, dateOfBirth, t],
  );

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('profileUserData.title')} />
      <Formik<ProfileFormFields>
        initialValues={initialValues}
        onSubmit={handleSave}
        validationSchema={validationSchema}
        validateOnChange>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
        }) => {
          const canSave =
            isValid && isPhoneValid && !!dateOfBirth && !isSubmitted;

          const fieldError = (field: keyof ProfileFormFields) =>
            errors[field] && touched[field] ? errors[field] : undefined;

          return (
            <KeyboardAwareScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              enableOnAndroid
              extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
              keyboardOpeningTime={0}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <FormInput
                label={t('profileEdit.firstName')}
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                errorMessage={fieldError('firstName')}
              />
              <FormInput
                label={t('profileEdit.lastName')}
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                errorMessage={fieldError('lastName')}
              />
              <FormInput
                label={t('userAddress.street')}
                value={values.street}
                onChangeText={handleChange('street')}
                onBlur={handleBlur('street')}
                errorMessage={fieldError('street')}
              />
              <View style={styles.row}>
                <View style={styles.rowCity}>
                  <FormInput
                    label={t('userAddress.city')}
                    value={values.city}
                    onChangeText={handleChange('city')}
                    onBlur={handleBlur('city')}
                    errorMessage={fieldError('city')}
                  />
                </View>
                <View style={styles.rowZip}>
                  <FormInput
                    label={t('userAddress.zipCode')}
                    keyboardType="numeric"
                    value={values.zipCode}
                    onChangeText={handleChange('zipCode')}
                    onBlur={handleBlur('zipCode')}
                    errorMessage={fieldError('zipCode')}
                  />
                </View>
              </View>
              <FormInput
                label={t('userAddress.country')}
                value={values.country}
                onChangeText={handleChange('country')}
                onBlur={handleBlur('country')}
                errorMessage={fieldError('country')}
              />

              <PhoneNumberPicker
                variant="figma"
                label={t('profileEdit.phoneNumber')}
                initialPhone={phoneData?.phone}
                initialPrefix={phoneData?.prefix}
                onChangePhoneNumber={setPhoneData}
                onCheckIfValid={setIsPhoneValid}
              />

              <View style={styles.dobBlock}>
                <Text style={styles.dobLabel}>
                  {t('userDateOfBirth.label')}
                </Text>
                <Pressable
                  onPress={() => setCalendarOpen(o => !o)}
                  style={styles.dobField}>
                  <Text
                    style={[
                      styles.dobValue,
                      !dateOfBirth && styles.dobPlaceholder,
                    ]}>
                    {dateOfBirth || t('userDateOfBirth.placeholder')}
                  </Text>
                  <IconMaterialCommunityIcons
                    name="calendar-blank-outline"
                    size={22}
                    color={semanticColors.info}
                  />
                </Pressable>
                {calendarOpen ? (
                  <InlineCalendar
                    value={
                      dateOfBirth
                        ? dayjs(dateOfBirth, DOB_FORMAT).toDate()
                        : null
                    }
                    maxDate={dayjs()
                      .subtract(MIN_AGE, 'year')
                      .endOf('day')
                      .toDate()}
                    onChange={d =>
                      setDateOfBirth(dayjs(d).format(DOB_FORMAT))
                    }
                  />
                ) : null}
              </View>

              <Button
                variant={'figmaPrimary' as never}
                h={50}
                mt={4}
                isDisabled={!canSave}
                isLoading={isSubmitted}
                onPress={() => handleSubmit()}>
                {t('profileUserData.save')}
              </Button>
            </KeyboardAwareScrollView>
          );
        }}
      </Formik>
    </View>
  );
};

export default ProfileEditScreen;
