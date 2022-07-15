import {RootState} from '../store';
import {IAuthState} from './auth.slice';

export const authSelector = (state: RootState): IAuthState => state.auth;

export const isAuthed = (state: RootState): boolean => state.auth.isAuthed;

export const getSignInParams = (state: RootState): IAuthState['signIn'] =>
  state.auth.signIn;

export const getSignUpParams = (state: RootState): IAuthState['signUp'] =>
  state.auth.signUp;

export const getForgotPasswordParams = (
  state: RootState,
): IAuthState['forgotPassword'] => state.auth.forgotPassword;
