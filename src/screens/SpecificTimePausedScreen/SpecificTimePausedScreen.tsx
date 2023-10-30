import React, {useLayoutEffect} from 'react';
import {ScrollView} from 'native-base';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useTimeFormat} from './hooks/UseTimeFormat.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';

import Container from '~/components/Container';
import {timeSlotPatchLoading} from '~/redux/automatedEmergency/selectors';

import styles from './styles';
import {getUser} from '~/redux/user/thunks';
import PauseEmergencyPanel from './components/PauseEmergencyPanel/PauseEmergencyPanel';
import SpecificTimesPanel from './components/SpecificTimesPanel/SpecificTimesPanel';
const SpecificTimesScreen = () => {
  // Needed here to get async timeFormatValue before usage
  useTimeFormat();
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(timeSlotPatchLoading);

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Container
      loading={loading}
      title={t('specificTimesScreen.title')}
      type="static"
      contentContainerStyle={styles.contentContainer}
      showBackIcon
      showDrawerIcon>
      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
        <PauseEmergencyPanel />
        <SpecificTimesPanel />
      </ScrollView>
    </Container>
  );
};

export default SpecificTimesScreen;
