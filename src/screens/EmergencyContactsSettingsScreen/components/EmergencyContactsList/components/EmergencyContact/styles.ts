import {StyleSheet} from 'react-native';
import {semanticColors, typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  card: {
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarTile: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  name: {
    ...typography.rowTitle,
    color: semanticColors.primary,
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  detail: {
    ...typography.rowDescriptionMedium,
    color: '#53677F',
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: '#E7EDF4',
  },
  footerRow: {
    minHeight: 34,
  },
  toggleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 30,
  },
  toggleLabel: {
    flex: 1,
    ...typography.body,
    color: '#53677F',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: -2,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6F9',
    borderWidth: 1,
    borderColor: '#E2E9F0',
  },
});

export default styles;
