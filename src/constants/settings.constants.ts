import {isIOS} from '~/utils';

export const intervalsConfig = [
  {
    time: 6,
    value: '6',
    unit: 'minutes',
    debug: true,
  },
  {
    time: 20,
    value: '20',
    debug: true,
    unit: 'minutes',
  },
  {
    time: 120,
    value: '120',
    unit: 'minutes',
    debug: false,
  },
  {
    time: 240,
    value: '240',
    unit: 'minutes',
    debug: false,
  },
  {
    time: 6,
    value: '360',
    unit: 'hours',
    debug: false,
  },
  {
    time: 8,
    value: '480',
    unit: 'hours',
    debug: false,
  },
  {
    time: 12,
    value: '720',
    unit: 'hours',
    debug: false,
  },
  {
    time: 24,
    value: '1440',
    unit: 'hours',
    debug: false,
  },
  {
    time: 48,
    value: '2880',
    unit: 'hours',
    debug: false,
  },
] as const;

export const excludedIntervalsForPulse = isIOS
  ? ['240', '360', '480']
  : ['240', '480'];
