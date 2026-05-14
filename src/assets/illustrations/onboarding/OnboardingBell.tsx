import React, {FC} from 'react';
import {Image} from 'react-native';

interface OnboardingBellProps {
  width?: number;
  height?: number;
}

const OnboardingBell: FC<OnboardingBellProps> = ({
  width = 140,
  height = 127,
}) => {
  return (
    <Image
      source={require('./bell.png')}
      style={{width, height}}
      resizeMode="contain"
    />
  );
};

export default OnboardingBell;
