import {Button, Text, View} from 'native-base';
import React, {useCallback, useState} from 'react';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Container from '~/components/Container';

import styles from './styles';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';

import {useNavigation} from '@react-navigation/core';
import {updateUser} from '~/redux/user/thunks';
import {userSelector} from '~/redux/user/selectors';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';

export const PhoneNumberScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const [phoneData, setPhoneData] = useState<IPhoneNumber>();
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handleContinuePress = useCallback(() => {
    dispatch(
      updateUser({
        phone: phoneData?.phone,
        prefix: phoneData?.prefix,
        countryCode: phoneData?.countryCode,
      }),
    ).then((response: {error: string}) => {
      if (!response.error) {
        navigate('UserDateOfBirth');
      }
    });
  }, [
    dispatch,
    navigate,
    phoneData?.countryCode,
    phoneData?.phone,
    phoneData?.prefix,
  ]);

  return (
    <Container
      title={t('common.welcome', {username: user.name || 'user'})}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.content}>
        <View style={styles.text}>
          <Text fontSize={'xl'}>{t('userPhone.title')}</Text>
        </View>
        <PhoneNumberPicker
          onCheckIfValid={setIsPhoneValid}
          onChangePhoneNumber={setPhoneData}
        />
        <Button
          variant={'solid'}
          disabled={!isPhoneValid}
          style={styles.submitButton}
          onPress={handleContinuePress}>
          {t('common.continue')}
        </Button>
      </View>
    </Container>
  );
};
export default PhoneNumberScreen;
