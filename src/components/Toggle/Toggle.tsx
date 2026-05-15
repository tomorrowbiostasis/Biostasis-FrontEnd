import React, {FC, useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';

interface ToggleProps {
  value: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

const TRACK_W = 44;
const TRACK_H = 24;
const THUMB = 17;
const PAD = 3.5;

/** On/off switch matching the Figma toggle (grey off, blue on). */
const Toggle: FC<ToggleProps> = ({value, onChange, disabled}) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PAD, TRACK_W - THUMB - PAD],
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onChange?.(!value)}
      hitSlop={8}
      style={[styles.track, value ? styles.trackOn : styles.trackOff, disabled && styles.disabled]}>
      <Animated.View style={[styles.thumb, {transform: [{translateX}]}]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
  },
  trackOff: {
    backgroundColor: '#C4C9D0',
  },
  trackOn: {
    backgroundColor: '#8FB1EF',
  },
  disabled: {
    opacity: 0.5,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 2,
  },
});

export default Toggle;
