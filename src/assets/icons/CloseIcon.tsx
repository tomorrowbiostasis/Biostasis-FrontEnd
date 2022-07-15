import React from 'react';
import {} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {IconProps} from 'react-native-vector-icons/Icon';
import colors from '~/theme/colors';

export interface ICloseIconProps extends Omit<IconProps, 'name'> {}

const CloseIcon = (props: ICloseIconProps) => {
  return (
    <AntDesign name={'close'} size={23} color={colors.red[100]} {...props} />
  );
};

export default CloseIcon;
