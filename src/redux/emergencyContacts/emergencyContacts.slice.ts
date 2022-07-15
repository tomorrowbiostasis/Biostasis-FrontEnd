import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import extraReducersBuilder from './extraReducers';

export interface IEmergencyContact {
  name: string;
  surname: string;
  email: string;
  active: boolean;
  phone?: string;
  prefix?: number;
  countryCode?: string;
}

export interface IEmergencyContactResponse extends IEmergencyContact {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmergencyContactsState {
  emergencyContacts: IEmergencyContactResponse[];
  pending: boolean;
}

export const initialState: IEmergencyContactsState = {
  emergencyContacts: [],
  pending: false,
};

export const emergencyContactsSlice = createSlice({
  name: 'emergencyContacts',
  initialState,
  reducers: {
    setEmergencyContacts: (
      state: IEmergencyContactsState,
      action: PayloadAction<IEmergencyContactsState>,
    ) => {
      state.emergencyContacts = action.payload.emergencyContacts;
    },
  },
  extraReducers: extraReducersBuilder,
});

export const {setEmergencyContacts} = emergencyContactsSlice.actions;

export default emergencyContactsSlice.reducer;
