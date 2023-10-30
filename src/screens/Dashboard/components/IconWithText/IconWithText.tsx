import React, {FC, ReactNode} from 'react';
import {Text, Box, IBoxProps} from 'native-base';
import styles from './styles';
import colors from '~/theme/colors';

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
      <Box style={styles.container}>
        <Box style={styles.icon}>{icon}</Box>
        <Box style={styles.textContainer}>
          <Text style={styles.linkTitle}>{title}</Text>
          <Text fontSize={'sm'} color={colors.gray[600]}>
            {description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
export default IconWithText;
