import React, {FC} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';

interface OrDividerProps {
  label: string;
}

const OrDivider: FC<OrDividerProps> = ({label}) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default React.memo(OrDivider);
