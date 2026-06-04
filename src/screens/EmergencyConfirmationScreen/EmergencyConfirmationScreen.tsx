import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import {BioEmergencyContactFillMapPin} from '~/assets/icons/BiostasisIcons';
import NativeBottomSheet from '~/components/NativeBottomSheet';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useGeoPosition} from '~/hooks/UseGeoPosition.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {useTriggerEmergency} from '~/hooks/UseTriggerEmergency.hook';
import {Screens} from '~/models/Navigation.model';
import {getGoogleMapsUrl} from '~/services/Location.service';
import styles from './styles';

const HOLD_SECONDS = 3;
const HOLD_DURATION_MS = HOLD_SECONDS * 1000;

type Status = 'idle' | 'holding' | 'sending' | 'sent' | 'failed';
type LocationPreviewState = 'loading' | 'ready' | 'unavailable';

const buildStaticMapUrl = (latitude: number, longitude: number) =>
  `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=640x280&markers=${latitude},${longitude},red-pushpin`;

const formatCoordinate = (value: number, positiveLabel: string, negativeLabel: string) =>
  `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positiveLabel : negativeLabel}`;

const EmergencyConfirmationScreen = () => {
  const {t} = useAppTranslation();
  const navigation = useNavigation();
  const {triggerEmergency} = useTriggerEmergency();
  const {getGeoPosition} = useGeoPosition();
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);

  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(HOLD_SECONDS);
  const [locationState, setLocationState] =
    useState<LocationPreviewState>('loading');
  const [locationMapUrl, setLocationMapUrl] = useState<string | null>(null);
  const [locationPreviewUrl, setLocationPreviewUrl] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const statusRef = useRef<Status>('idle');
  const holdProgress = useRef(new Animated.Value(0)).current;
  const completionScale = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vibrationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const holdCompletedRef = useRef(false);

  const contactsReady = hasContacts && areContactsEnabled;
  const canDismiss = status !== 'holding' && status !== 'sending';

  const setStatusValue = useCallback((nextStatus: Status) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, []);

  const clearHoldTimers = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (vibrationRef.current) {
      clearInterval(vibrationRef.current);
      vibrationRef.current = null;
    }
    holdAnimationRef.current?.stop();
    holdAnimationRef.current = null;
    Vibration.cancel();
  }, []);

  const dismiss = useCallback(() => {
    clearHoldTimers();
    navigation.goBack();
  }, [clearHoldTimers, navigation]);

  // Fires the real emergency and reflects the result inline.
  const runTrigger = useCallback(async () => {
    setStatusValue('sending');
    const success = await triggerEmergency();
    setStatusValue(success ? 'sent' : 'failed');
  }, [setStatusValue, triggerEmergency]);

  const resetHold = useCallback(
    (animated = true) => {
      clearHoldTimers();
      setCountdown(HOLD_SECONDS);
      setStatusValue('idle');
      holdCompletedRef.current = false;

      const reset = Animated.timing(holdProgress, {
        toValue: 0,
        duration: animated ? 180 : 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      reset.start();
    },
    [clearHoldTimers, holdProgress, setStatusValue],
  );

  const handlePressIn = useCallback(() => {
    if (!contactsReady) {
      navigation.dispatch(
        StackActions.replace(Screens.EmergencyContactSettings),
      );
      return;
    }
    if (statusRef.current !== 'idle') {
      return;
    }

    const holdStartedAt = Date.now();
    setStatusValue('holding');
    holdCompletedRef.current = false;
    setCountdown(HOLD_SECONDS);
    holdProgress.setValue(0);
    completionScale.setValue(1);
    Vibration.vibrate(24);

    countdownRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartedAt;
      const remaining = Math.max(1, HOLD_SECONDS - Math.floor(elapsed / 1000));
      setCountdown(remaining);
    }, 1000);

    vibrationRef.current = setInterval(() => {
      Vibration.vibrate(18);
    }, 1000);

    holdAnimationRef.current = Animated.timing(holdProgress, {
      toValue: 1,
      duration: HOLD_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    holdAnimationRef.current.start(({finished}) => {
      if (!finished) {
        return;
      }
      holdCompletedRef.current = true;
      clearHoldTimers();
      setCountdown(0);
      setStatusValue('sending');
      Animated.sequence([
        Animated.timing(completionScale, {
          toValue: 0.98,
          duration: 70,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(completionScale, {
          toValue: 1,
          stiffness: 360,
          damping: 22,
          mass: 0.6,
          useNativeDriver: true,
        }),
      ]).start(runTrigger);
    });
  }, [
    clearHoldTimers,
    completionScale,
    contactsReady,
    holdProgress,
    navigation,
    runTrigger,
    setStatusValue,
  ]);

  const handlePressOut = useCallback(() => {
    if (statusRef.current === 'holding' && !holdCompletedRef.current) {
      resetHold(true);
    }
  }, [resetHold]);

  // Cancel any in-progress timers if the sheet is unmounted.
  useEffect(() => {
    let active = true;

    const loadLocationPreview = async () => {
      setLocationState('loading');
      try {
        const geoPosition = await getGeoPosition();
        if (!active || !geoPosition) {
          if (active) {
            setLocationState('unavailable');
            setLocationMapUrl(null);
            setLocationPreviewUrl(null);
            setLocationLabel(null);
          }
          return;
        }

        const {
          coords: {latitude, longitude},
        } = geoPosition;
        setLocationMapUrl(getGoogleMapsUrl(geoPosition));
        setLocationPreviewUrl(buildStaticMapUrl(latitude, longitude));
        setLocationLabel(
          `${formatCoordinate(latitude, 'N', 'S')} · ${formatCoordinate(
            longitude,
            'E',
            'W',
          )}`,
        );
        setLocationState('ready');
      } catch {
        if (active) {
          setLocationState('unavailable');
          setLocationMapUrl(null);
          setLocationPreviewUrl(null);
          setLocationLabel(null);
        }
      }
    };

    loadLocationPreview();

    return () => {
      active = false;
      clearHoldTimers();
    };
  }, [clearHoldTimers, getGeoPosition]);

  const steps = [t('emergencyConfirm.step1'), t('emergencyConfirm.step2')];

  const renderResult = () => {
    const isSent = status === 'sent';
    return (
      <View style={styles.resultContent}>
        {!isSent ? (
          <Icon
            name="closecircle"
            size={64}
            color="#D6455D"
            style={styles.resultIcon}
          />
        ) : null}
        <Text style={styles.title}>
          {t(
            isSent
              ? 'emergencyConfirm.sentTitle'
              : 'emergencyConfirm.failedTitle',
          )}
        </Text>
        <Text style={styles.resultDescription}>
          {t(
            isSent
              ? 'emergencyConfirm.sentSubtitle'
              : 'emergencyConfirm.failedSubtitle',
          )}
        </Text>
        {isSent ? (
          <View style={styles.resultDetailsBox}>
            <Text style={styles.resultDetailsTitle}>
              {t('emergencyConfirm.sentDetailsTitle')}
            </Text>
            <Text style={styles.resultDetails}>
              {t('emergencyConfirm.sentDetails')}
            </Text>
          </View>
        ) : null}
        {isSent ? (
          <TouchableOpacity style={styles.primaryButton} onPress={dismiss}>
            <Text style={styles.primaryButtonText}>
              {t('emergencyConfirm.done')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultButtonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={dismiss}>
              <Text style={styles.secondaryButtonText}>
                {t('emergencyConfirm.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={runTrigger}>
              <Text style={styles.primaryButtonText}>
                {t('emergencyConfirm.retry')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderEmergencyAction = () => {
    if (status === 'idle' || status === 'holding') {
      const progressScale = holdProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 1],
      });
      const pressScale = holdProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.96],
      });
      const progressOpacity = holdProgress.interpolate({
        inputRange: [0, 0.12, 1],
        outputRange: [0.18, 0.28, 0.52],
      });

      return (
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={`${t(
            'emergencyConfirm.hold',
          )} ${HOLD_SECONDS} ${t('emergencyConfirm.seconds')}`}
          style={styles.holdPressableCircle}>
          <Animated.View
            style={[
              styles.holdCircle,
              {
                transform: [
                  {scale: Animated.multiply(pressScale, completionScale)},
                ],
              },
            ]}>
            <View style={styles.holdInnerRing} />
            <Animated.View
              style={[
                styles.holdProgressOrb,
                {
                  opacity: progressOpacity,
                  transform: [{scale: progressScale}],
                },
              ]}
            />
            <Text style={styles.holdCount}>{countdown}</Text>
            <Text style={styles.holdSecondsLabel}>
              {t('emergencyConfirm.seconds')}
            </Text>
            <Text style={styles.holdLabel} numberOfLines={2}>
              {t('emergencyConfirm.holdInstruction')}
            </Text>
          </Animated.View>
        </Pressable>
      );
    }
    // sending
    return (
      <View style={styles.sendingCircle}>
        <ActivityIndicator color="#FFFFFF" />
        <Text style={styles.holdLabel}>{t('emergencyConfirm.sending')}</Text>
      </View>
    );
  };

  const isResult = status === 'sent' || status === 'failed';

  const handleOpenMap = useCallback(() => {
    if (locationMapUrl) {
      Linking.openURL(locationMapUrl).catch(() => {});
    }
  }, [locationMapUrl]);

  return (
    <NativeBottomSheet
      visible
      onDismiss={canDismiss ? dismiss : () => {}}
      closeOnBackdropPress={canDismiss}
      swipeToDismiss={canDismiss}
      sheetStyle={styles.sheet}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
          disabled={!canDismiss}
          onPress={canDismiss ? dismiss : undefined}
          style={styles.closeButton}>
          <Icon name="close" size={22} color="#7B6F72" />
        </TouchableOpacity>
      </View>
      {isResult ? (
        renderResult()
      ) : (
        <>
          <View style={styles.content}>
            <Text style={styles.title}>{t('emergencyConfirm.title')}</Text>
            <Text style={styles.description}>
              {t('emergencyConfirm.description')}
            </Text>

            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <View style={styles.locationHeaderCopy}>
                  <BioEmergencyContactFillMapPin />
                  <View style={styles.locationTitleColumn}>
                    <Text style={styles.locationTitle}>
                      {t('emergencyConfirm.locationTitle')}
                    </Text>
                    <Text style={styles.locationSubtitle}>
                      {locationState === 'ready'
                        ? t('emergencyConfirm.locationReady')
                        : locationState === 'loading'
                          ? t('emergencyConfirm.locationLoading')
                          : t('emergencyConfirm.locationUnavailable')}
                    </Text>
                  </View>
                </View>
                {locationMapUrl ? (
                  <TouchableOpacity
                    activeOpacity={0.78}
                    style={styles.mapAction}
                    onPress={handleOpenMap}>
                    <Text style={styles.mapActionText}>
                      {t('emergencyConfirm.openMap')}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {locationPreviewUrl ? (
                <Image
                  source={{uri: locationPreviewUrl}}
                  resizeMode="cover"
                  style={styles.mapPreview}
                />
              ) : (
                <View style={styles.mapPreviewPlaceholder}>
                  <Text style={styles.mapPreviewPlaceholderText}>
                    {locationState === 'loading'
                      ? t('emergencyConfirm.locationLoading')
                      : t('emergencyConfirm.locationUnavailable')}
                  </Text>
                </View>
              )}

              {locationLabel ? (
                <Text style={styles.locationMeta}>{locationLabel}</Text>
              ) : null}
            </View>

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

            <View style={styles.actionArea}>{renderEmergencyAction()}</View>
          </View>
        </>
      )}
    </NativeBottomSheet>
  );
};

export default EmergencyConfirmationScreen;
