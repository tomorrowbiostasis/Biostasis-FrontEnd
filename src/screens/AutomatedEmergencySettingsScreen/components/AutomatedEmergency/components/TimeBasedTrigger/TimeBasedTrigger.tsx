import React, {useCallback, useState} from 'react';
import {LayoutAnimation, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  AutomatedEmergencySettings,
  automatedEmergencySettingsSelector,
} from '~/redux/user/selectors';
import styles from '../../../../styles';
import {Text} from 'native-base';
import colors from '~/theme/colors';
import IntervalSelect from '~/components/IntervalSelect';
import {IUser} from '~/redux/user/user.slice';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {updateUser} from '~/redux/user/thunks';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import {setEmergencyCheckType} from '~/redux/automatedEmergency/automatedEmergency.slice';
import ToastService from '~/services/Toast.service';
import EnvConfig from '~/services/Env.service';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import SwitchButton from '~/components/SwitchButton';
import {resetRecommendationSystem} from '~/services/Recommendation.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MaxDescriptionLength = 75;
const defaultFrequencyOfRegularNotification = 120;

const TimeBasedTrigger = () => {
  const {t} = useAppTranslation();

  const {regularPushNotification, frequencyOfRegularNotification} =
    useAppSelector(automatedEmergencySettingsSelector);

  const [showFullTimeDescription, setShowFullTimeDescription] = useState(
    regularPushNotification,
  );
  const [showTimeSettings, setShowTimeSettings] = useState(
    regularPushNotification,
  );
  const dispatch = useAppDispatch();

  const handleUpdateUser = useCallback(
    (updateData: AutomatedEmergencySettings, touched?: boolean) => {
      if (touched) {
        dispatch(updateUser(updateData));
      }
    },
    [dispatch],
  );

  const updateUserDataOnChange = useCallback(() => {
    const updateData: IUser = {
      regularPushNotification: true,
    };
    updateData.frequencyOfRegularNotification =
      frequencyOfRegularNotification || defaultFrequencyOfRegularNotification;
    handleUpdateUser(updateData, true);
  }, [handleUpdateUser, frequencyOfRegularNotification]);

  const renderDescription = () => {
    const description = t(
      'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.description',
    );
    if (showFullTimeDescription) {
      return (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowFullTimeDescription(!showFullTimeDescription);
          }}
        >
          <Text style={styles.infoText}>
            {description}
            <Text style={styles.readText}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.readLess',
              )}
            </Text>
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowFullTimeDescription(!showFullTimeDescription);
          }}
        >
          <Text style={styles.infoText}>
            {description.slice(0, MaxDescriptionLength)}...
            <Text style={styles.readText}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.readMore',
              )}
            </Text>
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderSettings = () => {
    if (showTimeSettings) {
      return (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowTimeSettings(!showTimeSettings);
          }}
        >
          <Text style={styles.settingsTouchText}>
            {t('emergencyContactsSettings.automatedEmergencySettings.collapse')}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowTimeSettings(!showTimeSettings);
          }}
        >
          <Text style={styles.settingsTouchText}>
            {t('emergencyContactsSettings.automatedEmergencySettings.seeAll')}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const handleFrequency = useCallback(
    (frequency: number) => {
      const updateData: IUser = {};
      updateData.frequencyOfRegularNotification = frequency;
      ToastService.success(
        t('emergencyContactsSettings.automatedEmergencySettings.frequencySet') +
          ' ' +
          (EnvConfig.DEV
            ? t(
                'emergencyContactsSettings.automatedEmergencySettings.time.minutes',
                {count: frequency},
              )
            : t(
                'emergencyContactsSettings.automatedEmergencySettings.time.hours',
                {count: frequency / 60},
              )),
        {
          visibilityTime: 1000,
        },
      );

      handleUpdateUser(updateData, true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleUpdateUser],
  );

  const handleEmergencyCheckTypeChange = async () => {
    await resetRecommendationSystem(AsyncStorage);
    dispatch(setEmergencyCheckType('time'));
  };

  const handleManualEmergencySwitch = (value: boolean) => {
    const updateData: AutomatedEmergencySettings = {
      automatedEmergency: value,
    };
    handleUpdateUser(updateData, true);
    if (!value) {
      ToastService.success(
        t(
          'emergencyContactsSettings.automatedEmergencySettings.systemOffMessage',
        ),
      );
    }
  };

  return (
    <View style={styles.panel}>
      <View style={styles.triggerPanelHeader}>
        <Text style={styles.triggerTitle}>
          {t(
            'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.title',
          )}
        </Text>
        {!regularPushNotification ? (
          <View style={styles.activeButton}>
            <View style={styles.buttonIcon}>
              <IconFontAwesome
                name={'warning'}
                size={14}
                color={colors.yellow[600]}
              />
            </View>
            <Text style={styles.buttonText}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.systemOff',
              )}
            </Text>
          </View>
        ) : (
          <View style={[styles.activeButton, styles.isActive]}>
            <View style={styles.buttonIcon}>
              <IconFontisto name={'clock'} size={13} color={colors.blue[800]} />
            </View>
            <Text style={[styles.buttonText, {color: colors.white}]}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.systemOn',
              )}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.panelBody}>
        {renderDescription()}
        <SwitchButton
          value={regularPushNotification}
          title={t(
            'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.turnOn',
          )}
          containerStyle={styles.switchButton}
          onSwitchPress={value => {
            updateUserDataOnChange();
            setShowTimeSettings(value);
            handleEmergencyCheckTypeChange();
            handleManualEmergencySwitch(value);
          }}
        />
        {!regularPushNotification && (
          <Text fontSize={12} py={2} color={colors.red[600]}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.warning',
            )}
          </Text>
        )}
      </View>
      {showTimeSettings && (
        <>
          <Text fontSize={16}>
            {t(
              'emergencyContactsSettings.automatedEmergencySettings.timeTrigger.frequency',
            )}
          </Text>
          <IntervalSelect
            selectedValue={`${frequencyOfRegularNotification}`}
            type={'time'}
            onValueChange={itemValue => handleFrequency(+itemValue)}
          />
        </>
      )}
      {renderSettings()}
    </View>
  );
};

export default TimeBasedTrigger;
