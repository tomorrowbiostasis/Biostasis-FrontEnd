import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {getUserPersistedSettings} from '~/services/AsyncStorage.service/helpers';

const pseudoTime = (time: number) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours * 100 + minutes;
};

export const getTimeSettings = async () => {
  const {positiveInfoPeriod} = await getUserPersistedSettings();
  //TODO refactor this parsing below as with getUserPersistedSettings
  const settingsJsonOfJson = await AsyncStorageService.getItem(
    AsyncStorageEnum.PersistedAutomatedEmergencySettings,
  );
  const settingsObjectOfJson = Object.entries(
    JSON.parse(`${settingsJsonOfJson}`),
  );
  const settingsObject = settingsObjectOfJson.reduce(
    (acc, curr) => ({
      ...acc,
      [curr[0]]: JSON.parse(`${curr[1]}`),
    }),
    {pausedDate: {}, specificPausedTimes: []},
  );

  return {
    positiveInfoPeriod,
    ...settingsObject,
  };
};

export const isPausedTime = (
  givenDate: any,
  pausedDate: any,
  specificPausedTimes: any,
) => {
  const timestamp = +new Date(givenDate);

  if (timestamp < pausedDate?.timestamp) {
    return true;
  }

  const hour = givenDate.getHours();
  if (hour >= 22 || hour < 6) {
    return true;
  }

  return specificPausedTimes.some((pausedTime: any) => {
    const {isActive, startTime, endTime, startDay, endDay} = pausedTime;

    const startingWeekDay = startDay[0];
    const endingWeekDay = endDay[endDay.length - 1];
    const startingHour = pseudoTime(startTime);
    const endingHour = pseudoTime(endTime);
    const givenWeekDay = givenDate.getDay();
    const givenHour = pseudoTime(timestamp);

    if (isActive) {
      let dayMatch = false;
      let hourMatch = false;

      if (startDay.length === 7) {
        dayMatch = true;

        if (givenHour >= startingHour && givenHour < endingHour) {
          hourMatch = true;
        }
      } else if (startingWeekDay === endingWeekDay) {
        if (startingWeekDay === givenWeekDay) {
          dayMatch = true;

          if (givenHour >= startingHour && givenHour < endingHour) {
            hourMatch = true;
          }
        }
      } else if (startingWeekDay < endingWeekDay) {
        if (givenWeekDay >= startingWeekDay && givenWeekDay <= endingWeekDay) {
          dayMatch = true;

          if (givenWeekDay > startingWeekDay && givenWeekDay < endingWeekDay) {
            hourMatch = true;
          }

          if (givenWeekDay === startingWeekDay && givenHour >= startingHour) {
            hourMatch = true;
          }

          if (givenWeekDay === endingWeekDay && givenHour < endingHour) {
            hourMatch = true;
          }
        }
      } else {
        // starting day > ending day
        if (givenWeekDay >= startingWeekDay || givenWeekDay <= endingWeekDay) {
          dayMatch = true;

          if (givenWeekDay > startingWeekDay || givenWeekDay < endingWeekDay) {
            hourMatch = true;
          }

          if (givenWeekDay === startingWeekDay && givenHour >= startingHour) {
            hourMatch = true;
          }

          if (givenWeekDay === endingWeekDay && givenHour < endingHour) {
            hourMatch = true;
          }
        }
      }

      return dayMatch && hourMatch;
    }
  });
};
