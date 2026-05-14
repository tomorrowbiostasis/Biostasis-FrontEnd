import React, {FC} from 'react';
import {Image} from 'react-native';

interface OnboardingMedicalProps {
  width?: number;
  height?: number;
}

const OnboardingMedical: FC<OnboardingMedicalProps> = ({
  width = 140,
  height = 127,
}) => {
  return (
    <Image
      source={require('./medical.png')}
      style={{width, height}}
      resizeMode="contain"
    />
  );
};

export default OnboardingMedical;
