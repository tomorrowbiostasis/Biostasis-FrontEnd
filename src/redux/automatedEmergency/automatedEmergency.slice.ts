import {createSlice, SerializedError} from '@reduxjs/toolkit';
import {SpecificDateComponentItemIdType} from '~/screens/SpecificTimePausedScreen/components/SpecificDateComponent/SpecificDateComponent';
import {DaysOfTheWeekEnum} from '~/screens/SpecificTimePausedScreen/util';
import reducers from './reducers';
import extraReducersBuilder from './extraReducers';

export interface ISmartDevice {
  id: string;
  name?: string;
}

export interface ISpecificPausedTime {
  id: SpecificDateComponentItemIdType;
  startDay: DaysOfTheWeekEnum[];
  startTime: number;
  endDay: DaysOfTheWeekEnum[];
  endTime: number;
  isActive: boolean;
}

export type IPausedDate = {
  id: SpecificDateComponentItemIdType;
  timestamp: number;
};

export interface IAutomatedEmergencyState {
  pausedDate: IPausedDate | null;
  smartDevice: ISmartDevice | null;
  specificPausedTimes: ISpecificPausedTime[];
  emergencyPending: boolean;
  emergencyError: SerializedError | null;
  lastSucceededEmergencyInternalId: string | null;
  lastFailedEmergencyInternalId: string | null;
  patchLoading: boolean;
}

export const initialState: IAutomatedEmergencyState = {
  pausedDate: null,
  smartDevice: null,
  specificPausedTimes: [],
  emergencyPending: false,
  emergencyError: null,
  lastSucceededEmergencyInternalId: null,
  lastFailedEmergencyInternalId: null,
  patchLoading: false,
};

export const automatedEmergencySlice = createSlice({
  name: 'automatedEmergency',
  initialState,
  reducers,
  extraReducers: extraReducersBuilder,
});

export const {
  setAutomatedEmergencyPause,
  setAutomatedEmergencyPauseTimes,
  setSmartDevice,
} = automatedEmergencySlice.actions;

export default automatedEmergencySlice.reducer;
