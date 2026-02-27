import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HealthData = {
  heartRate: number;
  restingHeartRate: number;
  steps: number;
  heartRateEndDate: number;
  restingHeartRateEndDate: number;
  stepsEndDate: number;
  totalSteps: number;
};

type HealthState = {
  data: HealthData | null;
  allData: HealthData[];
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
    },
    setAllHealthData(state, action: PayloadAction<HealthData[]>) {
      state.allData = action.payload;
    },
    clearHealthData(state) {
      state.data = null;
      state.allData = [];
    },
  },
});

export const { setHealthData, setAllHealthData, clearHealthData } = healthSlice.actions;
export default healthSlice.reducer;
