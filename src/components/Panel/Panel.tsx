import React, {FC, ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {semanticColors, radius, shadow, spacing} from '~/theme/tokens';
import styles from './styles';

type PanelVariant = 'default' | 'flat' | 'elevated';
type PanelAlign = 'start' | 'center' | 'stretch';
type PanelJustify =
  | 'start'
  | 'center'
  | 'space-evenly'
  | 'space-between'
  | 'end';

interface PanelProps {
  children: ReactNode;
  variant?: PanelVariant;
  padding?: keyof typeof spacing;
  align?: PanelAlign;
  justify?: PanelJustify;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const alignMap: Record<PanelAlign, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  stretch: 'stretch',
};

const justifyMap: Record<PanelJustify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-evenly': 'space-evenly',
  'space-between': 'space-between',
};

const Panel: FC<PanelProps> = ({
  children,
  variant = 'default',
  padding = 'xl',
  align,
  justify,
  style,
  testID,
}) => {
  const variantStyle: ViewStyle =
    variant === 'flat'
      ? {backgroundColor: semanticColors.surface}
      : variant === 'elevated'
      ? {backgroundColor: semanticColors.surface, ...shadow.lg}
      : {backgroundColor: semanticColors.surface, ...shadow.md};

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        variantStyle,
        {padding: spacing[padding]},
        align && {alignItems: alignMap[align]},
        justify && {justifyContent: justifyMap[justify]},
        style,
      ]}>
      {children}
    </View>
  );
};

export default React.memo(Panel);
