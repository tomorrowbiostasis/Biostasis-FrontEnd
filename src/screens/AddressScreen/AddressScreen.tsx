import React, {useCallback, useState} from 'react';
import {Button, Spinner, Text, View} from 'native-base';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Container from '~/components/Container';
import Input from '~/components/Input';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {updateUser} from '~/redux/user/thunks';
import {userLoading, userSelector} from '~/redux/user/selectors';
import {useUserAddressValidationSchema} from '~/services/Validation.service';

import styles from './styles';
import {Screens} from '~/models/Navigation.model';
import IconEntypo from 'react-native-vector-icons/Entypo';
import ToastService from '~/services/Toast.service';
import {getLocation} from '~/services/Location.service';
import axios from 'axios';
import {TouchableOpacity} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '~/theme/colors';

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
  const {reset} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const userAddressValidationSchema = useUserAddressValidationSchema();
  const pending = useAppSelector(userLoading);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const reverseGeoCode = async () => {
    try {
      const geoPosition = await getLocation();
      const {latitude, longitude} = geoPosition.coords;

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = response.data;
      const addressComponents = data.address;

      return addressComponents;
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  const handleCurrentLocation = useCallback(async setFieldValue => {
    try {
      setIsLoadingLocation(true);
      const address = await reverseGeoCode();
      setFieldValue('street', address.road);
      setFieldValue('city', address.city);
      setFieldValue('country', address.country);
      setFieldValue('zipCode', address.postcode);
      setIsLoadingLocation(false);
    } catch (error) {
      setIsLoadingLocation(false);
      console.error(error);
    }
  }, []);

  const handleContinuePress = useCallback(
    async (userAddress: AddressFormFields) => {
      try {
        const {street, city, country, zipCode} = userAddress;
        const address = `${street}, ${city}, ${country}, ${zipCode}`;

        await dispatch(
          updateUser({
            address,
          }),
        ).then(() =>
          reset({
            index: 0,
            routes: [{name: Screens.Home as never}],
          }),
        );
      } catch (error) {
        ToastService.error(t('userAddress.wrongAddress'));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, reset],
  );

  return (
    <Container
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.panel}>
        <Text style={styles.userName}>
          {t('common.welcome', {username: user.name || 'user'})}
        </Text>
        <View style={styles.panelHeader}>
          <IconEntypo name={'location'} size={26} style={styles.icon} />
          <Text fontSize={'md'} textAlign={'center'} fontWeight={700}>
            {t('userAddress.title')}
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.panelBody}>
          <Formik<AddressFormFields>
            initialValues={initialValues}
            onSubmit={handleContinuePress}
            validationSchema={userAddressValidationSchema}
            validateOnChange={true}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              touched,
              errors,
            }) => (
              <>
                <View style={styles.panelFooter}>
                  <Input
                    type="street"
                    label={t('userAddress.street')}
                    onChangeText={handleChange('street')}
                    onBlur={handleBlur('street')}
                    mb={2}
                    onSubmitEditing={() => {
                      if (!errors.street) {
                        handleSubmit();
                      }
                    }}
                    value={values.street}
                    errorMessage={
                      errors.street && touched.street
                        ? errors.street
                        : undefined
                    }
                    isValid={!errors.street && touched.street}
                  />
                  <Input
                    type="city"
                    label={t('userAddress.city')}
                    onChangeText={handleChange('city')}
                    onBlur={handleBlur('city')}
                    mb={2}
                    onSubmitEditing={() => {
                      if (!errors.city) {
                        handleSubmit();
                      }
                    }}
                    value={values.city}
                    errorMessage={
                      errors.city && touched.city ? errors.city : undefined
                    }
                    isValid={!errors.city && touched.city}
                  />
                  <Input
                    type="country"
                    label={t('userAddress.country')}
                    onChangeText={handleChange('country')}
                    onBlur={handleBlur('country')}
                    mb={2}
                    onSubmitEditing={() => {
                      if (!errors.country) {
                        handleSubmit();
                      }
                    }}
                    value={values.country}
                    errorMessage={
                      errors.country && touched.country
                        ? errors.country
                        : undefined
                    }
                    isValid={!errors.country && touched.country}
                  />
                  <Input
                    type="zipCode"
                    keyboardType="numeric"
                    label={t('userAddress.zipCode')}
                    onChangeText={handleChange('zipCode')}
                    onBlur={handleBlur('zipCode')}
                    mb={2}
                    onSubmitEditing={() => {
                      if (!errors.zipCode) {
                        handleSubmit();
                      }
                    }}
                    value={values.zipCode}
                    errorMessage={
                      errors.zipCode && touched.zipCode
                        ? errors.zipCode
                        : undefined
                    }
                    isValid={!errors.zipCode && touched.zipCode}
                  />
                  <TouchableOpacity
                    onPress={() => handleCurrentLocation(setFieldValue)}
                    style={styles.getLocationBox}
                    disabled={isLoadingLocation}>
                    {isLoadingLocation ? (
                      <Spinner color={colors.white} size="small" />
                    ) : (
                      <>
                        <IconFontAwesome
                          name={'location-arrow'}
                          size={25}
                          color={colors.white}
                        />
                        <Text fontSize={'sm'} color={colors.white} ml={2}>
                          {t('userAddress.currentLocation')}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <Button
                  variant={'solid'}
                  disabled={
                    !!errors.street ||
                    !values.street ||
                    !!errors.city ||
                    !values.city ||
                    !!errors.country ||
                    !values.country ||
                    !!errors.zipCode ||
                    !values.zipCode ||
                    pending
                  }
                  isLoading={pending}
                  style={styles.submitButton}
                  onPress={() => handleSubmit()}>
                  {t('common.continue')}
                </Button>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Container>
  );
};

export default AddressScreen;
