import React from 'react';
import {ImageSourcePropType, View} from 'react-native';
import {Text, Image} from 'native-base';

import styles from './styles';
import RadioButton from '~/components/RadioButton';

export type ISelectItem = {
  icon: ImageSourcePropType;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

const SelectItem = ({
  icon,
  title,
  description,
  selected,
  onSelect,
}: ISelectItem) => {
  return (
    <View style={styles.container}>
      <Image alt=" " source={icon} style={styles.icon} resizeMode={'contain'} />
      <View style={styles.textContainer}>
        <Text fontSize={'lg'}>{title}</Text>
        <Text fontSize={'sm'} style={styles.descriptionText}>
          {description}
        </Text>
      </View>
      <View style={styles.radioButton}>
        <RadioButton checked={selected} onSelect={onSelect} />
      </View>
    </View>
  );
};

export default SelectItem;
