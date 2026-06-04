import React from 'react';
import {View} from 'react-native';

import {useAppSelector} from '~/redux/store/hooks';
import {automatedEmergencySettingsSelector} from '~/redux/user/selectors';
import BioBasedTrigger from './components/BioBasedTrigger/BioBasedTrigger';
import TimeBasedTrigger from './components/TimeBasedTrigger/TimeBasedTrigger';

const AutomatedEmergency = () => {
  const {regularPushNotification} = useAppSelector(
    automatedEmergencySettingsSelector,
  );

  return (
    <View>
      {regularPushNotification === false ? <BioBasedTrigger embedded /> : null}
      {regularPushNotification === true ? <TimeBasedTrigger embedded /> : null}
    </View>
  );
};

export default AutomatedEmergency;
