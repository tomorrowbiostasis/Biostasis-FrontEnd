import {Text} from 'native-base';
import React, {VFC} from 'react';
import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextProps,
  View,
} from 'react-native';
import ForwardArrowIcon from '~/assets/icons/ForwardArrowIcon';

import styles from './styles';

export interface IBottomButtonProps {
  leftIcon: JSX.Element;
  title: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: TextProps['style'];
  withBottomBorder?: boolean;
  hideRightButton?: boolean;
  disabled?: boolean;
}

const BottomButton: VFC<IBottomButtonProps> = ({
  containerStyle,
  titleStyle,
  leftIcon,
  title,
  onPress,
  withBottomBorder,
  hideRightButton,
  disabled,
}) => {
  return (
    <View style={disabled && styles.disabled}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          withBottomBorder && styles.bottomBorder,
          containerStyle,
        ]}
        activeOpacity={0.6}
        disabled={disabled}>
        {leftIcon}
        <Text style={[styles.title, titleStyle]} noOfLines={1}>
          {title}
        </Text>
        {!hideRightButton && <ForwardArrowIcon />}
      </TouchableOpacity>
    </View>
  );
};

export default BottomButton;
