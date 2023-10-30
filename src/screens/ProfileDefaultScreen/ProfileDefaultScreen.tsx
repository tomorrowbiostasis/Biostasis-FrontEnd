import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/core';
import Container from '~/components/Container';
import styles from './styles';
import {Screens} from '~/models/Navigation.model';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ProfileDefaultScreen = () => {
  const {t} = useTranslation();
  const {navigate} = useNavigation();

  const handleEditProfile = useCallback(() => {
    navigate(Screens.ProfileEdit as never);
  }, [navigate]);

  const handleAddEditMedicalInfo = useCallback(() => {
    navigate(Screens.ProfileMedicalInfo as never);
  }, [navigate]);

  const handleAccountSettings = useCallback(() => {
    navigate(Screens.AccountSettings as never);
  }, [navigate]);

  return (
    <Container
      title={t('profileDefault.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      disableWrapper
      showBackIcon
      showDrawerIcon>
      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
        <TouchableOpacity style={styles.panel} onPress={handleEditProfile}>
          <View style={styles.panelHeader}>
            <IconAntDesign name={'profile'} size={26} style={styles.icon} />
            <Text fontSize={'md'} fontWeight={700}>
              {t('profileDefault.editProfile.title')}
            </Text>
          </View>
          <View style={styles.lineStyle} />
          <View style={styles.panelBody}>
            <Text fontSize={'sm'}>
              {t('profileDefault.editProfile.description')}
            </Text>
          </View>
          <View style={styles.panelFooter}>
            <Text style={styles.footerText}>
              {t('profileDefault.editProfile.footer')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.panel} onPress={handleAccountSettings}>
          <View style={styles.panelHeader}>
            <IconMaterialCommunityIcons
              name={'account-settings-outline'}
              size={26}
              style={styles.icon}
            />
            <Text fontSize={'md'} fontWeight={700}>
              {t('profileDefault.accountSettings.title')}
            </Text>
          </View>
          <View style={styles.lineStyle} />
          <View style={styles.panelBody}>
            <Text fontSize={'sm'}>
              {t('profileDefault.accountSettings.description')}
            </Text>
          </View>
          <View style={styles.panelFooter}>
            <Text style={styles.footerText}>
              {t('profileDefault.accountSettings.footer')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.panel}
          onPress={handleAddEditMedicalInfo}>
          <View style={styles.panelHeader}>
            <IconMaterialCommunityIcons
              name={'medical-bag'}
              size={26}
              style={styles.icon}
            />
            <Text fontSize={'md'} fontWeight={700}>
              {t('profileDefault.medicalInfo.title')}
            </Text>
          </View>
          <View style={styles.lineStyle} />
          <View style={styles.panelBody}>
            <Text fontSize={'sm'}>
              {t('profileDefault.medicalInfo.description')}
            </Text>
          </View>
          <View style={styles.panelFooter}>
            <Text style={styles.footerText}>
              {t('profileDefault.medicalInfo.footer')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default ProfileDefaultScreen;
