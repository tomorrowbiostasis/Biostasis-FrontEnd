import React, {ReactNode, useEffect, useRef} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import styles from '~/components/Switch/styles';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

export type SwitchProps = {
  handleOnPress: (value: boolean) => void;
  activeTrackColor: string;
  inActiveTrackColor: string;
  value: boolean;
  leftComponent: ReactNode;
  trackBar: Record<string, unknown>;
  thumbStyle: StyleProp<ViewStyle>;
  travel: number;
  disabled?: boolean;
};

const config: Animated.WithSpringConfig = {
  overshootClamping: true,
};

const RNSwitch: React.FC<SwitchProps> = ({
  handleOnPress,
  activeTrackColor,
  inActiveTrackColor,
  value,
  leftComponent,
  trackBar,
  thumbStyle,
  travel,
  disabled,
}) => {
  const translateX = useSharedValue(0);
  const panRef = useRef<PanGestureHandler>(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });
  useEffect(() => {
    translateX.value = withSpring(!value ? 0 : travel, config);
  }, [value, translateX, travel]);

  const onPress = ({
    nativeEvent: {state},
  }: TapGestureHandlerStateChangeEvent) => {
    if (state !== State.ACTIVE || disabled) {
      return;
    }
    handleOnPress(!value);
  };
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, travel],
        [inActiveTrackColor, activeTrackColor],
      ),
    };
  });

  return (
    <TapGestureHandler waitFor={panRef} onHandlerStateChange={onPress}>
      <Animated.View
        style={[styles.containerStyle, trackBar, animatedContainerStyle]}>
        {leftComponent}
        <Animated.View style={[animatedStyle, styles.thumbStyle, thumbStyle]} />
      </Animated.View>
    </TapGestureHandler>
  );
};
export default React.memo(RNSwitch);
