import {Box} from 'native-base';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';

export interface IIconProps {
  size?: number;
}

const styles = StyleSheet.create({
  box: {
    padding: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContents: 'center',
    backgroundColor: colors.white,
    ...boxShadow,
  },
});

export const BackButtonIcon: FC<IIconProps> = ({size = 26}) => {
  return (
    <Box style={styles.box}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          fill={colors.gray[600]}
          d="M16.413 3.879L13.534.993 0 12l13.534 11.007 2.879-2.886L6.756 12z"
        />
      </Svg>
    </Box>
  );
};

export default BackButtonIcon;
