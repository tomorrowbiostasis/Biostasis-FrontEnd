import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import IntervalSelect from '~/components/IntervalSelect';
import NativeBottomSheet from '~/components/NativeBottomSheet';
import {CheckIcon, XIcon} from '~/assets/icons/AppIcons';
import {
  BioEmergencySettingsFillCalendar,
  BioEmergencySettingsFillClock,
  BioEmergencySettingsFillEcgWave,
} from '~/assets/icons/BiostasisIcons';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {layout, semanticColors, typography} from '~/theme/tokens';
import EnvConfig from '~/services/Env.service';
import {useAppSelector} from '~/redux/store/hooks';
import {requestLatestHealthData} from '~/utils';
import {
  formatTime,
  getSleepSchedule,
  saveSleepSchedule,
  SleepSchedule,
} from '~/services/SleepSchedule.service';
import {
  canContinueGuidedMonitoringSetup,
  GuidedMonitoringMode,
  GuidedMonitoringStep,
  hasReceivedHealthData,
} from './GuidedMonitoringSetupSheet.logic';

export type SleepSetupChoice = 'enable';

interface Props {
  visible: boolean;
  defaultFrequency: number;
  defaultPositiveInfoPeriod: number;
  onDismiss: () => void;
  onComplete: (settings: {
    mode: GuidedMonitoringMode;
    frequencyOfRegularNotification: number;
    positiveInfoPeriod: number;
    sleepChoice: SleepSetupChoice;
  }) => void;
}

const GuidedMonitoringSetupSheet = ({
  visible,
  defaultFrequency,
  defaultPositiveInfoPeriod,
  onDismiss,
  onComplete,
}: Props) => {
  const {t} = useAppTranslation();
  const health = useAppSelector(state => state.health.data);
  const [step, setStep] = useState<GuidedMonitoringStep>(1);
  const [mode, setMode] = useState<GuidedMonitoringMode | null>(null);
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [positiveInfoPeriod, setPositiveInfoPeriod] = useState(
    defaultPositiveInfoPeriod,
  );
  const [schedule, setSchedule] = useState<SleepSchedule>({
    enabled: false,
    bedtimeHour: 22,
    bedtimeMinute: 0,
    wakeHour: 7,
    wakeMinute: 0,
  });
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const healthDataReceived = hasReceivedHealthData(health);

  useEffect(() => {
    if (visible) {
      setStep(1);
      setMode(null);
      setFrequency(defaultFrequency);
      setPositiveInfoPeriod(defaultPositiveInfoPeriod);
      getSleepSchedule().then(setSchedule);
    }
  }, [defaultFrequency, defaultPositiveInfoPeriod, visible]);

  const primaryLabel = useMemo(() => {
    if (step === 3) {
      return t(
        schedule.enabled
          ? 'emergencyContactsSettings.automatedEmergencySettings.setupFlow.continue'
          : 'emergencyContactsSettings.automatedEmergencySettings.setupFlow.sleep.enable',
      );
    }

    if (step < 4) {
      return t(
        'emergencyContactsSettings.automatedEmergencySettings.setupFlow.continue',
      );
    }
    return t(
      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.enableMonitoring',
    );
  }, [schedule.enabled, step, t]);

  const canContinue = canContinueGuidedMonitoringSetup({
    step,
    mode,
    healthDataReceived,
    sleepScheduleEnabled: schedule.enabled,
  });

  const persistSchedule = useCallback(async (updated: SleepSchedule) => {
    setSchedule(updated);
    await saveSleepSchedule(updated);
  }, []);

  const handleBedtimeConfirm = useCallback(
    (date: Date) => {
      setShowBedtimePicker(false);
      persistSchedule({
        ...schedule,
        bedtimeHour: date.getHours(),
        bedtimeMinute: date.getMinutes(),
      });
    },
    [persistSchedule, schedule],
  );

  const handleWakeConfirm = useCallback(
    (date: Date) => {
      setShowWakePicker(false);
      persistSchedule({
        ...schedule,
        wakeHour: date.getHours(),
        wakeMinute: date.getMinutes(),
      });
    },
    [persistSchedule, schedule],
  );

  const handlePrimaryPress = async () => {
    if (step === 3) {
      await persistSchedule({...schedule, enabled: true});
      setStep(4);
      return;
    }

    if (step === 4 && mode) {
      onComplete({
        mode,
        frequencyOfRegularNotification: frequency,
        positiveInfoPeriod,
        sleepChoice: 'enable',
      });
      return;
    }
    if (canContinue) {
      setStep(value => Math.min(value + 1, 4) as GuidedMonitoringStep);
    }
  };

  const bedtimeDate = new Date();
  bedtimeDate.setHours(schedule.bedtimeHour, schedule.bedtimeMinute, 0, 0);
  const wakeDate = new Date();
  wakeDate.setHours(schedule.wakeHour, schedule.wakeMinute, 0, 0);

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <Text style={styles.title}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.choose.title',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.choose.subtitle',
            )}
          </Text>
          <View style={styles.optionList}>
            <SetupOption
              selected={mode === 'bio'}
              icon={<BioEmergencySettingsFillEcgWave />}
              title={t(
                'emergencyContactsSettings.automatedEmergencySettings.guidance.bioChoice.title',
              )}
              subtitle={t(
                'emergencyContactsSettings.automatedEmergencySettings.setupFlow.choose.bioSubtitle',
              )}
              onPress={() => setMode('bio')}
            />
            <SetupOption
              selected={mode === 'time'}
              icon={<BioEmergencySettingsFillClock />}
              title={t(
                'emergencyContactsSettings.automatedEmergencySettings.guidance.timeChoice.title',
              )}
              subtitle={t(
                'emergencyContactsSettings.automatedEmergencySettings.setupFlow.choose.timeSubtitle',
              )}
              onPress={() => setMode('time')}
            />
          </View>
        </>
      );
    }

    if (step === 2 && mode === 'bio') {
      return (
        <>
          <Text style={styles.title}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.bio.title',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.bio.subtitle',
            )}
          </Text>
          <View style={styles.statusBox}>
            <BioEmergencySettingsFillEcgWave />
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>
                {healthDataReceived
                  ? t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.bio.connected',
                    )
                  : t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.bio.notConnected',
                    )}
              </Text>
              <Text style={styles.statusDescription}>
                {healthDataReceived
                  ? t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.bio.connectedHelper',
                    )
                  : t(
                      'emergencyContactsSettings.automatedEmergencySettings.setupFlow.bio.missingHelper',
                    )}
              </Text>
            </View>
          </View>
          {!healthDataReceived ? (
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.inlineAction}
              onPress={requestLatestHealthData}
              accessibilityRole="button">
              <Text style={styles.inlineActionText}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.setupFlow.bio.checkConnection',
                )}
              </Text>
            </TouchableOpacity>
          ) : null}
        </>
      );
    }

    if (step === 2 && mode === 'time') {
      return (
        <>
          <Text style={styles.title}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.time.title',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.time.subtitle',
            )}
          </Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.frequency',
              )}
            </Text>
            <IntervalSelect
              type="time"
              selectedValue={`${frequency}`}
              onValueChange={value => setFrequency(+value)}
            />
          </View>
          <Text style={styles.helper}>
            {EnvConfig.DEV
              ? t(
                  'emergencyContactsSettings.automatedEmergencySettings.setupFlow.time.devHelper',
                )
              : t(
                  'emergencyContactsSettings.automatedEmergencySettings.setupFlow.time.helper',
                )}
          </Text>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <Text style={styles.title}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.sleep.title',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.setupFlow.sleep.subtitle',
            )}
          </Text>
          <View style={styles.optionList}>
            <View style={styles.sleepTimeCards}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.sleepTimeCard}
                onPress={() => setShowBedtimePicker(true)}
                accessibilityRole="button">
                <Text style={styles.sleepTimeIcon}>🌙</Text>
                <Text style={styles.sleepTimeLabel}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.bedtime',
                  )}
                </Text>
                <Text style={styles.sleepTimeValue}>
                  {formatTime(schedule.bedtimeHour, schedule.bedtimeMinute)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.sleepTimeCard}
                onPress={() => setShowWakePicker(true)}
                accessibilityRole="button">
                <Text style={styles.sleepTimeIcon}>☀️</Text>
                <Text style={styles.sleepTimeLabel}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.sleepSchedule.wakeTime',
                  )}
                </Text>
                <Text style={styles.sleepTimeValue}>
                  {formatTime(schedule.wakeHour, schedule.wakeMinute)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.requiredNotice}>
              <BioEmergencySettingsFillCalendar />
              <Text style={styles.requiredNoticeText}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.setupFlow.sleep.required',
                )}
              </Text>
            </View>
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.title}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.setupFlow.final.title',
          )}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'bio'
            ? t(
                'emergencyContactsSettings.automatedEmergencySettings.setupFlow.final.subtitleBio',
              )
            : t(
                'emergencyContactsSettings.automatedEmergencySettings.setupFlow.final.subtitleTime',
              )}
        </Text>
        <View style={styles.summaryCard}>
          {mode === 'bio' ? (
            <BioEmergencySettingsFillEcgWave />
          ) : (
            <BioEmergencySettingsFillClock />
          )}
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>
              {mode === 'bio'
                ? t(
                    'emergencyContactsSettings.automatedEmergencySettings.guidance.bioChoice.title',
                  )
                : t(
                    'emergencyContactsSettings.automatedEmergencySettings.guidance.timeChoice.title',
                  )}
            </Text>
            <Text style={styles.summaryDescription}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.setupFlow.final.sleepEnabled',
              )}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <NativeBottomSheet
        visible={visible}
        onDismiss={onDismiss}
        sheetStyle={styles.sheet}>
        <View style={styles.header}>
            <Text style={styles.stepLabel}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.setupFlow.stepLabel',
                {step},
              )}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={10}
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel={t('common.cancel')}>
              <XIcon size={20} color={semanticColors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}>
            {renderStepContent()}
          </ScrollView>
          <View style={styles.footer}>
            {step > 1 ? (
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.secondaryButton}
                onPress={() =>
                  setStep(
                    value => Math.max(value - 1, 1) as GuidedMonitoringStep,
                  )
                }>
                <Text style={styles.secondaryButtonText}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.setupFlow.back',
                  )}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.86}
              disabled={!canContinue}
              style={[
                styles.primaryButton,
                !canContinue ? styles.primaryButtonDisabled : undefined,
              ]}
              onPress={handlePrimaryPress}>
              <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
            </TouchableOpacity>
          </View>
      </NativeBottomSheet>
      <DateTimePickerModal
        isVisible={showBedtimePicker}
        mode="time"
        date={bedtimeDate}
        onConfirm={handleBedtimeConfirm}
        onCancel={() => setShowBedtimePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
      <DateTimePickerModal
        isVisible={showWakePicker}
        mode="time"
        date={wakeDate}
        onConfirm={handleWakeConfirm}
        onCancel={() => setShowWakePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </>
  );
};

interface SetupOptionProps {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const SetupOption = ({
  selected,
  icon,
  title,
  subtitle,
  onPress,
}: SetupOptionProps) => (
  <TouchableOpacity
    activeOpacity={0.84}
    style={[
      styles.optionCard,
      selected ? styles.optionCardSelected : undefined,
    ]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{selected}}>
    {icon}
    <View style={styles.optionCopy}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <View style={[styles.radio, selected ? styles.radioSelected : undefined]}>
      {selected ? <CheckIcon size={13} color="#FFFFFF" /> : null}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sheet: {
    maxHeight: '86%',
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 12,
  },
  stepLabel: {
    ...typography.sectionLabel,
    color: semanticColors.textMuted,
  },
  body: {
    gap: 14,
    paddingBottom: 18,
  },
  title: {
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
    lineHeight: 28,
    color: semanticColors.primary,
  },
  subtitle: {
    ...typography.sectionDescription,
    color: semanticColors.textSecondary,
  },
  helper: {
    ...typography.rowDescription,
    color: semanticColors.textMuted,
  },
  optionList: {
    gap: 10,
  },
  howCard: {
    backgroundColor: semanticColors.surfaceMuted,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  howHeaderText: {
    flex: 1,
    gap: 4,
  },
  howTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  howDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  howSteps: {
    gap: 12,
  },
  howStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  howStepText: {
    flex: 1,
    gap: 2,
  },
  howStepTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  howStepDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  optionCard: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    backgroundColor: semanticColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionCardSelected: {
    borderColor: 'rgba(30, 155, 107, 0.42)',
    backgroundColor: '#F1FAF6',
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  optionSubtitle: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  radio: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD4DE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surface,
  },
  radioSelected: {
    borderColor: semanticColors.success,
    backgroundColor: semanticColors.success,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    backgroundColor: semanticColors.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statusCopy: {
    flex: 1,
    gap: 4,
  },
  statusTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  statusDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  inlineAction: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    paddingHorizontal: layout.ctaPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.primary,
  },
  inlineActionText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
  fieldLabel: {
    ...typography.sectionLabel,
    color: semanticColors.textMuted,
  },
  fieldGroup: {
    gap: 6,
  },
  sleepTimeCards: {
    flexDirection: 'row',
    gap: 12,
  },
  sleepTimeCard: {
    flex: 1,
    backgroundColor: semanticColors.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  sleepTimeIcon: {
    fontSize: 20,
  },
  sleepTimeLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: semanticColors.textSecondary,
  },
  sleepTimeValue: {
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    color: semanticColors.primary,
  },
  requiredNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: '#F1FAF6',
    borderWidth: 1,
    borderColor: 'rgba(30, 155, 107, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  requiredNoticeText: {
    flex: 1,
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    backgroundColor: '#F1FAF6',
    borderWidth: 1,
    borderColor: 'rgba(30, 155, 107, 0.24)',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  summaryCopy: {
    flex: 1,
    gap: 4,
  },
  summaryTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  summaryDescription: {
    ...typography.rowDescription,
    color: semanticColors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  secondaryButton: {
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    paddingHorizontal: layout.ctaPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.surfaceSubtle,
  },
  secondaryButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.primary,
  },
  primaryButton: {
    flex: 1,
    height: layout.ctaHeight,
    borderRadius: layout.ctaRadius,
    paddingHorizontal: layout.ctaPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColors.primary,
  },
  primaryButtonDisabled: {
    backgroundColor: semanticColors.primaryDisabled,
  },
  primaryButtonText: {
    ...typography.buttonLabel,
    color: semanticColors.textInverse,
  },
});

export default GuidedMonitoringSetupSheet;
