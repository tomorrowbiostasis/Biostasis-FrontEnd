import {useNetInfo} from '@react-native-community/netinfo';
import React, {useCallback, useEffect, useState, VFC} from 'react';
import {Modal} from 'native-base';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import SoundService from '~/services/Alert.service';
import {useAppSelector} from '~/redux/store/hooks';
import {isAuthed} from '~/redux/auth/selectors';
import {configSelector} from '~/redux/config/config.slice';
import {userInitializedSelector} from '~/redux/user/selectors';
import {navigationRef} from '~/navigators/navigationContainerRef';
import {getReconnectRootResetState} from '~/navigators/helper/rootReconnectNavigation';
import AlertScreen from '~/components/AlertScreen';
import {PlaneOffIcon, WifiOffIcon} from '~/assets/icons/AppIcons';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

const LostConnectionScreen: VFC = () => {
  const {t} = useAppTranslation();
  const {reset} = useNavigation();
  const [isOpen, setIsOpen] = useState(true);
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const {isConnected, type} = useNetInfo();
  const isLogged = useAppSelector(isAuthed);
  const {loadingInitData} = useAppSelector(configSelector);
  const isInitialized = useAppSelector(userInitializedSelector);

  const handleConfirm = useCallback(async () => {
    SoundService.resetAllSounds();
    //@ts-ignore
    if (isConnected && type !== 'unknown') {
      setIsOpen(prev => !prev);
      reset(
        getReconnectRootResetState({
          isLogged,
          loadingInitData,
          isInitialized,
          navigationReady: navigationRef.isReady(),
        }),
      );
    }
  }, [isConnected, isInitialized, isLogged, loadingInitData, reset, type]);

  useEffect(() => {
    const handleAirplaneMode = async () => {
      setIsAirplaneMode(await DeviceInfo.isAirplaneMode());
    };
    handleAirplaneMode();
  }, []);

  if (isConnected) {
    return <View style={styles.placeholder} />;
  }

  const icon = isAirplaneMode ? (
    <PlaneOffIcon size={44} color={semanticColors.warningStrong} />
  ) : (
    <WifiOffIcon size={44} color={semanticColors.warningStrong} />
  );

  const title = isAirplaneMode
    ? t('airplaneMode.text1')
    : t('lostConnection.text1');
  const description = isAirplaneMode
    ? t('airplaneMode.text2')
    : t('lostConnection.text2');

  return (
    <Modal isOpen={isOpen} style={styles.modal}>
      <AlertScreen
        tone="warning"
        icon={icon}
        title={title}
        description={description}
        primary={{
          label: t('common.retry'),
          onPress: handleConfirm,
          variant: 'figmaPrimary',
        }}
      />
    </Modal>
  );
};
export default LostConnectionScreen;
