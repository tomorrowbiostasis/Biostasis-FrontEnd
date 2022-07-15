import React, {VFC} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'native-base';

import PencilIcon from '~/assets/icons/PencilIcon';
import Switch from '~/components/Switch';

import {IEmergencyContactResponse} from '~/redux/emergencyContacts/emergencyContacts.slice';

import styles from './styles';

export type IEmergencyContactProps = {
  contact: IEmergencyContactResponse;
  onSwitchPress: (value: boolean) => void;
  onEditPress: (contact: IEmergencyContactResponse) => void;
};

const EmergencyContact: VFC<IEmergencyContactProps> = ({
  contact,
  onSwitchPress,
  onEditPress,
}) => {
  return (
    <View style={styles.container}>
      <Switch value={contact.active} onValueChange={onSwitchPress} />
      <Text fontSize={'lg'} style={styles.text} noOfLines={1}>
        {`${contact.name} ${contact.surname}`}
      </Text>
      <TouchableOpacity onPress={() => onEditPress(contact)}>
        <PencilIcon />
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyContact;
