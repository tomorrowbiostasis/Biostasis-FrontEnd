import {useNetInfo} from '@react-native-community/netinfo';
import React, {useCallback, useEffect, useState, VFC} from 'react';
import {Button, Modal, Text, View} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import SoundService from '~/services/Alert.service';
import styles from './styles';
import colors from '~/theme/colors';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LostConnectionScreen: VFC = () => {
  const {t} = useAppTranslation();
  const {reset} = useNavigation();
  const [isOpen, setIsOpen] = useState(true);
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const {isConnected, type} = useNetInfo();

  const handleConfirm = useCallback(async () => {
    SoundService.resetAllSounds();
    //@ts-ignore
    if (isConnected && type !== 'unknown') {
      setIsOpen(prev => !prev);
      reset({
        index: 0,
        routes: [{name: 'MainStack'}],
      });
    }
  }, [isConnected, reset, type]);

  useEffect(() => {
    const handleAirplaneMode = async () => {
      setIsAirplaneMode(await DeviceInfo.isAirplaneMode());
    };
    handleAirplaneMode();
  }, []);

  return isConnected ? (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, backgroundColor: colors.gray[50]}} />
  ) : (
    <Modal isOpen={isOpen} style={styles.container}>
      <SafeAreaView style={styles.contentContainerStyle}>
        {isAirplaneMode ? (
          <>
            <IconMaterialIcons name={'airplanemode-off'} size={100} />
            <Text fontSize="3xl" bold textAlign="center" mt={20}>
              {t('airplaneMode.text1')}
            </Text>
            <Text fontSize="md" textAlign="center" mt={5}>
              {t('airplaneMode.text2')}
            </Text>
          </>
        ) : (
          <>
            <IconFeather name={'wifi-off'} size={100} />
            <Text fontSize="3xl" bold textAlign="center" mt={20}>
              {t('lostConnection.text1')}
            </Text>
            <Text fontSize="md" textAlign="center" mt={5}>
              {t('lostConnection.text2')}
            </Text>
          </>
        )}
        <View py={5} width={'100%'} mt={10}>
          <Button
            style={styles.button}
            variant={'solid'}
            onPress={handleConfirm}>
            {t('common.retry')}
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default LostConnectionScreen;
