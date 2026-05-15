import React, {VFC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {IEmergencyContactResponse} from '~/redux/emergencyContacts/emergencyContacts.slice';
import Toggle from '~/components/Toggle';
import {PencilIcon, TrashIcon} from '~/assets/icons/AppIcons';
import styles from './styles';

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
    <View style={styles.card}>
      <Toggle value={contact.active} onChange={onSwitchPress} />
      <Text style={styles.name} numberOfLines={1}>
        {`${contact.name} ${contact.surname}`}
      </Text>
      <View style={styles.icons}>
        <TouchableOpacity hitSlop={8} onPress={() => onEditPress(contact)}>
          <PencilIcon size={20} color="#343330" />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8} onPress={() => onDeletePress(contact)}>
          <TrashIcon size={20} color="#343330" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmergencyContact;
