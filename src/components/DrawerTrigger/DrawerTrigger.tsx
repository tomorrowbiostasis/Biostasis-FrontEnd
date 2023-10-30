import React, {FC, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import styles from './styles';
import DrawerIcon from '~/assets/icons/DrawerIcon';
import {Box} from 'native-base';

const hitSlop = 15;

const DrawerTrigger: FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  const openDrawer = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return (
    <TouchableOpacity
      onPress={openDrawer}
      hitSlop={{top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop}}>
      <Box style={styles.drawerBox}>
        <DrawerIcon />
      </Box>
    </TouchableOpacity>
  );
};

export default DrawerTrigger;
