import {Row, Text} from 'native-base';
import React, {VFC} from 'react';
import {TouchableOpacity} from 'react-native';
import LogoutIcon from '~/assets/icons/LogoutIcon';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

import styles from './styles';
import {clearDataAndSignOut} from '~/redux/store/utils';
import {ClearDataTypes} from '~/services/ClearData.types';
import colors from '~/theme/colors';

const LogoutTrigger: VFC = () => {
  const {t} = useAppTranslation();

  return (
    <TouchableOpacity
      hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
      onPress={() => clearDataAndSignOut(ClearDataTypes.LOGOUT)}
      style={styles.container}>
      <Row style={styles.row}>
        <LogoutIcon style={styles.icon} />
        <Text fontSize={14} color={colors.red[400]}>
          {t('common.logOut')}
        </Text>
      </Row>
    </TouchableOpacity>
  );
};

export default LogoutTrigger;
