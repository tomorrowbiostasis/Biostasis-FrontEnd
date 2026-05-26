import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/core';
import {RouteProp, useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  AddNewEmergencyContact,
  updateEmergencyContact,
} from '~/redux/emergencyContacts/thunks';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {selectEmergencyContacts} from '~/redux/emergencyContacts/selectors';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';
import ScreenHeader from '~/components/ScreenHeader';

import styles from './styles';
import {AddNewContact} from './components/AddNewContact';
import {EditContact} from './components/EditContact';

export type AddNewEmergencyContactFormFields = {
  firstName: string;
  lastName: string;
  email: string;
};

export const AddNewEmergencyContactScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const emergencyContacts = useAppSelector(selectEmergencyContacts);
  const [editedContact, setEditedContact] =
    useState<IEmergencyContactResponse | null>(null);

  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'EditEmergencyContact'>>();

  const handleGoToContactsList = useCallback(() => {
    navigate.goBack();
  }, [navigate]);

  const handleAddContact = useCallback(
    (newContact: IEmergencyContact) => {
      dispatch(
        AddNewEmergencyContact({
          contact: newContact,
          onSuccess: handleGoToContactsList,
        }),
      );
    },
    [dispatch, handleGoToContactsList],
  );

  const handleEditContact = useCallback(
    (contact: IEmergencyContact) => {
      if (editedContact?.id) {
        dispatch(
          updateEmergencyContact({
            id: editedContact?.id,
            contact,
            onSuccess: handleGoToContactsList,
          }),
        );
      }
    },
    [dispatch, editedContact?.id, handleGoToContactsList],
  );

  useEffect(() => {
    if (params && params.contactId) {
      const contact = emergencyContacts.find(c => c.id === params.contactId);
      if (contact) {
        setEditedContact(contact);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={
          editedContact
            ? t('emergencyContactsSettings.editEmergencyContact')
            : t('emergencyContactsSettings.AddNewEmergencyContact')
        }
      />
      {editedContact ? (
        <EditContact contact={editedContact} onSavePress={handleEditContact} />
      ) : (
        <AddNewContact onSavePress={handleAddContact} />
      )}
    </View>
  );
};

export default AddNewEmergencyContactScreen;
