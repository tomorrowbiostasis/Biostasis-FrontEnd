import {Row} from 'native-base';
import React, {VFC, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import BackButtonIcon from '~/assets/icons/BackButtonIcon';
import {useNavigation} from '@react-navigation/native';

const BackButtonTrigger: VFC = () => {
  const navigation = useNavigation();
  const handlePress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <TouchableOpacity
      hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
      onPress={handlePress}
      style={styles.container}
    >
      <Row style={styles.row}>
        <BackButtonIcon />
      </Row>
    </TouchableOpacity>
  );
};

export default BackButtonTrigger;
