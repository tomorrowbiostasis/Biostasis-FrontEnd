import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'native-base';
import Container from '~/components/Container';

import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Screens} from '~/models/Navigation.model';

const EmergencyContactExplanationsScreen = () => {
  const {t} = useAppTranslation();
  const {dispatch} = useNavigation();

  const handleSetUpPress = useCallback(() => {
    dispatch((state: any) => {
      state.routes.pop();

      const newRoutes = [
        ...state.routes,
        {name: Screens.AddNewEmergencyContact},
      ];
      return CommonActions.reset({
        ...state,
        routes: newRoutes,
        index: newRoutes.length - 1,
      });
    });
  }, [dispatch]);

  return (
    <Container
      title={t('emergencyContactsSettings.title')}
      contentContainerStyle={styles.container}
      showBackIcon
      showDrawerIcon>
      <View>
        <Text style={styles.text}>
          {t('emergencyContactsSettings.explanations.description1')}
        </Text>
        <Text style={styles.text}>
          {t('emergencyContactsSettings.explanations.description2')}
        </Text>
      </View>
      <Button onPress={handleSetUpPress}>{t('common.setUp')}</Button>
    </Container>
  );
};

export default EmergencyContactExplanationsScreen;
