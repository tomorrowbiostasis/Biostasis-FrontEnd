import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

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
    paddingTop: 24,
    paddingBottom: 32,
    gap: 22,
  },
  dimmed: {
    opacity: 0.5,
  },

  /* How it works card */
  howCard: {
    backgroundColor: semanticColors.surface,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 12,
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  howTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.primary,
  },
  howDescription: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 19.5,
    color: '#3D5470',
  },
  steps: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    color: semanticColors.primary,
  },
  stepDesc: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#3D5470',
  },

  /* Enable toggles card */
  togglesCard: {
    backgroundColor: semanticColors.surfaceCanvas,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 14,
    overflow: 'hidden',
  },
  toggleRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  toggleLabel: {
    flex: 1,
    paddingRight: 12,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: semanticColors.primary,
  },
});

export default styles;
