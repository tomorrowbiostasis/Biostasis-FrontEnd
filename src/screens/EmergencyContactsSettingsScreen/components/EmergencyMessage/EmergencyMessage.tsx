import {Formik, FormikProps} from 'formik';
import {Button, Text, View} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import Loader from '~/components/Loader';
import TextArea from '~/components/TextArea';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  EmergencyButtonSettings,
  selectEmergencyButtonSettings,
  testMessageSelector,
  userSelector,
} from '~/redux/user/selectors';

import {
  IUser,
  setEmergencyButtonSettingsUpdated,
} from '~/redux/user/user.slice';
import {
  sendTestMessage,
  updateEmergencyButtonSettings,
  updateUser,
} from '~/redux/user/thunks';
import {useEmergencyContactSettingsValidationSchema} from '~/services/Validation.service';
import SwitchButton from '~/components/SwitchButton';
import {updateDataCollectionStatus} from '~/utils';
import mainStyles from '../../styles';
import styles from './styles';

import {
  getGoogleMapsUrl,
  getLocation,
  requestLocationPermission,
} from '~/services/Location.service';
import {useMemo} from 'react';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';

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
        {
          username: user.name,
        },
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

  const handleSendTestEmailPress = useCallback(async () => {
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

  return (
    <View style={mainStyles.panel}>
      <View style={mainStyles.panelHeader}>
        <IconMaterialCommunityIcons
          name={'message-cog-outline'}
          size={26}
          style={mainStyles.icon}
        />
        <Text fontWeight={700} px={2}>
          {t('emergencyContactsSettings.emergencyButtonSettings')}
        </Text>
      </View>
      <View style={mainStyles.lineStyle} />
      {emergencyButtonSettings.emergencyEmailAndSms == null ? (
        <Loader />
      ) : (
        <View style={mainStyles.panelBody}>
          <Formik<EmergencyButtonSettings>
            initialValues={initialFormValues}
            onSubmit={handleConfirm}
            validationSchema={emergencyContactSettingsValidationSchema}
            validateOnBlur={true}
            validateOnChange={true}
          >
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
              return (
                <>
                  <Text style={styles.headerText}>
                    {t('emergencyContactsSettings.settings.disclaimer')}
                  </Text>
                  <Text
                    style={[styles.headerText, styles.includeInfoHeaderText]}
                  >
                    {t('emergencyContactsSettings.settings.includeInfo')}
                  </Text>
                  <SwitchButton
                    value={values.locationAccess}
                    onSwitchPress={value =>
                      handleLocationSettingsChange(value, setFieldValue)
                    }
                    containerStyle={styles.switchButton}
                    title={t('emergencyContactsSettings.settings.location')}
                  />
                  <SwitchButton
                    value={values.uploadedDocumentsAccess}
                    onSwitchPress={value =>
                      setFieldValue('uploadedDocumentsAccess', value)
                    }
                    containerStyle={styles.switchButton}
                    title={t(
                      'emergencyContactsSettings.settings.uploadedDocuments',
                    )}
                  />
                  <TextArea
                    label={t('common.message')}
                    onChangeText={handleChange('emergencyMessage')}
                    onBlur={handleBlur('emergencyMessage')}
                    value={values.emergencyMessage}
                    errorMessage={errors.emergencyMessage}
                    containerStyle={styles.messageAreaContainer}
                    isValid={
                      !errors.emergencyMessage && touched.emergencyMessage
                    }
                  />
                  <View>
                    <Button
                      style={styles.button}
                      disabled={
                        !isValid || pending || !hasInitialStateChanged(values)
                      }
                      isLoading={pending}
                      onPress={() => handleSubmit()}
                    >
                      {t('common.confirm')}
                    </Button>
                    <Button
                      variant={'outline'}
                      style={styles.button}
                      disabled={
                        !isValid ||
                        testMessage.pending ||
                        hasInitialStateChanged(values)
                      }
                      isLoading={testMessage.pending}
                      onPress={handleSendTestEmailPress}
                    >
                      {t('emergencyContactsSettings.settings.sendTestEmail')}
                    </Button>
                  </View>
                </>
              );
            }}
          </Formik>
        </View>
      )}
    </View>
  );
};

export default EmergencyMessage;
