import {Formik, FormikHelpers, FormikProps} from 'formik';
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Loader from '~/components/Loader';
import Toggle from '~/components/Toggle';
import {
  BioEmergencyContactFillDocument,
  BioEmergencyContactFillMapPin,
} from '~/assets/icons/BiostasisIcons';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  EmergencyButtonSettings,
  selectEmergencyButtonSettings,
  testMessageSelector,
  userSelector,
} from '~/redux/user/selectors';
import {IUser, setEmergencyButtonSettingsUpdated} from '~/redux/user/user.slice';
import {
  sendTestMessage,
  updateEmergencyButtonSettings,
  updateUser,
} from '~/redux/user/thunks';
import {useEmergencyContactSettingsValidationSchema} from '~/services/Validation.service';
import {updateDataCollectionStatus} from '~/utils';
import {
  getGoogleMapsUrl,
  getLocation,
  requestLocationPermission,
} from '~/services/Location.service';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';
import ToastService from '~/services/Toast.service';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import SectionHeader from '../SectionHeader';
import styles from './styles';

const MESSAGE_MAX_LENGTH = 300;
const TEST_COOLDOWN_MS = 60 * 1000;

type SaveStatus = 'idle' | 'saved' | 'error';

interface ToggleCardProps {
  icon: ReactNode;
  title: string;
  value?: boolean;
  onChange: (next: boolean) => void;
}

const ToggleCard: FC<ToggleCardProps> = ({
  icon,
  title,
  value,
  onChange,
}) => (
  <View style={styles.toggleCard}>
    {icon}
    <Text style={styles.toggleTitle}>{title}</Text>
    <Toggle value={!!value} onChange={onChange} />
  </View>
);

const EmergencyMessage = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();

  const emergencyContactSettingsValidationSchema =
    useEmergencyContactSettingsValidationSchema();

  const {pending, emergencyButtonSettingsUpdated, user} =
    useAppSelector(userSelector);
  const emergencyButtonSettings = useAppSelector(selectEmergencyButtonSettings);
  const testMessage = useAppSelector(testMessageSelector);
  const [messageFocused, setMessageFocused] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [preparingTestMessage, setPreparingTestMessage] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCooldown = useCallback((sentAt: number) => {
    const remaining = sentAt + TEST_COOLDOWN_MS - Date.now();
    if (remaining <= 0) {
      setCooldownUntil(0);
      return;
    }
    setCooldownUntil(sentAt + TEST_COOLDOWN_MS);
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }
    cooldownTimeoutRef.current = setTimeout(() => {
      setCooldownUntil(0);
    }, remaining);
  }, []);

  // Restore any active cooldown so it survives leaving and re-entering the
  // screen (the component unmounts on navigation, so in-memory state alone
  // would reset the block).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await AsyncStorageService.getItem(
        AsyncStorageEnum.LastTestMessageSentAt,
      );
      const sentAt = stored ? Number(stored) : 0;
      if (!cancelled && sentAt && sentAt + TEST_COOLDOWN_MS > Date.now()) {
        startCooldown(sentAt);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [startCooldown]);

  useEffect(() => {
    return () => {
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
      dispatch(setEmergencyButtonSettingsUpdated(false));
    };
  }, [dispatch, emergencyButtonSettingsUpdated]);

  const initialFormValues = useMemo(() => {
    const init = {...emergencyButtonSettings};
    if (!init.emergencyMessage) {
      init.emergencyMessage = t(
        'emergencyContactsSettings.settings.defaultMessage',
        {username: user.name},
      );
    }
    return init;
  }, [emergencyButtonSettings, t, user.name]);

  const scheduleSaveStatusReset = useCallback(() => {
    if (saveStatusTimeoutRef.current) {
      clearTimeout(saveStatusTimeoutRef.current);
    }
    saveStatusTimeoutRef.current = setTimeout(() => {
      setSaveStatus('idle');
    }, 1300);
  }, []);

  const handleConfirm = useCallback(
    async (
      values: EmergencyButtonSettings,
      helpers: FormikHelpers<EmergencyButtonSettings>,
    ) => {
      try {
        await dispatch(updateEmergencyButtonSettings(values)).unwrap();
        updateDataCollectionStatus();
        helpers.resetForm({values});
        setSaveStatus('saved');
        scheduleSaveStatusReset();
      } catch {
        setSaveStatus('error');
      }
    },
    [dispatch, scheduleSaveStatusReset],
  );

  const handleLocationSettingsChange = useCallback(
    async (
      value: boolean,
      setFieldValue: FormikProps<EmergencyButtonSettings>['setFieldValue'],
    ) => {
      const locationPermission = await requestLocationPermission(false);
      if (locationPermission) {
        setFieldValue('locationAccess', value);
        if (value) {
          try {
            const payload: Partial<IUser> = {
              timezone: timestampToISOWithOffset().slice(-6),
            };
            const location = await getLocation(5000);
            payload.location = getGoogleMapsUrl(location);
            console.log('LOCATION WILL BE UPDATED');

            dispatch(updateUser(payload));
          } catch (error) {
            setFieldValue('locationAccess', false);
          }
        }
      } else {
        setFieldValue('locationAccess', false);
      }
    },
    [dispatch],
  );

  const handleSendTestEmailPress = useCallback(
    async (values: EmergencyButtonSettings) => {
      try {
        setPreparingTestMessage(true);

        if (values.locationAccess) {
          const payload: Partial<IUser> = {
            timezone: timestampToISOWithOffset().slice(-6),
          };
          const location = await getLocation(10000, true);
          payload.location = getGoogleMapsUrl(location);
          await dispatch(updateUser(payload)).unwrap();
        }

        await dispatch(sendTestMessage()).unwrap();

        const sentAt = Date.now();
        await AsyncStorageService.setItem(
          AsyncStorageEnum.LastTestMessageSentAt,
          String(sentAt),
          true,
        );
        startCooldown(sentAt);
      } catch {
        if (values.locationAccess) {
          ToastService.error(
            t('emergencyContactsSettings.settings.testMessageLocationError'),
          );
        }
      } finally {
        setPreparingTestMessage(false);
      }
    },
    [dispatch, startCooldown, t],
  );

  const hasInitialStateChanged = useCallback(
    (values: EmergencyButtonSettings) => {
      const keys = Object.keys(
        values,
      ) as unknown as (keyof EmergencyButtonSettings)[];

      for (let key of keys) {
        if (values[key] !== initialFormValues[key]) {
          return true;
        }
      }
      return false;
    },
    [initialFormValues],
  );

  if (emergencyButtonSettings.emergencyEmailAndSms == null) {
    return <Loader />;
  }

  return (
    <Formik<EmergencyButtonSettings>
      initialValues={initialFormValues}
      enableReinitialize
      onSubmit={handleConfirm}
      validationSchema={emergencyContactSettingsValidationSchema}
      validateOnBlur
      validateOnChange>
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        touched,
        errors,
        setFieldValue,
        isValid,
        dirty,
      }) => {
        const messageLength = (values.emergencyMessage || '').length;
        const changed = dirty || hasInitialStateChanged(values);
        const saveDisabled = !isValid || pending || !changed;
        const testDisabled =
          !isValid ||
          testMessage.pending ||
          preparingTestMessage ||
          changed ||
          cooldownUntil > Date.now();
        const saveLabel =
          saveStatus === 'saved'
            ? t('emergencyContactsSettings.savedChanges')
            : t('emergencyContactsSettings.saveChanges');

        const handleMessageChange = (message: string) => {
          if (saveStatus !== 'idle') {
            setSaveStatus('idle');
            if (saveStatusTimeoutRef.current) {
              clearTimeout(saveStatusTimeoutRef.current);
              saveStatusTimeoutRef.current = null;
            }
          }
          handleChange('emergencyMessage')(message);
        };

        const resetSaveFeedbackForEdit = () => {
          if (saveStatus === 'idle') {
            return;
          }
          setSaveStatus('idle');
          if (saveStatusTimeoutRef.current) {
            clearTimeout(saveStatusTimeoutRef.current);
            saveStatusTimeoutRef.current = null;
          }
        };

        return (
          <View style={styles.container}>
            <View style={styles.section}>
              <SectionHeader
                label={t('emergencyContactsSettings.includeWithMessage')}
              />
              <View style={styles.toggleCards}>
                <ToggleCard
                  icon={<BioEmergencyContactFillMapPin />}
                  title={t('emergencyContactsSettings.settings.location')}
                  value={values.locationAccess}
                  onChange={value => {
                    resetSaveFeedbackForEdit();
                    handleLocationSettingsChange(value, setFieldValue);
                  }}
                />
                <ToggleCard
                  icon={<BioEmergencyContactFillDocument />}
                  title={t(
                    'emergencyContactsSettings.settings.uploadedDocuments',
                  )}
                  value={values.uploadedDocumentsAccess}
                  onChange={value => {
                    resetSaveFeedbackForEdit();
                    setFieldValue('uploadedDocumentsAccess', value);
                  }}
                />
              </View>
            </View>

            <View style={styles.section}>
              <SectionHeader
                label={t('emergencyContactsSettings.emergencyMessageLabel')}
                right={
                  <Text style={styles.counter}>
                    {`${messageLength}/${MESSAGE_MAX_LENGTH}`}
                  </Text>
                }
              />
              <Text style={styles.sectionHelper}>
                {t('emergencyContactsSettings.emergencyMessageEditHelper')}
              </Text>
              <TextInput
                style={[
                  styles.messageInput,
                  messageFocused && styles.messageInputFocused,
                ]}
                multiline
                textAlignVertical="top"
                maxLength={MESSAGE_MAX_LENGTH}
                value={values.emergencyMessage}
                onChangeText={handleMessageChange}
                onFocus={() => setMessageFocused(true)}
                onBlur={event => {
                  setMessageFocused(false);
                  handleBlur('emergencyMessage')(event);
                }}
                placeholder={t(
                  'emergencyContactsSettings.settings.defaultMessage',
                  {username: user.name},
                )}
                placeholderTextColor="#9BA8B5"
                selectionColor="#2E7DAF"
                scrollEnabled
              />
              {errors.emergencyMessage && touched.emergencyMessage ? (
                <Text style={styles.error}>{errors.emergencyMessage}</Text>
              ) : saveStatus === 'error' ? (
                <Text style={styles.error}>
                  {t('emergencyContactsSettings.saveError')}
                </Text>
              ) : (
                <Text style={styles.helper}>
                  {t('emergencyContactsSettings.emergencyMessageHelper')}
                </Text>
              )}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={saveDisabled}
                onPress={() => handleSubmit()}
                style={[
                  styles.saveButton,
                  saveStatus === 'saved' && styles.saveButtonSaved,
                  saveDisabled && saveStatus !== 'saved' && styles.disabled,
                ]}>
                {pending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.saveText,
                      saveStatus === 'saved' && styles.saveTextSaved,
                    ]}>
                    {saveLabel}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={testDisabled}
                onPress={() => handleSendTestEmailPress(values)}
                style={[styles.testButton, testDisabled && styles.disabled]}>
                {testMessage.pending || preparingTestMessage ? (
                  <ActivityIndicator color="#0B1F3A" />
                ) : (
                  <Text style={styles.testText}>
                    {t('emergencyContactsSettings.sendTestMessage')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

export default EmergencyMessage;
