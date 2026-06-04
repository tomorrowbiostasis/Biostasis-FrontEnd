import React, {FC, ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {semanticColors, typography} from '~/theme/tokens';

interface SectionHeaderProps {
  label: string;
  description?: string;
  /** Optional trailing node aligned with the label row (e.g. a counter). */
  right?: ReactNode;
}

/** Flat section header used across the redesigned Emergency Contacts screen. */
const SectionHeader: FC<SectionHeaderProps> = ({label, description, right}) => (
  <View style={styles.wrap}>
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {right}
    </View>
    {description ? <Text style={styles.description}>{description}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.sectionLabel,
    color: semanticColors.textMuted,
  },
  description: {
    ...typography.sectionDescription,
    color: '#3D5470',
  },
});

export default SectionHeader;
