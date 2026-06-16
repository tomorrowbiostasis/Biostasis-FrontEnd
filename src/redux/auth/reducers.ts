import {PayloadAction} from '@reduxjs/toolkit';
import {IAuthState} from './auth.slice';

export const setIsAuthed = (
  state: IAuthState,
  {payload}: PayloadAction<Pick<IAuthState, 'isAuthed'>>,
) => {
  state.isAuthed = payload.isAuthed;
};

export const setAuthSessionResolved = (
  state: IAuthState,
  {payload}: PayloadAction<Pick<IAuthState, 'isAuthSessionResolved'>>,
) => {
  state.isAuthSessionResolved = payload.isAuthSessionResolved;
};

const setForgotPasswordEmailMessage = (
  state: IAuthState,
  {payload}: PayloadAction<IAuthState['forgotPassword']['emailMessage']>,
) => {
  state.forgotPassword.emailMessage = payload;
};

const setForgotPasswordNewPasswordMessage = (
  state: IAuthState,
  {payload}: PayloadAction<IAuthState['forgotPassword']['newPasswordMessage']>,
) => {
  state.forgotPassword.newPasswordMessage = payload;
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
  setAuthSessionResolved,
  setForgotPasswordEmailMessage,
  setForgotPasswordNewPasswordMessage,
  setShouldBackToAuthScreen,
};
