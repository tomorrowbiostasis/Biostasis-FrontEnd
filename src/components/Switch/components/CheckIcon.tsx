import React from 'react';
import {} from 'react-native';

import Svg, {SvgProps, Path} from 'react-native-svg';
import colors from '~/theme/colors';

const CheckIcon = (props: SvgProps) => {
  return (
    <Svg width={12} height={11} viewBox="0 0 12 11" fill="none" {...props}>
      <Path
        d="M1.707 4.316L0 6.173l4.546 4.178L12 1.64 10.083 0 4.33 6.725l-2.622-2.41z"
        fill={colors.white}
      />
    </Svg>
  );
};

export default CheckIcon;
