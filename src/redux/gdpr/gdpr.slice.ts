import {createSlice} from '@reduxjs/toolkit';
import {extraReducersBuilder} from '~/redux/gdpr/extraReducers';

export interface IGDPRState {
  gdprStatus: 'success' | 'error' | null;
}

export const initialState: IGDPRState = {
  gdprStatus: null,
};

export const gdprSlice = createSlice({
  name: 'gdpr',
  initialState,
  reducers: {
    clearGdprStatus: (state: IGDPRState) => {
      state.gdprStatus = null;
    },
  },
  extraReducers: extraReducersBuilder,
});

export const {clearGdprStatus} = gdprSlice.actions;

export default gdprSlice.reducer;
