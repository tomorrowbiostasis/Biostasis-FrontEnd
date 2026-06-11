import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  AddNewEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  updateActiveEmergencyContactStatus,
} from '~/redux/emergencyContacts/thunks';
import {selectEmergencyContacts} from '~/redux/emergencyContacts/selectors';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {CirclePlusIcon} from '~/assets/icons/AppIcons';
import {typography} from '~/theme/tokens';
import SectionHeader from '../SectionHeader';
import EmergencyContact from './components/EmergencyContact';
import EmergencyContactFormCard from './components/EmergencyContactFormCard';

type EditorState =
  | {mode: 'add'}
  | {mode: 'edit'; contactId: string}
  | null;

const EmergencyContactsList = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const emergencyContacts = useAppSelector(selectEmergencyContacts);
  const [editorState, setEditorState] = useState<EditorState>(null);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      dispatch(getEmergencyContacts());
    });

    return () => task.cancel();
  }, [dispatch]);

  const handleAddContactPress = useCallback(() => {
    setEditorState({mode: 'add'});
  }, []);

  const handleChangeContactActiveStatus = useCallback(
    (contact: IEmergencyContactResponse, active: boolean) => {
      dispatch(updateActiveEmergencyContactStatus({contact, active}));
    },
    [dispatch],
  );

  const handleContactEditPress = useCallback(
    (contact: IEmergencyContactResponse) =>
      setEditorState({mode: 'edit', contactId: contact.id}),
    [],
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
                setEditorState(current =>
                  current?.mode === 'edit' && current.contactId === contact.id
                    ? null
                    : current,
                );
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

  const handleCancelEditor = useCallback(() => {
    setEditorState(null);
  }, []);

  const handleAddContact = useCallback(
    (contact: IEmergencyContact) => {
      dispatch(
        AddNewEmergencyContact({
          contact,
          onSuccess: () => setEditorState(null),
        }),
      );
    },
    [dispatch],
  );

  const handleEditContact = useCallback(
    (contactId: string, contact: IEmergencyContact) => {
      dispatch(
        updateEmergencyContact({
          id: contactId,
          contact,
          onSuccess: () => setEditorState(null),
        }),
      );
    },
    [dispatch],
  );

  const editingContact = useMemo(
    () =>
      editorState?.mode === 'edit'
        ? emergencyContacts.find(contact => contact.id === editorState.contactId) ||
          null
        : null,
    [editorState, emergencyContacts],
  );

  return (
    <View style={styles.section}>
      <SectionHeader
        label={t('emergencyContactsSettings.yourContacts')}
        description={t(
          'emergencyContactsSettings.makeSureToTestEmergencyContact',
        )}
      />
      {emergencyContacts.map(contact =>
        editorState?.mode === 'edit' && editorState.contactId === contact.id ? (
          <EmergencyContactFormCard
            key={`emergencyContact-form-${contact.id}`}
            contact={editingContact}
            onCancel={handleCancelEditor}
            onSubmit={nextContact =>
              handleEditContact(contact.id, nextContact)
            }
          />
        ) : (
          <EmergencyContact
            key={`emergencyContact-${contact.id}`}
            contact={contact}
            onEditPress={handleContactEditPress}
            onDeletePress={handleContactDeletePress}
            onSwitchPress={handleChangeContactActiveStatus}
          />
        ),
      )}
      {editorState?.mode === 'add' ? (
        <EmergencyContactFormCard
          onCancel={handleCancelEditor}
          onSubmit={handleAddContact}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addButton}
          onPress={handleAddContactPress}>
          <CirclePlusIcon size={16} color="#3D5470" />
          <Text style={styles.addLabel}>
            {t('emergencyContactsSettings.AddNewEmergencyContact')}
          </Text>
        </TouchableOpacity>
      )}
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
    ...typography.buttonLabel,
    color: '#3D5470',
  },
});

export default EmergencyContactsList;
