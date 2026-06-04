import React, {FC, PropsWithChildren, useMemo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Edge, useSafeAreaInsets} from 'react-native-safe-area-context';

interface AnimatedHeaderSurfaceProps extends PropsWithChildren {
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

const AnimatedHeaderSurface: FC<AnimatedHeaderSurfaceProps> = ({
  children,
  edges = ['top'],
  style,
  contentStyle,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  const safeAreaPadding = useMemo(
    () => ({
      paddingTop: edges.includes('top') ? insets.top : 0,
      paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    }),
    [edges, insets.bottom, insets.top],
  );

  return (
    <View testID={testID} style={[styles.surface, style, safeAreaPadding]}>
      <View style={[contentStyle, styles.content]}>
        <View>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    overflow: 'hidden',
  },
  content: {
    flexShrink: 0,
  },
});

export default React.memo(AnimatedHeaderSurface);
