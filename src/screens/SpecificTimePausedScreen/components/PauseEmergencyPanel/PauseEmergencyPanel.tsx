import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Toggle from '~/components/Toggle';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {addPauseFromNow, deleteTimeSlot} from '~/redux/automatedEmergency/thunks';
import {isPausedTime} from '~/services/Time.service';
import ToastService from '~/services/Toast.service';
import {BioEmergencySettingsFillClockPause} from '~/assets/icons/BiostasisIcons';
import {layout, semanticColors, typography} from '~/theme/tokens';

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

  const handlePauseToggle = useCallback(
    (nextValue: boolean) => {
      if (nextValue) {
        setDatePickerVisibility(true);
        return;
      }

      if (!pausedDate) {
        return;
      }

      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
      ToastService.success(t('specificTimesScreen.pauseNow.cancelMessage'), {
        visibilityTime: 2000,
      });
    },
    [dispatch, pausedDate, t],
  );

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconChip}>
            <BioEmergencySettingsFillClockPause />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {t('specificTimesScreen.pauseNow.title')}
            </Text>
            <Text style={styles.description}>
              {isNowPaused
                ? t('specificTimesScreen.pauseNow.pausedUntil', {
                    time: pauseUntilLabel,
                  })
                : t('specificTimesScreen.pauseNow.description')}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>
              {isNowPaused
                ? t('specificTimesScreen.pauseNow.pauseEnabled')
                : t('specificTimesScreen.pauseNow.pauseDisabled')}
            </Text>
            <Text style={styles.toggleDescription}>
              {isNowPaused
                ? t('specificTimesScreen.pauseNow.disablePauseHint')
                : t('specificTimesScreen.pauseNow.enablePauseHint')}
            </Text>
          </View>
          <Toggle value={isNowPaused} onChange={handlePauseToggle} />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        cancelTextIOS={t('common.cancel')}
        confirmTextIOS={t('common.confirm')}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
        isDarkModeEnabled={false}
        themeVariant="light"
        textColor={semanticColors.primary}
        accentColor={semanticColors.primary}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0D9',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 19,
    color: semanticColors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.06)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleText: {
    flex: 1,
    gap: 3,
  },
  toggleTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  toggleDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: semanticColors.textMuted,
  },
});

export default PauseEmergencyPanel;
