import React, {FC, useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import styles from './styles';

const hitSlop = 15;

const DrawerTrigger: FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  const openDrawer = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={openDrawer}
      hitSlop={{top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop}}>
      <View style={styles.bar} />
      <View style={styles.bar} />
      <View style={styles.bar} />
    </TouchableOpacity>
  );
};

export default DrawerTrigger;
