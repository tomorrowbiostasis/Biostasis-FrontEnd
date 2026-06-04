import React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import ScreenHeader from '~/components/ScreenHeader';
import EmergencyContactsList from './components/EmergencyContactsList';
import Documents from './components/Documents';
import EmergencyMessage from './components/EmergencyMessage/EmergencyMessage';
import styles from './styles';

const EmergencyContactsSettingsScreen = () => {
  const {t} = useAppTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('emergencyContactsSettings.title')} />
      <KeyboardAwareScrollView
        bounces={false}
        enableOnAndroid
        extraScrollHeight={76}
        enableResetScrollToCoords={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {paddingBottom: insets.bottom + 40},
        ]}
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback
          accessible={false}
          onPress={Keyboard.dismiss}>
          <View style={styles.contentInner}>
            <EmergencyContactsList />
            <Documents />
            <EmergencyMessage />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EmergencyContactsSettingsScreen;
