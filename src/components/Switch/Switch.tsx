import React, {FC, useCallback, useMemo} from 'react';
import PlusIcon from '~/assets/icons/PlusIcon';
import Toggle from '~/components/Switch/components/Toggle';
import colors from '~/theme/colors';
import CheckIcon from './components/CheckIcon';
import styles from './styles';

interface Switch {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  paused?: boolean;
  smaller?: boolean;
}

const Switch: FC<Switch> = ({
  value,
  onValueChange,
  disabled,
  paused,
  smaller,
}) => {
  const activeColor = paused || !value ? colors.gray[600] : colors.green[200];
  const trackBar = useMemo(() => {
    return {
      width: smaller ? 32 : 46,
      height: smaller ? 16 : 22,
      borderRadius: 25,
    };
  }, [smaller]);

  const thumbButton = useMemo(
    () => ({
      width: smaller ? 12 : 19,
      height: smaller ? 12 : 19,
      borderRadius: smaller ? 6 : 9,
    }),
    [smaller],
  );

  const getLeftComponent = useCallback(() => {
    if (value) {
      const size = smaller ? 8 : 12;
      if (paused) {
        return (
          <PlusIcon
            style={styles.plusIcon}
            width={size}
            height={size}
            color={colors.white}
          />
        );
      }
      return <CheckIcon style={styles.checkIcon} width={size} height={size} />;
    }
  }, [paused, value, smaller]);

  return (
    <Toggle
      value={value}
      handleOnPress={(newState: boolean) => onValueChange(newState)}
      trackBar={trackBar}
      thumbStyle={thumbButton}
      leftComponent={getLeftComponent()}
      disabled={disabled}
      inActiveTrackColor={colors.gray[500]}
      activeTrackColor={activeColor}
      travel={smaller ? 15 : 23}
    />
  );
};

export default React.memo(Switch);
