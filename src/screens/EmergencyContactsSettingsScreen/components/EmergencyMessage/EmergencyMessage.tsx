import {Formik, FormikProps} from 'formik';
import React, {FC, ReactNode, useCallback, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Loader from '~/components/Loader';
import IconChip from '~/components/IconChip';
import Toggle from '~/components/Toggle';
import {MapPinIcon, CopyIcon} from '~/assets/icons/AppIcons';
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
import SectionHeader from '../SectionHeader';
import styles from './styles';

const MESSAGE_MAX_LENGTH = 300;

interface ToggleCardProps {
  icon: ReactNode;
  iconBackground: string;
  title: string;
  value?: boolean;
  onChange: (next: boolean) => void;
}

const ToggleCard: FC<ToggleCardProps> = ({
  icon,
  iconBackground,
  title,
  value,
  onChange,
}) => (
  <View style={styles.toggleCard}>
    <IconChip background={iconBackground} size={36} radius={8}>
      {icon}
    </IconChip>
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

  useEffect(() => {
    return () => {
      dispatch(setEmergencyButtonSettingsUpdated(false));
    };
  }, [dispatch, emergencyButtonSettingsUpdated]);

  const initialFormValues = useMemo(() => {
    const init = emergencyButtonSettings;
    if (!init.emergencyMessage) {
      init.emergencyMessage = t(
        'emergencyContactsSettings.settings.defaultMessage',
        {username: user.name},
      );
    }
    return init;
  }, [emergencyButtonSettings, t, user.name]);

  const handleConfirm = useCallback(
    (values: EmergencyButtonSettings) => {
      dispatch(updateEmergencyButtonSettings(values)).then(() => {
        updateDataCollectionStatus();
      });
    },
    [dispatch],
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

  const handleSendTestEmailPress = useCallback(() => {
    dispatch(sendTestMessage());
  }, [dispatch]);

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
      }) => {
        const messageLength = (values.emergencyMessage || '').length;
        const changed = hasInitialStateChanged(values);
        const saveDisabled = !isValid || pending || !changed;
        const testDisabled = !isValid || testMessage.pending || changed;

        return (
          <View style={styles.container}>
            <View style={styles.section}>
              <SectionHeader
                label={t('emergencyContactsSettings.includeWithMessage')}
              />
              <View style={styles.toggleCards}>
                <ToggleCard
                  icon={<MapPinIcon size={18} color="#2C8F86" />}
                  iconBackground="rgba(212, 236, 230, 0.6)"
                  title={t('emergencyContactsSettings.settings.location')}
                  value={values.locationAccess}
                  onChange={value =>
                    handleLocationSettingsChange(value, setFieldValue)
                  }
                />
                <ToggleCard
                  icon={<CopyIcon size={18} color="#4A6FA5" />}
                  iconBackground="rgba(217, 228, 240, 0.6)"
                  title={t(
                    'emergencyContactsSettings.settings.uploadedDocuments',
                  )}
                  value={values.uploadedDocumentsAccess}
                  onChange={value =>
                    setFieldValue('uploadedDocumentsAccess', value)
                  }
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
              <TextInput
                style={styles.messageInput}
                multiline
                textAlignVertical="top"
                maxLength={MESSAGE_MAX_LENGTH}
                value={values.emergencyMessage}
                onChangeText={handleChange('emergencyMessage')}
                onBlur={handleBlur('emergencyMessage')}
                placeholder={t(
                  'emergencyContactsSettings.settings.defaultMessage',
                  {username: user.name},
                )}
                placeholderTextColor="#9BA8B5"
              />
              {errors.emergencyMessage && touched.emergencyMessage ? (
                <Text style={styles.error}>{errors.emergencyMessage}</Text>
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
                style={[styles.saveButton, saveDisabled && styles.disabled]}>
                {pending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveText}>
                    {t('emergencyContactsSettings.saveChanges')}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={testDisabled}
                onPress={handleSendTestEmailPress}
                style={[styles.testButton, testDisabled && styles.disabled]}>
                {testMessage.pending ? (
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
