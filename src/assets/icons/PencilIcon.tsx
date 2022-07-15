import * as React from 'react';
import Svg, {SvgProps, Path, Mask} from 'react-native-svg';
import colors from '~/theme/colors';

function PencilIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.09 6.077l-4.168-4.166a.833.833 0 00-1.178 0L1.911 12.744a.833.833 0 00-.244.59V17.5c0 .46.373.833.833.833h4.167a.833.833 0 00.589-.244L18.089 7.256a.833.833 0 000-1.179zM3.332 16.667v-2.988l10-10 2.988 2.988-10 10H3.333z"
        fill={colors.black}
      />
      <Mask id="prefix__a" x={1} y={1} width={18} height={18}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.09 6.077l-4.168-4.166a.833.833 0 00-1.178 0L1.911 12.744a.833.833 0 00-.244.59V17.5c0 .46.373.833.833.833h4.167a.833.833 0 00.589-.244L18.089 7.256a.833.833 0 000-1.179zM3.332 16.667v-2.988l10-10 2.988 2.988-10 10H3.333z"
          fill={colors.white}
        />
      </Mask>
    </Svg>
  );
}

export default React.memo(PencilIcon);
