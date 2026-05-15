import React, {FC, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import DrawerIcon from '~/assets/icons/DrawerIcon';
import {Box} from 'native-base';
import {Screens} from '~/models/Navigation.model';

const hitSlop = 15;

/**
 * The drawer was removed in the redesign — this top-right control now opens
 * Account Settings. Kept for the not-yet-redesigned screens.
 */
const DrawerTrigger: FC = () => {
  const navigation = useNavigation();
  const openSettings = useCallback(() => {
    navigation.navigate(Screens.AccountSettings as never);
  }, [navigation]);

  return (
    <TouchableOpacity
      onPress={openSettings}
      hitSlop={{top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop}}>
      <Box style={styles.drawerBox}>
        <DrawerIcon />
      </Box>
    </TouchableOpacity>
  );
};

export default DrawerTrigger;
