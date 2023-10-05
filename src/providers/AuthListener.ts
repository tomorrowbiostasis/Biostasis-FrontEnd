import messaging from '@react-native-firebase/messaging';
import {useEffect, useState} from 'react';
import {Platform, Settings} from 'react-native';
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
import {stopBackgroundFetch} from '~/services/Background.service';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {AwsUserInternalStatus} from '~/services/Amazon.types';
import {useGoogleFitAuthStatus} from '~/hooks/UseGoogleFitAuthStatus.hook';
import {isAndroid} from '~/utils';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
// import {getLocales} from 'react-native-localize';
// import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

const AuthListener = () => {
  const dispatch = useAppDispatch();
  const {user: profile} = useAppSelector(userSelector);
  const [user, setUser] = useState({
    internalStatus: AwsUserInternalStatus.loading,
  });
  const {authorizeGoogleFit} = useGoogleFitAuthStatus();
  // const {setAppLanguage} = useAppTranslation();

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
    const abortController = new AbortController();

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

    return () => {
      abortController.abort();
    };
    // @ts-ignore-next-line
  }, [dispatch, user]);

  /* Detect the device language for both platforms did not apply it because we need to build a responsive design */

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   const handleLanguage = async () => {
  //     let deviceLanguage = isAndroid
  //       ? await AsyncStorage.getItem(AsyncStorageEnum.Language)
  //       : Settings.get(AsyncStorageEnum.Language);
  //     if (!deviceLanguage) {
  //       deviceLanguage = getLocales()[0].languageCode;
  //     }
  //     setAppLanguage(deviceLanguage);
  //   };

  //   handleLanguage();

  //   return () => {
  //     abortController.abort();
  //   };
  // }, [setAppLanguage]);

  return null;
};

export default AuthListener;
