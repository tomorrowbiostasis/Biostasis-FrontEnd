import React, {FC, ReactNode, useEffect, useRef} from 'react';
import {Animated, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Button, IButtonProps} from 'native-base';

interface AnimatedSubmitButtonProps extends IButtonProps {
  children: ReactNode;
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
}

const AnimatedSubmitButton: FC<AnimatedSubmitButtonProps> = ({
  children,
  disabled,
  style,
  variant = 'figmaPrimary',
  ...props
}) => {
  const progress = useRef(new Animated.Value(disabled ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: disabled ? 0 : 1,
      damping: 18,
      mass: 0.8,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  }, [disabled, progress]);

  const animatedStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.42, 1],
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.wrapper, style, animatedStyle]}>
      <Button
        {...props}
        variant={variant as IButtonProps['variant']}
        isDisabled={disabled}>
        {children}
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
});

export default AnimatedSubmitButton;
