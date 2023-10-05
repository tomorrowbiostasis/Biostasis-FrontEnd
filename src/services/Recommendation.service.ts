import AsyncStorage, {
  AsyncStorageStatic,
} from '@react-native-async-storage/async-storage';
import {intervalsConfig} from '~/constants/settings.constants';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {IBioData} from '~/services/GoogleFit.types';

// Main function for calculating and managing recommended periods
export const recommendationSystem = async (
  data: IBioData,
  storageType = AsyncStorage,
) => {
  const storedData: IBioData | null = await getStoredData(storageType);
  const startingDate: number = await getStartDate(storageType);
  const lastUpdatedDate: number = await getLastUpdatedDate(storageType);
  let longestPeriod: number = await getLongestPeriod(storageType);

  if (!isSameData(storedData, data)) {
    const timeDifferenceMinutes =
      getTimeDifference(lastUpdatedDate) / (1000 * 60);
    if (timeDifferenceMinutes > longestPeriod) {
      longestPeriod = timeDifferenceMinutes;
      await storageType.setItem(
        AsyncStorageEnum.LongestPeriod,
        longestPeriod.toString(),
      );
      console.log('Longest period updated', longestPeriod);
    }
    await storageType.setItem(
      AsyncStorageEnum.LastUpdatedDate,
      new Date().toISOString(),
    );
    await storageType.setItem(AsyncStorageEnum.BioData, JSON.stringify(data));
    console.log('New Bio Data found');
  }

  const timeDifferenceDays =
    getTimeDifference(startingDate) / (1000 * 60 * 60 * 24);

  if (timeDifferenceDays > 7) {
    const recommendedPeriod: number = findNearestGreaterValue(
      longestPeriod / 60,
    );
    await storageType.setItem(
      AsyncStorageEnum.RecommendedPeriod,
      recommendedPeriod.toString(),
    );
    await resetRecommendationSystem(storageType);
    console.log('Recommended Period updated', recommendedPeriod);
  }
};

export const isSameData = (
  preData: IBioData | null,
  newData: IBioData,
): Boolean => {
  if (!preData) {
    return false;
  }
  if (
    +preData.movementData.value !== +newData.movementData.value ||
    +preData.pulseData.value !== +newData.pulseData.value ||
    +preData.restingPulseData.value !== +newData.restingPulseData.value
  ) {
    return false;
  }
  return true;
};

// Calculate time difference in milliseconds
export const getTimeDifference = (startingDate: number): number => {
  if (startingDate) {
    return new Date().getTime() - startingDate;
  } else {
    return new Date().getTime();
  }
};

export const getStoredData = async (
  storage: AsyncStorageStatic,
): Promise<IBioData | null> => {
  const storedDataString = await storage.getItem(AsyncStorageEnum.BioData);
  if (storedDataString) {
    return JSON.parse(storedDataString);
  } else {
    return null;
  }
};

export const getStartDate = async (
  storage: AsyncStorageStatic,
): Promise<number> => {
  const startingDateString = await storage.getItem(
    AsyncStorageEnum.StartingDate,
  );
  if (startingDateString) {
    return new Date(startingDateString).getTime();
  } else {
    const now = new Date();
    await storage.setItem(AsyncStorageEnum.StartingDate, now.toISOString());
    return now.getTime();
  }
};

export const getLastUpdatedDate = async (
  storage: AsyncStorageStatic,
): Promise<number> => {
  const lastDateString = await storage.getItem(
    AsyncStorageEnum.LastUpdatedDate,
  );
  if (lastDateString) {
    return new Date(lastDateString).getTime();
  } else {
    const now = new Date();
    await storage.setItem(AsyncStorageEnum.LastUpdatedDate, now.toISOString());
    return now.getTime();
  }
};

export const getLongestPeriod = async (
  storage: AsyncStorageStatic,
): Promise<number> => {
  const longestPeriodString = await storage.getItem(
    AsyncStorageEnum.LongestPeriod,
  );
  if (longestPeriodString) {
    return parseInt(longestPeriodString, 10);
  } else {
    await storage.setItem(AsyncStorageEnum.LongestPeriod, '0');
    return 0;
  }
};

export const findNearestGreaterValue = (longestPeriod: number): number => {
  const intervalValues = intervalsConfig
    .filter(interval => interval.unit === 'hours')
    .map(interval => interval.time);
  let nearestValue = intervalValues[intervalValues.length - 1];
  for (const value of intervalValues) {
    if (value >= longestPeriod) {
      nearestValue = value;
      break;
    }
  }
  return nearestValue;
};

export const resetRecommendationSystem = async (
  storage: AsyncStorageStatic,
) => {
  await storage.multiRemove([
    AsyncStorageEnum.StartingDate,
    AsyncStorageEnum.BioData,
    AsyncStorageEnum.LastUpdatedDate,
    AsyncStorageEnum.LongestPeriod,
  ]);
};
