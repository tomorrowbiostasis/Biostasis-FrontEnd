import React from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import ScreenHeader from '~/components/ScreenHeader';
import EmergencyContactsList from './components/EmergencyContactsList';
import Documents from './components/Documents';
import EmergencyMessage from './components/EmergencyMessage/EmergencyMessage';
import styles from './styles';

const EmergencyContactsSettingsScreen = () => {
  const {t} = useAppTranslation();

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('emergencyContactsSettings.title')} />
      <KeyboardAwareScrollView
        bounces={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardOpeningTime={0}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <EmergencyContactsList />
        <Documents />
        <EmergencyMessage />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EmergencyContactsSettingsScreen;
