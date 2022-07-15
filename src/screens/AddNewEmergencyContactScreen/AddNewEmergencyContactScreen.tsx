import React, {useCallback, useEffect, useState} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  addEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
} from '~/redux/emergencyContacts/thunks';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';

import Container from '~/components/Container';
import {selectEmergencyContacts} from '~/redux/emergencyContacts/selectors';
import {useRoute} from '@react-navigation/core';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';

import styles from './styles';
import {AddNewContact} from './components/AddNewContact';
import {EditContact} from './components/EditContact';
import {ConfirmationPopup} from './components/ConfirmationPopup/ConfirmationPopup';

export type AddEmergencyContactFormFields = {
  firstName: string;
  lastName: string;
  email: string;
};

export const AddNewEmergencyContactScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const emergencyContacts = useAppSelector(selectEmergencyContacts);
  const [editedContact, setEditedContact] =
    useState<IEmergencyContactResponse | null>(null);

  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] =
    useState(false);

  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'EditEmergencyContact'>>();

  const handleGoToContactsList = useCallback(() => {
    // @ts-ignore
    navigation.navigate('EmergencyContactList');
  }, [navigation]);

  const handleAddContact = useCallback(
    (newContact: IEmergencyContact) => {
      dispatch(addEmergencyContact(newContact));
      handleGoToContactsList();
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

  const handleDeleteContact = useCallback(() => {
    if (editedContact?.id) {
      dispatch(deleteEmergencyContact(editedContact?.id));
      dispatch(getEmergencyContacts());
      handleGoToContactsList();
    }
  }, [dispatch, editedContact?.id, handleGoToContactsList]);

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
    <Container
      title={t('emergencyContacts.addNewEdit.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}>
      {editedContact ? (
        <EditContact
          contact={editedContact}
          onDeletePress={() => setIsConfirmationPopupVisible(true)}
          onSavePress={handleEditContact}
        />
      ) : (
        <AddNewContact onSavePress={handleAddContact} />
      )}
      {isConfirmationPopupVisible && (
        <ConfirmationPopup
          onClose={() => setIsConfirmationPopupVisible(false)}
          onConfirm={handleDeleteContact}
        />
      )}
    </Container>
  );
};

export default AddNewEmergencyContactScreen;
