import {StyleSheet} from 'react-native';
import {layout, semanticColors, typography} from '~/theme/tokens';

const CARD_BORDER = 'rgba(11, 31, 58, 0.1)';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  content: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: 14,
    gap: 14,
  },
  cardColumn: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: 14,
    gap: 14,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  cardSubtitle: {
    ...typography.body,
    color: '#96A3B3',
  },
  chevronOpen: {
    transform: [{rotate: '90deg'}],
  },
  gdprBody: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: semanticColors.border,
  },
  gdprText: {
    ...typography.body,
    color: semanticColors.textSecondary,
  },
  dangerCard: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dangerHeading: {
    ...typography.rowTitle,
    color: semanticColors.primary,
  },
  dangerTitle: {
    ...typography.rowTitle,
    color: semanticColors.primary,
    marginTop: 4,
  },
  dangerDescription: {
    ...typography.body,
    color: semanticColors.textSecondary,
  },
  deleteButton: {
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    ...typography.rowTitle,
    color: semanticColors.danger,
  },
});

export default styles;
