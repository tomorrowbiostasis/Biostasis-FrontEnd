import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type HealthData = {
  heartRate: number;
  restingHeartRate: number;
  steps: number;
  heartRateEndDate: number | null;
  restingHeartRateEndDate: number | null;
  stepsEndDate: number | null;
  totalSteps: number;
};

export type HealthState = {
  data: HealthData | null;
  allData: HealthData[];
};

const MAX_LOCAL_HEALTH_LOGS = 1000;

const normalizeTimestamp = (value?: number | null): number | null => {
  if (!value) {
    return null;
  }

  return value < 10000000000 ? value * 1000 : value;
};

const getLatestTimestamp = (entry: HealthData): number | null => {
  const timestamps = [
    normalizeTimestamp(entry.heartRateEndDate),
    normalizeTimestamp(entry.restingHeartRateEndDate),
    normalizeTimestamp(entry.stepsEndDate),
  ].filter((value): value is number => value != null);

  return timestamps.length ? Math.max(...timestamps) : null;
};

const getHealthEntryKey = (entry: HealthData): string => {
  const timestamp = getLatestTimestamp(entry);

  if (timestamp) {
    return String(timestamp);
  }

  return [
    entry.heartRate ?? 'hr',
    entry.restingHeartRate ?? 'rhr',
    entry.steps ?? 'steps',
    entry.totalSteps ?? 'total',
  ].join(':');
};

const upsertHealthEntry = (
  entries: HealthData[],
  entry: HealthData,
): HealthData[] => {
  const nextEntries = [...entries];
  const nextKey = getHealthEntryKey(entry);
  const existingIndex = nextEntries.findIndex(
    currentEntry => getHealthEntryKey(currentEntry) === nextKey,
  );

  if (existingIndex >= 0) {
    nextEntries[existingIndex] = entry;
  } else {
    nextEntries.push(entry);
  }

  return nextEntries
    .sort((a, b) => (getLatestTimestamp(a) ?? 0) - (getLatestTimestamp(b) ?? 0))
    .slice(-MAX_LOCAL_HEALTH_LOGS);
};

const initialState: HealthState = {
  data: null,
  allData: [],
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setHealthData(state, action: PayloadAction<HealthData>) {
      state.data = action.payload;
      state.allData = upsertHealthEntry(state.allData, action.payload);
    },
    setAllHealthData(state, action: PayloadAction<HealthData[]>) {
      state.allData = [...action.payload]
        .sort(
          (a, b) =>
            (getLatestTimestamp(a) ?? 0) - (getLatestTimestamp(b) ?? 0),
        )
        .slice(-MAX_LOCAL_HEALTH_LOGS);
      state.data = state.allData.at(-1) ?? state.data;
    },
    clearHealthData(state) {
      state.data = null;
      state.allData = [];
    },
  },
});

export const {setHealthData, setAllHealthData, clearHealthData} =
  healthSlice.actions;
export default healthSlice.reducer;
