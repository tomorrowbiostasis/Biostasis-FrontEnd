import Amplify from '@aws-amplify/core';
import {Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Auth} from '@aws-amplify/auth';
import {AwsUserInternalStatus} from '~/services/Amazon.types';
import EnvConfig from '~/services/Env.service';

const urlOpener = async (url: string, redirectUrl: string) => {
  if (url && redirectUrl) {
    await InAppBrowser.isAvailable();
    // @ts-ignore-next-line
    const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
      showTitle: false,
      enableUrlBarHiding: true,
      enableDefaultShare: false,
      ephemeralWebSession: true, // iOS-only
    });
    
    if (type === 'success') {
      await Linking.openURL(newUrl);
    }
  }
};

const awsConfig = {
  aws_project_region: EnvConfig.AWS_REGION,
  aws_cognito_identity_pool_id: EnvConfig.AWS_IDENTITY_POOL_ID,
  aws_cognito_region: EnvConfig.AWS_REGION,
  aws_user_pools_id: EnvConfig.AWS_USER_POOL_ID,
  aws_user_pools_web_client_id: EnvConfig.AWS_POOL_WEB_CLIENT_ID,
  oauth: {
    domain: EnvConfig.AWS_OAUTH_DOMAIN,
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: 'biostasis://auth/signin/',
    redirectSignOut: 'biostasis://auth/signout/',
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
};

export const awsInit = () => {
  console.log('[Amazon] awsInit -> Amplify.configure()');
  Amplify.configure({
    ...awsConfig,
    oauth: {
      ...awsConfig.oauth,
      urlOpener,
    },
  });
};

// @ts-ignore-next-line
export const googleSignIn = () => Auth.federatedSignIn({provider: 'Google'});

export const appleSignIn = () =>
  // @ts-ignore-next-line
  Auth.federatedSignIn({provider: 'SignInWithApple'});

/** Amplify storage key: skip Hosted UI logout webview on local sign-out */
const HOSTED_UI_SESSION_KEY = 'amplify-signin-with-hostedUI';

type AuthWithStorage = {
  _storage?: {removeItem: (key: string) => unknown};
  _storageSync?: Promise<void>;
};

/**
 * Local sign-out only. Removes the Hosted UI marker before Auth.signOut() so Amplify
 * does not open Cognito's OAuth logout URL in InAppBrowser (brief flash on logout).
 * Tokens are still cleared; full IdP session may remain in the system browser until cleared there.
 */
export const signOut = async () => {
  try {
    const auth = Auth as unknown as AuthWithStorage;
    if (auth._storageSync) {
      await auth._storageSync.catch(() => undefined);
    }
    auth._storage?.removeItem(HOSTED_UI_SESSION_KEY);
    await Auth.signOut();
  } catch (error) {
    console.log('error while signout from Cognito');
  }
};

export const getAwsUser = () => {
  console.log('[Amazon] getAwsUser -> calling Auth.currentAuthenticatedUser()');
  return Auth.currentAuthenticatedUser()
    .then(userData => {
      console.log('[Amazon] currentAuthenticatedUser SUCCESS (logged in)');
      return {
        ...userData,
        internalStatus: AwsUserInternalStatus.loggedIn,
      };
    })
    .catch(err => {
      console.log('[Amazon] currentAuthenticatedUser rejected (not logged in)', err?.message ?? err);
      return {internalStatus: AwsUserInternalStatus.notLoggedIn};
    });
};

export const getToken = () => {
  return getAwsUser().then(
    user => user?.signInUserSession?.accessToken?.getJwtToken() ?? null,
  );
};
