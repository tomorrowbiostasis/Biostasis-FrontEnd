import React from 'react';
import {View} from 'react-native';
import colors from '~/theme/colors';
import {AppIconProps, LogOutIcon} from './AppIcons';

export interface ILogoutIconProps extends AppIconProps {}

const LogoutIcon = (props: ILogoutIconProps) => {
  return (
    <View>
      <LogOutIcon size={15} color={colors.gray[800]} {...props} />
    </View>
  );
};

export default LogoutIcon;
