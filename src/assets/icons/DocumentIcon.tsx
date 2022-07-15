import * as React from 'react';
import Svg, {Defs, ClipPath, Rect, G, Path, SvgProps} from 'react-native-svg';

function DocumentIcon(props: SvgProps) {
  return (
    <Svg width={16} height={22} viewBox="0 0 16 22" {...props}>
      <Defs>
        <ClipPath id="prefix__a">
          <Rect
            data-name="Rectangle 3"
            width={15}
            height={21}
            rx={3}
            transform="translate(4)"
            fill="none"
          />
        </ClipPath>
      </Defs>
      <G data-name="Group 1">
        <Path
          data-name="Subtraction 1"
          d="M15 22H1a1 1 0 01-1-1V1a1 1 0 011-1h9.636L16 5.364V21a1 1 0 01-1 1z"
          fill="#c2381d"
        />
        <G
          data-name="Mask Group 1"
          transform="translate(-4 1)"
          clipPath="url(#prefix__a)">
          <G
            data-name="Rectangle 2"
            transform="translate(13 -5)"
            fill="none"
            stroke="#fff">
            <Rect width={11} height={11} rx={1} stroke="none" />
            <Rect x={0.5} y={0.5} width={10} height={10} rx={0.5} />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default DocumentIcon;
