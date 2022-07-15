import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import colors from '~/theme/colors';

function PlusIcon({color, ...props}: SvgProps) {
  return (
    <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.417 7.917h-6.334V1.583a1.583 1.583 0 10-3.166 0v6.334H1.583a1.583 1.583 0 000 3.166h6.334v6.334a1.583 1.583 0 003.166 0v-6.334h6.334a1.583 1.583 0 100-3.166z"
        fill={color || colors.blueDark[400]}
      />
    </Svg>
  );
}

export default React.memo(PlusIcon);
