import React, {VFC} from 'react';
import {ActivityIndicator, ActivityIndicatorProps} from 'react-native';
import colors from '~/theme/colors';

import styles from './styles';
export interface ILoaderProps extends ActivityIndicatorProps {
  absolute?: boolean;
}

const Loader: VFC<ILoaderProps> = ({absolute, style, ...props}) => {
  return (
    <ActivityIndicator
      size={absolute ? 'large' : 'small'}
      color={colors.gray[600]}
      {...props}
      style={[absolute && styles.absoluteFullScreen, style]}
    />
  );
};

export default Loader;
