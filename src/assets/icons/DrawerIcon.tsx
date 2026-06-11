import {Box} from 'native-base';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import boxShadow from '~/theme/boxShadow';
import colors from '~/theme/colors';
import {useDrawerStatus} from '@react-navigation/drawer';

const styles = StyleSheet.create({
  box: {
    padding: 7,
    borderRadius: 10,
    borderColor: colors.gray[600],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...boxShadow,
  },
});

const DrawerIcon = ({size = 26, color = colors.gray[600], width = 3}) => {
  const drawerStatus = useDrawerStatus();
  return (
    <Box style={styles.box}>
      {
        drawerStatus === 'closed' ? <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M3 12h18M3 18h18"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </Svg> : <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6L18 18M6 18L18 6"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
    </Svg>
    }
    </Box>
  );
};
export default DrawerIcon;
