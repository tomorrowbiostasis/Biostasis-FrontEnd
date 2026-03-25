import React from 'react';
import Container from '~/components/Container';
import EmergencyContactsList from './components/EmergencyContactsList';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from './styles';
import Documents from './components/Documents';
import EmergencyMessage from './components/EmergencyMessage/EmergencyMessage';
import {Box} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const EmergencyContactsSettingsScreen = () => {
  const {t} = useAppTranslation();

  return (
    <Container
      title={t('emergencyContactsSettings.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      disableWrapper
      showBackIcon
      showDrawerIcon>
      <Box style={styles.curveElement} />
      
      <KeyboardAwareScrollView
        bounces={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardOpeningTime={0}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
        <EmergencyContactsList />
        <Documents />
        <EmergencyMessage />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default EmergencyContactsSettingsScreen;
