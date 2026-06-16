import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import Toggle from '~/components/Toggle';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {addPauseFromNow, deleteTimeSlot} from '~/redux/automatedEmergency/thunks';
import {isPausedTime} from '~/services/Time.service';
import ToastService from '~/services/Toast.service';
import {BioEmergencySettingsFillClockPause} from '~/assets/icons/BiostasisIcons';
import {layout, semanticColors} from '~/theme/tokens';

const MIN_PAUSE_MINUTES = 1;
const MAX_PAUSE_MINUTES = 7 * 24 * 60;

const QUICK_PAUSE_OPTIONS = [
  {
    key: 'oneMinute',
    minutes: 1,
    labelKey: 'specificTimesScreen.pauseNow.quickOneMinute',
  },
  {
    key: 'thirtyMinutes',
    minutes: 30,
    labelKey: 'specificTimesScreen.pauseNow.quickThirtyMinutes',
  },
  {
    key: 'oneHour',
    minutes: 60,
    labelKey: 'specificTimesScreen.pauseNow.quickOneHour',
  },
  {
    key: 'oneDay',
    minutes: 24 * 60,
    labelKey: 'specificTimesScreen.pauseNow.quickOneDay',
  },
] as const;

const CUSTOM_MINUTE_OPTIONS = [0, 15, 30, 45] as const;

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

const formatDuration = (
  durationMinutes: number,
  t: ReturnType<typeof useAppTranslation>['t'],
): string => {
  const days = Math.floor(durationMinutes / (24 * 60));
  const hours = Math.floor((durationMinutes % (24 * 60)) / 60);
  const minutes = durationMinutes % 60;
  const parts: string[] = [];

  if (days) {
    parts.push(
      t('specificTimesScreen.pauseNow.durationDays', {count: days}),
    );
  }
  if (hours) {
    parts.push(
      t('specificTimesScreen.pauseNow.durationHours', {count: hours}),
    );
  }
  if (minutes) {
    parts.push(
      t('specificTimesScreen.pauseNow.durationMinutes', {count: minutes}),
    );
  }

  return parts.join(' ');
};

const formatCustomDuration = (durationMinutes: number) => {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
};

const PauseEmergencyPanel = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const [durationPickerVisible, setDurationPickerVisible] = useState(false);
  const [customDurationVisible, setCustomDurationVisible] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(30);

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

  const durationLabel = useMemo(
    () => formatDuration(durationMinutes, t),
    [durationMinutes, t],
  );
  const customDurationLabel = useMemo(
    () => formatCustomDuration(durationMinutes),
    [durationMinutes],
  );

  const customHours = Math.floor(durationMinutes / 60);
  const customMinutes = durationMinutes % 60;
  const pauseSwitchOn = isNowPaused || durationPickerVisible;

  const updateDuration = useCallback((nextMinutes: number) => {
    setDurationMinutes(
      Math.min(
        MAX_PAUSE_MINUTES,
        Math.max(MIN_PAUSE_MINUTES, nextMinutes),
      ),
    );
  }, []);

  const updateCustomHours = useCallback(
    (nextHours: number) => {
      updateDuration(nextHours * 60 + customMinutes);
    },
    [customMinutes, updateDuration],
  );

  const updateCustomMinutes = useCallback(
    (nextMinutes: number) => {
      updateDuration(customHours * 60 + nextMinutes);
    },
    [customHours, updateDuration],
  );

  const handleConfirmPause = useCallback(() => {
    const timestamp = Date.now() + durationMinutes * 60 * 1000;
    dispatch(
      addPauseFromNow({timestamp, id: new Date().valueOf()}),
    );
    setDurationPickerVisible(false);
    setCustomDurationVisible(false);
    ToastService.success(
      t('specificTimesScreen.pauseNow.pauseConfirmed', {
        time: formatPauseUntil(timestamp),
      }),
      {visibilityTime: 3000},
    );
  }, [dispatch, durationMinutes, t]);

  const handlePauseToggle = useCallback(
    (nextValue: boolean) => {
      if (nextValue) {
        setDurationPickerVisible(true);
        return;
      }

      setDurationPickerVisible(false);
      setCustomDurationVisible(false);
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
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.header}>
          <View style={styles.iconChip}>
            <BioEmergencySettingsFillClockPause />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {t('specificTimesScreen.pauseNow.title', {
                defaultValue: 'Pause monitoring',
              })}
            </Text>
            <Text style={styles.description}>
              {isNowPaused
                ? t('specificTimesScreen.pauseNow.pausedUntil', {
                    time: pauseUntilLabel,
                    defaultValue: 'Paused until {{time}}',
                  })
                : t('specificTimesScreen.pauseNow.description', {
                    defaultValue:
                      'Temporarily pause protection for a short break you choose.',
                  })}
            </Text>
          </View>
        </View>
        <Toggle value={pauseSwitchOn} onChange={handlePauseToggle} />
      </View>

      {!pauseSwitchOn ? (
        <View style={styles.inactiveState}>
          <Text style={styles.inactiveStateText}>
            {t('specificTimesScreen.pauseNow.inactiveState', {
              defaultValue:
                'Monitoring is active. Turn on the switch when you need a short pause.',
            })}
          </Text>
        </View>
      ) : null}

      {!isNowPaused && durationPickerVisible ? (
        <View style={styles.durationBox}>
          <Text style={styles.durationEyebrow}>
            {t('specificTimesScreen.pauseNow.pauseFor')}
          </Text>
          <View style={styles.quickRow}>
            {QUICK_PAUSE_OPTIONS.map(option => {
              const selected = durationMinutes === option.minutes;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="button"
                  onPress={() => {
                    setCustomDurationVisible(false);
                    updateDuration(option.minutes);
                  }}
                  style={({pressed}) => [
                    styles.quickChip,
                    pressed ? styles.quickChipPressed : undefined,
                    selected ? styles.quickChipSelected : undefined,
                  ]}>
                  <Text
                    style={[
                      styles.quickChipText,
                      selected ? styles.quickChipTextSelected : undefined,
                    ]}>
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setCustomDurationVisible(value => !value)}
            style={({pressed}) => [
              styles.customSummaryRow,
              pressed ? styles.customSummaryRowPressed : undefined,
            ]}>
            <View style={styles.customSummaryCopy}>
              <Text style={styles.customSummaryTitle}>
                {t('specificTimesScreen.pauseNow.customDuration')}
              </Text>
              <Text style={styles.customSummaryHint}>
                {t('specificTimesScreen.pauseNow.customDurationHint', {
                  defaultValue: 'Adjust hours and minutes',
                })}
              </Text>
            </View>
            <Text style={styles.customSummaryValue}>{customDurationLabel}</Text>
          </Pressable>

          {customDurationVisible ? (
            <View style={styles.customPicker}>
              <View style={styles.customDurationRow}>
                <DurationStepper
                  label={t('specificTimesScreen.pauseNow.hours')}
                  value={customHours}
                  onDecrease={() => updateCustomHours(customHours - 1)}
                  onIncrease={() => updateCustomHours(customHours + 1)}
                  decreaseDisabled={durationMinutes <= MIN_PAUSE_MINUTES}
                  increaseDisabled={durationMinutes >= MAX_PAUSE_MINUTES}
                />
                <View style={styles.minutePickerCard}>
                  <Text style={styles.stepperLabel}>
                    {t('specificTimesScreen.pauseNow.minutes')}
                  </Text>
                  <View style={styles.minuteChipGrid}>
                    {CUSTOM_MINUTE_OPTIONS.map(option => {
                      const selected = customMinutes === option;
                      return (
                        <Pressable
                          key={option}
                          accessibilityRole="button"
                          onPress={() => updateCustomMinutes(option)}
                          style={({pressed}) => [
                            styles.minuteChip,
                            pressed ? styles.minuteChipPressed : undefined,
                            selected ? styles.minuteChipSelected : undefined,
                          ]}>
                          <Text
                            style={[
                              styles.minuteChipText,
                              selected
                                ? styles.minuteChipTextSelected
                                : undefined,
                            ]}>
                            {String(option).padStart(2, '0')}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.durationActions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleConfirmPause}
              style={({pressed}) => [
                styles.confirmDurationButton,
                pressed ? styles.primaryButtonPressed : undefined,
              ]}>
              <Text style={styles.confirmDurationText}>
                {t('specificTimesScreen.pauseNow.pauseForDuration', {
                  duration: durationLabel,
                })}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
};

interface DurationStepperProps {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
}

const DurationStepper = ({
  label,
  value,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
}: DurationStepperProps) => (
  <View style={styles.stepperCard}>
    <Text style={styles.stepperLabel}>{label}</Text>
    <View style={styles.stepperControls}>
      <Pressable
        accessibilityRole="button"
        disabled={decreaseDisabled}
        onPress={onDecrease}
        style={({pressed}) => [
          styles.stepperButton,
          pressed ? styles.stepperButtonPressed : undefined,
          decreaseDisabled ? styles.stepperButtonDisabled : undefined,
        ]}>
        <Text style={styles.stepperButtonText}>-</Text>
      </Pressable>
      <Text style={styles.stepperValue}>{String(value).padStart(2, '0')}</Text>
      <Pressable
        accessibilityRole="button"
        disabled={increaseDisabled}
        onPress={onIncrease}
        style={({pressed}) => [
          styles.stepperButton,
          pressed ? styles.stepperButtonPressed : undefined,
          increaseDisabled ? styles.stepperButtonDisabled : undefined,
        ]}>
        <Text style={styles.stepperButtonText}>+</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: 14,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontSize: 14,
    lineHeight: 18,
    color: semanticColors.textMuted,
  },
  inactiveState: {
    borderRadius: 10,
    backgroundColor: semanticColors.surfaceCanvas,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inactiveStateText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 17,
    color: semanticColors.textMuted,
  },
  durationBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: semanticColors.border,
    backgroundColor: semanticColors.surfaceCanvas,
    padding: 10,
    gap: 10,
  },
  durationEyebrow: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: semanticColors.textSecondary,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    flexBasis: '23%',
    flexGrow: 1,
    minHeight: 36,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: semanticColors.border,
    backgroundColor: semanticColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipPressed: {
    backgroundColor: semanticColors.surfaceMuted,
  },
  quickChipSelected: {
    borderColor: semanticColors.primary,
    backgroundColor: semanticColors.surfaceMuted,
  },
  quickChipText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    color: semanticColors.primary,
  },
  quickChipTextSelected: {
    color: semanticColors.primary,
  },
  customSummaryRow: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: semanticColors.border,
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  customSummaryRowPressed: {
    backgroundColor: semanticColors.surfaceMuted,
  },
  customSummaryCopy: {
    flex: 1,
    gap: 1,
  },
  customSummaryTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    lineHeight: 18,
    color: semanticColors.primary,
  },
  customSummaryHint: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: semanticColors.textMuted,
  },
  customSummaryValue: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: semanticColors.surfaceCanvas,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    color: semanticColors.primary,
  },
  customPicker: {
    borderRadius: 10,
    backgroundColor: semanticColors.surface,
    padding: 8,
  },
  customDurationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stepperCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: semanticColors.border,
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 8,
  },
  stepperLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: semanticColors.textMuted,
    textAlign: 'center',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: semanticColors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surface,
  },
  stepperButtonPressed: {
    backgroundColor: semanticColors.surfaceMuted,
    borderColor: semanticColors.primary,
  },
  stepperButtonDisabled: {
    opacity: 0.45,
  },
  stepperButtonText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    lineHeight: 22,
    color: semanticColors.primary,
  },
  stepperValue: {
    minWidth: 34,
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 21,
    color: semanticColors.primary,
  },
  minutePickerCard: {
    flex: 1.15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: semanticColors.border,
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 8,
  },
  minuteChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  minuteChip: {
    minHeight: 32,
    flexBasis: '45%',
    flexGrow: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: semanticColors.border,
    backgroundColor: semanticColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minuteChipPressed: {
    backgroundColor: semanticColors.surfaceMuted,
  },
  minuteChipSelected: {
    borderColor: semanticColors.primary,
    backgroundColor: semanticColors.primary,
  },
  minuteChipText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    color: semanticColors.primary,
  },
  minuteChipTextSelected: {
    color: semanticColors.textInverse,
  },
  durationActions: {
    marginTop: 2,
  },
  confirmDurationButton: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.primary,
  },
  primaryButtonPressed: {
    backgroundColor: semanticColors.primaryPressed,
  },
  confirmDurationText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.textInverse,
    textAlign: 'center',
  },
});

export default PauseEmergencyPanel;
