import React, {FC, useCallback} from 'react';
import {Pressable, StyleProp, Text, View, ViewStyle} from 'react-native';
import styles from './styles';

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
  const handlePress = useCallback(
    (index: number) => () => onChange(index),
    [onChange],
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      {segments.map((label, index) => {
        const selected = index === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={handlePress(index)}
            style={[styles.segment, selected && styles.segmentActive]}>
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
