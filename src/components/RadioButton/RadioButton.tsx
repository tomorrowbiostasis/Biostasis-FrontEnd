import React, {useCallback, VFC} from 'react';
import {TouchableOpacity} from 'react-native';

import RadioButtonOn from './components/RadioButtonOn';
import RadioButtonOff from './components/RadioButtonOff';

export interface IRadioButton {
  checked?: boolean;
  onSelect?: () => void;
}

const RadioButton: VFC<IRadioButton> = ({checked, onSelect}) => {
  const handlePress = useCallback(() => {
    onSelect?.();
  }, [onSelect]);

  return (
    <TouchableOpacity onPress={handlePress}>
      {checked ? <RadioButtonOn /> : <RadioButtonOff />}
    </TouchableOpacity>
  );
};

export default RadioButton;
