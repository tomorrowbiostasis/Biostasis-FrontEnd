import React, {FC, ReactNode} from 'react';
import {Text, View, Box, IBoxProps} from 'native-base';
import styles from './styles';

interface IIconWithText {
  icon: ReactNode;
  title: string;
  description: string;
}

export const IconWithText: FC<IIconWithText & IBoxProps> = ({
  icon,
  title,
  description,
  ...props
}) => {
  return (
    <Box {...props}>
      <Box flexDirection="row">
        {icon}
        <View ml={4} style={styles.container}>
          <Text fontSize="lg" style={styles.linkTitle}>
            {title}
          </Text>
          <Text fontSize="sm" mt={1} style={styles.linkDescription}>
            {description}
          </Text>
        </View>
      </Box>
    </Box>
  );
};
export default IconWithText;
