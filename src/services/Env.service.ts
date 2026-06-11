import RNConfig from 'react-native-config';

type Config = {
  ENVIRONMENT: string;
  API_URL: string;
  AWS_REGION: string;
  AWS_USER_POOL_ID: string;
  AWS_POOL_WEB_CLIENT_ID: string;
  AWS_IDENTITY_POOL_ID: string;
  AWS_OAUTH_DOMAIN: string;
  GOOGLE_MAPS_API_KEY?: string;
  PROD: boolean;
  DEV: boolean;
};

const EnvConfig: Config = {
  ENVIRONMENT: RNConfig.ENVIRONMENT,
  API_URL: RNConfig.API_URL,
  AWS_REGION: RNConfig.AWS_REGION,
  AWS_USER_POOL_ID: RNConfig.AWS_USER_POOL_ID,
  AWS_POOL_WEB_CLIENT_ID: RNConfig.AWS_POOL_WEB_CLIENT_ID,
  AWS_IDENTITY_POOL_ID: RNConfig.AWS_IDENTITY_POOL_ID,
  AWS_OAUTH_DOMAIN: RNConfig.AWS_OAUTH_DOMAIN,
  GOOGLE_MAPS_API_KEY: RNConfig.GOOGLE_MAPS_API_KEY,
  PROD: RNConfig.ENVIRONMENT === 'production',
  DEV: RNConfig.ENVIRONMENT === 'development',
} as Config;

export default EnvConfig;
