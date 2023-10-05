import {Text} from 'native-base';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {useAppSelector} from '~/redux/store/hooks';
import {automatedEmergencySettingsSelector} from '~/redux/user/selectors';
import {timeFromNow} from '~/services/Date.service';

import styles from './styles';

const PauseDateInfoText: React.FC<{isSlotPause?: number}> = ({isSlotPause}) => {
  const {t} = useAppTranslation();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const {automatedEmergency: automatedEmergencyEnabled} = useAppSelector(
    automatedEmergencySettingsSelector,
  );

  const getPauseTime = useCallback(() => {
    return timeFromNow(Math.max(pausedDate?.timestamp ?? 0, isSlotPause ?? 0));
  }, [isSlotPause, pausedDate?.timestamp]);

  const getText = useCallback(() => {
    const translationKey = automatedEmergencyEnabled
      ? 'automatedEmergencyDisabledFor'
      : 'youStillHavePause';

    return t(
      `emergencyContactsSettings.automatedEmergencySettings.${translationKey}`,
      {
        pauseTime: getPauseTime(),
      },
    );
  }, [automatedEmergencyEnabled, t, getPauseTime]);

  return (
    <View>
      {(pausedDate || isSlotPause) && (
        <Text fontSize={12} style={styles.pausedDateText}>
          {getText()}
        </Text>
      )}
    </View>
  );
};

export default PauseDateInfoText;
