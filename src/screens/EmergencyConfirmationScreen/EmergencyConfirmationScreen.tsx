import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackActions, useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {useEmergencyValue} from '~/services/Emergency.service';
import {useNavigateToAddNewEmergencyContactScreenName} from '~/hooks/UseNavigateWithLogic.hook';
import styles from './styles';

const HOLD_SECONDS = 3;

const EmergencyConfirmationScreen = () => {
  const {t} = useAppTranslation();
  const navigation = useNavigation();
  const {startEmergency} = useEmergencyValue();
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  const addContactScreen = useNavigateToAddNewEmergencyContactScreenName();

  const [countdown, setCountdown] = useState(HOLD_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contactsReady = hasContacts && areContactsEnabled;

  const dismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handlePressIn = useCallback(() => {
    if (!contactsReady) {
      navigation.dispatch(StackActions.replace(addContactScreen));
      return;
    }
    setCountdown(HOLD_SECONDS);
    intervalRef.current = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : prev));
    }, 1000);
    timeoutRef.current = setTimeout(() => {
      clearTimers();
      Vibration.vibrate();
      startEmergency();
      dismiss();
    }, HOLD_SECONDS * 1000);
  }, [
    contactsReady,
    dismiss,
    navigation,
    addContactScreen,
    clearTimers,
    startEmergency,
  ]);

  const handlePressOut = useCallback(() => {
    clearTimers();
    setCountdown(HOLD_SECONDS);
  }, [clearTimers]);

  // Cancel any in-progress hold if the sheet is dismissed.
  useEffect(() => clearTimers, [clearTimers]);

  const steps = [t('emergencyConfirm.step1'), t('emergencyConfirm.step2')];

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={styles.scrim} />
      </TouchableWithoutFeedback>

      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('emergencyConfirm.title')}</Text>
          <Text style={styles.description}>
            {t('emergencyConfirm.description')}
          </Text>

          <View style={styles.steps}>
            {steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <Text style={styles.stepNumber}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View style={styles.stepMarkerColumn}>
                  <View style={styles.stepDot}>
                    <View style={styles.stepDotInner} />
                  </View>
                  {index < steps.length - 1 ? (
                    <View style={styles.stepLine}>
                      {Array.from({length: 5}).map((_, dotIndex) => (
                        <View key={dotIndex} style={styles.stepLineDot} />
                      ))}
                    </View>
                  ) : null}
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.holdBar}>
          <Text style={styles.holdCount}>{countdown}</Text>
          <Text style={styles.holdLabel}>{t('emergencyConfirm.hold')}</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

export default EmergencyConfirmationScreen;
