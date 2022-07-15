import RNConfig from 'react-native-config';

type Config = {
  ENVIRONMENT: string;
  API_URL: string;
  AWS_REGION: string;
  AWS_USER_POOL_ID: string;
  AWS_POOL_WEB_CLIENT_ID: string;
  AWS_IDENTITY_POOL_ID: string;
  AWS_OAUTH_DOMAIN: string;
  PROD: boolean;
  DEV: boolean;
};

const EnvConfig = {
  ...RNConfig,
  PROD: RNConfig.ENVIRONMENT === 'production',
  DEV: RNConfig.ENVIRONMENT === 'development',
} as Config;

export default EnvConfig;
