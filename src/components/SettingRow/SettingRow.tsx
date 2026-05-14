import React, {FC, ReactNode} from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {semanticColors} from '~/theme/tokens';
import styles from './styles';

interface SettingRowProps {
  label: string;
  description?: string;
  rightElement?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SettingRow: FC<SettingRowProps> = ({
  label,
  description,
  rightElement,
  onPress,
  disabled,
  divider,
  style,
  testID,
}) => {
  const content = (
    <View
      style={[
        styles.row,
        divider && styles.divider,
        disabled && styles.disabled,
        style,
      ]}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      {rightElement ? (
        <View style={styles.rightSlot}>{rightElement}</View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        android_ripple={{color: semanticColors.surfaceSubtle}}>
        {content}
      </Pressable>
    );
  }
  return (
    <View testID={testID}>
      {content}
    </View>
  );
};

export default React.memo(SettingRow);
