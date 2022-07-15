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

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('error while signout from Cognito');
  }
};

export const getAwsUser = () => {
  return Auth.currentAuthenticatedUser()
    .then(userData => ({
      ...userData,
      internalStatus: AwsUserInternalStatus.loggedIn,
    }))
    .catch(() => ({internalStatus: AwsUserInternalStatus.notLoggedIn}));
};

export const getToken = () => {
  return getAwsUser().then(
    user => user?.signInUserSession?.accessToken?.getJwtToken() ?? null,
  );
};
