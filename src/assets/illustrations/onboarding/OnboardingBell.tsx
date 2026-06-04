import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {BioSettingsFillBroadcastSignal} from '~/assets/icons/BiostasisIcons';

interface OnboardingBellProps {
  width?: number;
  height?: number;
}

const OnboardingBell: FC<OnboardingBellProps> = ({
  width = 140,
  height = 127,
}) => {
  const size = Math.min(width, height);

  return (
    <View style={[styles.container, {width, height}]}>
      <BioSettingsFillBroadcastSignal size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingBell;
