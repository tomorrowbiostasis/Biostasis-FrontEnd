import {
  ActionReducerMapBuilder,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';
import {TimeSlot} from '~/services/TimeSlot.service/ApiToLocal';
import {
  IAutomatedEmergencyState,
  ISpecificPausedTime,
} from './automatedEmergency.slice';
import {
  addPauseFromNow,
  addTimeSlot,
  getTimeSlot,
  startEmergency,
  updateTimeSlot,
} from './thunks';

interface IStartEmergencySuccessPayload {
  data?: {success?: boolean};
}

const pendingStartEmergency = (state: IAutomatedEmergencyState) => {
  state.emergencyPending = true;
};

const fulfilledStartEmergency = (
  state: IAutomatedEmergencyState,
  {payload}: PayloadAction<IStartEmergencySuccessPayload | undefined>,
) => {
  state.emergencyPending = false;
  if (payload?.data?.success) {
    state.lastSucceededEmergencyInternalId = uuidv4();
  } else {
    state.lastFailedEmergencyInternalId = uuidv4();
  }
};

const rejectedStartEmergency = (
  state: IAutomatedEmergencyState,
  {error}: {error: SerializedError},
) => {
  state.emergencyPending = false;
  state.emergencyError = error;
  state.lastFailedEmergencyInternalId = uuidv4();
};

const fulfilledGetTimeSlot = (
  state: IAutomatedEmergencyState,
  {payload}: PayloadAction<TimeSlot>,
) => {
  state.pausedDate = payload.pausedDate;
  state.specificPausedTimes = payload.specificPausedTimes;
};

const rejectedGetTimeSlot = (
  state: IAutomatedEmergencyState,
  {error}: {error: SerializedError},
) => {
  console.log('error when getting time slots', {error});
};

const rejectedAddTimeSlot = (
  state: IAutomatedEmergencyState,
  {error}: {error: SerializedError},
) => {
  console.log('error when adding time slot', {error});
};

const fulfilledUpdateTimeSlot = (
  state: IAutomatedEmergencyState,
  {payload}: PayloadAction<ISpecificPausedTime>,
) => {
  const index = state.specificPausedTimes.findIndex(
    item => item.id === payload.id,
  );
  if (index !== -1) {
    state.specificPausedTimes[index] = payload;
  }
  state.patchLoading = false;
};

const pendingUpdateTimeSlot = (state: IAutomatedEmergencyState) => {
  state.patchLoading = true;
};

const rejectedUpdateTimeSlot = (
  state: IAutomatedEmergencyState,
  {error}: {error: SerializedError},
) => {
  state.patchLoading;
  console.log('error when adding time slot', {error});
};

export const extraReducersBuilder = (
  builder: ActionReducerMapBuilder<IAutomatedEmergencyState>,
) => {
  builder.addCase(startEmergency.pending, pendingStartEmergency);
  builder.addCase(startEmergency.fulfilled, fulfilledStartEmergency);
  builder.addCase(startEmergency.rejected, rejectedStartEmergency);
  builder.addCase(getTimeSlot.fulfilled, fulfilledGetTimeSlot);
  builder.addCase(getTimeSlot.rejected, rejectedGetTimeSlot);
  builder.addCase(addTimeSlot.rejected, rejectedAddTimeSlot);
  builder.addCase(addPauseFromNow.rejected, rejectedAddTimeSlot);
  builder.addCase(updateTimeSlot.fulfilled, fulfilledUpdateTimeSlot);
  builder.addCase(updateTimeSlot.pending, pendingUpdateTimeSlot);
  builder.addCase(updateTimeSlot.rejected, rejectedUpdateTimeSlot);
};

export default extraReducersBuilder;
