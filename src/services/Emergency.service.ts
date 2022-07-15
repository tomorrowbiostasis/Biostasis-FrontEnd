import {useState, useCallback} from 'react';
import {useBetween} from 'use-between';

// FIXME: maybe better as Emergency.hook.ts?
const useEmergency = () => {
  const [emergencyPressed, setEmergencyPressed] = useState(false);
  const startEmergency = useCallback(() => setEmergencyPressed(true), []);
  const stopEmergency = useCallback(() => setEmergencyPressed(false), []);
  return {
    emergencyPressed,
    startEmergency,
    stopEmergency,
  };
};

export const useEmergencyValue = () => useBetween(useEmergency);
