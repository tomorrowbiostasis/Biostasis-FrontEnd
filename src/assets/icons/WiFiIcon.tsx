import * as React from 'react';
import Svg, {SvgProps, Path, Mask} from 'react-native-svg';
import colors from '~/theme/colors';

function WiFiIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.385 8.96a12.5 12.5 0 0116.539 0 .833.833 0 001.102-1.25 14.167 14.167 0 00-18.744 0 .833.833 0 001.103 1.25zm2.973 2.973a8.333 8.333 0 0110.667 0 .833.833 0 101.067-1.28 10 10 0 00-12.8 0 .833.833 0 101.066 1.28zm7.71 3.006a4.167 4.167 0 00-4.827 0 .833.833 0 11-.965-1.358 5.833 5.833 0 016.757 0 .833.833 0 01-.966 1.358z"
        fill={colors.black}
      />
      <Mask id="prefix__a" x={0} y={4} width={20} height={12}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.385 8.96a12.5 12.5 0 0116.539 0 .833.833 0 001.102-1.25 14.167 14.167 0 00-18.744 0 .833.833 0 001.103 1.25zm2.973 2.973a8.333 8.333 0 0110.667 0 .833.833 0 101.067-1.28 10 10 0 00-12.8 0 .833.833 0 101.066 1.28zm7.71 3.006a4.167 4.167 0 00-4.827 0 .833.833 0 11-.965-1.358 5.833 5.833 0 016.757 0 .833.833 0 01-.966 1.358z"
          fill={colors.white}
        />
      </Mask>
    </Svg>
  );
}

export default React.memo(WiFiIcon);
