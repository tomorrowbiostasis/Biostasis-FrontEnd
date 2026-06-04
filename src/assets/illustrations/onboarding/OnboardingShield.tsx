import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {BioProfileFillShield} from '~/assets/icons/BiostasisIcons';

interface OnboardingShieldProps {
  width?: number;
  height?: number;
}

const OnboardingShield: FC<OnboardingShieldProps> = ({
  width = 140,
  height = 127,
}) => {
  const size = Math.min(width, height);

  return (
    <View style={[styles.container, {width, height}]}>
      <BioProfileFillShield size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingShield;
