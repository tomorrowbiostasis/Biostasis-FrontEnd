import {CheckIcon, Select} from 'native-base';
import React, {FC, useMemo} from 'react';

import {
  excludedIntervalsForPulse,
  intervalsConfig,
} from '~/constants/settings.constants';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import EnvConfig from '~/services/Env.service';
import colors from '~/theme/colors';

interface IntervalSelect {
  type: 'pulse' | 'time';
  onValueChange: (itemValue: string) => void;
  selectedValue?: string;
}

type Interval = {
  time: number;
  value: string;
  unit: string;
  debug: boolean;
};

const IntervalSelect: FC<IntervalSelect> = ({
  type,
  onValueChange,
  selectedValue,
}) => {
  const {t} = useAppTranslation();

  const intervals = useMemo(
    () =>
      type === 'time'
        ? intervalsConfig
        : intervalsConfig
            .map(interval =>
              interval.time === 120 ? {...interval, debug: true} : interval,
            )
            .filter(({value}) => !excludedIntervalsForPulse.includes(value)),
    [type],
  );
  return (
    <Select
      selectedValue={selectedValue}
      minWidth="200px"
      accessibilityLabel={t(
        'emergencyContacts.automatedEmergencySettings.interval.title',
      )}
      placeholder={t(
        'emergencyContacts.automatedEmergencySettings.interval.title',
      )}
      _selectedItem={{
        bg: colors.magenta['400'],
        endIcon: <CheckIcon size="5" />,
      }}
      mt={4}
      onValueChange={onValueChange}>
      {(intervals as Interval[])
        .map(({time, value, unit, debug}) => {
          if (debug && EnvConfig.PROD) {
            return undefined;
          }
          return (
            <Select.Item
              key={value}
              label={`${t(
                `emergencyContacts.automatedEmergencySettings.time.${unit}`,
                {count: time},
              )} ${debug ? '(DEV)' : ''}`}
              value={value}
            />
          );
        })
        .filter(Boolean)}
    </Select>
  );
};

export default React.memo(IntervalSelect);
