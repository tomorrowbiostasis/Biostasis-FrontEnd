import messaging from '@react-native-firebase/messaging';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useAppDispatch} from '~/redux/store/hooks';
import {getAwsUser} from '~/services/Amazon.service';
import {Hub} from '@aws-amplify/core';
import {setIsAuthed} from '~/redux/auth/auth.slice';
import {clearUser} from '~/redux/user/user.slice';
import {getUser} from '~/redux/user/thunks';
import {getTimeSlot} from '~/redux/automatedEmergency/thunks';
import {getEmergencyContacts} from '~/redux/emergencyContacts/thunks';
import {setLoadingInitData} from '~/redux/config/config.slice';
import {useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';
import API from '~/services/API.service';
import {
  startBackgroundFetch,
  stopBackgroundFetch,
  updateNotification,
} from '~/services/Background.service';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {checkPushPermissionsIOS, invokeGetToken} from '~/services/Push.service';
import {AwsUserInternalStatus} from '~/services/Amazon.types';
import {useGoogleFitAuthStatus} from '~/hooks/UseGoogleFitAuthStatus.hook';
import {isPausedTime} from '~/services/Time.service';
import {
  automatedEmergencyPausedDateSelector,
  automatedEmergencyPausedTimesSelector,
} from '~/redux/automatedEmergency/selectors';
import {isAndroid} from '~/utils';

const AuthListener = () => {
  const dispatch = useAppDispatch();
  // const {t} = useTranslation();

  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const specificPausedTimes = useAppSelector(
    automatedEmergencyPausedTimesSelector,
  );
  const {user: profile} = useAppSelector(userSelector);
  const [user, setUser] = useState({
    internalStatus: AwsUserInternalStatus.loading,
  });
  const [isEmergencyStatus, setIsEmergencyStatus] = useState(false);

  const {authorizeGoogleFit} = useGoogleFitAuthStatus();

  const isNowPaused = isPausedTime(new Date(), pausedDate, specificPausedTimes);

  useEffect(() => {
    Hub.listen('auth', ({payload: {event, data}}) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getAwsUser().then(setUser);
          break;
        case 'signOut':
          setUser({internalStatus: AwsUserInternalStatus.notLoggedIn});
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getAwsUser().then(setUser);
  }, []);

  useEffect(() => {
    if (profile.pulseBasedTriggerGoogleFitAuthenticated && isAndroid) {
      authorizeGoogleFit();
    }
  }, [authorizeGoogleFit, profile.pulseBasedTriggerGoogleFitAuthenticated]);

  useEffect(() => {
    // @ts-ignore-next-line
    const isAuthed = Boolean(user?.username);
    if (isAuthed) {
      dispatch(setLoadingInitData(true));
    }
    dispatch(setIsAuthed({isAuthed}));
  }, [dispatch, user]);

  useEffect(() => {
    const initData = async () => {
      try {
        if (isAndroid) {
          const fcmToken = await messaging().getToken();
          fcmToken && (await API.updateUserToken(fcmToken));
        }
        await dispatch(getUser());
        await dispatch(getEmergencyContacts());
        await dispatch(getTimeSlot());
      } catch (_) {
      } finally {
        dispatch(setLoadingInitData(false));
      }
    };
    if (user.internalStatus === AwsUserInternalStatus.loggedIn) {
      initData();
    } else if (user.internalStatus === AwsUserInternalStatus.notLoggedIn) {
      dispatch(clearUser());

      if (Platform.OS === 'android') {
        stopBackgroundFetch(
          BackgroundEventsEnum.ReactNativeBackgroundFetch,
        ).then(() => console.log('stopped background fetch'));
      }
    }
    // @ts-ignore-next-line
  }, [dispatch, user]);

  useEffect(() => {
    if (profile.id) {
      if (profile.automatedEmergency && !profile.regularPushNotification) {
        if (Platform.OS === 'android') {
          startBackgroundFetch().then(status => {
            console.log('background service enabled with status', status);
            setIsEmergencyStatus(true);
          });
        } else {
          checkPushPermissionsIOS().then(null);
        }
      }
      // FIXME: ADD hook for get data from Async Storage and add conditional for check Google Fit Authenticated status
    }
  }, [
    profile.automatedEmergency,
    profile.regularPushNotification,
    profile.id,
    profile.pulseBasedTriggerGoogleFitAuthenticated,
    authorizeGoogleFit,
  ]);
  useEffect(() => {
    profile.id && invokeGetToken();
  }, [profile.id]);

  useEffect(() => {
    if (isEmergencyStatus && !isNowPaused) {
      updateNotification(
        'Automated Health Check',
        'The Biostasis Emergency App is checking your pulse data',
      );
    }
  }, [isEmergencyStatus, isNowPaused]);

  return null;
};

export default AuthListener;
