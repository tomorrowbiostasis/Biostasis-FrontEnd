import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {useTriggerEmergency} from '~/hooks/UseTriggerEmergency.hook';
import {useNavigateToAddNewEmergencyContactScreenName} from '~/hooks/UseNavigateWithLogic.hook';
import styles from './styles';

const HOLD_SECONDS = 3;
const CANCEL_WINDOW_MS = 4000;

type Status = 'idle' | 'confirming' | 'sending' | 'sent' | 'failed';

const EmergencyConfirmationScreen = () => {
  const {t} = useAppTranslation();
  const navigation = useNavigation();
  const {triggerEmergency} = useTriggerEmergency();
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  const addContactScreen = useNavigateToAddNewEmergencyContactScreenName();

  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(HOLD_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contactsReady = hasContacts && areContactsEnabled;

  const dismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const clearHoldTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearCancelTimer = useCallback(() => {
    if (cancelTimerRef.current) {
      clearTimeout(cancelTimerRef.current);
      cancelTimerRef.current = null;
    }
  }, []);

  // Fires the real emergency and reflects the result inline.
  const runTrigger = useCallback(async () => {
    setStatus('sending');
    const success = await triggerEmergency();
    setStatus(success ? 'sent' : 'failed');
  }, [triggerEmergency]);

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
      clearHoldTimers();
      Vibration.vibrate();
      // Brief cancel window before the request actually fires.
      setStatus('confirming');
      cancelTimerRef.current = setTimeout(runTrigger, CANCEL_WINDOW_MS);
    }, HOLD_SECONDS * 1000);
  }, [
    contactsReady,
    navigation,
    addContactScreen,
    clearHoldTimers,
    runTrigger,
  ]);

  const handlePressOut = useCallback(() => {
    // Only abort if the hold has not yet completed.
    if (status === 'idle') {
      clearHoldTimers();
      setCountdown(HOLD_SECONDS);
    }
  }, [status, clearHoldTimers]);

  const handleCancel = useCallback(() => {
    clearCancelTimer();
    setCountdown(HOLD_SECONDS);
    setStatus('idle');
  }, [clearCancelTimer]);

  // Cancel any in-progress timers if the sheet is unmounted.
  useEffect(
    () => () => {
      clearHoldTimers();
      clearCancelTimer();
    },
    [clearHoldTimers, clearCancelTimer],
  );

  const steps = [t('emergencyConfirm.step1'), t('emergencyConfirm.step2')];

  const renderResult = () => {
    const isSent = status === 'sent';
    return (
      <View style={styles.resultContent}>
        <Icon
          name={isSent ? 'checkcircle' : 'closecircle'}
          size={64}
          color={isSent ? '#2ABFA0' : '#D6455D'}
          style={styles.resultIcon}
        />
        <Text style={styles.title}>
          {t(isSent ? 'emergencyConfirm.sentTitle' : 'emergencyConfirm.failedTitle')}
        </Text>
        <Text style={styles.description}>
          {t(
            isSent
              ? 'emergencyConfirm.sentSubtitle'
              : 'emergencyConfirm.failedSubtitle',
          )}
        </Text>
        {isSent ? (
          <TouchableOpacity style={styles.primaryButton} onPress={dismiss}>
            <Text style={styles.primaryButtonText}>
              {t('emergencyConfirm.done')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultButtonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={dismiss}>
              <Text style={styles.secondaryButtonText}>
                {t('emergencyConfirm.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={runTrigger}>
              <Text style={styles.primaryButtonText}>
                {t('emergencyConfirm.retry')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderBottom = () => {
    if (status === 'idle') {
      return (
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.holdBar}>
          <Text style={styles.holdCount}>{countdown}</Text>
          <Text style={styles.holdLabel}>{t('emergencyConfirm.hold')}</Text>
        </Pressable>
      );
    }
    // confirming | sending
    return (
      <View style={styles.statusBar}>
        <ActivityIndicator color="#FFFFFF" />
        <Text style={styles.holdLabel}>{t('emergencyConfirm.sending')}</Text>
        {status === 'confirming' ? (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>
              {t('emergencyConfirm.cancel')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const isResult = status === 'sent' || status === 'failed';

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback
        onPress={status === 'idle' ? dismiss : undefined}>
        <View style={styles.scrim} />
      </TouchableWithoutFeedback>

      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {isResult ? (
          renderResult()
        ) : (
          <>
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

            {renderBottom()}
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

export default EmergencyConfirmationScreen;
