import React, {useCallback, VFC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {IEmergencyContactResponse} from '~/redux/emergencyContacts/emergencyContacts.slice';
import Toggle from '~/components/Toggle';
import {PencilIcon, TrashIcon, UserCheckIcon} from '~/assets/icons/AppIcons';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from './styles';

export type IEmergencyContactProps = {
  contact: IEmergencyContactResponse;
  onSwitchPress: (contact: IEmergencyContactResponse, value: boolean) => void;
  onEditPress: (contact: IEmergencyContactResponse) => void;
  onDeletePress: (contact: IEmergencyContactResponse) => void;
};

const EmergencyContact: VFC<IEmergencyContactProps> = ({
  contact,
  onSwitchPress,
  onEditPress,
  onDeletePress,
}) => {
  const {t} = useAppTranslation();
  const fullName = `${contact.name} ${contact.surname}`.trim();
  const phonePrefix = contact.countryCode
    ? contact.countryCode.startsWith('+')
      ? contact.countryCode
      : `+${contact.countryCode}`
    : contact.prefix
      ? `+${contact.prefix}`
      : '';
  const phoneValue = [phonePrefix, contact.phone].filter(Boolean).join(' ');
  const handleSwitchPress = useCallback(
    (value: boolean) => onSwitchPress(contact, value),
    [contact, onSwitchPress],
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarTile}>
          <UserCheckIcon size={18} color="#4D6FE5" />
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {fullName}
            </Text>
            <View style={styles.icons}>
              <TouchableOpacity
                style={styles.actionButton}
                hitSlop={8}
                onPress={() => onEditPress(contact)}>
                <PencilIcon size={18} color="#343330" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                hitSlop={8}
                onPress={() => onDeletePress(contact)}>
                <TrashIcon size={18} color="#343330" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.detail} numberOfLines={1}>
            {contact.email}
          </Text>
          {phoneValue ? (
            <Text style={styles.detail} numberOfLines={1}>
              {phoneValue}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.footerRow}>
        <Text style={styles.toggleLabel} numberOfLines={2}>
          {t('emergencyContactsSettings.contactToggleHelper')}
        </Text>
        <Toggle value={contact.active} onChange={handleSwitchPress} />
      </View>
    </View>
  );
};

export default React.memo(EmergencyContact);
