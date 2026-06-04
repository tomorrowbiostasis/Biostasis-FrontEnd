import React, {FC} from 'react';
import {Text, View, ViewProps} from 'react-native';
import {CheckIcon, XIcon} from '~/assets/icons/AppIcons';
import {semanticColors} from '~/theme/tokens';

import styles from './styles';

interface AlertProps extends ViewProps {
  label: string;
  error?: boolean;
}

const Alert: FC<AlertProps> = ({label, error, style, ...props}) => {
  const Icon = error ? XIcon : CheckIcon;
  const accentColor = error ? semanticColors.danger : semanticColors.success;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.wrapper,
        error ? styles.error : styles.success,
        style,
      ]}
      {...props}>
      <View style={[styles.accentBar, {backgroundColor: accentColor}]} />
      <View style={styles.iconChip}>
        <Icon size={18} color={accentColor} />
      </View>
      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
};

export default Alert;
