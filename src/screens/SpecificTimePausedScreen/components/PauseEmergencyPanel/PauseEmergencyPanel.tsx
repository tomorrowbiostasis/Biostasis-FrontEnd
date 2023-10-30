import React, {useCallback, useState, useMemo} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  addPauseFromNow,
  deleteTimeSlot,
} from '~/redux/automatedEmergency/thunks';
import {styles} from './styles';
import IconFeather from 'react-native-vector-icons/Feather';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'native-base';
import ToastService from '~/services/Toast.service';
import {isPausedTime} from '~/services/Time.service';

const PauseEmergencyPanel = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const isNowPaused = useMemo(
    () => isPausedTime(new Date(), pausedDate, []),
    [pausedDate],
  );

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    async (date: Date) => {
      hideDatePicker();
      /*
        To avoid race condition I added this threshold for adding pause from now.
        There was unnecessary render while setting timeSlots from api
       */
      if (Date.now() + 6000 > date.valueOf()) {
        return;
      }

      const value = {
        timestamp: date.valueOf(),
        id: new Date().valueOf(),
      };
      dispatch(addPauseFromNow(value));
    },
    [dispatch, hideDatePicker],
  );

  const handlePauseButtonPress = useCallback(async () => {
    if (pausedDate) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
      ToastService.success(t('specificTimesScreen.pauseNow.cancelMessage'), {
        visibilityTime: 2000,
      });
    } else {
      showDatePicker();
    }
  }, [dispatch, pausedDate, showDatePicker, t]);

  return (
    <>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <IconFeather name="pause-circle" size={26} style={styles.icon} />
          <Text fontSize={'md'} fontWeight={700}>
            {t('specificTimesScreen.pauseNow.title')}
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.panelBody}>
          <Text fontSize={'sm'}>
            {t('specificTimesScreen.pauseNow.description')}
          </Text>
        </View>
        <View style={styles.panelFooter}>
          <TouchableOpacity
            onPress={handlePauseButtonPress}
            style={[styles.activeButton, isNowPaused && styles.isActive]}
          >
            {isNowPaused ? (
              <Text style={styles.buttonText}>
                {t('specificTimesScreen.pauseNow.pausedDisclaimer')}
              </Text>
            ) : (
              <Text style={styles.buttonText}>
                {t('specificTimesScreen.pauseNow.startDisclaimer')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={'datetime'}
        cancelTextIOS={t('common.cancel')}
        confirmTextIOS={t('common.confirm')}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </>
  );
};

export default PauseEmergencyPanel;
