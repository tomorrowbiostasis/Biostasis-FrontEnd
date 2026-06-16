import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {semanticColors} from '~/theme/tokens';
import {toastConfig} from '~/theme/toast';

interface NativeBottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onDismiss: () => void;
  onDismissComplete?: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  maxHeight?: number | `${number}%`;
  bottomInsetPadding?: number;
  closeOnBackdropPress?: boolean;
  swipeToDismiss?: boolean;
  panGestureTarget?: 'sheet' | 'handle';
  showHandle?: boolean;
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 1100;
const CLOSE_DURATION_MS = 420;
const CLOSE_EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SHEET_SPRING = {
  damping: 30,
  stiffness: 185,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.5,
  restSpeedThreshold: 0.5,
};

const NativeBottomSheet = ({
  visible,
  onDismiss,
  onDismissComplete,
  children,
  sheetStyle,
  contentStyle,
  handleStyle,
  maxHeight = '86%',
  bottomInsetPadding = 18,
  closeOnBackdropPress = true,
  swipeToDismiss = true,
  panGestureTarget = 'sheet',
  showHandle = true,
}: NativeBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const {height: windowHeight} = useWindowDimensions();
  const [rendered, setRendered] = useState(visible);
  const [closing, setClosing] = useState(false);
  const hiddenOffset = Math.max(windowHeight, 720);
  const dragY = useSharedValue(visible ? 0 : hiddenOffset);

  // Mirror `rendered` so the visibility effect can read its current value
  // without taking it as a dependency (which would re-run the effect — and
  // thus replay the open animation — on a bare re-render).
  const renderedRef = useRef(rendered);
  renderedRef.current = rendered;

  // Keep the latest callback identities in refs so that the close animation
  // pipeline (finishClose -> animateClose -> open/close effect) never depends
  // on the parent recreating these props. Without this, any parent re-render
  // that hands us a new onDismiss reference would re-run the open animation
  // while the sheet is already visible, making it flicker. See plan.
  const onDismissRef = useRef(onDismiss);
  const onDismissCompleteRef = useRef(onDismissComplete);
  useEffect(() => {
    onDismissRef.current = onDismiss;
    onDismissCompleteRef.current = onDismissComplete;
  }, [onDismiss, onDismissComplete]);

  const finishClose = useCallback(
    (notifyDismiss: boolean) => {
      setClosing(false);
      setRendered(false);
      onDismissCompleteRef.current?.();
      if (notifyDismiss) {
        onDismissRef.current();
      }
    },
    [],
  );

  const animateClose = useCallback(
    (notifyDismiss: boolean) => {
      setClosing(true);
      dragY.value = withTiming(
        hiddenOffset,
        {
          duration: CLOSE_DURATION_MS,
          easing: CLOSE_EASING,
        },
        finished => finished && runOnJS(finishClose)(notifyDismiss),
      );
    },
    [dragY, finishClose, hiddenOffset],
  );

  // Drive open/close strictly off `visible`. animateClose/dragY/hiddenOffset
  // are intentionally omitted from the deps: re-running this effect on a bare
  // re-render must never replay the open animation on an already-open sheet.
  useEffect(() => {
    if (visible) {
      setRendered(true);
      setClosing(false);
      dragY.value = hiddenOffset;
      requestAnimationFrame(() => {
        dragY.value = withSpring(0, SHEET_SPRING);
      });
      return;
    }

    if (renderedRef.current) {
      animateClose(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleRequestDismiss = useCallback(() => {
    if (visible && !closing) {
      animateClose(true);
    }
  }, [animateClose, closing, visible]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(swipeToDismiss)
        .activeOffsetY(12)
        .failOffsetX([-18, 18])
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

          dragY.value = withSpring(0, SHEET_SPRING);
        }),
    [dragY, handleRequestDismiss, swipeToDismiss],
  );

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{translateY: dragY.value}],
  }));

  const animatedScrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      dragY.value,
      [hiddenOffset, 0],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  if (!rendered) {
    return null;
  }

  const handle = (
    <View style={styles.handleHitArea}>
      {showHandle ? <View style={[styles.handle, handleStyle]} /> : null}
    </View>
  );

  const sheet = (
    <Animated.View
      style={[
        styles.sheet,
        {maxHeight, paddingBottom: insets.bottom + bottomInsetPadding},
        animatedSheetStyle,
        sheetStyle,
      ]}>
      {panGestureTarget === 'handle' ? (
        <GestureDetector gesture={panGesture}>{handle}</GestureDetector>
      ) : (
        handle
      )}
      <View style={contentStyle}>{children}</View>
    </Animated.View>
  );

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
          <Animated.View style={[styles.scrim, animatedScrimStyle]} />
        </Pressable>

        {panGestureTarget === 'sheet' ? (
          <GestureDetector gesture={panGesture}>{sheet}</GestureDetector>
        ) : (
          sheet
        )}
        <Toast config={toastConfig} topOffset={insets.top + 12} />
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
