import React, {FC, useCallback} from 'react';
import {Pressable, StyleProp, Text, View, ViewStyle} from 'react-native';
import styles from './styles';

type TabsVariant = 'lightOnDark' | 'darkOnLight';

interface TabsProps {
  tabs: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  variant?: TabsVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Tabs: FC<TabsProps> = ({
  tabs,
  selectedIndex,
  onChange,
  variant = 'lightOnDark',
  style,
  testID,
}) => {
  const isLightOnDark = variant === 'lightOnDark';
  const containerVariant = isLightOnDark ? styles.containerLight : styles.containerDark;

  const handlePress = useCallback(
    (index: number) => () => onChange(index),
    [onChange],
  );

  return (
    <View style={[styles.container, containerVariant, style]} testID={testID}>
      {tabs.map((label, index) => {
        const selected = index === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={handlePress(index)}
            style={[
              styles.tab,
              selected &&
                (isLightOnDark ? styles.tabActiveLight : styles.tabActiveDark),
            ]}>
            <Text
              style={[
                styles.label,
                selected ? styles.labelActive : styles.labelInactive,
              ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default React.memo(Tabs);
