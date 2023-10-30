import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {LayoutAnimation, Platform} from 'react-native';
import {Box, Text} from 'native-base';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useEmergencyValue} from '~/services/Emergency.service';
import {useCountdownTimer} from 'use-countdown-timer';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {useGeoPosition} from '~/hooks/UseGeoPosition.hook';

import EmergencyInfoWithButton from './components/EmergencyInfoWithButton';
import EmergencyInfoWrapper from './components/EmergencyInfoWrapper';

import {startEmergency} from '~/redux/automatedEmergency/thunks';
import {
  automatedEmergencyLastFailedESelector,
  automatedEmergencyLastSucceededSelector,
  automatedEmergencyPendingSelector,
} from '~/redux/automatedEmergency/selectors';
import {
  animationConfig,
  animationStatuses,
  animationStyles,
  firstCountdownTime,
  infoComponentGradients,
  infoStatuses,
  secondCountdownTime,
} from '~/constants/emergency.constants';
import {GeoPosition} from 'react-native-geolocation-service';
import {
  emergencyRetry,
  scheduleEvent,
  startBackgroundFetch,
} from '~/services/Background.service';

import styles from './styles';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import Loader from '~/components/Loader';
import colors from '~/theme/colors';
import Icon from 'react-native-vector-icons/AntDesign';

export const EmergencyCountdown = () => {
  const {t} = useAppTranslation();
  const {emergencyPressed} = useEmergencyValue();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const {getGeoPosition} = useGeoPosition();

  const emergencyPending = useAppSelector(automatedEmergencyPendingSelector);
  const lastSucceededEmergency = useAppSelector(
    automatedEmergencyLastSucceededSelector,
  );
  const lastFailedEmergency = useAppSelector(
    automatedEmergencyLastFailedESelector,
  );

  const [currentGeoPosition, setCurrentGeoPosition] =
    useState<GeoPosition | null>(null);
  const [countdownValue, setCountdownValue] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [infoComponent, setInfoComponent] = useState(infoStatuses.INFO_OFF);

  const [animationStatus, setAnimationStatus] = useState(
    animationStatuses.ANIMATION_OFF,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentStyles, setCurrentStyles] = useState(
    animationStyles[animationStatuses.ANIMATION_OFF],
  );

  const dispatchEmergency = useCallback(() => {
    dispatch(startEmergency());
  }, [dispatch]);

  /**
   * Setup retry service
   */
  const setupRetries = useCallback(
    async geoPosition => {
      await AsyncStorageService.setItem(
        AsyncStorageEnum.RetryGeoPosition,
        JSON.stringify(geoPosition),
      );

      const backgroundServiceStatus = await startBackgroundFetch();
      console.log(
        `background service status: ${JSON.stringify(backgroundServiceStatus)}`,
      );
      scheduleEvent(BackgroundEventsEnum.EmergencyRetryMechanism, 0)
        .then(() => console.log('first retry task set'))
        .catch(e => {
          console.log('task not scheduled', e);
          dispatchEmergency();
        });
    },
    [dispatchEmergency],
  );

  /**
   * Trigger fired after countdown completes
   */
  const emergencyTrigger = useCallback(async () => {
    setInfoComponent(infoStatuses.INFO_PENDING);
    const geoPosition = await getGeoPosition();
    geoPosition && setCurrentGeoPosition(geoPosition);
    if (Platform.OS === 'ios') {
      dispatchEmergency();
    } else {
      await setupRetries(geoPosition);
      setInfoComponent(infoStatuses.INFO_SUCCEEDED);
    }
  }, [dispatchEmergency, setupRetries, getGeoPosition]);

  /**
   * Handle succeeded emergency
   */
  useEffect(() => {
    if (lastSucceededEmergency) {
      setInfoComponent(infoStatuses.INFO_SUCCEEDED);
    }
  }, [lastSucceededEmergency]);

  /**
   * Handle failed emergency
   */
  useEffect(() => {
    if (lastFailedEmergency) {
      setInfoComponent(infoStatuses.INFO_FAILED);
      emergencyRetry();
      // if (emergencyContacts.length) {
      //   setTimeout(() => {
      //     dispatchEmergency();
      //   }, 30 * 1000);
      // } else {
      //   ToastService.warning(t('dashboard.emergency.noContacts'), {
      //     visibilityTime: 5000,
      //   });
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchEmergency, currentGeoPosition, lastFailedEmergency]);

  /**
   * Set up the countdown
   */
  const {countdown, start, reset, isRunning} = useCountdownTimer({
    timer: firstCountdownTime,
    expireImmediate: true,
    onExpire: emergencyTrigger,
  });

  /**
   * Start the countdown on emergency button press
   */
  useEffect(() => {
    if (emergencyPressed) {
      start();
      setCountdownValue('');
      setAnimationStatus(animationStatuses.ANIMATION_PRESSED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emergencyPressed]);

  /**
   * Resets the timer:
   * 1. When button released within first 3 seconds
   * 2. When Cancel button pressed in the next 5 seconds
   */
  const resetEmergencyTimer = useCallback(() => {
    reset();
    setAnimationStatus(animationStatuses.ANIMATION_OFF);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Triggers when button is released within first 3 seconds
   */
  useEffect(() => {
    if (isRunning && countdown > secondCountdownTime && !emergencyPressed) {
      resetEmergencyTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, countdown, emergencyPressed]);

  /**
   * Triggers when user clicks on Cancel button on next 5 seconds
   */
  const cancelEmergency = useCallback(() => {
    setInfoComponent(infoStatuses.INFO_CANCELED);
    resetEmergencyTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Assigns according animation status on timer tick
   */
  useEffect(() => {
    let actualValue;
    if (countdown > secondCountdownTime) {
      actualValue = 4 - (firstCountdownTime - countdown) / 1000;
      if (actualValue === 3) {
        setAnimationStatus(animationStatuses.ANIMATION_PRESS_3);
      }
      if (actualValue === 2) {
        setAnimationStatus(animationStatuses.ANIMATION_PRESS_2);
      }
      if (actualValue === 1) {
        setAnimationStatus(animationStatuses.ANIMATION_PRESS_1);
      }
    } else {
      actualValue = 5 - (secondCountdownTime - countdown) / 1000;
      if (actualValue === 5) {
        setAnimationStatus(animationStatuses.ANIMATION_COUNTDOWN);
      }
    }
    setCountdownValue(`${actualValue}`);
  }, [countdown]);

  /**
   * Enables the animation if needed and updates the styles for each step
   */
  useEffect(() => {
    if (animationStatus !== animationStatuses.ANIMATION_OFF) {
      LayoutAnimation.configureNext(animationConfig);
    }
    setCurrentStyles(animationStyles[animationStatus]);
  }, [animationStatus]);

  /**
   * Enabled or disables the emergency overlay
   */
  useEffect(() => {
    if (!emergencyPressed && countdown > secondCountdownTime) {
      setOverlayVisible(false);
    } else {
      setOverlayVisible(true);
    }
  }, [emergencyPressed, countdown, setCountdownValue]);

  const dismissInfoComponent = useCallback(
    () => setInfoComponent(infoStatuses.INFO_OFF),
    [],
  );

  const infoTitleForStatus = useMemo(() => {
    switch (infoComponent) {
      case infoStatuses.INFO_SUCCEEDED:
        return t('dashboard.emergency.countdownSent');
      default:
        return t('dashboard.emergency.countdownRetrying');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoComponent]);

  const infoSubtitleForStatus = useMemo(() => {
    switch (infoComponent) {
      case infoStatuses.INFO_SUCCEEDED:
        return t('dashboard.emergency.countdownSubtitleDone');
      default:
        return t('dashboard.emergency.countdownSubtitleRetrying');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoComponent]);

  if (
    [
      infoStatuses.INFO_PENDING,
      infoStatuses.INFO_SUCCEEDED,
      infoStatuses.INFO_FAILED,
    ].includes(infoComponent)
  ) {
    return (
      <EmergencyInfoWrapper color={infoComponentGradients.green}>
        {infoComponent === infoStatuses.INFO_PENDING && (
          <Loader color={colors.white} absolute={true} />
        )}
        <Icon
          name="checkcircleo"
          size={100}
          color={colors.blue[200]}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{textAlign: 'center', margin: 10}}
        />
        <EmergencyInfoWithButton
          title={infoTitleForStatus}
          subtitle={infoSubtitleForStatus}
          count=" "
          buttonCaption={t('dashboard.emergency.ok')}
          buttonVariant="solid"
          onPressButton={dismissInfoComponent}
          loading={emergencyPending}
        />
      </EmergencyInfoWrapper>
    );
  }

  if (infoComponent === infoStatuses.INFO_CANCELED) {
    return (
      <EmergencyInfoWrapper color={infoComponentGradients.black}>
        <Icon
          name="warning"
          size={100}
          color={colors.yellow[600]}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{textAlign: 'center', margin: 10}}
        />
        <EmergencyInfoWithButton
          title={t('dashboard.emergency.countdownCanceled')}
          subtitle=" "
          count=" "
          buttonCaption={t('dashboard.emergency.ok')}
          buttonVariant="solid"
          onPressButton={dismissInfoComponent}
        />
      </EmergencyInfoWrapper>
    );
  }

  if (!overlayVisible) {
    return null;
  }

  return (
    <EmergencyInfoWrapper color={infoComponentGradients.red}>
      {[
        animationStatuses.ANIMATION_PRESSED,
        animationStatuses.ANIMATION_PRESS_3,
        animationStatuses.ANIMATION_PRESS_2,
        animationStatuses.ANIMATION_PRESS_1,
      ].includes(animationStatus) ? (
        <Box style={{marginBottom: insets.bottom}}>
          <Text
            mb={10}
            textAlign="center"
            fontSize="6xl"
            style={styles.counter}>
            {countdownValue}
          </Text>
          <Text textAlign="center" fontSize="2xl" style={styles.title}>
            {`${t('dashboard.emergency.countdown')}`}
          </Text>
          <Text textAlign="center" fontSize="xl" style={styles.subtitle}>
            {`${t('dashboard.emergency.countdownSubtitleHold')}`}
          </Text>
        </Box>
      ) : (
        <EmergencyInfoWithButton
          title={t('dashboard.emergency.countdown')}
          subtitle={t('dashboard.emergency.countdownSubtitleBeing')}
          count={countdownValue}
          buttonCaption={t('dashboard.emergency.cancel')}
          buttonVariant="solid"
          onPressButton={cancelEmergency}
        />
      )}
    </EmergencyInfoWrapper>
  );
};

export default EmergencyCountdown;
