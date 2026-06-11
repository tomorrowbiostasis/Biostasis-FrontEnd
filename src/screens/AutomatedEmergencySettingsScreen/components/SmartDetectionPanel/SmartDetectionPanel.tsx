import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {Text} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {BrainIcon, MoonIcon, SunIcon} from '~/assets/icons/AppIcons';
import SwitchButton from '~/components/SwitchButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {
  getSmartDetectionSettings,
  saveSmartDetectionSettings,
  SmartDetectionSettings,
} from '~/services/DeviceSignals.service';
import {formatTime, getSleepSchedule} from '~/services/SleepSchedule.service';
import colors from '~/theme/colors';
import styles from './styles';

const SmartDetectionPanel = () => {
  const {t} = useAppTranslation();
  const [settings, setSettings] = useState<SmartDetectionSettings>({
    enabled: false,
    useFocusDetection: true,
    useChargingDetection: true,
    useHealthDataRecency: true,
    healthDataStaleThresholdMs: 2 * 60 * 60 * 1000,
    nighttimeStartHour: 22,
    nighttimeStartMinute: 0,
    nighttimeEndHour: 8,
    nighttimeEndMinute: 0,
  });
  const [hasSleepSchedule, setHasSleepSchedule] = useState(false);
  const [showNightStartPicker, setShowNightStartPicker] = useState(false);
  const [showNightEndPicker, setShowNightEndPicker] = useState(false);

  useEffect(() => {
    getSmartDetectionSettings().then(setSettings);
    getSleepSchedule().then(s => setHasSleepSchedule(s.enabled));
  }, []);

  const persist = useCallback(async (updated: SmartDetectionSettings) => {
    setSettings(updated);
    await saveSmartDetectionSettings(updated);
  }, []);

  const handleMasterToggle = useCallback(
    (value: boolean) => persist({...settings, enabled: value}),
    [settings, persist],
  );

  const handleFocusToggle = useCallback(
    (value: boolean) => persist({...settings, useFocusDetection: value}),
    [settings, persist],
  );

  const handleChargingToggle = useCallback(
    (value: boolean) => persist({...settings, useChargingDetection: value}),
    [settings, persist],
  );

  const handleHealthDataToggle = useCallback(
    (value: boolean) => persist({...settings, useHealthDataRecency: value}),
    [settings, persist],
  );

  const handleNightStartConfirm = useCallback(
    (date: Date) => {
      setShowNightStartPicker(false);
      persist({
        ...settings,
        nighttimeStartHour: date.getHours(),
        nighttimeStartMinute: date.getMinutes(),
      });
    },
    [settings, persist],
  );

  const handleNightEndConfirm = useCallback(
    (date: Date) => {
      setShowNightEndPicker(false);
      persist({
        ...settings,
        nighttimeEndHour: date.getHours(),
        nighttimeEndMinute: date.getMinutes(),
      });
    },
    [settings, persist],
  );

  const nightStartDate = new Date();
  nightStartDate.setHours(
    settings.nighttimeStartHour,
    settings.nighttimeStartMinute,
    0,
    0,
  );
  const nightEndDate = new Date();
  nightEndDate.setHours(
    settings.nighttimeEndHour,
    settings.nighttimeEndMinute,
    0,
    0,
  );

  const prefix =
    'emergencyContactsSettings.automatedEmergencySettings.smartDetection';

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={[styles.circle, styles.icon]}>
          <BrainIcon size={20} color="#9370DB" />
        </View>
        <Text style={styles.panelTitle} fontWeight={700}>
          {t(`${prefix}.title`)}
        </Text>
      </View>
      <View style={styles.lineStyle} />

      <View style={styles.panelBody}>
        <Text style={styles.panelInfoText}>{t(`${prefix}.description`)}</Text>

        <SwitchButton
          value={settings.enabled}
          title={t(`${prefix}.enableDetection`)}
          containerStyle={styles.switchButton}
          onSwitchPress={handleMasterToggle}
        />

        {settings.enabled && (
          <View style={{marginTop: 12}}>
            {/* Focus / DND toggle */}
            <View style={{marginBottom: 12}}>
              <SwitchButton
                value={settings.useFocusDetection}
                title={t(`${prefix}.useFocus`)}
                containerStyle={styles.switchButton}
                onSwitchPress={handleFocusToggle}
              />
              <Text
                fontSize="xs"
                style={{color: colors.gray[600], marginTop: 4, marginLeft: 4}}>
                {t(`${prefix}.useFocusDescription`)}
              </Text>
            </View>

            {/* Charging toggle */}
            <View style={{marginBottom: 12}}>
              <SwitchButton
                value={settings.useChargingDetection}
                title={t(`${prefix}.useCharging`)}
                containerStyle={styles.switchButton}
                onSwitchPress={handleChargingToggle}
              />
              <Text
                fontSize="xs"
                style={{color: colors.gray[600], marginTop: 4, marginLeft: 4}}>
                {t(`${prefix}.useChargingDescription`)}
              </Text>
            </View>

            {/* Health data recency toggle */}
            <View style={{marginBottom: 12}}>
              <SwitchButton
                value={settings.useHealthDataRecency}
                title={t(`${prefix}.useHealthData`)}
                containerStyle={styles.switchButton}
                onSwitchPress={handleHealthDataToggle}
              />
              <Text
                fontSize="xs"
                style={{color: colors.gray[600], marginTop: 4, marginLeft: 4}}>
                {t(`${prefix}.useHealthDataDescription`)}
              </Text>
            </View>

            {/* Nighttime window — only show when sleep schedule is not set */}
            {!hasSleepSchedule && (
              <View style={{marginTop: 8}}>
                <Text
                  fontSize="xs"
                  style={{
                    color: colors.gray[700],
                    fontWeight: '600',
                    marginBottom: 8,
                  }}>
                  {t(`${prefix}.nighttimeWindow`)}
                </Text>
                <Text
                  fontSize="xs"
                  style={{color: colors.gray[600], marginBottom: 8}}>
                  {t(`${prefix}.nighttimeWindowDescription`)}
                </Text>

                <TouchableOpacity
                  onPress={() => setShowNightStartPicker(true)}
                  style={[
                    styles.activeButton,
                    {justifyContent: 'space-between'},
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MoonIcon
                      size={18}
                      color="#9370DB"
                      style={{marginRight: 12}}
                    />
                    <Text style={styles.buttonText}>
                      {t(`${prefix}.nighttimeFrom`)}
                    </Text>
                  </View>
                  <Text style={[styles.buttonText, {color: colors.blue[800]}]}>
                    {formatTime(
                      settings.nighttimeStartHour,
                      settings.nighttimeStartMinute,
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowNightEndPicker(true)}
                  style={[
                    styles.activeButton,
                    {justifyContent: 'space-between'},
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <SunIcon
                      size={18}
                      color="#F4BB44"
                      style={{marginRight: 12}}
                    />
                    <Text style={styles.buttonText}>
                      {t(`${prefix}.nighttimeTo`)}
                    </Text>
                  </View>
                  <Text style={[styles.buttonText, {color: colors.blue[800]}]}>
                    {formatTime(
                      settings.nighttimeEndHour,
                      settings.nighttimeEndMinute,
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <DateTimePickerModal
        isVisible={showNightStartPicker}
        mode="time"
        date={nightStartDate}
        onConfirm={handleNightStartConfirm}
        onCancel={() => setShowNightStartPicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
      <DateTimePickerModal
        isVisible={showNightEndPicker}
        mode="time"
        date={nightEndDate}
        onConfirm={handleNightEndConfirm}
        onCancel={() => setShowNightEndPicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </View>
  );
};

export default SmartDetectionPanel;
