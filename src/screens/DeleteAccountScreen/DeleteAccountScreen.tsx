import React, {useCallback, useEffect, useState} from 'react';
import {Button, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/core';

import {clearDataAndSignOut} from '~/redux/store/utils';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {deleteUser} from '~/redux/user/thunks';
import {gdprSelector} from '~/redux/gdpr/selectors';

import Container from '~/components/Container';

import styles from './styles';
import NotificationService from '~/services/NotificationService';
import {ClearDataTypes} from '~/services/ClearData.types';

const DeleteAccountScreen = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const {gdprStatus} = useAppSelector(gdprSelector);
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  const handleSubmit = useCallback(() => {
    setIsDeleteButtonVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsDeleteButtonVisible(false);
  }, []);

  const handleDelete = useCallback(() => {
    setAreButtonsDisabled(true);
    dispatch(deleteUser()).then(async () => {
      try {
        await clearDataAndSignOut(ClearDataTypes.DELETE);
        NotificationService.success(t('deleteAccount.successMessage'));
      } catch (error) {
        console.log(error.message);
      }
    });
  }, [dispatch, t]);

  useEffect(() => {
    if (gdprStatus === 'success') {
      navigate('AccountSettings', {showSuccessMessage: true});
    }
    if (gdprStatus === 'error') {
      NotificationService.error(t('gdpr.error'));
    }
  }, [gdprStatus, navigate, t]);

  return (
    <Container
      title={t('deleteAccount.title')}
      contentContainerStyle={styles.contentContainer}>
      <View>
        <Text style={styles.text}>{t('deleteAccount.description')}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {isDeleteButtonVisible ? (
          <>
            <Button
              variant={'outline'}
              disabled={areButtonsDisabled || false}
              style={styles.button}
              onPress={handleDelete}>
              {t('common.delete')}
            </Button>
            <Button
              variant={'solid'}
              disabled={areButtonsDisabled || false}
              style={styles.button}
              onPress={handleCancel}>
              {t('common.cancel')}
            </Button>
          </>
        ) : (
          <Button
            variant={'solid'}
            disabled={false}
            style={styles.button}
            onPress={handleSubmit}>
            {t('common.submit')}
          </Button>
        )}
      </View>
    </Container>
  );
};

export default DeleteAccountScreen;
