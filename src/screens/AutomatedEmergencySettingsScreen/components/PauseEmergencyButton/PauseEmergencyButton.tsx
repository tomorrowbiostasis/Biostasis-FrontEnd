import React, {useCallback, useState, useMemo, VFC} from 'react';
import PlusIcon from '~/assets/icons/PlusIcon';
import BottomButton, {IBottomButtonProps} from '~/components/BottomButton';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {setAutomatedEmergencyPause} from '~/redux/automatedEmergency/automatedEmergency.slice';
import {automatedEmergencyPausedDateSelector} from '~/redux/automatedEmergency/selectors';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  addPauseFromNow,
  deleteTimeSlot,
} from '~/redux/automatedEmergency/thunks';

interface IPauseEmergencyButtonProps {
  bottomButtonProps: Partial<IBottomButtonProps>;
}

const PauseEmergencyButton: VFC<IPauseEmergencyButtonProps> = ({
  bottomButtonProps = {},
}) => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const pausedDate = useAppSelector(automatedEmergencyPausedDateSelector);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    (date: Date) => {
      hideDatePicker();
      /*
        To avoid race condition I added this threshold for adding pause from now.
        There was unnecessary render while setting timeslots from api
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

  const handlePauseButtonPress = useCallback(() => {
    if (pausedDate) {
      dispatch(deleteTimeSlot(pausedDate.id));
      dispatch(setAutomatedEmergencyPause(null));
    } else {
      showDatePicker();
    }
  }, [dispatch, pausedDate, showDatePicker]);

  const buttonTitle = useMemo(
    () =>
      t(
        pausedDate
          ? 'emergencyContacts.automatedEmergencySettings.cancelEmergencyPause'
          : 'emergencyContacts.automatedEmergencySettings.pauseAutomatedEmergency',
      ),
    [pausedDate, t],
  );

  return (
    <>
      <BottomButton
        leftIcon={
          <PlusIcon style={!!pausedDate && {transform: [{rotate: '45deg'}]}} />
        }
        title={buttonTitle}
        hideRightButton
        onPress={handlePauseButtonPress}
        {...bottomButtonProps}
      />
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

export default PauseEmergencyButton;
