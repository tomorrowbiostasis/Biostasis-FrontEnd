import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
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
      <Image
        source={{
          uri: 'data:image/png;base64,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',
        }}
        style={styles.image}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 21,
    height: 20,
  },
});

const MemoSvgComponent = React.memo(SvgComponent);
export default MemoSvgComponent;
