import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {clearDataAndSignOut} from '~/redux/store/utils';
import {accountSettingsSelector} from '~/redux/user/selectors';
import {updateUser} from '~/redux/user/thunks';

import BottomButton from '~/components/BottomButton';
import Container from '~/components/Container';
import SwitchButton from '~/components/SwitchButton';

import LogoutIcon from '~/assets/icons/LogoutIcon';
import TrashIcon from '~/assets/icons/TrashIcon';
import WiFiIcon from '~/assets/icons/WiFiIcon';

import styles from './styles';
import {ClearDataTypes} from '~/services/ClearData.types';

const AccountSettingsScreen = () => {
  const {t} = useAppTranslation();
  const accountSettings = useAppSelector(accountSettingsSelector);
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();

  const handleAllowNotificationsSwitchPress = useCallback(
    (value: boolean) => {
      dispatch(updateUser({allowNotifications: value}));
    },
    [dispatch],
  );

  const handleReceiveTipsAndTricksSwitchPress = useCallback(
    (value: boolean) => {
      dispatch(updateUser({tipsAndTricks: value}));
    },
    [dispatch],
  );

  const navigateToGDPR = useCallback(() => {
    navigate('GDPR');
  }, [navigate]);

  const navigateToDeleteAccount = useCallback(() => {
    navigate('DeleteAccount');
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    await clearDataAndSignOut(ClearDataTypes.LOGOUT);
  }, []);

  return (
    <Container
      title={t('accountSettings.title')}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.switchesContainer}>
        <SwitchButton
          containerStyle={styles.switchContainer}
          value={accountSettings.allowNotifications}
          title={t('accountSettings.allowNotifications')}
          onSwitchPress={handleAllowNotificationsSwitchPress}
        />
        <SwitchButton
          containerStyle={styles.switchContainer}
          value={accountSettings.tipsAndTricks}
          title={t('accountSettings.receiveTipsAndTricks')}
          onSwitchPress={handleReceiveTipsAndTricksSwitchPress}
        />
      </View>
      <View>
        <BottomButton
          title={t('accountSettings.requestSavedData')}
          leftIcon={<WiFiIcon />}
          onPress={navigateToGDPR}
        />
        <BottomButton
          title={t('accountSettings.deleteAccount')}
          leftIcon={<TrashIcon />}
          onPress={navigateToDeleteAccount}
        />
        <BottomButton
          title={t('common.logOut')}
          leftIcon={<LogoutIcon />}
          withBottomBorder
          onPress={handleSignOut}
        />
      </View>
    </Container>
  );
};

export default AccountSettingsScreen;
