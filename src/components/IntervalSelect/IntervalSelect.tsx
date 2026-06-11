import {Select} from 'native-base';
import React, {FC, useMemo} from 'react';

import {
  excludedIntervals,
  intervalsConfig,
} from '~/constants/settings.constants';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import EnvConfig from '~/services/Env.service';
import colors from '~/theme/colors';
import {layout, semanticColors, typography} from '~/theme/tokens';

interface IntervalSelect {
  type: 'bio' | 'time';
  onValueChange: (itemValue: string) => void;
  selectedValue?: string;
}

type Interval = {
  time: number;
  value: string;
  unit: string;
  debug: boolean;
  warning: boolean;
};

const IntervalSelect: FC<IntervalSelect> = ({
  type,
  onValueChange,
  selectedValue,
}) => {
  const {t} = useAppTranslation();

  const intervals = useMemo(
    () =>
      type === 'bio'
        ? intervalsConfig
        : intervalsConfig
            .map(interval =>
              interval.time === 120 ? {...interval, debug: true} : interval,
            )
            .filter(({value}) => !excludedIntervals.includes(value)),
    [type],
  );
  return (
    <Select
      selectedValue={selectedValue}
      width="100%"
      h={`${layout.ctaHeight}px`}
      borderRadius={layout.ctaRadius}
      borderColor="rgba(11, 31, 58, 0.1)"
      backgroundColor={semanticColors.surface}
      px="12px"
      _selectedItem={{
        bg: colors.blue[300],
      }}
      _item={{
        _text: {
          fontSize: typography.body.fontSize,
          color: semanticColors.primary,
        },
      }}
      _text={{
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight,
        color: semanticColors.primary,
      }}
      accessibilityLabel={t(
        'emergencyContactsSettings.automatedEmergencySettings.interval.title',
      )}
      placeholder={t(
        'emergencyContactsSettings.automatedEmergencySettings.interval.title',
      )}
      _actionSheetContent={{
        backgroundColor: semanticColors.surface,
      }}
      onValueChange={onValueChange}>
      {(intervals as Interval[])
        .map(({time, value, unit, debug, warning}) => {
          if (debug && EnvConfig.PROD) {
            return null;
          } else if (warning) {
            return (
              <Select.Item
                key={value}
                label={`${t(
                  `emergencyContactsSettings.automatedEmergencySettings.time.${unit}`,
                  {count: time},
                )} ${debug ? '(DEV)' : ''} ❗`}
                value={value}
              />
            );
          }
          return (
            <Select.Item
              key={value}
              label={`${t(
                `emergencyContactsSettings.automatedEmergencySettings.time.${unit}`,
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
