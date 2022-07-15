import {useNetInfo} from '@react-native-community/netinfo';
import React, {useCallback, useState, VFC} from 'react';
import {Button, Modal, Text, View} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import SoundService from '~/services/Alert.service';

import styles from './styles';

const LostConnectionScreen: VFC = () => {
  const {t} = useAppTranslation();
  const {reset} = useNavigation();
  const [isOpen, setIsOpen] = useState(true);
  const {isConnected, type} = useNetInfo();

  const handleConfirm = useCallback(async () => {
    SoundService.resetAllSounds();
    if (isConnected && type !== 'unknown') {
      setIsOpen(prev => !prev);
      reset({
        index: 0,
        routes: [{name: 'MainStack'}],
      });
    }
  }, [isConnected, reset, type]);

  return (
    <Modal isOpen={isOpen} style={styles.container}>
      <SafeAreaView style={styles.contentContainerStyle}>
        <View py={40} px={10} minHeight={50} width={'100%'}>
          <Text fontSize="2xl" textAlign="center">
            {t('lostConnection.text1')}
          </Text>
          <Text fontSize="2xl" textAlign="center" mt={10}>
            {t('lostConnection.text2')}
          </Text>
        </View>
        <View py={5} width={'100%'} px={10}>
          <Button
            style={styles.button}
            variant={'solid'}
            onPress={handleConfirm}>
            {t('common.ok')}
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default LostConnectionScreen;
