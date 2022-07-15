import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const UseAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  const onChange = (newState: AppStateStatus) => {
    setAppState(newState);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onChange);
    return () => {
      // @ts-ignore
      subscription.remove();
    };
  }, []);
  return {appState, isActive: appState === 'active'};
};
