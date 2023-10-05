import {Alert, LayoutAnimation, Settings, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import styles from '../../../../styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Text, View} from 'native-base';
import {isIOS} from '~/utils';
import {
  AutomatedEmergencySettings,
  automatedEmergencySettingsSelector,
  userSelector,
} from '~/redux/user/selectors';
import {useGoogleFitAuthStatus} from '~/hooks/UseGoogleFitAuthStatus.hook';
import React, {useCallback, useEffect, useState} from 'react';
import {IUser} from '~/redux/user/user.slice';
import ToastService from '~/services/Toast.service';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import {updateUser} from '~/redux/user/thunks';
import EnvConfig from '~/services/Env.service';
import {setEmergencyCheckType} from '~/redux/automatedEmergency/automatedEmergency.slice';
import colors from '~/theme/colors';
import SwitchButton from '~/components/SwitchButton';
import IntervalSelect from '~/components/IntervalSelect';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {Screens} from '~/models/Navigation.model';
import {useNavigation} from '@react-navigation/native';
import useBioTriggerValid from '~/hooks/UseBioTriggerValid.hook';

type BasedTriggerSwitchStepsType = Pick<
  IUser,
  | 'pulseBasedTriggerIOSHealthPermissions'
  | 'pulseBasedTriggerIOSAppleWatchPaired'
  | 'pulseBasedTriggerConnectedToGoogleFit'
  | 'pulseBasedTriggerBackgroundModesEnabled'
  | 'pulseBasedTriggerGoogleFitAuthenticated'
>;

const BioBasedTrigger = () => {
  const MaxDescriptionLength = 75;
  const defaultPositiveInfoPeriod = 1440;
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(userSelector);
  const {authorizeGoogleFit, isGoogleFitAuthorized, resetGoogleFit} =
    useGoogleFitAuthStatus();
  const {regularPushNotification, positiveInfoPeriod} = useAppSelector(
    automatedEmergencySettingsSelector,
  );
  const [showFullBioDescription, setShowFullBioDescription] = useState(
    !regularPushNotification,
  );
  const [showBioSettings, setShowBioSettings] = useState(
    !regularPushNotification,
  );

  const [recommendedPeriod, setRecommendedPeriod] = useState<string | null>(
    null,
  );
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const {isPlatformConditionsValid} = useBioTriggerValid();

  useEffect(() => {
    const abortController = new AbortController();

    const handleRecommendedPeriod = async () => {
      try {
        const period = isIOS
          ? await Settings.get(AsyncStorageEnum.RecommendedPeriod)
          : await AsyncStorageService.getItem(
              AsyncStorageEnum.RecommendedPeriod,
            );
        setRecommendedPeriod(period);
      } catch (error) {
        console.error('Error retrieving recommended period:', error);
        setRecommendedPeriod(null);
      }
    };

    const handleDaysLeft = async () => {
      const startingDateString = isIOS
        ? await Settings.get(AsyncStorageEnum.StartingDate)
        : await AsyncStorageService.getItem(AsyncStorageEnum.StartingDate);
      if (startingDateString) {
        const startingDate = new Date(startingDateString);
        const currentDate = new Date();
        const timeDifferenceMillis =
          currentDate.getTime() - startingDate.getTime();
        const daysDifference = Math.floor(
          timeDifferenceMillis / (1000 * 60 * 60 * 24),
        );
        if (daysDifference < 7) {
          setDaysLeft(7 - daysDifference);
        }
      } else {
        setDaysLeft(7);
      }
    };

    handleRecommendedPeriod();
    handleDaysLeft();

    return () => {
      abortController.abort();
    };
  }, []);

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
      regularPushNotification: false,
    };
    updateData.positiveInfoPeriod =
      positiveInfoPeriod || defaultPositiveInfoPeriod;

    handleUpdateUser(updateData, true);
  }, [handleUpdateUser, positiveInfoPeriod]);

  const handleSpecificTimesNavigation = useCallback(() => {
    navigate(Screens.SpecificTimePaused as never);
  }, [navigate]);

  const handleWarningMessage = useCallback(
    (frequency: number) => {
      Alert.alert(
        t('warningFrequencyMessage.android.title'),
        t('warningFrequencyMessage.android.description'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('common.setUpPauseTimes'),
            onPress: () => {
              handleSpecificTimesNavigation();
            },
          },
          {
            text: t('common.ok'),
            onPress: () => {
              handleUpdateUser(
                {
                  positiveInfoPeriod: frequency,
                },
                true,
              );
              ToastService.success(
                t(
                  'emergencyContactsSettings.automatedEmergencySettings.frequencySet',
                ) +
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
            },
          },
        ],
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleUpdateUser],
  );

  const handleFrequency = useCallback(
    (frequency: number) => {
      const updateData: IUser = {};
      updateData.positiveInfoPeriod = frequency;

      // user chose 6 or 9 hours
      if ([180, 360, 540].includes(frequency)) {
        handleWarningMessage(frequency);
      } else {
        updateData.positiveInfoPeriod = frequency;
        handleUpdateUser(updateData, true);
        ToastService.success(
          t(
            'emergencyContactsSettings.automatedEmergencySettings.frequencySet',
          ) +
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
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleUpdateUser, handleWarningMessage],
  );

  const handleEmergencyCheckTypeChange = async () => {
    dispatch(setEmergencyCheckType('bio'));
  };

  const handleSwitchChange = useCallback(
    (field: keyof BasedTriggerSwitchStepsType, value: boolean) => {
      if (value) {
        Alert.alert(t('confirmAlert.title'), t('confirmAlert.text'), [
          {
            text: t('common.cancel'),
            onPress: () => {
              handleUpdateUser({
                [field]: false,
              });
            },
            style: 'cancel',
          },
          {
            text: t('common.ok'),
            onPress: () => {
              handleUpdateUser(
                {
                  [field]: value,
                },
                true,
              );
            },
          },
        ]);
      } else {
        handleUpdateUser(
          {
            [field]: value,
          },
          true,
        );
      }
    },
    [handleUpdateUser, t],
  );

  const renderDescription = () => {
    const description = isIOS
      ? t(
          'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.description',
        )
      : t(
          'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.description',
        );

    if (showFullBioDescription) {
      return (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowFullBioDescription(!showFullBioDescription);
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
            setShowFullBioDescription(!showFullBioDescription);
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

  const handleAuthorizeGoogleFit = useCallback(
    async value => {
      if (value) {
        Alert.alert(t('confirmAlert.title'), t('confirmAlert.text'), [
          {
            text: t('common.cancel'),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: t('common.ok'),
            onPress: async () => {
              await authorizeGoogleFit();
              handleUpdateUser(
                {pulseBasedTriggerGoogleFitAuthenticated: value},
                true,
              );
            },
          },
        ]);
      } else {
        await resetGoogleFit();
        handleUpdateUser(
          {pulseBasedTriggerGoogleFitAuthenticated: false},
          true,
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authorizeGoogleFit, handleUpdateUser, resetGoogleFit],
  );

  const renderSettings = () => {
    if (showBioSettings) {
      return (
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowBioSettings(!showBioSettings);
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
            setShowBioSettings(!showBioSettings);
          }}
        >
          <Text style={styles.settingsTouchText}>
            {t('emergencyContactsSettings.automatedEmergencySettings.seeAll')}
          </Text>
        </TouchableOpacity>
      );
    }
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
            'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.title',
          )}
        </Text>
        {isPlatformConditionsValid ? (
          <View style={[styles.activeButton, styles.isActive]}>
            <View style={styles.buttonIcon}>
              <IconFontisto
                name={'heartbeat'}
                size={14}
                color={colors.pink[600]}
              />
            </View>
            <Text style={[styles.buttonText, {color: colors.white}]}>
              {t(
                'emergencyContactsSettings.automatedEmergencySettings.systemOn',
              )}
            </Text>
          </View>
        ) : (
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
        )}
      </View>
      <>
        {isIOS ? (
          <>
            <View style={styles.panelBody}>
              {renderDescription()}
              <SwitchButton
                value={!regularPushNotification}
                title={t(
                  'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.turnOn',
                )}
                containerStyle={styles.switchButton}
                onSwitchPress={value => {
                  updateUserDataOnChange();
                  setShowBioSettings(value);
                  handleEmergencyCheckTypeChange();
                  handleManualEmergencySwitch(value);
                }}
              />
              {regularPushNotification && (
                <Text fontSize={12} py={2} color={colors.red[600]}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.warning',
                  )}
                </Text>
              )}
            </View>
            {showBioSettings && (
              <View style={styles.panelFooter}>
                <SwitchButton
                  value={user.pulseBasedTriggerIOSAppleWatchPaired}
                  title={t(
                    'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.title',
                  )}
                  containerStyle={styles.switchButton}
                  onSwitchPress={value =>
                    handleSwitchChange(
                      'pulseBasedTriggerIOSAppleWatchPaired',
                      value,
                    )
                  }
                  showQuestionIcon
                  onQuestionPress={() =>
                    Alert.alert(
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.alertTitle',
                      ),
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.appleWatch.alertDescription',
                      ),
                    )
                  }
                />
                <View mt={5}>
                  <Text fontSize={16}>
                    {t(
                      'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.frequency',
                    )}
                  </Text>
                  <IntervalSelect
                    type="bio"
                    onValueChange={itemValue => handleFrequency(+itemValue)}
                    selectedValue={`${positiveInfoPeriod}`}
                  />
                </View>
                <View style={styles.message}>
                  {isPlatformConditionsValid &&
                    (recommendedPeriod ? (
                      <Text fontSize={12} color={colors.red[600]}>
                        {t(
                          'dashboard.automatedEmergency.recommendationMessage',
                          {recommendedPeriod},
                        )}
                      </Text>
                    ) : (
                      <Text fontSize={12} color={colors.red[600]}>
                        {t(
                          'dashboard.automatedEmergency.recommendationDaysLeft',
                          {daysLeft},
                        )}
                        {daysLeft === 1
                          ? t('dashboard.automatedEmergency.day')
                          : t('dashboard.automatedEmergency.days')}
                      </Text>
                    ))}
                </View>
              </View>
            )}
            {renderSettings()}
          </>
        ) : (
          <>
            <View style={styles.panelBody}>
              {renderDescription()}
              <SwitchButton
                value={!regularPushNotification}
                title={t(
                  'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.turnOn',
                )}
                containerStyle={styles.switchButton}
                onSwitchPress={value => {
                  updateUserDataOnChange();
                  setShowBioSettings(value);
                  handleEmergencyCheckTypeChange();
                  handleManualEmergencySwitch(value);
                }}
              />
              {regularPushNotification && (
                <Text fontSize={12} py={2} color={colors.red[600]}>
                  {t(
                    'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.warning',
                  )}
                </Text>
              )}
            </View>
            {showBioSettings && (
              <View style={styles.panelFooter}>
                <SwitchButton
                  value={isGoogleFitAuthorized}
                  title={t(
                    'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.title',
                  )}
                  containerStyle={styles.switchButton}
                  onSwitchPress={handleAuthorizeGoogleFit}
                  showQuestionIcon
                  onQuestionPress={() =>
                    Alert.alert(
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertTitle1',
                      ),
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertDescription1',
                      ),
                    )
                  }
                />
                <SwitchButton
                  value={user.pulseBasedTriggerConnectedToGoogleFit}
                  title={t(
                    'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.connect',
                  )}
                  containerStyle={styles.switchButton}
                  onSwitchPress={value =>
                    handleSwitchChange(
                      'pulseBasedTriggerConnectedToGoogleFit',
                      value,
                    )
                  }
                  showQuestionIcon
                  onQuestionPress={() =>
                    Alert.alert(
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertTitle2',
                      ),
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.googleFit.alertDescription2',
                      ),
                    )
                  }
                />
                <SwitchButton
                  value={user.pulseBasedTriggerBackgroundModesEnabled}
                  title={t(
                    'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.backgroundModes.title',
                  )}
                  containerStyle={styles.switchButton}
                  onSwitchPress={value =>
                    handleSwitchChange(
                      'pulseBasedTriggerBackgroundModesEnabled',
                      value,
                    )
                  }
                  showQuestionIcon
                  onQuestionPress={() =>
                    Alert.alert(
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.backgroundModes.alertTitle',
                      ),
                      t(
                        'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.backgroundModes.alertDescription',
                      ),
                    )
                  }
                />
                <View mt={5}>
                  <Text fontSize={16}>
                    {t(
                      'emergencyContactsSettings.automatedEmergencySettings.bioTrigger.frequency',
                    )}
                  </Text>
                  <IntervalSelect
                    type="bio"
                    onValueChange={itemValue => handleFrequency(+itemValue)}
                    selectedValue={`${positiveInfoPeriod}`}
                  />
                </View>
                <View style={styles.message}>
                  {isPlatformConditionsValid &&
                    (recommendedPeriod ? (
                      <Text fontSize={12} color={colors.red[600]}>
                        {t(
                          'dashboard.automatedEmergency.recommendationMessage',
                          {recommendedPeriod},
                        )}
                      </Text>
                    ) : (
                      <Text fontSize={12} color={colors.red[600]}>
                        {t(
                          'dashboard.automatedEmergency.recommendationDaysLeft',
                          {daysLeft},
                        )}
                        {daysLeft === 1
                          ? t('dashboard.automatedEmergency.day')
                          : t('dashboard.automatedEmergency.days')}
                      </Text>
                    ))}
                </View>
              </View>
            )}
            {renderSettings()}
          </>
        )}
      </>
    </View>
  );
};

export default BioBasedTrigger;
