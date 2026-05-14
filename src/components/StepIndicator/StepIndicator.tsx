import React, {FC} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

type StepIndicatorVariant = 'darkOnLight' | 'lightOnDark';

interface StepIndicatorProps {
  total: number;
  currentIndex: number;
  variant?: StepIndicatorVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const StepIndicator: FC<StepIndicatorProps> = ({
  total,
  currentIndex,
  variant = 'darkOnLight',
  style,
  testID,
}) => {
  const activeColor =
    variant === 'darkOnLight' ? semanticColors.primary : semanticColors.surface;
  const inactiveColor =
    variant === 'darkOnLight'
      ? semanticColors.borderStrong
      : 'rgba(255, 255, 255, 0.3)';

  return (
    <View testID={testID} style={[styles.row, style]}>
      {Array.from({length: total}).map((_, idx) => {
        const isActive = idx === currentIndex;
        return (
          <View
            key={idx}
            style={[
              styles.dot,
              isActive ? styles.dotActive : styles.dotInactive,
              {backgroundColor: isActive ? activeColor : inactiveColor},
            ]}
          />
        );
      })}
    </View>
  );
};

export default React.memo(StepIndicator);
