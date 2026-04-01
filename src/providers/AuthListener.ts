import messaging from '@react-native-firebase/messaging';
import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {useAppDispatch} from '~/redux/store/hooks';
import {getAwsUser} from '~/services/Amazon.service';
import {Hub} from '@aws-amplify/core';
import {setAuthSessionResolved, setIsAuthed} from '~/redux/auth/auth.slice';
import {clearUser} from '~/redux/user/user.slice';
import {getUser} from '~/redux/user/thunks';
import {getTimeSlot} from '~/redux/automatedEmergency/thunks';
import {getEmergencyContacts} from '~/redux/emergencyContacts/thunks';
import {setLoadingInitData} from '~/redux/config/config.slice';
import API from '~/services/API.service';
import {stopBackgroundFetch} from '~/services/Background.service';
import {BackgroundEventsEnum} from '~/services/Background.types';
import {AwsUserInternalStatus} from '~/services/Amazon.types';
import {isAndroid} from '~/utils';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
// import {getLocales} from 'react-native-localize';
// import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

const AuthListener = () => {
  const dispatch = useAppDispatch();
  const prevAwsInternalStatusRef = useRef<AwsUserInternalStatus | null>(null);
  const [user, setUser] = useState({
    internalStatus: AwsUserInternalStatus.loading,
  });
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

    getAwsUser()
      .then(setUser)
      .finally(() => {
        dispatch(setAuthSessionResolved({isAuthSessionResolved: true}));
      });
  }, [dispatch]);

  useEffect(() => {
    // @ts-ignore-next-line
    const isAuthed = Boolean(user?.username);
    dispatch(setIsAuthed({isAuthed}));
  }, [dispatch, user]);

  useEffect(() => {
    const status = user.internalStatus;

    const initData = async () => {
      dispatch(setLoadingInitData(true));
      try {
        if (isAndroid) {
          const updateFcmToken = async (retries = 2) => {
            for (let i = 0; i <= retries; i++) {
              try {
                if (i > 0) {
                  await new Promise(r => setTimeout(r, 2000));
                }
                const fcmToken = await messaging().getToken();
                if (fcmToken) {
                  await API.updateUserToken(fcmToken);
                }
                return;
              } catch (e) {
                if (i === retries) {
                  console.log('[AuthListener] FCM token update failed after retries:', e);
                }
              }
            }
          };
          updateFcmToken();
        }
        const userResult = await dispatch(getUser());
        if (userResult.meta.requestStatus === 'rejected') {
          console.log(
            '[AuthListener] getUser failed, retrying in 1s...',
          );
          await new Promise(resolve => setTimeout(resolve, 1000));
          await dispatch(getUser());
        }
        await dispatch(getEmergencyContacts());
        await dispatch(getTimeSlot());
      } catch (e) {
        console.log('[AuthListener] initData error:', e);
      } finally {
        dispatch(setLoadingInitData(false));
      }
    };

    if (status === AwsUserInternalStatus.loggedIn) {
      const wasLoggedIn =
        prevAwsInternalStatusRef.current === AwsUserInternalStatus.loggedIn;
      prevAwsInternalStatusRef.current = status;
      if (!wasLoggedIn) {
        void initData();
      }
    } else {
      prevAwsInternalStatusRef.current = status;
      if (status === AwsUserInternalStatus.notLoggedIn) {
        dispatch(setLoadingInitData(false));
        dispatch(clearUser());

        if (Platform.OS === 'android') {
          stopBackgroundFetch(
            BackgroundEventsEnum.ReactNativeBackgroundFetch,
          ).then(() => console.log('stopped background fetch'));
        }
      }
    }
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
