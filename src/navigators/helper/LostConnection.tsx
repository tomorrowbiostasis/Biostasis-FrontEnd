import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {Screens} from '~/models/Navigation.model';
import {isAuthed} from '~/redux/auth/selectors';
import {useAppSelector} from '~/redux/store/hooks';
import {userInitializedSelector} from '~/redux/user/selectors';

const LostConnection = () => {
  const isLogged = useAppSelector(isAuthed);
  const {type, isConnected} = useNetInfo();
  const {navigate, reset} = useNavigation();
  const isInitialized = useAppSelector(userInitializedSelector);

  useEffect(() => {
    if (type !== 'unknown') {
      if (!isConnected) {
        navigate(Screens.LostConnection as never);
      } else {
        reset({
          index: 0,
          routes: isLogged
            ? isInitialized
              ? [{name: 'MainStack'}]
              : [{name: 'SignUpStack'}]
            : [{name: 'AuthStack'}],
        });
      }
    }
  }, [isConnected, isInitialized, isLogged, navigate, reset, type]);
  return null;
};

export default LostConnection;
