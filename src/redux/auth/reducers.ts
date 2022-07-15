import {PayloadAction} from '@reduxjs/toolkit';
import {IAuthState} from './auth.slice';

export const setIsAuthed = (
  state: IAuthState,
  {payload}: PayloadAction<Pick<IAuthState, 'isAuthed'>>,
) => {
  state.isAuthed = payload.isAuthed;
};

const setForgotPasswordEmailMessage = (
  state: IAuthState,
  {payload}: PayloadAction<IAuthState['forgotPassword']['emailMessage']>,
) => {
  state.forgotPassword.emailMessage = payload;
};

const setShouldBackToAuthScreen = (
  state: IAuthState,
  {
    payload,
  }: PayloadAction<IAuthState['forgotPassword']['shouldBackToAuthScreen']>,
) => {
  state.forgotPassword.shouldBackToAuthScreen = payload;
};

export const reducers = {
  setIsAuthed,
  setForgotPasswordEmailMessage,
  setShouldBackToAuthScreen,
};
