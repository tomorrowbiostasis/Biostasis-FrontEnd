import React, {FC} from 'react';
import Svg, {Path} from 'react-native-svg';

export interface IIconProps {
  size?: number;
  fill?: string;
}

export const QuestionIcon: FC<IIconProps> = ({size = 18, fill = 'black'}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill={fill}>
      <Path
        data-name="Union 4"
        d="M4.861 15.292a7.967 7.967 0 01-2.53-1.706 7.967 7.967 0 01-1.706-2.53 7.95 7.95 0 01.734-7.547A7.979 7.979 0 014.861.626a7.984 7.984 0 016.2 0 7.979 7.979 0 014.235 4.235 7.984 7.984 0 010 6.2 7.979 7.979 0 01-4.235 4.235 7.984 7.984 0 01-6.2 0zm.781-12.816a5.965 5.965 0 102.317-.468 5.918 5.918 0 00-2.317.468zm1.237 9.061V8.825a1.13 1.13 0 012.26 0v2.712a1.13 1.13 0 11-2.26 0zm-.34-6.892a1.469 1.469 0 111.469 1.469 1.469 1.469 0 01-1.469-1.469z"
      />
    </Svg>
  );
};

export default QuestionIcon;
