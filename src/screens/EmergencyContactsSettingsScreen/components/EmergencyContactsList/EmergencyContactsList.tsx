import React from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import styles from '../../styles';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import {Text} from 'native-base';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import colors from '~/theme/colors';
import {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  deleteEmergencyContact,
  getEmergencyContacts,
  updateActiveEmergencyContactStatus,
} from '~/redux/emergencyContacts/thunks';
import {useNavigation} from '@react-navigation/native';
import {useNavigateToAddNewEmergencyContactScreenName} from '~/hooks/UseNavigateWithLogic.hook';
import {Screens} from '~/models/Navigation.model';
import {IEmergencyContactResponse} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {selectEmergencyContacts} from '~/redux/emergencyContacts/selectors';
import EmergencyContact from './components/EmergencyContact';

const EmergencyContactsList = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const AddNewEmergencyContactScreenName =
    useNavigateToAddNewEmergencyContactScreenName();
  const emergencyContacts = useAppSelector(selectEmergencyContacts);

  useEffect(() => {
    dispatch(getEmergencyContacts());
  }, [dispatch]);

  const handleAddContactPress = useCallback(() => {
    navigate(AddNewEmergencyContactScreenName as never);
  }, [AddNewEmergencyContactScreenName, navigate]);

  const handleChangeContactActiveStatus = useCallback(
    (contact: IEmergencyContactResponse, active: boolean) => {
      dispatch(
        updateActiveEmergencyContactStatus({
          contact,
          active,
        }),
      );
    },
    [dispatch],
  );

  const handleContactEditPress = useCallback(
    (contact: IEmergencyContactResponse) =>
      // @ts-ignore
      navigate(Screens.AddNewEmergencyContact, {
        contactId: contact.id,
      }),
    [navigate],
  );

  const handleContactDeletePress = useCallback(
    (contact: IEmergencyContactResponse) => {
      Alert.alert(
        t('emergencyContactsSettings.addNewEdit.alert.title'),
        t('emergencyContactsSettings.addNewEdit.alert.description'),
        [
          {
            text: 'No',
          },
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

  const renderListItem = useCallback(
    item => {
      return (
        <EmergencyContact
          key={`emergencyContact-${item.id}`}
          contact={item}
          onEditPress={handleContactEditPress}
          onDeletePress={handleContactDeletePress}
          onSwitchPress={value => handleChangeContactActiveStatus(item, value)}
        />
      );
    },
    [
      handleChangeContactActiveStatus,
      handleContactDeletePress,
      handleContactEditPress,
    ],
  );

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <IconAntDesign name={'contacts'} size={26} style={styles.icon} />
        <Text fontSize={'md'} fontWeight={700}>
          {t('emergencyContactsSettings.emergencyList')}
        </Text>
      </View>
      <View style={styles.lineStyle} />
      <View style={styles.panelBody}>
        <Text fontSize={'sm'}>
          {t('emergencyContactsSettings.makeSureToTestEmergencyContact')}
        </Text>
        <View style={styles.listContentContainer}>
          <View style={styles.listContentContainer}>
            {emergencyContacts.map(contact => renderListItem(contact))}
          </View>
        </View>
      </View>
      <View style={styles.lineStyle} />
      <TouchableOpacity
        onPress={handleAddContactPress}
        style={styles.panelFooter}
      >
        <IconFeather
          name="plus"
          size={20}
          style={styles.icon}
          color={colors.gray[642]}
        />
        <Text fontSize={'sm'} color={colors.gray[642]}>
          {t('emergencyContactsSettings.AddNewEmergencyContact')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyContactsList;
