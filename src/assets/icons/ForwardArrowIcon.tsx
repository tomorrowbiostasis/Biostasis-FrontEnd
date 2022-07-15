import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import colors from '~/theme/colors';

function ForwardArrowIcon(props: SvgProps) {
  return (
    <Svg width={7} height={12} viewBox="0 0 7 12" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.515 6L.302 1.766a1.038 1.038 0 010-1.463 1.026 1.026 0 011.455 0l4.941 4.966a1.038 1.038 0 010 1.462l-4.94 4.966a1.026 1.026 0 01-1.456 0 1.038 1.038 0 010-1.463L4.515 6z"
        fill={colors.gray[800]}
      />
    </Svg>
  );
}

export default React.memo(ForwardArrowIcon);
