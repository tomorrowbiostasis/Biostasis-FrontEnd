import React, {FC, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleProp,
  Text,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CollapsibleVariant = 'inset' | 'flush';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  initiallyExpanded?: boolean;
  variant?: CollapsibleVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const CollapsibleSection: FC<CollapsibleSectionProps> = ({
  title,
  children,
  initiallyExpanded = false,
  variant = 'flush',
  style,
  testID,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const rotation = useRef(new Animated.Value(initiallyExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [expanded, rotation]);

  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      style={[
        styles.container,
        variant === 'inset' && styles.containerInset,
        style,
      ]}
      testID={testID}>
      <Pressable
        onPress={handleToggle}
        style={styles.header}
        android_ripple={{color: semanticColors.surfaceSubtle}}>
        <Text style={styles.title}>{title}</Text>
        <Animated.Text
          style={[styles.chevron, {transform: [{rotate}]}]}
          accessibilityElementsHidden>
          {'▾'}
        </Animated.Text>
      </Pressable>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
};

export default React.memo(CollapsibleSection);
