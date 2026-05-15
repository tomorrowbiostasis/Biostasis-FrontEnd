import React, {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Toggle from '~/components/Toggle';
import {HelpCircleIcon} from '~/assets/icons/AppIcons';
import {semanticColors} from '~/theme/tokens';
import triggerStyles from './triggerStyles';

interface TriggerToggleRowProps {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  /** Adds a top divider — use for every row after the first. */
  divider?: boolean;
  /** When set, renders a tappable info icon that fires this handler. */
  onInfoPress?: () => void;
}

/** Label (+ optional info icon) + Toggle row used inside the trigger panels. */
const TriggerToggleRow: FC<TriggerToggleRowProps> = ({
  label,
  value,
  onChange,
  disabled,
  divider,
  onInfoPress,
}) => (
  <View style={[triggerStyles.row, divider && triggerStyles.rowDivider]}>
    <View style={triggerStyles.rowLabelWrap}>
      <Text style={triggerStyles.rowLabel}>{label}</Text>
      {onInfoPress ? (
        <TouchableOpacity hitSlop={8} onPress={onInfoPress}>
          <HelpCircleIcon size={16} color={semanticColors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
    <Toggle value={value} onChange={onChange} disabled={disabled} />
  </View>
);

export default TriggerToggleRow;
