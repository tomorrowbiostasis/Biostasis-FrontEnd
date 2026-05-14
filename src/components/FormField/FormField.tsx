import React, {FC, ReactNode} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import styles from './styles';

interface FormFieldProps {
  children: ReactNode;
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const FormField: FC<FormFieldProps> = ({
  children,
  label,
  required,
  error,
  hint,
  style,
  testID,
}) => {
  const helperText = error ?? hint;
  const helperStyle = error ? styles.error : styles.hint;

  return (
    <View style={[styles.wrapper, style]} testID={testID}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <View style={styles.inputSlot}>{children}</View>
      {helperText ? <Text style={helperStyle}>{helperText}</Text> : null}
    </View>
  );
};

export default React.memo(FormField);
