import {PayloadAction} from '@reduxjs/toolkit';
import {
  IAutomatedEmergencyState,
  ISpecificPausedTime,
} from './automatedEmergency.slice';

const setAutomatedEmergencyPause = (
  state: IAutomatedEmergencyState,
  {payload}: PayloadAction<IAutomatedEmergencyState['pausedDate']>,
) => {
  state.pausedDate = payload;
};

const setSmartDevice = (
  state: IAutomatedEmergencyState,
  {payload}: PayloadAction<IAutomatedEmergencyState['smartDevice']>,
) => {
  state.smartDevice = payload;
};

const setAutomatedEmergencyPauseTimes = (
  state: IAutomatedEmergencyState,
  {payload}: PayloadAction<ISpecificPausedTime[]>,
) => {
  state.specificPausedTimes = payload;
};

const setEmergencyCheckType = (
  state: IAutomatedEmergencyState,
  {payload}: PayloadAction<IAutomatedEmergencyState['emergencyCheckType']>,
) => {
  state.emergencyCheckType = payload;
};

export default {
  setAutomatedEmergencyPause,
  setSmartDevice,
  setAutomatedEmergencyPauseTimes,
  setEmergencyCheckType,
};
