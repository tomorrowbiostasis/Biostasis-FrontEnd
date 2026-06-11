import {StyleSheet} from 'react-native';
import colors from '~/theme/colors';
import {typography} from '~/theme/tokens';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: 14,
    marginTop: 12,
  },
  cardInactive: {
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusInactive: {
    backgroundColor: colors.gray[200],
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusDotInactive: {
    backgroundColor: colors.gray[500],
  },
  statusText: {
    ...typography.statusTagSmall,
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextInactive: {
    color: colors.gray[600],
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: colors.gray[600],
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeDayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeDay: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginRight: 6,
  },
  timeHour: {
    fontSize: 13,
    color: colors.gray[700],
  },
  arrowContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 13,
    color: colors.gray[700],
    marginRight: 8,
  },
});

export default styles;
