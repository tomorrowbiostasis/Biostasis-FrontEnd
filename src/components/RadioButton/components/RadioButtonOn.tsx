import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import colors from '~/theme/colors';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20" fill="none" {...props}>
      <Path
        d="M21 10c0 4.906-4.287 9-9.726 9-5.438 0-9.725-4.094-9.725-9s4.287-9 9.726-9C16.712 1 21 5.094 21 10z"
        fill={colors.green[400]}
        stroke={colors.green[400]}
        strokeWidth={2}
      />
      <Path
        d="M7.8 10.4l2.2 2.2 4.3-4.3"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const MemoSvgComponent = React.memo(SvgComponent);
export default MemoSvgComponent;
