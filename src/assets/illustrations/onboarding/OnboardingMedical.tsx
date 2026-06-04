import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {BioProfileFillHeartbeat} from '~/assets/icons/BiostasisIcons';

interface OnboardingMedicalProps {
  width?: number;
  height?: number;
}

const OnboardingMedical: FC<OnboardingMedicalProps> = ({
  width = 140,
  height = 127,
}) => {
  const size = Math.min(width, height);

  return (
    <View style={[styles.container, {width, height}]}>
      <BioProfileFillHeartbeat size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingMedical;
