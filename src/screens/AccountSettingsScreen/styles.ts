import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const CARD_BORDER = 'rgba(11, 31, 58, 0.1)';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 34,
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
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
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
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.primary,
  },
  cardSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
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
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 19,
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
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.primary,
  },
  dangerTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.primary,
    marginTop: 4,
  },
  dangerDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 19,
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
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: semanticColors.danger,
  },
  logoutWrap: {
    marginTop: 8,
  },
});

export default styles;
