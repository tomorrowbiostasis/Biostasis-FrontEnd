import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {addPauseFromNow, deleteTimeSlot} from '~/redux/automatedEmergency/thunks';
import {isPausedTime} from '~/services/Time.service';
import ToastService from '~/services/Toast.service';
import IconChip from '~/components/IconChip';
import {PauseCircleIcon} from '~/assets/icons/AppIcons';

const AMBER_TITLE = '#92400E';
const AMBER_BODY = '#B45309';
const AMBER_ACTION = '#D97706';

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

  if (isToday) {
    return `today at ${timeStr}`;
  }
  if (isTomorrow) {
    return `tomorrow at ${timeStr}`;
  }
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
    if (!pausedDate?.timestamp) {
      return '';
    }
    return formatPauseUntil(pausedDate.timestamp);
  }, [pausedDate]);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    async (date: Date) => {
      hideDatePicker();
      if (Date.now() + 6000 > date.valueOf()) {
        return;
      }
      dispatch(
        addPauseFromNow({timestamp: date.valueOf(), id: new Date().valueOf()}),
      );
      ToastService.success(
        t('specificTimesScreen.pauseNow.pauseConfirmed', {
          time: formatPauseUntil(date.valueOf()),
        }),
        {visibilityTime: 3000},
      );
    },
    [dispatch, hideDatePicker, t],
  );

  const handlePauseButtonPress = useCallback(() => {
    if (pausedDate) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
      ToastService.success(t('specificTimesScreen.pauseNow.cancelMessage'), {
        visibilityTime: 2000,
      });
    } else {
      setDatePickerVisibility(true);
    }
  }, [dispatch, pausedDate, t]);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <IconChip background="rgba(217, 119, 6, 0.15)" size={36} radius={8}>
            <PauseCircleIcon size={18} color={AMBER_ACTION} />
          </IconChip>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {t('specificTimesScreen.pauseNow.title')}
            </Text>
            <Text style={styles.description}>
              {t('specificTimesScreen.pauseNow.description')}
            </Text>
          </View>
        </View>

        {isNowPaused ? (
          <Text style={styles.pausedUntil}>
            {t('specificTimesScreen.pauseNow.pausedUntil', {
              time: pauseUntilLabel,
            })}
          </Text>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={handlePauseButtonPress}>
          <Text style={styles.buttonText}>
            {isNowPaused
              ? t('specificTimesScreen.pauseNow.cancelPause')
              : t('specificTimesScreen.pauseNow.choosePauseDuration')}
          </Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        cancelTextIOS={t('common.cancel')}
        confirmTextIOS={t('common.confirm')}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEF3E2',
    borderWidth: 1,
    borderColor: '#F5D68A',
    borderRadius: 14,
    paddingHorizontal: 17,
    paddingVertical: 14,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    color: AMBER_TITLE,
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 18.2,
    color: AMBER_BODY,
  },
  pausedUntil: {
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    color: AMBER_TITLE,
  },
  button: {
    height: 44,
    borderRadius: 14,
    backgroundColor: AMBER_ACTION,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default PauseEmergencyPanel;
