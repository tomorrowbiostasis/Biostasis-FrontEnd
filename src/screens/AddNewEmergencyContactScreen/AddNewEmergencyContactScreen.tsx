import React, {useCallback, useEffect, useState} from 'react';
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

import Container from '~/components/Container';
import {selectEmergencyContacts} from '~/redux/emergencyContacts/selectors';
import {useRoute} from '@react-navigation/core';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {Screens, ScreensNavigationParamsList} from '~/models/Navigation.model';

import styles from './styles';
import {AddNewContact} from './components/AddNewContact';
import {EditContact} from './components/EditContact';
import {View} from 'react-native';

export type AddNewEmergencyContactFormFields = {
  firstName: string;
  lastName: string;
  email: string;
};

export const AddNewEmergencyContactScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const emergencyContacts = useAppSelector(selectEmergencyContacts);
  const [editedContact, setEditedContact] =
    useState<IEmergencyContactResponse | null>(null);

  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'EditEmergencyContact'>>();

  const handleGoToContactsList = useCallback(() => {
    // @ts-ignore
    navigate(Screens.EmergencyContactSettings);
  }, [navigate]);

  const handleAddContact = useCallback(
    (newContact: IEmergencyContact) => {
      dispatch(AddNewEmergencyContact(newContact));
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
      title={t('emergencyContactsSettings.AddNewEmergencyContact')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}
      showDrawerIcon
      showBackIcon>
      <View style={styles.panel}>
        <View style={styles.panelBody}>
          {editedContact ? (
            <EditContact
              contact={editedContact}
              onSavePress={handleEditContact}
            />
          ) : (
            <AddNewContact onSavePress={handleAddContact} />
          )}
        </View>
      </View>
    </Container>
  );
};

export default AddNewEmergencyContactScreen;
