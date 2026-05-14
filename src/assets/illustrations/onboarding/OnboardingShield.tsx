import React, {FC} from 'react';
import {Image} from 'react-native';

interface OnboardingShieldProps {
  width?: number;
  height?: number;
}

const OnboardingShield: FC<OnboardingShieldProps> = ({
  width = 140,
  height = 127,
}) => {
  return (
    <Image
      source={require('./shield.png')}
      style={{width, height}}
      resizeMode="contain"
    />
  );
};

export default OnboardingShield;
