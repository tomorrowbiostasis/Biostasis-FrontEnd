import React, {useCallback} from 'react';
import {Button, Text, View} from 'native-base';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Container from '~/components/Container';
import Input from '~/components/Input';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {updateUser} from '~/redux/user/thunks';
import {userSelector} from '~/redux/user/selectors';
import {useUserAddressValidationSchema} from '~/services/Validation.service';

import styles from './styles';

type AddressFormFields = {
  address: string;
};

export const AddressScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {reset} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const userAddressValidationSchema = useUserAddressValidationSchema();

  const handleContinuePress = useCallback(
    async ({address}: AddressFormFields) => {
      //TODO there is no error handling mechanism , add Notification.service.error for all update
      dispatch(
        updateUser({
          address,
        }),
      ).then(() => {
        /*
          Moved here because of race condition - we cannot reset navigation while Home is not available for Navigator yet
         */
        reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      });
    },
    [dispatch, reset],
  );
  return (
    <Container
      title={t('common.welcome', {username: user.name})}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text} fontSize={'xl'}>
            {t('userAddress.title')}
          </Text>
        </View>

        <Formik<AddressFormFields>
          initialValues={{address: ''}}
          onSubmit={handleContinuePress}
          validationSchema={userAddressValidationSchema}
          validateOnChange={true}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <>
              <View style={styles.space}>
                <Input
                  type="address"
                  label={t('userAddress.yourAddress')}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  placeholder={t('userAddress.placeholder')}
                  value={values.address}
                  errorMessage={
                    errors.address && touched.address
                      ? errors.address
                      : undefined
                  }
                  isValid={!errors.address && touched.address}
                />
              </View>
              <Button
                variant={'solid'}
                disabled={!!errors.address || !values.address}
                style={styles.submitButton}
                onPress={handleSubmit}>
                {t('common.continue')}
              </Button>
            </>
          )}
        </Formik>
      </View>
    </Container>
  );
};

export default AddressScreen;
