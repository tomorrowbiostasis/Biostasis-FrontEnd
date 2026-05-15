import React, {useCallback, useEffect} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  deleteEmergencyContact,
  getEmergencyContacts,
  updateActiveEmergencyContactStatus,
} from '~/redux/emergencyContacts/thunks';
import {selectEmergencyContacts} from '~/redux/emergencyContacts/selectors';
import {IEmergencyContactResponse} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {Screens} from '~/models/Navigation.model';
import {CirclePlusIcon} from '~/assets/icons/AppIcons';
import SectionHeader from '../SectionHeader';
import EmergencyContact from './components/EmergencyContact';

const EmergencyContactsList = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const emergencyContacts = useAppSelector(selectEmergencyContacts);

  useEffect(() => {
    dispatch(getEmergencyContacts());
  }, [dispatch]);

  const handleAddContactPress = useCallback(() => {
    navigate(Screens.AddNewEmergencyContact as never);
  }, [navigate]);

  const handleChangeContactActiveStatus = useCallback(
    (contact: IEmergencyContactResponse, active: boolean) => {
      dispatch(updateActiveEmergencyContactStatus({contact, active}));
    },
    [dispatch],
  );

  const handleContactEditPress = useCallback(
    (contact: IEmergencyContactResponse) =>
      // @ts-ignore — loose route params, matches the existing call site
      navigate(Screens.AddNewEmergencyContact, {contactId: contact.id}),
    [navigate],
  );

  const handleContactDeletePress = useCallback(
    (contact: IEmergencyContactResponse) => {
      Alert.alert(
        t('emergencyContactsSettings.addNewEdit.alert.title'),
        t('emergencyContactsSettings.addNewEdit.alert.description'),
        [
          {text: 'No'},
          {
            text: 'Yes',
            onPress: () => {
              if (contact?.id) {
                dispatch(deleteEmergencyContact(contact?.id));
                dispatch(getEmergencyContacts());
              }
            },
          },
        ],
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  return (
    <View style={styles.section}>
      <SectionHeader
        label={t('emergencyContactsSettings.yourContacts')}
        description={t(
          'emergencyContactsSettings.makeSureToTestEmergencyContact',
        )}
      />
      {emergencyContacts.map(contact => (
        <EmergencyContact
          key={`emergencyContact-${contact.id}`}
          contact={contact}
          onEditPress={handleContactEditPress}
          onDeletePress={handleContactDeletePress}
          onSwitchPress={value =>
            handleChangeContactActiveStatus(contact, value)
          }
        />
      ))}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.addButton}
        onPress={handleAddContactPress}>
        <CirclePlusIcon size={16} color="#3D5470" />
        <Text style={styles.addLabel}>
          {t('emergencyContactsSettings.AddNewEmergencyContact')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C8D5E2',
  },
  addLabel: {
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    color: '#3D5470',
  },
});

export default EmergencyContactsList;
