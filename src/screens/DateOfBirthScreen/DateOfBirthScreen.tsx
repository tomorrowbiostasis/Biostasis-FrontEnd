import React, {useCallback, useState} from 'react';
import {Button, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';
import {updateUser} from '~/redux/user/thunks';

import Container from '~/components/Container';

import styles from './styles';
import {MaskedDateInput} from './components/MaskedDateInput/MaskedDateInput';

export const DateOfBirthScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(userSelector);
  const {navigate} = useNavigation();
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [isDateValid, setIsDateValid] = useState(false);

  const handleContinuePress = useCallback(() => {
    dispatch(
      updateUser({
        dateOfBirth,
      }),
    );
    navigate('UserAddress');
  }, [dateOfBirth, dispatch, navigate]);

  return (
    <Container
      title={t('common.welcome', {username: user.name})}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.content}>
        <View style={styles.text}>
          <Text fontSize={'xl'}>{t('userDateOfBirth.title')}</Text>
        </View>
        <MaskedDateInput
          onChangeValue={setDateOfBirth}
          onChangeValidation={setIsDateValid}
          type="birth"
        />
        <Button
          variant={'solid'}
          disabled={!isDateValid}
          style={styles.submitButton}
          onPress={handleContinuePress}>
          {t('common.continue')}
        </Button>
      </View>
    </Container>
  );
};
export default DateOfBirthScreen;
