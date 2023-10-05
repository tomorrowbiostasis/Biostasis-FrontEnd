import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Settings,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
} from 'react-native';
import {Text, Box} from 'native-base';

import Container from '~/components/Container';
import {UseAppState} from '~/hooks/UseAppState.hook';
import {Screens} from '~/models/Navigation.model';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import IconWithText from './components/IconWithText';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppSelector} from '~/redux/store/hooks';
import {
  EmergencyButtonSettings,
  automatedEmergencySettingsSelector,
  userSelector,
} from '~/redux/user/selectors';
import {useNavigation} from '@react-navigation/native';
import {useEmergencyValue} from '~/services/Emergency.service';
import colors from '~/theme/colors';
import styles from './styles';
import {useNavigateToAddNewEmergencyContactScreenName} from '~/hooks/UseNavigateWithLogic.hook';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {
  getGoogleMapsUrl,
  getLocation,
  requestLocationPermission,
} from '~/services/Location.service';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import {useDispatch} from 'react-redux';
import {
  getUser,
  updateEmergencyButtonSettings,
  updateUser,
} from '~/redux/user/thunks';
import {isIOS, updateDataCollectionStatus} from '~/utils';
import IconFeather from 'react-native-vector-icons/Feather';
import {IUser} from '~/redux/user/user.slice';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';

const Dashboard = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const {startEmergency, stopEmergency} = useEmergencyValue();
  const {user} = useAppSelector(userSelector);
  const {hasContacts, areContactsEnabled} = useAppSelector(selectContactsInfo);
  const dispatch = useDispatch();
  const {isActive} = UseAppState();
  const AddNewEmergencyContactScreenName =
    useNavigateToAddNewEmergencyContactScreenName();
  const {automatedEmergency, regularPushNotification} = useAppSelector(
    automatedEmergencySettingsSelector,
  );
  const [recommendedPeriod, setRecommendedPeriod] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const abortController = new AbortController();

    const handleRecommendedPeriod = async () => {
      try {
        const period = isIOS
          ? await Settings.get(AsyncStorageEnum.RecommendedPeriod)
          : await AsyncStorageService.getItem(
              AsyncStorageEnum.RecommendedPeriod,
            );
        setRecommendedPeriod(period);
      } catch (error) {
        console.error('Error retrieving recommended period:', error);
        setRecommendedPeriod(null);
      }
    };

    handleRecommendedPeriod();
    return () => {
      abortController.abort();
    };
  }, []);

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleHealthTriggerCheck = useCallback(async () => {
    const healthStatus = await AsyncStorageService.getItem(
      AsyncStorageEnum.HealthTrigger,
    );
    if (healthStatus === 'true') {
      // @ts-ignore
      navigate(Screens.HealthConditionError, {healthCheck: true});
    }
  }, [navigate]);

  const handleTimeTriggerCheck = useCallback(async () => {
    const timeStatus = await AsyncStorageService.getItem(
      AsyncStorageEnum.TimeTrigger,
    );
    if (timeStatus === 'true') {
      // @ts-ignore
      navigate(Screens.HealthConditionError, {regularCheck: true});
    }
  }, [navigate]);

  const handleLocationChange = useCallback(async () => {
    const payload: Partial<IUser> = {
      timezone: timestampToISOWithOffset().slice(-6),
    };
    const location = await getLocation(5000);
    payload.location = getGoogleMapsUrl(location);
    console.log('LOCATION WILL BE UPDATED');

    dispatch(updateUser(payload));
  }, [dispatch]);

  useEffect(() => {
    handleHealthTriggerCheck();
    handleTimeTriggerCheck();
  }, [handleHealthTriggerCheck, handleTimeTriggerCheck]);

  useEffect(() => {
    requestLocationPermission(false)
      .then(isGranted => {
        const values: EmergencyButtonSettings = {
          locationAccess: isGranted,
        };
        dispatch(updateEmergencyButtonSettings(values));
        isGranted && handleLocationChange();
        updateDataCollectionStatus();
      })
      .catch(e => console.log('Could not get location', e));
  }, [dispatch, handleLocationChange]);

  useEffect(() => {
    isActive &&
      (async () => {
        const isInEmergencyState = await AsyncStorageService.getItem(
          AsyncStorageEnum.IsEmergencyEscalationStarted,
        );
        if (JSON.parse(isInEmergencyState ?? 'false')) {
          navigate(Screens.HealthConditionError as never);
        }
      })();
  }, [isActive, navigate]);

  const handleContacts = useCallback(() => {
    navigate(Screens.EmergencyContactSettings as never);
  }, [navigate]);

  const handleAutomatedEmergency = useCallback(() => {
    navigate(Screens.AutomatedEmergencySettings as never);
  }, [navigate]);

  const handleSignUpTomorrowBio = useCallback(
    () => navigate(Screens.SignUpForCryopreservation as never),
    [navigate],
  );

  const openAlcorWebsite = () => {
    Linking.openURL(t('cryopreservationCompaniesUrls.alcor'));
  };

  const openCryonicsInstituteWebsite = () => {
    Linking.openURL(t('cryopreservationCompaniesUrls.cryonicsInstitute'));
  };

  const openSouthernCryonicsWebsite = () => {
    Linking.openURL(t('cryopreservationCompaniesUrls.southernCryonics'));
  };

  const handleEmergencyStart = useCallback(() => {
    if (hasContacts && areContactsEnabled) {
      Vibration.vibrate();
      startEmergency();
    } else {
      navigate(AddNewEmergencyContactScreenName as never);
    }
  }, [
    AddNewEmergencyContactScreenName,
    areContactsEnabled,
    hasContacts,
    navigate,
    startEmergency,
  ]);

  const handleEmergencyStop = useCallback(() => {
    if (hasContacts && areContactsEnabled) {
      stopEmergency();
    }
  }, [areContactsEnabled, hasContacts, stopEmergency]);

  const getEmergencyButtonLabel = useCallback(() => {
    if (hasContacts && areContactsEnabled) {
      return t('dashboard.emergency.countdown');
    } else if (hasContacts && !areContactsEnabled) {
      return t('dashboard.emergency.enableContacts');
    }
    return t('dashboard.emergency.setUpContacts');
  }, [areContactsEnabled, hasContacts, t]);

  return (
    <>
      <Container
        title={t('headers.welcomeUsername', {username: user.name})}
        disableWrapper
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        titleText={styles.titleText}
        showDrawerIcon>
        <Box style={styles.curveElement} />
        <ScrollView
          bounces={false}
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}>
          <Box style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('dashboard.sections.emergencySystem')}
            </Text>
            <TouchableOpacity onPress={handleContacts} style={styles.panel}>
              <IconFontAwesome
                name={'sliders'}
                size={24}
                style={styles.panelHeader}
                color={colors.gray[600]}
              />
              <IconWithText
                icon={
                  <Image
                    style={styles.image}
                    source={require('~/assets/images/dashboard/emergencyContacts.png')}
                  />
                }
                title={t('dashboard.contacts.title')}
                description={t('dashboard.contacts.description')}
                style={styles.panelBody}
              />
              <Box style={styles.panelFooter}>
                {hasContacts && areContactsEnabled ? (
                  <Box style={[styles.activeButton, styles.isActive]}>
                    <Box style={styles.buttonIcon}>
                      <IconFontAwesome
                        name={'check'}
                        size={14}
                        color={colors.green[75]}
                      />
                    </Box>
                    <Text
                      fontSize={'xs'}
                      style={[styles.buttonText, {color: colors.white}]}>
                      {t('dashboard.contacts.active')}
                    </Text>
                  </Box>
                ) : (
                  <Box style={[styles.activeButton]}>
                    <Box style={styles.buttonIcon}>
                      <IconFontAwesome
                        name={'warning'}
                        size={14}
                        color={colors.yellow[600]}
                      />
                    </Box>
                    <Text fontSize={'xs'} style={styles.buttonText}>
                      {t('dashboard.contacts.notActive')}
                    </Text>
                  </Box>
                )}
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAutomatedEmergency}
              style={styles.panel}>
              <IconFontAwesome
                name={'sliders'}
                size={24}
                style={styles.panelHeader}
                color={colors.gray[600]}
              />
              <IconWithText
                icon={
                  <Image
                    style={styles.image}
                    source={require('~/assets/images/dashboard/sirenAlert.png')}
                  />
                }
                title={t('dashboard.automatedEmergency.title')}
                description={t('dashboard.automatedEmergency.description')}
                style={styles.panelBody}
              />
              <Box style={styles.panelFooter}>
                {automatedEmergency ? (
                  <>
                    <Box
                      style={[
                        styles.activeButton,
                        !regularPushNotification && styles.isActive,
                      ]}>
                      <Box style={styles.buttonIcon}>
                        <IconFontisto
                          name={'heartbeat'}
                          size={14}
                          color={colors.pink[600]}
                        />
                      </Box>
                      <Text
                        fontSize={'xs'}
                        style={[
                          styles.buttonText,
                          !regularPushNotification && {color: colors.white},
                        ]}>
                        {t('dashboard.automatedEmergency.active.bioTrigger')}
                      </Text>
                    </Box>
                    <Box
                      style={[
                        styles.activeButton,
                        regularPushNotification && styles.isActive,
                      ]}>
                      <Box style={styles.buttonIcon}>
                        <IconFontisto
                          name={'clock'}
                          size={13}
                          color={colors.blue[800]}
                        />
                      </Box>
                      <Text
                        fontSize={'xs'}
                        style={[
                          styles.buttonText,
                          regularPushNotification && {color: colors.white},
                        ]}>
                        {t('dashboard.automatedEmergency.active.timeTrigger')}
                      </Text>
                    </Box>
                  </>
                ) : (
                  <Box style={[styles.activeButton]}>
                    <Box style={styles.buttonIcon}>
                      <IconFontAwesome
                        name={'warning'}
                        size={14}
                        color={colors.yellow[600]}
                      />
                    </Box>
                    <Text fontSize={'xs'} style={styles.buttonText}>
                      {t('dashboard.automatedEmergency.notActive')}
                    </Text>
                  </Box>
                )}
              </Box>
              {automatedEmergency &&
                !regularPushNotification &&
                recommendedPeriod && (
                  <Box style={styles.message}>
                    <Text
                      fontSize={12}
                      color={colors.red[600]}
                      textAlign={'center'}>
                      {t('dashboard.automatedEmergency.recommendationMessage', {
                        recommendedPeriod,
                      })}
                    </Text>
                  </Box>
                )}
            </TouchableOpacity>
          </Box>
          <Box style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('dashboard.sections.signUp')}
            </Text>
            <TouchableOpacity
              onPress={handleSignUpTomorrowBio}
              style={styles.panel}>
              <IconWithText
                icon={
                  <Image
                    style={styles.image}
                    source={require('~/assets/images/dashboard/tomorrowBioLogo.png')}
                  />
                }
                title={t(
                  'dashboard.signUpForCryopreservation.tomorrowBio.title',
                )}
                description={t(
                  'dashboard.signUpForCryopreservation.tomorrowBio.description',
                )}
                style={styles.panelBody}
              />
              <Box style={styles.panelFooter}>
                <Box style={styles.learnMoreBox}>
                  <Text style={styles.learnMoreText}>
                    {t(
                      'dashboard.signUpForCryopreservation.tomorrowBio.footer',
                    )}
                  </Text>
                </Box>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={openAlcorWebsite} style={styles.panel}>
              <IconWithText
                icon={
                  <Image
                    style={styles.image}
                    source={require('~/assets/images/dashboard/alcorLogo.png')}
                  />
                }
                title={t('dashboard.signUpForCryopreservation.alcor.title')}
                description={t(
                  'dashboard.signUpForCryopreservation.alcor.description',
                )}
                style={styles.panelBody}
              />
              <Box style={styles.panelFooter}>
                <Box style={styles.learnMoreBox}>
                  <Text style={styles.learnMoreText}>
                    {t('dashboard.signUpForCryopreservation.alcor.footer')}
                  </Text>
                  <IconFeather
                    name="external-link"
                    size={15}
                    color={colors.blue[800]}
                  />
                </Box>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openCryonicsInstituteWebsite}
              style={styles.panel}>
              <IconWithText
                icon={
                  <Image
                    style={styles.image}
                    source={require('~/assets/images/dashboard/cryonicsInstituteLogo.png')}
                  />
                }
                title={t(
                  'dashboard.signUpForCryopreservation.cryonicsInstitute.title',
                )}
                description={t(
                  'dashboard.signUpForCryopreservation.cryonicsInstitute.description',
                )}
                style={styles.panelBody}
              />
              <Box style={styles.panelFooter}>
                <Box style={styles.learnMoreBox}>
                  <Text style={styles.learnMoreText}>
                    {t('dashboard.signUpForCryopreservation.alcor.footer')}
                  </Text>
                  <IconFeather
                    name="external-link"
                    size={15}
                    color={colors.blue[800]}
                  />
                </Box>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openSouthernCryonicsWebsite}
              style={styles.panel}>
              <IconWithText
                icon={
                  <Image
                    style={styles.image}
                    source={require('~/assets/images/dashboard/southernCryonicsLogo.png')}
                  />
                }
                title={t(
                  'dashboard.signUpForCryopreservation.southernCryonics.title',
                )}
                description={t(
                  'dashboard.signUpForCryopreservation.southernCryonics.description',
                )}
                style={styles.panelBody}
              />
              <Box style={styles.panelFooter}>
                <Box style={styles.learnMoreBox}>
                  <Text style={styles.learnMoreText}>
                    {t('dashboard.signUpForCryopreservation.alcor.footer')}
                  </Text>
                  <IconFeather
                    name="external-link"
                    size={15}
                    color={colors.blue[800]}
                  />
                </Box>
              </Box>
            </TouchableOpacity>
          </Box>
        </ScrollView>
      </Container>
      <TouchableWithoutFeedback
        onPressIn={handleEmergencyStart}
        onPressOut={handleEmergencyStop}>
        <Box style={styles.emergencyButton}>
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
              style={styles.emergencySubCaption}>
              {t('dashboard.emergency.countdownSubtitleHold')}
            </Text>
          )}
        </Box>
      </TouchableWithoutFeedback>
    </>
  );
};
export default Dashboard;
