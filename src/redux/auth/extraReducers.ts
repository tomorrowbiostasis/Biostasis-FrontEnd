import {ActionReducerMapBuilder, SerializedError} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import NotificationService from '~/services/NotificationService';
import {IAuthState} from './auth.slice';
import {
  confirmSignUp,
  forgotPassword,
  forgotPasswordSetNewPassword,
  signIn,
  signUp,
} from './thunks';

const pendingSignIn = (state: IAuthState) => {
  state.signIn.pending = true;
  state.signIn.message = undefined;
};

const fulfilledSignIn = (state: IAuthState) => {
  state.signIn.pending = false;
};

const rejectedSignIn = (
  state: IAuthState,
  {error}: {error: SerializedError},
) => {
  state.signIn.pending = false;
  switch (error.code) {
    case 'NetworkError':
      NotificationService.error(i18n.t('common.errorNetwork'));
      console.log('network error');
      break;
    case 'NotAuthorizedException':
      state.signIn.message = {
        success: false,
        messageKey: 'auth.invalidCredentials',
      };
      break;
    default:
      state.signIn.message = {
        success: false,
        messageKey: 'defaultError',
      };
  }
};

const pendingSignUp = (state: IAuthState) => {
  state.signUp.pending = true;
  state.signUp.message = undefined;
};

const fulfilledSignUp = (state: IAuthState) => {
  state.signUp.pending = false;
  state.signUp.message = {
    success: true,
    messageKey: 'auth.accountWasCreated',
  };
};

const rejectedSignUp = (
  state: IAuthState,
  {error}: {error: SerializedError},
) => {
  state.signUp.pending = false;
  switch (error.code) {
    case 'NetworkError':
      NotificationService.error(i18n.t('pulseCheck.messages.networkError'));
      break;
    case 'UsernameExistsException':
      state.signUp.formFieldError = {
        key: 'email',
        messageKey: 'validation.email.accountAlreadyExist',
      };
      break;
    default:
      state.signUp.message = {
        success: false,
        messageKey: 'defaultError',
      };
  }
};

const fulfilledConfirmSignUp = (state: IAuthState) => {
  state.signIn.message = {
    messageKey: 'auth.accountActivated',
    success: true,
  };
  state.signUp.message = undefined;
};

const rejectedConfirmSignUp = (
  state: IAuthState,
  {error}: {error: SerializedError},
) => {
  state.signUp.message = undefined;
  switch (error.code) {
    case 'ExpiredCodeException':
      state.signIn.message = {
        messageKey: 'auth.linkExpired',
        success: false,
      };
      break;
    default:
      state.signIn.message = {
        messageKey: 'defaultError',
        success: false,
      };
  }
};

const pendingForgotPassword = (state: IAuthState) => {
  state.forgotPassword.pending = true;
  state.forgotPassword.emailMessage = undefined;
};

const fulfilledForgotPassword = (state: IAuthState) => {
  state.forgotPassword.pending = false;
  state.forgotPassword.emailMessage = {
    success: true,
    messageKey: 'forgotPassword.emailSent',
  };
};

const rejectedForgotPassword = (state: IAuthState) => {
  state.forgotPassword.pending = false;
  state.forgotPassword.emailMessage = {
    success: false,
    messageKey: 'defaultError',
  };
};

const pendingForgotPasswordSetNewPassword = (state: IAuthState) => {
  pendingForgotPassword(state);
  state.forgotPassword.newPasswordMessage = undefined;
};

const fulfilledForgotPasswordSetNewPassword = (state: IAuthState) => {
  state.signIn.message = {
    success: true,
    messageKey: 'forgotPassword.passwordChanged',
  };
  state.forgotPassword.pending = false;
  state.forgotPassword.shouldBackToAuthScreen = true;
};

const rejectedForgotPasswordSetNewPassword = (
  state: IAuthState,
  {error}: {error: SerializedError},
) => {
  state.forgotPassword.pending = false;
  if (error.code === 'ExpiredCodeException') {
    state.forgotPassword.shouldBackToAuthScreen = true;
    state.signIn.message = {
      success: false,
      messageKey: 'forgotPassword.resetLinkExpired',
    };
  } else {
    state.forgotPassword.newPasswordMessage = {
      success: false,
      messageKey: 'default',
    };
  }
};

export const extraReducersBuilder = (
  builder: ActionReducerMapBuilder<IAuthState>,
) => {
  builder.addCase(signIn.pending, pendingSignIn);
  builder.addCase(signIn.fulfilled, fulfilledSignIn);
  builder.addCase(signIn.rejected, rejectedSignIn);

  builder.addCase(signUp.pending, pendingSignUp);
  builder.addCase(signUp.fulfilled, fulfilledSignUp);
  builder.addCase(signUp.rejected, rejectedSignUp);

  builder.addCase(confirmSignUp.fulfilled, fulfilledConfirmSignUp);
  builder.addCase(confirmSignUp.rejected, rejectedConfirmSignUp);

  builder.addCase(forgotPassword.pending, pendingForgotPassword);
  builder.addCase(forgotPassword.fulfilled, fulfilledForgotPassword);
  builder.addCase(forgotPassword.rejected, rejectedForgotPassword);

  builder.addCase(
    forgotPasswordSetNewPassword.pending,
    pendingForgotPasswordSetNewPassword,
  );
  builder.addCase(
    forgotPasswordSetNewPassword.fulfilled,
    fulfilledForgotPasswordSetNewPassword,
  );
  builder.addCase(
    forgotPasswordSetNewPassword.rejected,
    rejectedForgotPasswordSetNewPassword,
  );
};

export default extraReducersBuilder;
