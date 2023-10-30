import React, {useCallback, useState} from 'react';
import {Button, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {userLoading, userSelector} from '~/redux/user/selectors';
import {updateUser} from '~/redux/user/thunks';

import Container from '~/components/Container';

import styles from './styles';
import {MaskedDateInput} from './components/MaskedDateInput/MaskedDateInput';
import {Screens} from '~/models/Navigation.model';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

export const DateOfBirthScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(userSelector);
  const {navigate} = useNavigation();
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [isDateValid, setIsDateValid] = useState(false);
  const pending = useAppSelector(userLoading);

  const handleContinuePress = useCallback(() => {
    dispatch(
      updateUser({
        dateOfBirth,
      }),
    );
    navigate(Screens.UserAddress as never);
  }, [dateOfBirth, dispatch, navigate]);

  return (
    <Container
      containerStyle={styles.container}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.panel}>
        <Text style={styles.userName}>
          {t('common.welcome', {username: user.name || 'user'})}
        </Text>
        <View style={styles.panelHeader}>
          <IconFontAwesome
            name={'birthday-cake'}
            size={26}
            style={styles.icon}
          />
          <Text fontSize={'md'} fontWeight={700}>
            {t('userDateOfBirth.title')}
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.panelBody}>
          <MaskedDateInput
            onChangeValue={setDateOfBirth}
            onChangeValidation={setIsDateValid}
            onSubmit={handleContinuePress}
            type="birth"
          />
          <Button
            variant={'solid'}
            disabled={!isDateValid || pending}
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
export default DateOfBirthScreen;
