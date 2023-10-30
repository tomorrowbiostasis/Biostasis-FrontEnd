/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Linking,
  TouchableOpacity,
  View,
  LayoutAnimation,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Text} from 'native-base';
import Container from '~/components/Container';
import {useTimeSlotPauseStatus} from '~/hooks/UseTimeSlotPauseStatus.hook';
import styles from './styles';
import SwitchButton from '~/components/SwitchButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {
  automatedEmergencySettingsSelector,
  AutomatedEmergencySettings,
  userSelector,
  userLoading,
} from '~/redux/user/selectors';
import {getUser, updateUser} from '~/redux/user/thunks';
import {useNavigation} from '@react-navigation/native';
import PauseDateInfoText from './components/SetUpPauseTimes/components/PauseDateInfoText';
import {deleteTimeSlot} from '~/redux/automatedEmergency/thunks';

import ToastService from '~/services/Toast.service';
import isBatteryOptimizationOn from '~/services/Battery.service';
import {Screens} from '~/models/Navigation.model';
import colors from '~/theme/colors';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AutomatedEmergency from './components/AutomatedEmergency';
import {isAndroid} from '~/utils';
import {resetRecommendationSystem} from '~/services/Recommendation.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AutomatedEmergencySettingsScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const {isSlotPause} = useTimeSlotPauseStatus();
  const {user} = useAppSelector(userSelector);
  const {automatedEmergency, readManual} = useAppSelector(
    automatedEmergencySettingsSelector,
  );

  const loading = useAppSelector(userLoading);
  const [isDisclaimerShown, setIsDisclaimerShown] = useState(false);

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

  const handleManualEmergencySwitch = async (value: boolean) => {
    const updateData: AutomatedEmergencySettings = {
      automatedEmergency: value,
    };
    handleUpdateUser(updateData, true);
    if (!value) {
      await resetRecommendationSystem(AsyncStorage);
      ToastService.success(
        t(
          'emergencyContactsSettings.automatedEmergencySettings.systemOffMessage',
        ),
      );
    }
  };

  useEffect(() => {
    if (pausedDate && pausedDate.timestamp < Date.now()) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
    }
  }, [dispatch, pausedDate]);

  const handleReadManualSwitchPress = (value: boolean) => {
    const updateData: AutomatedEmergencySettings = {
      readManual: value,
    };
    if (!value) {
      updateData.automatedEmergency = false;
    }
    setIsDisclaimerShown(value);
    handleUpdateUser(updateData, true);
  };

  useEffect(() => {
    isAndroid &&
      automatedEmergency &&
      user.pulseBasedTriggerBackgroundModesEnabled &&
      isBatteryOptimizationOn();
  }, [automatedEmergency, user.pulseBasedTriggerBackgroundModesEnabled]);

  const redirectToManual = useCallback(() => {
    Linking.openURL('https://www.tomorrow.bio/app-manual');
  }, []);

  const handleSpecificTimesNavigation = useCallback(() => {
    navigate(Screens.SpecificTimePaused as never);
  }, [navigate]);

  return (
    <Container
      loading={loading}
      title={t('emergencyContactsSettings.automatedEmergencySettings.title')}
      type={'static'}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      disableWrapper
      showBackIcon
      showDrawerIcon>
      <View style={styles.curveElement} />
      {/* Solve problem with scrollView IOS */}
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          bounces={false}
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <IconFeather name={'settings'} size={26} style={styles.icon} />
              <Text fontSize={'md'} fontWeight={700}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.enableSystemTitle',
                )}
              </Text>
            </View>
            <View style={styles.lineStyle} />

            <View style={styles.panelBody}>
              <SwitchButton
                value={readManual}
                title={t(
                  'emergencyContactsSettings.automatedEmergencySettings.confirmReadManual',
                )}
                containerStyle={styles.switchButton}
                onSwitchPress={handleReadManualSwitchPress}
              />
              <SwitchButton
                value={automatedEmergency}
                disabled={!readManual}
                title={t(
                  'emergencyContactsSettings.automatedEmergencySettings.enableAutomatedEmergency',
                )}
                containerStyle={styles.switchButton}
                onSwitchPress={handleManualEmergencySwitch}
                paused={!!pausedDate || !!isSlotPause}
              />
            </View>
            <View style={styles.panelFooter}>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  setIsDisclaimerShown(value => !value);
                }}
                style={styles.expandableSectionWrapper}>
                <View style={styles.expandIconWrapper}>
                  <View style={styles.instructionBox}>
                    <Text fontSize={'md'}>
                      {t(
                        'emergencyContactsSettings.automatedEmergencySettings.instructions',
                      )}
                    </Text>
                    <View
                      style={{
                        transform: [
                          {translateX: -5},
                          {rotate: isDisclaimerShown ? '-180deg' : '0deg'},
                        ],
                      }}>
                      <IconMaterialIcons
                        name={'arrow-drop-down'}
                        size={24}
                        color={colors.gray[700]}
                      />
                    </View>
                  </View>

                  {isDisclaimerShown && (
                    <View style={styles.instructionBody}>
                      <Text fontSize={'sm'} style={styles.descriptionText}>
                        {t(
                          'emergencyContactsSettings.automatedEmergencySettings.systemDescription',
                        )}
                      </Text>
                      <TouchableOpacity
                        onPress={redirectToManual}
                        style={styles.manualLinkBox}>
                        <Text underline pb={2} style={styles.manualLink}>
                          {t(
                            'emergencyContactsSettings.automatedEmergencySettings.manualDescription',
                          )}
                        </Text>
                        <IconFeather
                          name="external-link"
                          size={18}
                          color={colors.blue[800]}
                        />
                      </TouchableOpacity>
                      <Text fontSize={10} style={styles.warningText}>
                        {t(
                          'emergencyContactsSettings.automatedEmergencySettings.pleaseReadManual',
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {automatedEmergency && (
            <View
              style={isSlotPause || pausedDate ? styles.opacity : null}
              pointerEvents={isSlotPause || pausedDate ? 'none' : 'auto'}>
              <AutomatedEmergency />
            </View>
          )}

          <TouchableOpacity
            onPress={handleSpecificTimesNavigation}
            style={styles.panel}>
            <View style={styles.panelHeader}>
              <View style={[styles.circle, styles.icon]}>
                <IconMaterialCommunityIcons name="play-pause" size={20} />
              </View>
              <Text fontSize={'md'} fontWeight={700}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.pauseTime.title',
                )}
              </Text>
            </View>
            <View style={styles.lineStyle} />

            <View style={styles.panelBody}>
              <Text fontSize={'sm'}>
                {t(
                  'emergencyContactsSettings.automatedEmergencySettings.pauseTime.description',
                )}
              </Text>
              <PauseDateInfoText isSlotPause={isSlotPause} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
};

export default AutomatedEmergencySettingsScreen;
