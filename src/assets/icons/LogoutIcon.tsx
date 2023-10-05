import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {IconProps} from 'react-native-vector-icons/Icon';
import colors from '~/theme/colors';

export interface ILogoutIconProps extends Omit<IconProps, 'name'> {}

const LogoutIcon = (props: ILogoutIconProps) => {
  return (
    <View>
      <Icon name={'log-out'} size={15} color={colors.gray[800]} {...props} />
    </View>
  );
};

export default LogoutIcon;
