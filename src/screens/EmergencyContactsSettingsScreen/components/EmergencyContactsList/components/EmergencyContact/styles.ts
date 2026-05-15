import {StyleSheet} from 'react-native';
import {semanticColors} from '~/theme/tokens';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 14,
  },
  name: {
    flex: 1,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    color: semanticColors.primary,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default styles;
