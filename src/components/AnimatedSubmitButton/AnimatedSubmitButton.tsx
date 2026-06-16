import React, {FC, ReactNode, useEffect, useRef} from 'react';
import {Animated, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Button, IButtonProps, Spinner} from 'native-base';
import {semanticColors, spacing} from '~/theme/tokens';

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
  isLoading: isLoadingProp,
  ...props
}) => {
  const progress = useRef(new Animated.Value(disabled ? 0 : 1)).current;
  const isLoading = Boolean(isLoadingProp);
  const showDisabledStyle = disabled && !isLoading;
  const isBlocked = disabled || isLoading;

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
      outputRange: [1, 1],
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
        accessibilityState={{
          ...(props.accessibilityState ?? {}),
          disabled: isBlocked,
        }}
        backgroundColor={
          showDisabledStyle
            ? 'primaryDisabled'
            : isLoading
            ? '#2A3647'
            : undefined
        }
        _pressed={
          showDisabledStyle || isLoading
            ? {
                backgroundColor: showDisabledStyle
                  ? 'primaryDisabled'
                  : '#2A3647',
              }
            : props._pressed
        }
        _text={
          showDisabledStyle
            ? {
                color: 'textInverse',
                opacity: 1,
              }
            : props._text
        }
        onPress={isBlocked ? undefined : props.onPress}
        variant={variant as IButtonProps['variant']}
        isDisabled={false}>
        {children}
      </Button>
      {isLoading ? (
        <Spinner
          color={semanticColors.textInverse}
          size="small"
          style={styles.spinner}
        />
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: spacing.xl,
    top: '50%',
    marginTop: -10,
  },
});

export default AnimatedSubmitButton;
