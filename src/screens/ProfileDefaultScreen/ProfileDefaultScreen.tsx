import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ProgressCircle} from 'react-native-svg-charts';
import {Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/core';

import {useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';

import Container from '~/components/Container';
import BottomButton from '~/components/BottomButton';

import PencilIcon from '~/assets/icons/PencilIcon';
import colors from '~/theme/colors';
import styles from './styles';

const ProfileDefaultScreen = () => {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const {user} = useAppSelector(userSelector);

  const handleEditProfile = useCallback(() => {
    navigate('ProfileEdit');
  }, [navigate]);

  const handleAddEditMedicalInfo = useCallback(() => {
    navigate('ProfileMedicalInfo');
  }, [navigate]);

  const progress = useMemo(
    () => (user.fillLevel !== undefined ? user.fillLevel / 100 : 0),
    [user.fillLevel],
  );

  return (
    <Container
      type={'static'}
      title={t('profileDefault.title')}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.topContainer}>
        <View style={styles.infoContainer}>
          <Text fontSize="3xl">{user.fillLevel}%</Text>
          <Text fontSize="xl">{t('profileDefault.medicalInfo')}</Text>
        </View>
        <ProgressCircle
          style={styles.progressCircle}
          progress={progress}
          progressColor={colors.green[600]}
          startAngle={-90}
          strokeWidth={15}
        />
      </View>
      <BottomButton
        leftIcon={<PencilIcon />}
        title={t('profileDefault.editProfile')}
        onPress={handleEditProfile}
      />

      <BottomButton
        leftIcon={<PencilIcon />}
        title={t('profileDefault.EditAddMedicalInfo')}
        onPress={handleAddEditMedicalInfo}
        withBottomBorder
      />
    </Container>
  );
};

export default ProfileDefaultScreen;
