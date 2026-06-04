import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import styles, {SEGMENTED_CONTROL_PADDING} from './styles';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SegmentedControl: FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onChange,
  style,
  testID,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const segmentWidth =
    segments.length > 0
      ? (containerWidth - SEGMENTED_CONTROL_PADDING * 2) / segments.length
      : 0;
  const indicatorStyle = useMemo(
    () => ({
      width: segmentWidth,
      transform: [{translateX}],
    }),
    [segmentWidth, translateX],
  );

  useEffect(() => {
    if (!segmentWidth) {
      return;
    }

    Animated.spring(translateX, {
      toValue: selectedIndex * segmentWidth,
      damping: 18,
      mass: 0.7,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
  }, [segmentWidth, selectedIndex, translateX]);

  const handlePress = useCallback(
    (index: number) => () => onChange(index),
    [onChange],
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
      testID={testID}>
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, indicatorStyle]}
        />
      )}
      {segments.map((label, index) => {
        const selected = index === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={handlePress(index)}
            style={styles.segment}>
            <Text style={selected ? styles.labelActive : styles.label}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default React.memo(SegmentedControl);
