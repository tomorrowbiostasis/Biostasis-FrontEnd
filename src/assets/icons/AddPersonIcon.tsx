import * as React from 'react';
import Svg, {SvgProps, Path, Mask} from 'react-native-svg';
import colors from '~/theme/colors';

function AddPersonIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.083 10a4.167 4.167 0 110-8.333 4.167 4.167 0 010 8.333zm7.084 7.5v-1.667A4.167 4.167 0 0010 11.667H4.167A4.167 4.167 0 000 15.833V17.5a.833.833 0 001.667 0v-1.667a2.5 2.5 0 012.5-2.5H10a2.5 2.5 0 012.5 2.5V17.5a.833.833 0 001.667 0zm1.666-5.833V10h-1.666a.833.833 0 110-1.667h1.666V6.667a.833.833 0 011.667 0v1.666h1.667a.833.833 0 010 1.667H17.5v1.667a.833.833 0 11-1.667 0zm-6.25-5.834a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        fill={colors.black}
      />
      <Mask id="prefix__a" x={0} y={1} width={20} height={18}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.083 10a4.167 4.167 0 110-8.333 4.167 4.167 0 010 8.333zm7.084 7.5v-1.667A4.167 4.167 0 0010 11.667H4.167A4.167 4.167 0 000 15.833V17.5a.833.833 0 001.667 0v-1.667a2.5 2.5 0 012.5-2.5H10a2.5 2.5 0 012.5 2.5V17.5a.833.833 0 001.667 0zm1.666-5.833V10h-1.666a.833.833 0 110-1.667h1.666V6.667a.833.833 0 011.667 0v1.666h1.667a.833.833 0 010 1.667H17.5v1.667a.833.833 0 11-1.667 0zm-6.25-5.834a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          fill={colors.white}
        />
      </Mask>
    </Svg>
  );
}

export default React.memo(AddPersonIcon);
