import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import colors from '~/theme/colors';

function RadioButtonOf(props: SvgProps) {
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20" fill="none" {...props}>
      <Path
        d="M21 10c0 4.906-4.287 9-9.726 9-5.438 0-9.725-4.094-9.725-9s4.287-9 9.726-9C16.712 1 21 5.094 21 10z"
        stroke={colors.blue[300]}
        strokeWidth={2}
      />
    </Svg>
  );
}

const MemoRadioButtonOf = React.memo(RadioButtonOf);
export default MemoRadioButtonOf;
