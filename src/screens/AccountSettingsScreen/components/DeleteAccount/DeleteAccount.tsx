import React, {useCallback} from 'react';
import {Button, Text, View} from 'native-base';

import {clearDataAndSignOut} from '~/redux/store/utils';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch} from '~/redux/store/hooks';
import {deleteUser} from '~/redux/user/thunks';
import ToastService from '~/services/Toast.service';
import {ClearDataTypes} from '~/services/ClearData.types';
import colors from '~/theme/colors';
import {Alert} from 'react-native';

const DeleteAccount = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(() => {
    Alert.alert(
      t('accountSettings.deleteAccount.title'),
      t('accountSettings.deleteAccount.confirmMessage'),
      [
        {
          text: t('common.no'),
        },
        {
          text: t('common.yes'),
          onPress: () => {
            dispatch(deleteUser()).then(async () => {
              try {
                await clearDataAndSignOut(ClearDataTypes.DELETE);
                ToastService.success(
                  t('accountSettings.deleteAccount.successMessage'),
                );
              } catch (error: any) {
                console.log(error.message);
              }
            });
          },
        },
      ],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <View>
      <Text fontSize={'sm'} color={colors.gray[600]}>
        {t('accountSettings.deleteAccount.description')}
      </Text>

      <Button variant={'solid'} mt={5} disabled={false} onPress={handleDelete}>
        {t('common.confirm')}
      </Button>
    </View>
  );
};

export default DeleteAccount;
