import React, {useCallback, useState, useMemo} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  addPauseFromNow,
  deleteTimeSlot,
} from '~/redux/automatedEmergency/thunks';
import {styles} from './styles';
import IconFeather from 'react-native-vector-icons/Feather';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'native-base';
import ToastService from '~/services/Toast.service';
import {isPausedTime} from '~/services/Time.service';
import colors from '~/theme/colors';

const formatPauseUntil = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return `today at ${timeStr}`;
  if (isTomorrow) return `tomorrow at ${timeStr}`;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PauseEmergencyPanel = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const isNowPaused = useMemo(
    () => isPausedTime(new Date(), pausedDate, []),
    [pausedDate],
  );

  const pauseUntilLabel = useMemo(() => {
    if (!pausedDate?.timestamp) return '';
    return formatPauseUntil(pausedDate.timestamp);
  }, [pausedDate]);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    async (date: Date) => {
      hideDatePicker();
      if (Date.now() + 6000 > date.valueOf()) {
        return;
      }

      const value = {
        timestamp: date.valueOf(),
        id: new Date().valueOf(),
      };
      dispatch(addPauseFromNow(value));
      ToastService.success(
        t('specificTimesScreen.pauseNow.pauseConfirmed', {
          time: formatPauseUntil(date.valueOf()),
        }),
        {visibilityTime: 3000},
      );
    },
    [dispatch, hideDatePicker, t],
  );

  const handlePauseButtonPress = useCallback(async () => {
    if (pausedDate) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
      ToastService.success(t('specificTimesScreen.pauseNow.cancelMessage'), {
        visibilityTime: 2000,
      });
    } else {
      showDatePicker();
    }
  }, [dispatch, pausedDate, showDatePicker, t]);

  return (
    <>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <IconFeather name="pause-circle" size={26} style={styles.icon} />
          <Text style={styles.panelTitle} fontWeight={700}>
            {t('specificTimesScreen.pauseNow.title')}
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.panelBody}>
          <Text style={styles.panelInfoText}>
            {t('specificTimesScreen.pauseNow.description')}
          </Text>
        </View>
        <View style={styles.panelFooter}>
          {isNowPaused ? (
            <View style={styles.pausedStatusContainer}>
              <View style={styles.pausedStatusHeader}>
                <IconFeather
                  name="pause-circle"
                  size={18}
                  color={colors.yellow[600]}
                />
                <Text style={styles.pausedStatusTitle}>
                  {t('specificTimesScreen.pauseNow.systemPaused')}
                </Text>
              </View>
              <Text style={styles.pausedUntilText}>
                {t('specificTimesScreen.pauseNow.pausedUntil', {
                  time: pauseUntilLabel,
                })}
              </Text>
              <TouchableOpacity
                onPress={handlePauseButtonPress}
                style={styles.cancelButton}>
                <IconFeather name="x" size={14} color={colors.red[400]} />
                <Text style={styles.cancelButtonText}>
                  {t('specificTimesScreen.pauseNow.cancelPause')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePauseButtonPress}
              style={styles.activeButton}>
              <IconFeather
                name="pause-circle"
                size={16}
                color={colors.white}
                style={{marginRight: 6}}
              />
              <Text style={styles.buttonText}>
                {t('specificTimesScreen.pauseNow.startDisclaimer')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={'datetime'}
        cancelTextIOS={t('common.cancel')}
        confirmTextIOS={t('common.confirm')}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </>
  );
};

export default PauseEmergencyPanel;
