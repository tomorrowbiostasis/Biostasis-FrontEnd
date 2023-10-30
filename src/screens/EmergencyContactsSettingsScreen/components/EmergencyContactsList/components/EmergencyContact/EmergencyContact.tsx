import React, {VFC} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'native-base';
import Switch from '~/components/Switch';

import {IEmergencyContactResponse} from '~/redux/emergencyContacts/emergencyContacts.slice';

import styles from './styles';
import IconEntypo from 'react-native-vector-icons/Entypo';
import colors from '~/theme/colors';
export type IEmergencyContactProps = {
  contact: IEmergencyContactResponse;
  onSwitchPress: (value: boolean) => void;
  onEditPress: (contact: IEmergencyContactResponse) => void;
  onDeletePress: (contact: IEmergencyContactResponse) => void;
};

const EmergencyContact: VFC<IEmergencyContactProps> = ({
  contact,
  onSwitchPress,
  onEditPress,
  onDeletePress,
}) => {
  return (
    <View style={styles.container}>
      <Switch value={contact.active} onValueChange={onSwitchPress} />
      <Text fontSize={'lg'} style={styles.text} noOfLines={1}>
        {`${contact.name} ${contact.surname}`}
      </Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => onEditPress(contact)}>
          <IconEntypo name="edit" size={24} color={colors.blue[600]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeletePress(contact)}>
          <IconEntypo name="trash" size={24} color={colors.red[600]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmergencyContact;
