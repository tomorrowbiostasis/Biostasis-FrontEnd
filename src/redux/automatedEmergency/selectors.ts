import {ISpecificDateComponentItem} from '~/screens/SpecificTimePausedScreen/components/SpecificDateComponent/SpecificDateComponent';
import {convertTimestampToDate} from '~/services/Date.service';
import {RootState} from '../store';
import {IAutomatedEmergencyState} from './automatedEmergency.slice';

export const automatedEmergencySelector = (
  state: RootState,
): IAutomatedEmergencyState => state.automatedEmergency;

export const automatedEmergencyPausedDateSelector = (
  state: RootState,
): IAutomatedEmergencyState['pausedDate'] =>
  state.automatedEmergency.pausedDate;

export const smartDeviceSelector = (
  state: RootState,
): IAutomatedEmergencyState['smartDevice'] =>
  state.automatedEmergency.smartDevice;

export const automatedEmergencyPausedTimesSelector = (
  state: RootState,
): ISpecificDateComponentItem[] =>
  state.automatedEmergency.specificPausedTimes.map(i => ({
    ...i,
    startTime: convertTimestampToDate(i.startTime),
    endTime: convertTimestampToDate(i.endTime),
  }));

export const automatedEmergencyPendingSelector = (state: RootState): boolean =>
  state.automatedEmergency.emergencyPending;

export const automatedEmergencyLastSucceededSelector = (
  state: RootState,
): string | null => state.automatedEmergency.lastSucceededEmergencyInternalId;

export const automatedEmergencyLastFailedESelector = (
  state: RootState,
): string | null => state.automatedEmergency.lastFailedEmergencyInternalId;

export const automatedEmergencyActiveTimeSlots = (
  state: RootState,
): ISpecificDateComponentItem[] =>
  state.automatedEmergency.specificPausedTimes
    .filter(i => i.isActive)
    .map(slot => ({
      ...slot,
      startTime: convertTimestampToDate(slot.startTime),
      endTime: convertTimestampToDate(slot.endTime),
    }));

export const timeSlotPatchLoading = (state: RootState): boolean =>
  state.automatedEmergency.patchLoading;

export const automatedEmergencyLoading = (state: RootState): boolean =>
  state.automatedEmergency.emergencyPending;
