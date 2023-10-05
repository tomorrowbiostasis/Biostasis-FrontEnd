/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useLayoutEffect, useMemo, useState} from 'react';
import {LayoutAnimation, ScrollView, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  accountSettingsSelector,
  userLoading,
  userSelector,
} from '~/redux/user/selectors';
import {getUser, updateUser} from '~/redux/user/thunks';
import Container from '~/components/Container';
import SwitchButton from '~/components/SwitchButton';
import styles from './styles';
import {isIOS} from '~/utils';
import {isPausedTime} from '~/services/Time.service';
import {
  automatedEmergencyPausedDateSelector,
  automatedEmergencyPausedTimesSelector,
} from '~/redux/automatedEmergency/selectors';
import ToastService from '~/services/Toast.service';
import i18n from '~/i18n/i18n';
import colors from '~/theme/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from 'native-base';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GDPR from './components/GDPR/GDPR';
import DeleteAccount from './components/DeleteAccount';
import LogoutTrigger from '~/components/LogoutTrigger/LogoutTrigger';
// import LanguageSelector from './components/LanguageSelection/LanguageSelector';

const AccountSettingsScreen = () => {
  const {t} = useAppTranslation();
  const accountSettings = useAppSelector(accountSettingsSelector);
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(userSelector);
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const specificPausedTimes = useAppSelector(
    automatedEmergencyPausedTimesSelector,
  );
  const isNowPaused = useMemo(
    () => isPausedTime(new Date(), pausedDate, specificPausedTimes),
    [pausedDate, specificPausedTimes],
  );
  const loading = useAppSelector(userLoading);
  const [isGDPRShown, setIsGDPRShown] = useState(false);
  const [isDeleteAccountShown, setIsDeleteAccountShown] = useState(false);

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleAllowNotificationsSwitchPress = useCallback(
    async (value: boolean) => {
      if (value) {
        await handleTurnOnNotifications();
      } else {
        await handleTurnOffNotifications();
      }
      dispatch(updateUser({allowNotifications: value}));
    },
    [dispatch, accountSettings],
  );

  const handleTurnOnNotifications = async () => {
    const validatePlatformConditions = isIOS
      ? user.automatedEmergency && user.pulseBasedTriggerIOSAppleWatchPaired
      : user.automatedEmergency &&
        user.pulseBasedTriggerGoogleFitAuthenticated &&
        user.pulseBasedTriggerConnectedToGoogleFit &&
        user.pulseBasedTriggerBackgroundModesEnabled;

    if (!validatePlatformConditions || isNowPaused) {
      ToastService.warning(i18n.t('automatedEmergencyStatus.failed'), {
        visibilityTime: 3000,
      });
    } else {
      ToastService.success(i18n.t('accountSettings.notificationOn'), {
        visibilityTime: 3000,
      });
    }
  };

  const handleTurnOffNotifications = async () => {
    ToastService.success(i18n.t('accountSettings.notificationOff'), {
      visibilityTime: 3000,
    });
  };

  const handleReceiveTipsAndTricksSwitchPress = useCallback(
    (value: boolean) => {
      dispatch(updateUser({tipsAndTricks: value}));
    },
    [dispatch, accountSettings],
  );

  return (
    <Container
      title={t('accountSettings.title')}
      loading={loading}
      titleText={{fontSize: 16}}
      type={'static'}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      showBackIcon
      showDrawerIcon>
      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <SwitchButton
              containerStyle={styles.switchContainer}
              value={accountSettings.allowNotifications}
              title={t('accountSettings.allowNotifications')}
              onSwitchPress={handleAllowNotificationsSwitchPress}
            />
            <SwitchButton
              containerStyle={styles.switchContainer}
              value={accountSettings.tipsAndTricks}
              title={t('accountSettings.receiveTipsAndTricks')}
              onSwitchPress={handleReceiveTipsAndTricksSwitchPress}
            />
            {/* Removed until creating a responsive design */}
            {/* <LanguageSelector /> */}
          </View>
          <View style={styles.panelBody}>
            <View
              style={[styles.expandableSectionWrapper, {borderTopWidth: 1}]}>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  setIsGDPRShown(!isGDPRShown);
                }}>
                <View style={styles.expandableHeader}>
                  <Text fontSize={'md'}>{t('accountSettings.GDPR.title')}</Text>
                  <View
                    style={{
                      transform: [
                        {translateX: -5},
                        {rotate: isGDPRShown ? '-180deg' : '0deg'},
                      ],
                    }}>
                    <IconMaterialIcons
                      name={'arrow-drop-down'}
                      size={24}
                      color={colors.gray[700]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {isGDPRShown && (
                <View style={styles.sectionBody}>
                  <GDPR />
                </View>
              )}
            </View>

            <View
              style={[
                styles.expandableSectionWrapper,
                {borderStartColor: colors.red[800]},
              ]}>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  setIsDeleteAccountShown(!isDeleteAccountShown);
                }}>
                <View style={styles.expandableHeader}>
                  <Text fontSize={'md'}>
                    {t('accountSettings.deleteAccount.title')}
                  </Text>
                  <View
                    style={{
                      transform: [
                        {translateX: -5},
                        {rotate: isDeleteAccountShown ? '-180deg' : '0deg'},
                      ],
                    }}>
                    <IconMaterialIcons
                      name={'arrow-drop-down'}
                      size={24}
                      color={colors.gray[700]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {isDeleteAccountShown && (
                <View style={styles.sectionBody}>
                  <DeleteAccount />
                </View>
              )}
            </View>
            <View style={styles.panelFooter}>
              <LogoutTrigger />
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default AccountSettingsScreen;
