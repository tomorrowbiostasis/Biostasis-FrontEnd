import React, {FC} from 'react';
import {Text, Box} from 'native-base';

import styles from './styles';

interface AlertProps {
  label: string;
  error?: boolean;
  props?: any;
}

const Alert: FC<AlertProps> = ({label, error, ...props}) => {
  return (
    <Box p={4} style={[styles.wrapper, error ? styles.error : null]} {...props}>
      <Text textAlign="center" fontSize="sm" style={styles.label}>
        {label}
      </Text>
    </Box>
  );
};

export default Alert;
