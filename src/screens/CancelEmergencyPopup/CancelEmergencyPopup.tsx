import {useCallback, useEffect, VFC} from 'react';
import {Screens} from '~/models/Navigation.model';
import {navigate} from '~/navigators';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';
import {getUser} from '~/redux/user/thunks';
import useInterval from '../../hooks/UseInterval.hook';

const minuteInMs = 60000;
const numberOfMinutes = 15;
const triggerDelay = numberOfMinutes * minuteInMs;
/*TODO investigate necessity of using such a solution
 * with current implementation. Base on push from BE we are setting flag on async,
 * below implementation is just a guard for specific case ,
 * when we wont receive push notification during escalation flow
 */
const CancelEmergencyPopup: VFC = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(userSelector);

  useEffect(() => {
    if (user?.isEmergencyTriggerActive) {
      navigate(Screens.HealthConditionError, {
        backendTriggered: true,
      });
    }
  }, [user?.isEmergencyTriggerActive]);

  const triggerUserProfilePeriodically = useCallback(() => {
    dispatch(getUser());
  }, [dispatch]);

  useInterval(triggerUserProfilePeriodically, triggerDelay);
  return null;
};

export default CancelEmergencyPopup;
