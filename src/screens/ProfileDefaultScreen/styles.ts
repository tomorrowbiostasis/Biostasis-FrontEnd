import {StyleSheet} from 'react-native';
import {layout, semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  scroll: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    gap: 3,
  },
  sectionTitle: {
    ...typography.sectionLabel,
    color: '#6B7A8E',
  },
  sectionDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#96A3B3',
  },
  group: {
    gap: 12,
  },
});

export default styles;
