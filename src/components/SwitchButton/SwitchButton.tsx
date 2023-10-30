import {Row, Text} from 'native-base';
import React from 'react';
import {StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import Switch from '~/components/Switch';
import QuestionIcon from '~/assets/icons/QuestionIcon';

import styles from './styles';

export interface ISwitchButton {
  onSwitchPress: (newValue: boolean) => void;
  title?: string;
  value?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  paused?: boolean;
  smaller?: boolean;
  showQuestionIcon?: boolean;
  onQuestionPress?: () => void;
}

const SwitchButton = ({
  value = false,
  title,
  onSwitchPress,
  containerStyle,
  disabled,
  paused,
  smaller,
  showQuestionIcon,
  onQuestionPress,
}: ISwitchButton) => {
  return (
    <Row style={[containerStyle]}>
      <Switch
        value={value}
        onValueChange={onSwitchPress}
        disabled={disabled}
        paused={paused}
        smaller={smaller}
      />
      {!!title && (
        <Text
          fontSize={smaller ? 'sm' : 'md'}
          style={styles.text}
          noOfLines={1}>
          {title}
        </Text>
      )}
      {showQuestionIcon && (
        <TouchableOpacity onPress={onQuestionPress}>
          <QuestionIcon fill="#2C2C2C" />
        </TouchableOpacity>
      )}
    </Row>
  );
};

export default SwitchButton;
