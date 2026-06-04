import React, {useCallback} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Screens} from '~/models/Navigation.model';
import ScreenHeader from '~/components/ScreenHeader';
import SystemCard from '~/components/SystemCard';
import {
  BioProfileFillBook,
  BioProfileFillHeartbeat,
  BioProfileFillRadioSignal,
  BioProfileFillShield,
  BioProfileFillUser,
} from '~/assets/icons/BiostasisIcons';
import styles from './styles';

const ProfileDefaultScreen = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  const go = useCallback(
    (screen: Screens) => () => navigate(screen as never),
    [navigate],
  );

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('profileHub.title')} showBack={false} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {paddingBottom: tabBarHeight + 12},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('profileHub.sections.account.title')}
            </Text>
            <Text style={styles.sectionDescription}>
              {t('profileHub.sections.account.description')}
            </Text>
          </View>
          <View style={styles.group}>
            <SystemCard
              chip={<BioProfileFillUser />}
              title={t('profileHub.userData')}
              right="chevron"
              onPress={go(Screens.ProfileEdit)}
            />
            <SystemCard
              chip={<BioProfileFillRadioSignal />}
              title={t('profileHub.accountSettings')}
              right="chevron"
              onPress={go(Screens.AccountSettings)}
            />
            <SystemCard
              chip={<BioProfileFillShield />}
              title={t('profileHub.medicalInfo')}
              right="chevron"
              onPress={go(Screens.ProfileMedicalInfo)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('profileHub.sections.health.title')}
            </Text>
            <Text style={styles.sectionDescription}>
              {t('profileHub.sections.health.description')}
            </Text>
          </View>
          <View style={styles.group}>
            <SystemCard
              chip={<BioProfileFillHeartbeat />}
              title={t('profileHub.currentHealthLog')}
              right="chevron"
              onPress={go(Screens.CurrentHealthLog)}
            />
            <SystemCard
              chip={<BioProfileFillBook />}
              title={t('profileHub.historyLogs')}
              right="chevron"
              onPress={go(Screens.HistoryLogs)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileDefaultScreen;
