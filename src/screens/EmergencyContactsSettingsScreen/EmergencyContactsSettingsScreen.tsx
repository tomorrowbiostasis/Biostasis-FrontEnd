import React from 'react';
import {ScrollView} from 'react-native';
import Container from '~/components/Container';
import EmergencyContactsList from './components/EmergencyContactsList';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from './styles';
import Documents from './components/Documents';
import EmergencyMessage from './components/EmergencyMessage/EmergencyMessage';
import {Box} from 'native-base';

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

      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
        <EmergencyContactsList />
        <Documents />
        <EmergencyMessage />
      </ScrollView>
    </Container>
  );
};

export default EmergencyContactsSettingsScreen;
