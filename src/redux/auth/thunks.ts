import {createAsyncThunk} from '@reduxjs/toolkit';
import {Auth} from 'aws-amplify';

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({email, password}: {email: string; password: string}) => {
    const response = await Auth.signIn(email, password);

    const accessToken = response.signInUserSession.accessToken.jwtToken;
    const refreshToken = response.signInUserSession.refreshToken.token;

    return {accessToken, refreshToken};
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({email, password}: {email: string; password: string}) => {
    await Auth.signUp({
      username: email,
      password,
    });
  },
);

export const confirmSignUp = createAsyncThunk(
  'auth/confirmSignUp',
  async ({email, code}: {email: string; code: string}) => {
    await Auth.confirmSignUp(email, code);
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({email}: {email: string}) => {
    await Auth.forgotPassword(email);
  },
);

export const forgotPasswordSetNewPassword = createAsyncThunk(
  'auth/forgotPasswordSetNewPassword',
  async ({
    email,
    code,
    newPassword,
  }: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  },
);
