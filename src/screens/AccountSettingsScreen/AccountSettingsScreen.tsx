/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  InteractionManager,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  accountSettingsSelector,
  userSelector,
} from '~/redux/user/selectors';
import {getUser, updateUser, deleteUser} from '~/redux/user/thunks';
import {isIOS} from '~/utils';
import {isPausedTime} from '~/services/Time.service';
import {
  automatedEmergencyPausedDateSelector,
  automatedEmergencyPausedTimesSelector,
} from '~/redux/automatedEmergency/selectors';
import {sendGDPR} from '~/redux/gdpr/thunks';
import {gdprSelector} from '~/redux/gdpr/selectors';
import {clearGdprStatus} from '~/redux/gdpr/gdpr.slice';
import {clearDataAndSignOut} from '~/redux/store/utils';
import {ClearDataTypes} from '~/services/ClearData.types';
import ToastService from '~/services/Toast.service';
import i18n from '~/i18n/i18n';

import ScreenHeader from '~/components/ScreenHeader';
import Toggle from '~/components/Toggle';
import FormInput from '~/components/FormInput';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {
  ChevronRightIcon,
} from '~/assets/icons/AppIcons';
import {
  BioAccountSettingsFillAlertWarning,
  BioAccountSettingsFillDocumentDark,
  BioAccountSettingsFillLock,
  BioAccountSettingsFillSettings,
} from '~/assets/icons/BiostasisIcons';
import {regex} from '~/services/Validation.service';
import {iconSizes, semanticColors} from '~/theme/tokens';
import styles from './styles';

const AccountSettingsScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();

  const accountSettings = useAppSelector(accountSettingsSelector);
  const {user} = useAppSelector(userSelector);
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const specificPausedTimes = useAppSelector(
    automatedEmergencyPausedTimesSelector,
  );
  const {gdprStatus} = useAppSelector(gdprSelector);

  const isNowPaused = useMemo(
    () => isPausedTime(new Date(), pausedDate, specificPausedTimes),
    [pausedDate, specificPausedTimes],
  );

  const [gdprOpen, setGdprOpen] = useState(false);
  const [gdprEmail, setGdprEmail] = useState('');
  const [gdprSubmitting, setGdprSubmitting] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      dispatch(getUser());
    });

    return () => task.cancel();
  }, [dispatch]);

  /* ----- notifications ----- */
  const handleTurnOnNotifications = () => {
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

  const handleAllowNotificationsSwitchPress = useCallback(
    (value: boolean) => {
      if (value) {
        handleTurnOnNotifications();
      } else {
        ToastService.success(i18n.t('accountSettings.notificationOff'), {
          visibilityTime: 3000,
        });
      }
      dispatch(updateUser({allowNotifications: value}));
    },
    [dispatch, user, isNowPaused],
  );

  const handleReceiveTipsAndTricksSwitchPress = useCallback(
    (value: boolean) => {
      dispatch(updateUser({tipsAndTricks: value}));
    },
    [dispatch],
  );

  /* ----- GDPR ----- */
  const isGdprEmailValid = regex.email.test(gdprEmail.trim());

  const handleGdprSubmit = useCallback(() => {
    setGdprSubmitting(true);
    dispatch(sendGDPR(gdprEmail));
  }, [dispatch, gdprEmail]);

  useEffect(() => {
    if (gdprStatus === 'success') {
      dispatch(clearGdprStatus());
      setGdprSubmitting(false);
      setGdprEmail('');
      setGdprOpen(false);
      ToastService.success(t('accountSettings.GDPR.notification'));
    } else if (gdprStatus === 'error') {
      dispatch(clearGdprStatus());
      setGdprSubmitting(false);
    }
  }, [gdprStatus, dispatch, t]);

  /* ----- delete account ----- */
  const handleDelete = useCallback(() => {
    Alert.alert(
      t('accountSettings.deleteAccount.title'),
      t('accountSettings.deleteAccount.confirmMessage'),
      [
        {text: t('common.no')},
        {
          text: t('common.yes'),
          onPress: () => {
            dispatch(deleteUser()).then(async () => {
              try {
                await clearDataAndSignOut(ClearDataTypes.DELETE);
                ToastService.success(
                  t('accountSettings.deleteAccount.successMessage'),
                );
              } catch (error: any) {
                console.log(error.message);
              }
            });
          },
        },
      ],
    );
  }, [dispatch, t]);

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('accountSettingsScreen.title')} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Allow Notifications */}
        <View style={styles.card}>
          <BioAccountSettingsFillLock />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>
              {t('accountSettings.allowNotifications')}
            </Text>
            <Text style={styles.cardSubtitle}>
              {t('accountSettingsScreen.notificationsSub')}
            </Text>
          </View>
          <Toggle
            value={!!accountSettings.allowNotifications}
            onChange={handleAllowNotificationsSwitchPress}
          />
        </View>

        {/* Tips & Tricks */}
        <View style={styles.card}>
          <BioAccountSettingsFillSettings />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>
              {t('accountSettingsScreen.tipsTitle')}
            </Text>
            <Text style={styles.cardSubtitle}>
              {t('accountSettingsScreen.tipsSub')}
            </Text>
          </View>
          <Toggle
            value={!!accountSettings.tipsAndTricks}
            onChange={handleReceiveTipsAndTricksSwitchPress}
          />
        </View>

        {/* Request My Data (GDPR) */}
        <View style={styles.cardColumn}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.cardRow}
            onPress={() => setGdprOpen(o => !o)}>
            <BioAccountSettingsFillDocumentDark />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                {t('accountSettingsScreen.gdprTitle')}
              </Text>
              <Text style={styles.cardSubtitle}>
                {t('accountSettingsScreen.gdprSub')}
              </Text>
            </View>
            <View style={gdprOpen ? styles.chevronOpen : undefined}>
              <ChevronRightIcon
                size={iconSizes.chevron}
                color={semanticColors.iconChevron}
              />
            </View>
          </TouchableOpacity>

          {gdprOpen ? (
            <View style={styles.gdprBody}>
              <Text style={styles.gdprText}>
                {t('accountSettings.GDPR.description')}
              </Text>
              <Text style={styles.gdprText}>
                {t('accountSettings.GDPR.label')}
              </Text>
              <FormInput
                type="email"
                label={t('profileEdit.email')}
                placeholder={t('placeholder.email')}
                value={gdprEmail}
                onChangeText={setGdprEmail}
              />
              <AnimatedSubmitButton
                disabled={!isGdprEmailValid || gdprSubmitting}
                isLoading={gdprSubmitting}
                onPress={handleGdprSubmit}>
                {t('common.submit')}
              </AnimatedSubmitButton>
            </View>
          ) : null}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <BioAccountSettingsFillAlertWarning />
            <Text style={styles.dangerHeading}>
              {t('accountSettingsScreen.dangerZone')}
            </Text>
          </View>
          <Text style={styles.dangerTitle}>
            {t('accountSettings.deleteAccount.title')}
          </Text>
          <Text style={styles.dangerDescription}>
            {t('accountSettings.deleteAccount.description')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.deleteButton}
            onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>
              {t('accountSettingsScreen.deleteAction')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountSettingsScreen;
