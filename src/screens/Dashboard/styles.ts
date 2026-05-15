import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semanticColors.surfaceCanvas,
  },
  header: {
    backgroundColor: semanticColors.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 34,
    paddingTop: 12,
    paddingBottom: 24,
  },
  eyebrow: {
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  greeting: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    letterSpacing: -0.36,
    color: '#F1F3F6',
    marginTop: 12,
  },
  name: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 26,
    color: '#F1F3F6',
    marginTop: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: semanticColors.surfaceCanvas,
    borderWidth: 1,
    borderColor: 'rgba(11, 31, 58, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
    backgroundColor: semanticColors.primary,
  },
  menuLineLong: {
    width: 17,
  },
  menuLineShort: {
    width: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 34,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 18,
  },
  metricsCard: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  collectedAt: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: '#1D1617',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionLabel: {
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#6B7A8E',
  },
  cards: {
    gap: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 24,
  },
  badgeText: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
  },
});

export default styles;
