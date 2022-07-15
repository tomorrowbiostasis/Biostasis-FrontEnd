import {Formik, FormikProps} from 'formik';
import {Button, Text, View} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import Container from '~/components/Container';
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

import {setEmergencyButtonSettingsUpdated} from '~/redux/user/user.slice';
import {
  sendTestMessage,
  updateEmergencyButtonSettings,
} from '~/redux/user/thunks';
import {useEmergencyContactSettingsValidationSchema} from '~/services/Validation.service';
import SwitchButton from '~/components/SwitchButton';
import {updateDataCollectionStatus} from '~/utils';
import styles from './styles';

import {getLocation} from '~/services/Location.service';
import {useMemo} from 'react';

const EmergencyContactsSettingsScreen = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emergencyButtonSettingsUpdated]);

  const initialFormValues = useMemo(() => {
    const init = emergencyButtonSettings;
    if (!init.emergencyMessage) {
      init.emergencyMessage = t('emergencyContacts.settings.defaultMessage', {
        username: user.name,
      });
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
      setFieldValue('locationAccess', value);
      if (value) {
        try {
          await getLocation();
        } catch (error) {
          setFieldValue('locationAccess', false);
        }
      }
    },
    [],
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
    <Container
      title={t('emergencyContacts.emergencyButtonSettings')}
      type={'keyboardAvoidingScrollView'}
      contentContainerStyle={styles.content}>
      {emergencyButtonSettings.emergencyEmailAndSms == null ? (
        <Loader />
      ) : (
        <Formik<EmergencyButtonSettings>
          initialValues={initialFormValues}
          onSubmit={handleConfirm}
          validationSchema={emergencyContactSettingsValidationSchema}
          validateOnBlur={true}
          validateOnChange={true}>
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
                <View>
                  <Text style={styles.headerText}>
                    {t('emergencyContacts.settings.disclaimer')}
                  </Text>
                  <Text
                    style={[styles.headerText, styles.includeInfoHeaderText]}>
                    {t('emergencyContacts.settings.includeInfo')}
                  </Text>
                  <SwitchButton
                    value={values.locationAccess}
                    onSwitchPress={value =>
                      handleLocationSettingsChange(value, setFieldValue)
                    }
                    containerStyle={styles.switchButton}
                    title={t('emergencyContacts.settings.location')}
                  />
                  <SwitchButton
                    value={values.uploadedDocumentsAccess}
                    onSwitchPress={value =>
                      setFieldValue('uploadedDocumentsAccess', value)
                    }
                    containerStyle={styles.switchButton}
                    title={t('emergencyContacts.settings.uploadedDocuments')}
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
                </View>
                <View>
                  <Button
                    style={styles.button}
                    disabled={
                      !isValid || pending || !hasInitialStateChanged(values)
                    }
                    isLoading={pending}
                    onPress={handleSubmit}>
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
                    onPress={handleSendTestEmailPress}>
                    {t('emergencyContacts.settings.sendTestEmail')}
                  </Button>
                </View>
              </>
            );
          }}
        </Formik>
      )}
    </Container>
  );
};

export default EmergencyContactsSettingsScreen;
