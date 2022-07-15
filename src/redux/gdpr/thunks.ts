import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '~/services/API.service';

export const sendGDPR = createAsyncThunk(
  'user/sendGDPR',
  async (email: string) => {
    const response = await API.sendGDPR(email);
    return response.data;
  },
);
