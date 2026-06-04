import {createAsyncThunk} from '@reduxjs/toolkit';
import {Auth} from 'aws-amplify';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({email, password}: {email: string; password: string}) => {
    const response = await Auth.signIn(normalizeEmail(email), password);

    const accessToken = response.signInUserSession.accessToken.jwtToken;
    const refreshToken = response.signInUserSession.refreshToken.token;

    return {accessToken, refreshToken};
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({email, password}: {email: string; password: string}) => {
    const normalizedEmail = normalizeEmail(email);

    await Auth.signUp({
      username: normalizedEmail,
      password,
      attributes: {
        email: normalizedEmail,
      },
    });
  },
);

export const confirmSignUp = createAsyncThunk(
  'auth/confirmSignUp',
  async ({email, code}: {email: string; code: string}) => {
    await Auth.confirmSignUp(normalizeEmail(email), code);
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({email}: {email: string}) => {
    await Auth.forgotPassword(normalizeEmail(email));
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
    await Auth.forgotPasswordSubmit(normalizeEmail(email), code, newPassword);
  },
);
