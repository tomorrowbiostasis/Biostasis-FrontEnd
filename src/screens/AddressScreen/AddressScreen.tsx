import React, {useCallback, useState} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import {Spinner} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

import StepIndicator from '~/components/StepIndicator';
import FormInput from '~/components/FormInput';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {ArrowLeftIcon} from '~/assets/icons/AppIcons';
import {BioLogInSignUpMapPin} from '~/assets/icons/BiostasisIcons';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {updateUser} from '~/redux/user/thunks';
import {setSetupCompletePending} from '~/redux/user/user.slice';
import {userLoading} from '~/redux/user/selectors';
import {useUserAddressValidationSchema} from '~/services/Validation.service';
import {Screens} from '~/models/Navigation.model';
import {getLocation} from '~/services/Location.service';
import ToastService from '~/services/Toast.service';
import {semanticColors} from '~/theme/tokens';

import styles from './styles';

type AddressFormFields = {
  street: string;
  city: string;
  country: string;
  zipCode: string;
};

const initialValues: AddressFormFields = {
  street: '',
  city: '',
  country: '',
  zipCode: '',
};

export const AddressScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate, goBack, canGoBack} = useNavigation();
  const userAddressValidationSchema = useUserAddressValidationSchema();
  const pending = useAppSelector(userLoading);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleBack = useCallback(() => {
    if (canGoBack()) {
      goBack();
    }
  }, [canGoBack, goBack]);

  const reverseGeoCode = async () => {
    try {
      const geoPosition = await getLocation();
      const {latitude, longitude} = geoPosition.coords;

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = response.data;
      return data.address;
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  const handleCurrentLocation = useCallback(
    async (
      applyAddress: (address: AddressFormFields) => Promise<void> | void,
    ) => {
      try {
        setIsLoadingLocation(true);
        const address = await reverseGeoCode();
        if (address) {
          await applyAddress({
            street:
              [
                address.road,
                address.house_number,
              ]
                .filter(Boolean)
                .join(' ')
                .trim() ||
              address.pedestrian ||
              '',
            city:
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.county ||
              address.state ||
              '',
            country: address.country || '',
            zipCode: address.postcode || '',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingLocation(false);
      }
    },
    [],
  );

  const handleContinuePress = useCallback(
    async (userAddress: AddressFormFields) => {
      try {
        const {street, city, country, zipCode} = userAddress;
        const address = `${street}, ${city}, ${country}, ${zipCode}`;
        dispatch(setSetupCompletePending(true));
        dispatch(updateUser({address}));
        navigate(Screens.SetupComplete as never);
      } catch (error) {
        ToastService.error(t('userAddress.wrongAddress'));
      }
    },
    [dispatch, navigate, t],
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <StepIndicator total={3} currentIndex={2} />
      </SafeAreaView>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <Text style={styles.eyebrow}>
          {t('signUp.steps.eyebrow', {current: 3, total: 3})}
        </Text>
        <Text style={styles.title}>{t('userAddress.title')}</Text>
        <Text style={styles.subtitle}>{t('userAddress.subtitle')}</Text>

        <Formik<AddressFormFields>
          initialValues={initialValues}
          onSubmit={handleContinuePress}
          validationSchema={userAddressValidationSchema}
          validateOnChange>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setTouched,
            setValues,
            validateForm,
            values,
            touched,
            errors,
          }) => {
            const canSubmit =
              !!values.street &&
              !!values.city &&
              !!values.country &&
              !!values.zipCode &&
              !errors.street &&
              !errors.city &&
              !errors.country &&
              !errors.zipCode &&
              !pending;

            return (
              <>
                <Pressable
                  onPress={() =>
                    handleCurrentLocation(async nextAddress => {
                      setValues(nextAddress, false);
                      setTouched(
                        {
                          street: true,
                          city: true,
                          country: true,
                          zipCode: true,
                        },
                        false,
                      );
                      await validateForm(nextAddress);
                    })
                  }
                  style={styles.locationPill}
                  disabled={isLoadingLocation}>
                  {isLoadingLocation ? (
                    <Spinner color={semanticColors.info} size="small" />
                  ) : (
                    <>
                      <BioLogInSignUpMapPin size={20} />
                      <Text style={styles.locationPillText}>
                        {t('userAddress.currentLocation')}
                      </Text>
                    </>
                  )}
                </Pressable>

                <FormInput
                  label={t('userAddress.street')}
                  onChangeText={handleChange('street')}
                  onBlur={handleBlur('street')}
                  value={values.street}
                  errorMessage={
                    errors.street && touched.street
                      ? errors.street
                      : undefined
                  }
                />

                <View style={styles.row}>
                  <View style={styles.rowCityCol}>
                    <FormInput
                      label={t('userAddress.city')}
                      onChangeText={handleChange('city')}
                      onBlur={handleBlur('city')}
                      value={values.city}
                      errorMessage={
                        errors.city && touched.city ? errors.city : undefined
                      }
                    />
                  </View>
                  <View style={styles.rowZipCol}>
                    <FormInput
                      label={t('userAddress.zipCode')}
                      keyboardType="numeric"
                      onChangeText={handleChange('zipCode')}
                      onBlur={handleBlur('zipCode')}
                      value={values.zipCode}
                      errorMessage={
                        errors.zipCode && touched.zipCode
                          ? errors.zipCode
                          : undefined
                      }
                    />
                  </View>
                </View>

                <FormInput
                  label={t('userAddress.country')}
                  onChangeText={handleChange('country')}
                  onBlur={handleBlur('country')}
                  value={values.country}
                  errorMessage={
                    errors.country && touched.country
                      ? errors.country
                      : undefined
                  }
                />

                <View style={styles.footerRow}>
                  <Pressable
                    onPress={handleBack}
                    style={styles.backChip}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Back">
                    <ArrowLeftIcon size={18} color={semanticColors.primary} />
                  </Pressable>
                  <AnimatedSubmitButton
                    variant={'figmaFormPrimary' as never}
                    style={styles.submitButton}
                    flex={1}
                    disabled={!canSubmit}
                    isLoading={pending}
                    onPress={() => handleSubmit()}>
                    {`${t('signUp.common.next')}  →`}
                  </AnimatedSubmitButton>
                </View>
              </>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddressScreen;
