import * as React from 'react';
import Svg, {Path, Mask} from 'react-native-svg';
import colors from '~/theme/colors';
interface IIconProps {
  color?: string;
}

function TrashIcon({color = colors.black}: IIconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.833 4.167H2.5a.833.833 0 000 1.666h.833v10.834a2.5 2.5 0 002.5 2.5h8.334a2.5 2.5 0 002.5-2.5V5.833h.833a.833.833 0 100-1.666h-3.334v-.834a2.5 2.5 0 00-2.5-2.5H8.333a2.5 2.5 0 00-2.5 2.5v.834zm1.667 0h5v-.834a.833.833 0 00-.834-.833H8.333a.833.833 0 00-.833.833v.834zm5.833 1.666H5v10.834c0 .46.373.833.833.833h8.334c.46 0 .833-.373.833-.833V5.833h-1.667zM7.5 9.167v5a.833.833 0 001.666 0v-5a.833.833 0 00-1.666 0zm3.333 5v-5a.833.833 0 011.667 0v5a.833.833 0 01-1.667 0z"
        fill={color}
      />
      <Mask id="prefix__a" x={1} y={0} width={18} height={20}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.833 4.167H2.5a.833.833 0 000 1.666h.833v10.834a2.5 2.5 0 002.5 2.5h8.334a2.5 2.5 0 002.5-2.5V5.833h.833a.833.833 0 100-1.666h-3.334v-.834a2.5 2.5 0 00-2.5-2.5H8.333a2.5 2.5 0 00-2.5 2.5v.834zm1.667 0h5v-.834a.833.833 0 00-.834-.833H8.333a.833.833 0 00-.833.833v.834zm5.833 1.666H5v10.834c0 .46.373.833.833.833h8.334c.46 0 .833-.373.833-.833V5.833h-1.667zM7.5 9.167v5a.833.833 0 001.666 0v-5a.833.833 0 00-1.666 0zm3.333 5v-5a.833.833 0 011.667 0v5a.833.833 0 01-1.667 0z"
          fill={colors.white}
        />
      </Mask>
    </Svg>
  );
}

export default React.memo(TrashIcon);
