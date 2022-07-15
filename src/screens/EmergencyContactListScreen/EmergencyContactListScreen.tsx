import {useNavigation} from '@react-navigation/native';
import {Text} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {View, FlatList, ListRenderItem} from 'react-native';
import AddPersonIcon from '~/assets/icons/AddPersonIcon';
import WiFiIcon from '~/assets/icons/WiFiIcon';
import AlarmIcon from '~/assets/icons/AlarmIcon';

import Container from '~/components/Container';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {IEmergencyContactResponse} from '~/redux/emergencyContacts/emergencyContacts.slice';
import {selectEmergencyContacts} from '~/redux/emergencyContacts/selectors';
import {
  getEmergencyContacts,
  updateActiveEmergencyContactStatus,
} from '~/redux/emergencyContacts/thunks';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import EmergencyContact from './components/EmergencyContact';
import BottomButton from '~/components/BottomButton';

import styles from './styles';
import {useNavigateToAddEmergencyContactScreenName} from '~/hooks/UseNavigateWithLogic.hook';

const EmergencyContactListScreen = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const emergencyContacts = useAppSelector(selectEmergencyContacts);
  const addEmergencyContactScreenName =
    useNavigateToAddEmergencyContactScreenName();

  useEffect(() => {
    dispatch(getEmergencyContacts());
  }, [dispatch]);

  const handleAddContactPress = useCallback(() => {
    navigate(addEmergencyContactScreenName);
  }, [addEmergencyContactScreenName, navigate]);

  const handleAutomatedEmergencySettingsPress = useCallback(() => {
    navigate('AutomatedEmergencySettings');
  }, [navigate]);

  const handleEmergencyButtonSettingsPress = useCallback(() => {
    navigate('EmergencyContactSettings');
  }, [navigate]);

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
    (contact: IEmergencyContactResponse) => {
      navigate('AddNewEmergencyContact', {contactId: contact.id});
    },
    [navigate],
  );

  const renderListItem: ListRenderItem<IEmergencyContactResponse> = useCallback(
    ({item}) => {
      return (
        <EmergencyContact
          key={`emergencyContact-${item.id}`}
          contact={item}
          onEditPress={handleContactEditPress}
          onSwitchPress={value => handleChangeContactActiveStatus(item, value)}
        />
      );
    },
    [handleChangeContactActiveStatus, handleContactEditPress],
  );

  return (
    <Container
      type={'static'}
      title={t('emergencyContacts.emergencyAndSettings')}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.topContainer}>
        <FlatList<IEmergencyContactResponse>
          data={emergencyContacts}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          renderItem={renderListItem}
        />
        <Text fontSize={'sm'} style={styles.bottomText}>
          {t('emergencyContacts.makeSureToTestEmergencyContact')}
        </Text>
      </View>
      <BottomButton
        leftIcon={<AddPersonIcon />}
        title={t('emergencyContacts.addEmergencyContact')}
        onPress={handleAddContactPress}
      />
      <BottomButton
        leftIcon={<WiFiIcon />}
        title={t('emergencyContacts.emergencyButtonSettings')}
        onPress={handleEmergencyButtonSettingsPress}
      />
      <BottomButton
        leftIcon={<AlarmIcon style={styles.alarmIcon} />}
        title={t('emergencyContacts.automatedEmergencySettings.title')}
        onPress={handleAutomatedEmergencySettingsPress}
        withBottomBorder
      />
    </Container>
  );
};

export default EmergencyContactListScreen;
