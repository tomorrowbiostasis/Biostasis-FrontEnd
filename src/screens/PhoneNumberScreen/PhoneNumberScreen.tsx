import {Button, Text, View} from 'native-base';
import React, {useCallback, useState} from 'react';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import Container from '~/components/Container';

import styles from './styles';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';

import {useNavigation} from '@react-navigation/core';
import {updateUser} from '~/redux/user/thunks';
import {userLoading, userSelector} from '~/redux/user/selectors';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';
import {Screens} from '~/models/Navigation.model';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const PhoneNumberScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const [phoneData, setPhoneData] = useState<IPhoneNumber>();
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const pending = useAppSelector(userLoading);

  const handleContinuePress = useCallback(() => {
    dispatch(
      updateUser({
        phone: phoneData?.phone,
        prefix: phoneData?.prefix,
        countryCode: phoneData?.countryCode,
      }),
      //@ts-ignore
    ).then((response: {error: string}) => {
      if (!response.error) {
        navigate(Screens.UserDateOfBirth as never);
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
      containerStyle={styles.container}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.panel}>
        <Text style={styles.userName}>
          {t('common.welcome', {username: user.name || 'user'})}
        </Text>
        <View style={styles.panelHeader}>
          <IconMaterialCommunityIcons
            name={'phone'}
            size={26}
            style={styles.icon}
          />
          <Text fontSize={'md'} fontWeight={700}>
            {t('userPhone.title')}
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.panelBody}>
          <PhoneNumberPicker
            onCheckIfValid={setIsPhoneValid}
            onChangePhoneNumber={setPhoneData}
            onSubmit={handleContinuePress}
          />
          <Button
            variant={'solid'}
            disabled={!isPhoneValid || pending}
            isLoading={pending}
            style={styles.submitButton}
            onPress={handleContinuePress}>
            {t('common.continue')}
          </Button>
        </View>
      </View>
    </Container>
  );
};
export default PhoneNumberScreen;
