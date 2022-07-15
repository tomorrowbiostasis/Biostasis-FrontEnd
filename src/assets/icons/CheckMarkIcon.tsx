import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import colors from '~/theme/colors';

function CheckMarkIcon(props: SvgProps) {
  return (
    <Svg width={24} height={19} viewBox="0 0 24 19" fill="none" {...props}>
      <Path
        d="M1.076 8.62L9.51 17 23.006 1"
        stroke={colors.green[400]}
        strokeWidth={2}
      />
    </Svg>
  );
}

export default React.memo(CheckMarkIcon);
