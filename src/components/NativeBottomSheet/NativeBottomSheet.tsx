import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {semanticColors} from '~/theme/tokens';

interface NativeBottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onDismiss: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  maxHeight?: number | `${number}%`;
  bottomInsetPadding?: number;
  closeOnBackdropPress?: boolean;
  swipeToDismiss?: boolean;
  showHandle?: boolean;
}

const CLOSED_OFFSET = 48;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 1100;

const NativeBottomSheet = ({
  visible,
  onDismiss,
  children,
  sheetStyle,
  contentStyle,
  handleStyle,
  maxHeight = '86%',
  bottomInsetPadding = 18,
  closeOnBackdropPress = true,
  swipeToDismiss = true,
  showHandle = true,
}: NativeBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const [rendered, setRendered] = useState(visible);
  const dragY = useSharedValue(visible ? 0 : CLOSED_OFFSET);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      dragY.value = CLOSED_OFFSET;
      requestAnimationFrame(() => {
        dragY.value = withSpring(0, {
          damping: 24,
          stiffness: 280,
          mass: 0.92,
        });
      });
      return;
    }

    dragY.value = withTiming(
      CLOSED_OFFSET,
      {duration: 180},
      finished => finished && runOnJS(setRendered)(false),
    );
  }, [dragY, visible]);

  const handleRequestDismiss = useCallback(() => {
    if (visible) {
      onDismiss();
    }
  }, [onDismiss, visible]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(swipeToDismiss)
        .onUpdate(event => {
          if (event.translationY > 0) {
            dragY.value = event.translationY;
          }
        })
        .onEnd(event => {
          if (
            event.translationY > DISMISS_DISTANCE ||
            event.velocityY > DISMISS_VELOCITY
          ) {
            runOnJS(handleRequestDismiss)();
            return;
          }

          dragY.value = withSpring(0, {
            damping: 24,
            stiffness: 280,
            mass: 0.92,
          });
        }),
    [dragY, handleRequestDismiss, swipeToDismiss],
  );

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{translateY: dragY.value}],
  }));

  if (!rendered) {
    return null;
  }

  return (
    <Modal
      visible={rendered}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleRequestDismiss}>
      <View style={styles.root}>
        <Pressable
          style={StyleSheet.absoluteFill}
          disabled={!closeOnBackdropPress}
          onPress={handleRequestDismiss}>
          <View style={styles.scrim} />
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheet,
              {maxHeight, paddingBottom: insets.bottom + bottomInsetPadding},
              animatedSheetStyle,
              sheetStyle,
            ]}>
            <View style={styles.handleHitArea}>
              {showHandle ? (
                <View style={[styles.handle, handleStyle]} />
              ) : null}
            </View>
            <View style={contentStyle}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 31, 58, 0.42)',
  },
  sheet: {
    backgroundColor: semanticColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 12,
  },
  handleHitArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: semanticColors.borderStrong,
  },
});

export default React.memo(NativeBottomSheet);
