import {createSlice} from '@reduxjs/toolkit';

import {reducers} from './reducers';
import extraReducersBuilder from './extraReducers';
import {IAlertMessage} from '~/models/Message.model';

export interface IAuthState {
  isAuthed: boolean;
  signIn: {
    pending: boolean;
    message?: IAlertMessage;
  };
  signUp: {
    pending: boolean;
    message?: IAlertMessage;
    formFieldError?: {
      key: 'email' | 'password';
      messageKey: string;
    };
  };
  forgotPassword: {
    pending: boolean;
    shouldBackToAuthScreen: boolean;
    emailMessage?: IAlertMessage;
    newPasswordMessage?: IAlertMessage;
  };
}

export const initialState: IAuthState = {
  isAuthed: false,
  signIn: {
    pending: false,
    message: undefined,
  },
  signUp: {
    pending: false,
    message: undefined,
    formFieldError: undefined,
  },
  forgotPassword: {
    pending: false,
    shouldBackToAuthScreen: false,
    emailMessage: undefined,
    newPasswordMessage: undefined,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers,
  extraReducers: extraReducersBuilder,
});

export const {
  setIsAuthed,
  setForgotPasswordEmailMessage,
  setShouldBackToAuthScreen,
} = authSlice.actions;

export default authSlice.reducer;
