import React, {useCallback} from 'react';
import {ScrollView, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Screens} from '~/models/Navigation.model';
import ScreenHeader from '~/components/ScreenHeader';
import SystemCard from '~/components/SystemCard';
import IconChip from '~/components/IconChip';
import {
  UserIcon,
  BroadcastIcon,
  ShieldIcon,
  HeartPulseIcon,
  HeartHalfIcon,
} from '~/assets/icons/AppIcons';
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
        <View style={styles.group}>
          <SystemCard
            chip={
              <IconChip background="#0D1B2A" size={40} radius={12}>
                <UserIcon size={20} color="#FFFFFF" />
              </IconChip>
            }
            title={t('profileHub.userData')}
            right="chevron"
            onPress={go(Screens.ProfileEdit)}
          />
          <SystemCard
            chip={
              <IconChip background="rgba(251, 188, 5, 0.15)" size={40} radius={12}>
                <BroadcastIcon size={20} color="#B7791F" />
              </IconChip>
            }
            title={t('profileHub.accountSettings')}
            right="chevron"
            onPress={go(Screens.AccountSettings)}
          />
          <SystemCard
            chip={
              <IconChip background="#EFF3FE" size={40} radius={12}>
                <ShieldIcon size={20} color="#2D6BE4" />
              </IconChip>
            }
            title={t('profileHub.medicalInfo')}
            right="chevron"
            onPress={go(Screens.ProfileMedicalInfo)}
          />
        </View>

        <View style={styles.group}>
          <SystemCard
            chip={
              <IconChip background="#D6F5EA" size={40} radius={12}>
                <HeartPulseIcon size={20} color="#1E9B6B" />
              </IconChip>
            }
            title={t('profileHub.currentHealthLog')}
            right="chevron"
            onPress={go(Screens.CurrentHealthLog)}
          />
          <SystemCard
            chip={
              <IconChip
                background="rgba(245, 166, 35, 0.25)"
                size={40}
                radius={12}>
                <HeartHalfIcon size={20} color="#B7791F" />
              </IconChip>
            }
            title={t('profileHub.historyLogs')}
            right="chevron"
            onPress={go(Screens.HistoryLogs)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileDefaultScreen;
