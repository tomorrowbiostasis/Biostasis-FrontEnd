import React, {useCallback, useEffect} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text, View, Box} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';

import Container from '~/components/Container';
import ProfileMedicalInfoIcon from '~/components/assets/Icons/ProfileMedicalInfoIcon';
import EmergencyContactsIcon from '~/components/assets/Icons/EmergencyContactsIcon';
import DocumentsIcon from '~/components/assets/Icons/DocumentsIcon';
import {UseAppState} from '~/hooks/UseAppState.hook';
import {Screens} from '~/models/Navigation.model';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import IconWithText from './components/IconWithText';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';
import {useNavigation} from '@react-navigation/native';
import {useEmergencyValue} from '~/services/Emergency.service';
import colors from '~/theme/colors';
import styles from './styles';
import {useNavigateToAddEmergencyContactScreenName} from '~/hooks/UseNavigateWithLogic.hook';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {requestLocationPermission} from '~/services/Location.service';

const Dashboard = () => {
  const {t} = useAppTranslation();
  const {setOptions, navigate} = useNavigation();
  const {startEmergency, stopEmergency} = useEmergencyValue();
  const {user} = useAppSelector(userSelector);
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  const {isActive} = UseAppState();
  const addEmergencyContactScreenName =
    useNavigateToAddEmergencyContactScreenName();

  useEffect(() => {
    setOptions({
      headerTitleStyle: {marginLeft: -16}, // FIXME: any way of avoiding that?
      headerTitle: user?.name
        ? t('headers.welcomeUsername', {username: user?.name})
        : t('headers.welcome'),
    });
  }, [t, setOptions, user]);

  useEffect(() => {
    if (user.locationAccess) {
      requestLocationPermission(false).catch(e =>
        console.log('Could not get location', e),
      );
    }
  }, [user]);

  useEffect(() => {
    isActive &&
      (async () => {
        const isInEmergencyState = await AsyncStorageService.getItem(
          AsyncStorageEnum.IsEmergencyEscalationStarted,
        );
        if (JSON.parse(isInEmergencyState ?? 'false')) {
          navigate(Screens.HealthConditionError);
        }
      })();
  }, [isActive, navigate]);

  const handleProfile = useCallback(() => {
    navigate('ProfileDefault');
  }, [navigate]);

  const handleContacts = useCallback(() => {
    navigate('EmergencyContactList');
  }, [navigate]);

  const handleDocuments = useCallback(() => {
    navigate('Documents');
  }, [navigate]);

  const handleEmergencyStart = useCallback(() => {
    if (hasContacts && areContactsEnabled) {
      startEmergency();
    }
  }, [areContactsEnabled, hasContacts, startEmergency]);

  const handleEmergencyStop = useCallback(() => {
    if (hasContacts && areContactsEnabled) {
      stopEmergency();
    }
  }, [areContactsEnabled, hasContacts, stopEmergency]);

  const handleEmergency = useCallback(() => {
    if (!hasContacts || !areContactsEnabled) {
      navigate(addEmergencyContactScreenName);
    }
  }, [
    addEmergencyContactScreenName,
    areContactsEnabled,
    hasContacts,
    navigate,
  ]);

  const getEmergencyButtonLabel = useCallback(() => {
    if (hasContacts && areContactsEnabled) {
      return t('dashboard.emergency.countdown');
    } else if (hasContacts && !areContactsEnabled) {
      return t('dashboard.emergency.enableContacts');
    }
    return t('dashboard.emergency.setUpContacts');
  }, [areContactsEnabled, hasContacts, t]);

  return (
    <Container
      title={t('dashboard.title')}
      disableWrapper
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
        <View flex={10} />
        <Box style={[styles.panel, styles.elevateMe1]}>
          <TouchableOpacity onPress={handleProfile}>
            <IconWithText
              px={12}
              style={styles.firstButtonPadding}
              icon={<ProfileMedicalInfoIcon />}
              title={t('dashboard.profile.title')}
              description={t('dashboard.profile.description')}
            />
          </TouchableOpacity>
          <Box style={[styles.panel, styles.elevateMe2]}>
            <TouchableOpacity onPress={handleContacts}>
              <IconWithText
                px={12}
                style={styles.secondButtonPadding}
                icon={<EmergencyContactsIcon />}
                title={t('dashboard.contacts.title')}
                description={t('dashboard.contacts.description')}
              />
            </TouchableOpacity>
            <Box style={[styles.panel, styles.elevateMe3]}>
              <SafeAreaView edges={['bottom']}>
                <TouchableOpacity onPress={handleDocuments}>
                  <IconWithText
                    px={12}
                    style={styles.thirdButtonPadding}
                    icon={<DocumentsIcon />}
                    title={t('dashboard.documents.title')}
                    description={t('dashboard.documents.description')}
                  />
                </TouchableOpacity>
                <TouchableWithoutFeedback
                  onPress={handleEmergency}
                  onPressIn={handleEmergencyStart}
                  onPressOut={handleEmergencyStop}>
                  <Box
                    p={3}
                    mx={12}
                    rounded={20}
                    justifyContent="center"
                    minHeight={20}
                    style={styles.emergencyButton}
                    bg={{
                      linearGradient: {
                        colors: [colors.magenta['800'], colors.magenta['200']],
                        start: [0, 0],
                        end: [0, 1],
                      },
                    }}
                    _android={{mb: 4}}>
                    <Text
                      textAlign="center"
                      fontSize="xl"
                      style={styles.emergencyCaption}>
                      {getEmergencyButtonLabel()}
                    </Text>
                    {hasContacts && areContactsEnabled && (
                      <Text
                        textAlign="center"
                        fontSize="md"
                        style={styles.emergencySubcaption}>
                        {t('dashboard.emergency.countdownSubtitleHold')}
                      </Text>
                    )}
                  </Box>
                </TouchableWithoutFeedback>
              </SafeAreaView>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Container>
  );
};
export default Dashboard;
