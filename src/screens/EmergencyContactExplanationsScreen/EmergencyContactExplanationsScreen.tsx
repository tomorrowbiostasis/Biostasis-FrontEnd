import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'native-base';
import ScreenHeader from '~/components/ScreenHeader';

import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Screens} from '~/models/Navigation.model';

const EmergencyContactExplanationsScreen = () => {
  const {t} = useAppTranslation();
  const {dispatch} = useNavigation();

  const handleSetUpPress = useCallback(() => {
    dispatch((state: any) => {
      const newRoutes = [
        ...state.routes.slice(0,-1),
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
    <View style={styles.root}>
      <ScreenHeader title={t('emergencyContactsSettings.title')} />
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>
            {t('emergencyContactsSettings.explanations.description1')}
          </Text>
          <Text style={styles.text}>
            {t('emergencyContactsSettings.explanations.description2')}
          </Text>
        </View>
        <Button onPress={handleSetUpPress}>{t('common.setUp')}</Button>
      </View>
    </View>
  );
};

export default EmergencyContactExplanationsScreen;
