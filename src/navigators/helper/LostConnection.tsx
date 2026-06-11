import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {Screens} from '~/models/Navigation.model';
import {isAuthed} from '~/redux/auth/selectors';
import {useAppSelector} from '~/redux/store/hooks';
import {userInitializedSelector} from '~/redux/user/selectors';
import {configSelector} from '~/redux/config/config.slice';
import {navigationRef} from '~/navigators/navigationContainerRef';
import {getReconnectRootResetState} from './rootReconnectNavigation';

const LostConnection = () => {
  const isLogged = useAppSelector(isAuthed);
  const {loadingInitData} = useAppSelector(configSelector);
  const {type, isConnected} = useNetInfo();
  const {navigate, reset} = useNavigation();
  const isInitialized = useAppSelector(userInitializedSelector);

  useEffect(() => {
    if (type !== 'unknown') {
      if (!isConnected) {
        navigate(Screens.LostConnection as never);
      } else {
        reset(
          getReconnectRootResetState({
            isLogged,
            loadingInitData,
            isInitialized,
            navigationReady: navigationRef.isReady(),
          }) as never,
        );
      }
    }
  }, [
    isConnected,
    isInitialized,
    isLogged,
    loadingInitData,
    navigate,
    reset,
    type,
  ]);
  return null;
};

export default LostConnection;
