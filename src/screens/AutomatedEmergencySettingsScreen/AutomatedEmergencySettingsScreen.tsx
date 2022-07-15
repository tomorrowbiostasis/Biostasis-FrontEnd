import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Linking,
  TouchableOpacity,
  View,
  LayoutAnimation,
  ScrollView,
  Alert,
} from 'react-native';
import {Text} from 'native-base';
import Container from '~/components/Container';
import IntervalSelect from '~/components/IntervalSelect';
import {useTimeSlotPauseStatus} from '~/hooks/UseTimeSlotPauseStatus.hook';
import {isAndroid, isIOS, updateDataCollectionStatus} from '~/utils';
import styles from './styles';
import SwitchButton from '~/components/SwitchButton';
import BottomButton from '~/components/BottomButton';
import PlusIcon from '~/assets/icons/PlusIcon';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Radio, Box} from 'native-base';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  automatedEmergencyPausedDateSelector,
  automatedEmergencyPausedTimesSelector,
} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import PauseEmergencyButton from './components/PauseEmergencyButton';
import {
  automatedEmergencySettingsSelector,
  AutomatedEmergencySettings,
  userSelector,
  userLoading,
} from '~/redux/user/selectors';
import {getUser, updateUser} from '~/redux/user/thunks';
import {useNavigation} from '@react-navigation/native';
import PauseDateInfoText from './components/PauseDateInfoText';
import {deleteTimeSlot} from '~/redux/automatedEmergency/thunks';
import ForwardArrowIcon from '~/assets/icons/ForwardArrowIcon';
import {
  startBackgroundFetch,
  stopBackgroundFetch,
  updateNotification,
} from '~/services/Background.service';
import {IUser} from '~/redux/user/user.slice';
import {useGoogleFitAuthStatus} from '~/hooks/UseGoogleFitAuthStatus.hook';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {checkPushPermissionsIOS, invokeGetToken} from '~/services/Push.service';
import {useDidUpdateEffect} from '~/hooks/UseDidUpdateEffect';
import {isPausedTime} from '~/services/Time.service';

type EmergencyTriggerType = 'pulse' | 'time';

type PulseBasedTriggerSwitchStepsType = Pick<
  IUser,
  | 'pulseBasedTriggerIOSHealthPermissions'
  | 'pulseBasedTriggerIOSAppleWatchPaired'
  | 'pulseBasedTriggerConnectedToGoogleFit'
  | 'pulseBasedTriggerBackgroundModesEnabled'
  | 'pulseBasedTriggerGoogleFitAuthenticated'
>;

const defaultFrequencyOfRegularNotification = 120;
const defaultPositiveInfoPeriod = isIOS ? 720 : 360;

const AutomatedEmergencySettingsScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const {isSlotPause} = useTimeSlotPauseStatus();
  const specificPausedTimes = useAppSelector(
    automatedEmergencyPausedTimesSelector,
  );

  const activeSpecificPausedTimes = specificPausedTimes.filter(
    value => value.isActive,
  ).length;

  const {authorizeGoogleFit, isGoogleFitAuthorized, resetGoogleFit} =
    useGoogleFitAuthStatus();

  const {user} = useAppSelector(userSelector);
  const {
    automatedEmergency,
    readManual,
    regularPushNotification,
    positiveInfoPeriod,
    frequencyOfRegularNotification,
  } = useAppSelector(automatedEmergencySettingsSelector);
  const loading = useAppSelector(userLoading);

  const [isDisclaimerShown, setIsDisclaimerShown] = useState(true);
  const isPulseEmergencyEnabled = useMemo(
    () => automatedEmergency && !regularPushNotification,
    [automatedEmergency, regularPushNotification],
  );

  const isPulseBased = useMemo(
    () => !regularPushNotification,
    [regularPushNotification],
  );
  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleUpdateUser = useCallback(
    (updateData: AutomatedEmergencySettings, touched?: boolean) => {
      if (touched) {
        dispatch(updateUser(updateData));
      }
    },
    [dispatch],
  );

  const handleManualEmergencySwitch = (value: boolean) => {
    const updateData: AutomatedEmergencySettings = {
      automatedEmergency: value,
    };
    handleUpdateUser(updateData, true);
  };
  const stopAutomatedEmergency = useCallback(() => {
    if (isIOS) {
      updateDataCollectionStatus();
    } else {
      stopBackgroundFetch(BackgroundEventsEnum.ReactNativeBackgroundFetch)
        .then(response =>
          console.log('Settings > stopAutomatedEmergency', response),
        )
        .catch(e =>
          console.log('Settings > stopAutomatedEmergency > error', e),
        );
    }
  }, []);

  useEffect(() => {
    !automatedEmergency && stopAutomatedEmergency();
  }, [automatedEmergency, stopAutomatedEmergency]);

  const isNowPaused = isPausedTime(new Date(), pausedDate, specificPausedTimes);

  useEffect(() => {
    if (pausedDate && pausedDate.timestamp < Date.now()) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
    }
  }, [dispatch, pausedDate]);

  useDidUpdateEffect(() => {
    if (isAndroid && isPulseEmergencyEnabled && !isNowPaused) {
      updateNotification(
        'Automated Health Check',
        'The Biostasis Emergency App is checking your pulse data',
      );
    }
  }, [isPulseEmergencyEnabled]);

  const handleReadManualSwitchPress = useCallback(
    (value: boolean) => {
      const updateData: AutomatedEmergencySettings = {
        readManual: value,
      };
      if (!value) {
        updateData.automatedEmergency = false;
      }
      handleUpdateUser(updateData, true);
    },
    [handleUpdateUser],
  );

  const startAutomatedEmergency = useCallback(() => {
    if (isIOS) {
      updateDataCollectionStatus();
    } else {
      startBackgroundFetch()
        .then(status => {
          console.log('Settings > startAutomatedEmergency', status);
        })
        .catch(e =>
          console.log('Settings > startAutomatedEmergency > error', e),
        );
    }
    invokeGetToken();
  }, []);

  const handleChangeAutomatedEmergencyState = useCallback(
    (isPulseChosen = false) => {
      console.log('Automated Emergency: changing state to', isPulseChosen);
      const updateData: IUser = {
        automatedEmergency: isPulseChosen,
      };
      if (isPulseChosen) {
        updateData.regularPushNotification = false;
        handleUpdateUser(updateData);
        return startAutomatedEmergency();
      }
      return stopAutomatedEmergency();
    },
    [handleUpdateUser, startAutomatedEmergency, stopAutomatedEmergency],
  );

  useEffect(() => {
    automatedEmergency && checkPushPermissionsIOS();
  }, [automatedEmergency]);

  useEffect(() => {
    const validatePlatformConditions = isIOS
      ? user.pulseBasedTriggerIOSAppleWatchPaired
      : isGoogleFitAuthorized &&
        user.pulseBasedTriggerConnectedToGoogleFit &&
        user.pulseBasedTriggerBackgroundModesEnabled;
    // TODO inv some problematic behaviour with stopping background fetch while focusing on this screen
    handleChangeAutomatedEmergencyState(
      !regularPushNotification && validatePlatformConditions,
    );
  }, [
    handleChangeAutomatedEmergencyState,
    isGoogleFitAuthorized,
    user.pulseBasedTriggerConnectedToGoogleFit,
    user.pulseBasedTriggerBackgroundModesEnabled,
    user.pulseBasedTriggerIOSAppleWatchPaired,
    regularPushNotification,
    user.pulseBasedTriggerGoogleFitAuthenticated,
  ]);

  const handleAuthorizeGoogleFit = useCallback(
    async value => {
      if (value) {
        Alert.alert('Are you sure?', 'Confirm this action?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
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
    [authorizeGoogleFit, handleUpdateUser, resetGoogleFit],
  );

  const redirectToManual = useCallback(() => {
    Linking.openURL('https://tomorrowbiostasis.com/');
  }, []);

  const handleSpecificTimesNavigation = useCallback(() => {
    navigate('SpecificTimePaused');
  }, [navigate]);

  const pauseEmergencyButtonProps = useMemo(
    () => ({
      disabled: !automatedEmergency,
    }),
    [automatedEmergency],
  );

  const updateUserDataOnRadioChange = useCallback(
    (type: EmergencyTriggerType) => {
      const updateData: IUser = {
        regularPushNotification: type === 'time',
      };
      if (type === 'time') {
        updateData.frequencyOfRegularNotification =
          frequencyOfRegularNotification ||
          defaultFrequencyOfRegularNotification;
      } else {
        updateData.positiveInfoPeriod =
          positiveInfoPeriod || defaultPositiveInfoPeriod;
      }
      handleUpdateUser(updateData, true);
    },
    [handleUpdateUser, frequencyOfRegularNotification, positiveInfoPeriod],
  );

  const handleFrequency = useCallback(
    (frequency: number, type: EmergencyTriggerType) => {
      const updateData: IUser = {};
      if (type === 'time') {
        updateData.frequencyOfRegularNotification = frequency;
      } else {
        updateData.positiveInfoPeriod = frequency;
      }
      handleUpdateUser(updateData, true);
    },
    [handleUpdateUser],
  );

  const handleSwitchChange = useCallback(
    (field: keyof PulseBasedTriggerSwitchStepsType, value: boolean) => {
      if (value) {
        Alert.alert(t('confirmAlert.title'), t('confirmAlert.text'), [
          {
            text: 'Cancel',
            onPress: () => {
              handleUpdateUser({
                [field]: false,
              });
            },
            style: 'cancel',
          },
          {
            text: 'OK',
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

  return (
    <Container
      loading={loading}
      type="static"
      title={t('emergencyContacts.automatedEmergencySettings.title')}
      contentContainerStyle={styles.container}>
      <ScrollView>
        <View style={styles.topContentContainer}>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.easeInEaseOut();
              setIsDisclaimerShown(value => !value);
            }}
            style={styles.expandableSectionWrapper}>
            <Text fontSize={'sm'} style={styles.warningText} pb={2} flex={3}>
              {t(
                'emergencyContacts.automatedEmergencySettings.pleaseReadManual',
              )}
            </Text>
            <View style={styles.expandIconWrapper}>
              <View
                style={{
                  transform: [
                    {translateX: -5},
                    {rotate: isDisclaimerShown ? '-90deg' : '90deg'},
                  ],
                }}>
                <ForwardArrowIcon />
              </View>
            </View>
          </TouchableOpacity>
          {isDisclaimerShown && (
            <>
              <Text fontSize={'sm'} style={styles.descriptionText}>
                {t(
                  'emergencyContacts.automatedEmergencySettings.systemDescription',
                )}
              </Text>
              <TouchableOpacity onPress={redirectToManual}>
                <Text underline fontSize={'sm'} py={2}>
                  {t(
                    'emergencyContacts.automatedEmergencySettings.manualDescription',
                  )}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <SwitchButton
            value={readManual}
            title={t(
              'emergencyContacts.automatedEmergencySettings.confirmReadManual',
            )}
            containerStyle={styles.switchButton}
            onSwitchPress={handleReadManualSwitchPress}
          />
          <SwitchButton
            value={automatedEmergency}
            disabled={!readManual}
            title={t(
              'emergencyContacts.automatedEmergencySettings.enableAutomatedEmergency',
            )}
            containerStyle={styles.switchButton}
            onSwitchPress={handleManualEmergencySwitch}
            paused={!!pausedDate || !!isSlotPause}
          />
          <PauseDateInfoText isSlotPause={isSlotPause} />
          {automatedEmergency && (
            <Radio.Group
              name="whichTrigger"
              value={isPulseBased ? 'pulse' : 'time'}
              onChange={nextValue => {
                LayoutAnimation.easeInEaseOut();
                updateUserDataOnRadioChange(nextValue as EmergencyTriggerType);
              }}>
              <Box flexDirection="row" mt={6}>
                <Radio value="pulse" />
                <Text fontSize={'lg'} noOfLines={1} ml={2}>
                  {t(
                    'emergencyContacts.automatedEmergencySettings.pulseTrigger.title',
                  )}
                </Text>
              </Box>
              {isPulseBased && (
                <View style={styles.indented}>
                  {isIOS ? (
                    <>
                      <Text fontSize={'xs'} style={styles.infoText}>
                        {t(
                          'emergencyContacts.automatedEmergencySettings.pulseTrigger.description',
                        )}
                      </Text>
                      <Text
                        fontSize={'xs'}
                        style={[styles.infoText, styles.underline]}>
                        {`System is ${
                          user.pulseBasedTriggerIOSAppleWatchPaired
                            ? 'ON'
                            : 'OFF'
                        }`}
                      </Text>
                      <SwitchButton
                        smaller
                        value={user.pulseBasedTriggerIOSAppleWatchPaired}
                        title={t(
                          'emergencyContacts.automatedEmergencySettings.pulseTrigger.appleWatch.title',
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
                              'emergencyContacts.automatedEmergencySettings.pulseTrigger.appleWatch.alertTitle',
                            ),
                            t(
                              'emergencyContacts.automatedEmergencySettings.pulseTrigger.appleWatch.alertDescription',
                            ),
                          )
                        }
                      />
                      <IntervalSelect
                        type="pulse"
                        onValueChange={itemValue =>
                          handleFrequency(+itemValue, 'pulse')
                        }
                        selectedValue={`${positiveInfoPeriod}`}
                      />
                    </>
                  ) : (
                    <>
                      <Text fontSize={'xs'} style={styles.infoText}>
                        {t(
                          'emergencyContacts.automatedEmergencySettings.pulseTrigger.googleFit.description',
                        )}
                      </Text>
                      <Text
                        fontSize={'xs'}
                        style={[styles.infoText, styles.underline]}>
                        {`System is ${
                          isGoogleFitAuthorized &&
                          user.pulseBasedTriggerConnectedToGoogleFit &&
                          user.pulseBasedTriggerBackgroundModesEnabled
                            ? 'ON'
                            : 'OFF'
                        }`}
                      </Text>
                      <SwitchButton
                        smaller
                        value={isGoogleFitAuthorized}
                        title={t(
                          'emergencyContacts.automatedEmergencySettings.pulseTrigger.googleFit.title',
                        )}
                        containerStyle={styles.switchButton}
                        onSwitchPress={handleAuthorizeGoogleFit}
                        showQuestionIcon
                        onQuestionPress={() =>
                          Alert.alert(
                            'Authenticate',
                            "Please authenticate Google Fit to let Biostasis access your recorder pulse data. If you don't have the Google Fit app installed, please install it from Google Play first.",
                          )
                        }
                      />
                      <SwitchButton
                        smaller
                        value={user.pulseBasedTriggerConnectedToGoogleFit}
                        title={t(
                          'emergencyContacts.automatedEmergencySettings.pulseTrigger.googleFit.connect',
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
                              'emergencyContacts.automatedEmergencySettings.pulseTrigger.googleFit.alertTitle',
                            ),
                            t(
                              'emergencyContacts.automatedEmergencySettings.pulseTrigger.googleFit.alertDescription',
                            ),
                          )
                        }
                      />
                      <SwitchButton
                        smaller
                        value={user.pulseBasedTriggerBackgroundModesEnabled}
                        title={t(
                          'emergencyContacts.automatedEmergencySettings.pulseTrigger.backgroundModes.title',
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
                              'emergencyContacts.automatedEmergencySettings.pulseTrigger.backgroundModes.alertTitle',
                            ),
                            t(
                              'emergencyContacts.automatedEmergencySettings.pulseTrigger.backgroundModes.alertDescription',
                            ),
                          )
                        }
                      />
                      <IntervalSelect
                        type="pulse"
                        onValueChange={itemValue =>
                          handleFrequency(+itemValue, 'pulse')
                        }
                        selectedValue={`${positiveInfoPeriod}`}
                      />
                    </>
                  )}
                </View>
              )}
              <Box flexDirection="row" mt={6}>
                <Radio value="time" />
                <Text fontSize={'lg'} noOfLines={1} ml={2}>
                  {t(
                    'emergencyContacts.automatedEmergencySettings.timeTrigger.title',
                  )}
                </Text>
              </Box>
              {!isPulseBased && (
                <View style={styles.indented}>
                  <Text fontSize={'xs'} style={styles.infoText}>
                    {t(
                      'emergencyContacts.automatedEmergencySettings.timeTrigger.description',
                    )}
                  </Text>
                  <IntervalSelect
                    selectedValue={`${frequencyOfRegularNotification}`}
                    type={'time'}
                    onValueChange={itemValue =>
                      handleFrequency(+itemValue, 'time')
                    }
                  />
                </View>
              )}
            </Radio.Group>
          )}
        </View>
      </ScrollView>
      <PauseEmergencyButton bottomButtonProps={pauseEmergencyButtonProps} />
      <BottomButton
        leftIcon={<PlusIcon />}
        title={t(
          'emergencyContacts.automatedEmergencySettings.setUpSpecificTimes',
          {
            specificTimes:
              activeSpecificPausedTimes > 0
                ? `(${activeSpecificPausedTimes})`
                : '',
          },
        )}
        onPress={handleSpecificTimesNavigation}
        withBottomBorder
        disabled={!automatedEmergency}
      />
    </Container>
  );
};

export default AutomatedEmergencySettingsScreen;
