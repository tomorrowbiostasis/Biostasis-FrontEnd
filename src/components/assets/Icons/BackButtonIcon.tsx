import React, {FC} from 'react';
import Svg, {Path} from 'react-native-svg';

export interface IIconProps {
  size?: number;
  tintColor: string;
}

export const BackButtonIcon: FC<IIconProps> = ({size = 12, tintColor}) => {
  return (
    <Svg width={size * (7 / 12)} height={size} viewBox="0 0 7 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.485 6l4.213 4.234a1.038 1.038 0 010 1.463 1.026 1.026 0 01-1.455 0L.302 6.731a1.038 1.038 0 010-1.462L5.242.303a1.026 1.026 0 011.456 0 1.038 1.038 0 010 1.463L2.485 6z"
        fill={tintColor}
      />
    </Svg>
  );
};

export default BackButtonIcon;
