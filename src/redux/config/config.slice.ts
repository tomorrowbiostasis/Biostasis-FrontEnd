import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../store';

interface IConfigState {
  language: string;
  loadingInitData: boolean;
}

export const initialState: IConfigState = {
  language: 'en',
  // Defaults to true so the native splash stays visible during the initial
  // auth probe + bootstrap fetches. AuthListener flips it to false once
  // initData() completes or the session resolves to not-logged-in.
  loadingInitData: true,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setLanguage: (
      state: IConfigState,
      {payload}: PayloadAction<IConfigState['language']>,
    ) => {
      state.language = payload;
    },
    setLoadingInitData: (
      state: IConfigState,
      {payload}: PayloadAction<IConfigState['loadingInitData']>,
    ) => {
      state.loadingInitData = payload;
    },
  },
});

export const {setLanguage, setLoadingInitData} = configSlice.actions;

export const configSelector = (state: RootState): IConfigState => state.config;
export const configInitData = (state: RootState): boolean =>
  state.config.loadingInitData;

export default configSlice.reducer;
