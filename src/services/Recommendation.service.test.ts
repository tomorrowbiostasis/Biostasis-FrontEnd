import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {IBioData} from './GoogleFit.types';
import {
  getStoredData,
  isSameData,
  getStartDate,
  getLastUpdatedDate,
  getTimeDifference,
  getLongestPeriod,
  findNearestGreaterValue,
  recommendationSystem,
} from './Recommendation.service';
import {AsyncStorageEnum} from './AsyncStorage.service/AsyncStorage.types';

describe('Recommendation System Service', () => {
  const healthData: IBioData = {
    movementData: {
      value: 50,
      time: new Date().toString(),
    },
    pulseData: {
      value: 75,
      time: new Date().toString(),
    },
    restingPulseData: {
      value: 55,
      time: new Date().toString(),
    },
  };

  describe('Test similarity between previous saved and new fetched health data', () => {
    it('Similar data', () => {
      const preData = healthData;
      const newData = healthData;
      expect(isSameData(preData, newData)).toBeTruthy();
    });

    it('No data stored', () => {
      const preData = null;
      const newData = healthData;

      expect(isSameData(preData, newData)).toBeFalsy();
    });

    it('Different Data received', () => {
      const preData = healthData;
      const newDataMovementChange = {
        ...healthData,
        movementData: {
          value: 10,
          time: new Date(),
        },
      };
      expect(isSameData(preData, newDataMovementChange)).toBeFalsy();

      const newDataPulseChange = {
        ...healthData,
        pulseData: {
          value: 100,
          time: new Date(),
        },
      };
      expect(isSameData(preData, newDataPulseChange)).toBeFalsy();

      const newDataRestingPulseChange = {
        ...healthData,
        restingPulseData: {
          value: 80,
          time: new Date(),
        },
      };
      expect(isSameData(preData, newDataRestingPulseChange)).toBeFalsy();
    });
  });

  describe('Test the use of asyncStorage', () => {
    beforeEach(() => {
      AsyncStorage.clear();
    });

    describe('Stored health data', () => {
      it('No data stored', async () => {
        const storedData = await getStoredData(AsyncStorage);
        expect(AsyncStorage.getItem).toBeCalledWith(AsyncStorageEnum.BioData);
        expect(storedData).toBeNull();
      });

      it('Get saved data', async () => {
        await AsyncStorage.setItem(
          AsyncStorageEnum.BioData,
          JSON.stringify(healthData),
        );

        const storedData = await getStoredData(AsyncStorage);
        expect(storedData).not.toBeNull();
        expect(AsyncStorage.getItem).toBeCalledWith(AsyncStorageEnum.BioData);
        expect(storedData).toStrictEqual(healthData);
      });
    });

    describe('Stored Start date', () => {
      it('No start date stored', async () => {
        const startDate = await getStartDate(AsyncStorage);
        expect(AsyncStorage.getItem).toBeCalledWith(
          AsyncStorageEnum.StartingDate,
        );
        expect(startDate).toBeLessThanOrEqual(new Date().getTime());
      });

      it('Get saved start date', async () => {
        const now = new Date();
        await AsyncStorage.setItem(
          AsyncStorageEnum.StartingDate,
          now.toISOString(),
        );

        const startDate = await getStartDate(AsyncStorage);
        expect(startDate).not.toBeNull();
        expect(AsyncStorage.getItem).toBeCalledWith(
          AsyncStorageEnum.StartingDate,
        );
        expect(startDate).toBe(now.getTime());
      });
    });

    describe('Stored Last Updated Date', () => {
      it('No start date stored', async () => {
        const lastDate = await getLastUpdatedDate(AsyncStorage);
        expect(AsyncStorage.getItem).toBeCalledWith(
          AsyncStorageEnum.LastUpdatedDate,
        );
        expect(lastDate).toBeLessThanOrEqual(new Date().getTime());
      });

      it('Get saved last updated date', async () => {
        const now = new Date();
        await AsyncStorage.setItem(
          AsyncStorageEnum.LastUpdatedDate,
          now.toISOString(),
        );
        const lastDate = await getLastUpdatedDate(AsyncStorage);
        expect(lastDate).not.toBeNull();
        expect(AsyncStorage.getItem).toBeCalledWith(
          AsyncStorageEnum.LastUpdatedDate,
        );
        expect(lastDate).toBe(now.getTime());
      });
    });

    describe('Stored longest period', () => {
      it('No longest period stored', async () => {
        const longestPeriod = await getLongestPeriod(AsyncStorage);
        expect(AsyncStorage.getItem).toBeCalledWith(
          AsyncStorageEnum.LongestPeriod,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          AsyncStorageEnum.LongestPeriod,
          '0',
        );
        expect(longestPeriod).toBe(0);
      });

      it('Get saved longest period value', async () => {
        await AsyncStorage.setItem(AsyncStorageEnum.LongestPeriod, '1700000');
        const longestPeriod = await getLongestPeriod(AsyncStorage);
        expect(longestPeriod).not.toBeNull();
        expect(AsyncStorage.getItem).toBeCalledWith(
          AsyncStorageEnum.LongestPeriod,
        );
        expect(longestPeriod).toBe(1700000);
      });
    });
  });

  describe('Calculate time Difference between a specific date and now', () => {
    it('no value', () => {
      expect(getTimeDifference(0)).toBeGreaterThanOrEqual(new Date().getTime());
    });

    it('now', () => {
      expect(getTimeDifference(new Date().getTime())).toBeGreaterThanOrEqual(0);
    });

    it('two hours', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now);
      twoHoursAgo.setHours(now.getHours() - 2);
      expect(getTimeDifference(twoHoursAgo.getTime())).toBeGreaterThanOrEqual(
        7200000,
      );
    });

    it('two days', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setHours(now.getHours() - 48);
      expect(getTimeDifference(twoDaysAgo.getTime())).toBeGreaterThanOrEqual(
        172800000,
      );
    });
  });

  describe('Calculate the nearest greater value', () => {
    expect(findNearestGreaterValue(0)).toBe(3);
    expect(findNearestGreaterValue(4)).toBe(6);
    expect(findNearestGreaterValue(10)).toBe(12);
    expect(findNearestGreaterValue(12.1)).toBe(18);
    expect(findNearestGreaterValue(24.0001)).toBe(36);
  });

  describe('Test the recommendation system', () => {
    it('no stored health data', async () => {
      await recommendationSystem(healthData, AsyncStorage);
      expect(AsyncStorage.getItem).toBeCalledWith(AsyncStorageEnum.BioData);
      expect(AsyncStorage.getItem).toBeCalledWith(
        AsyncStorageEnum.StartingDate,
      );
      expect(AsyncStorage.getItem).toBeCalledWith(
        AsyncStorageEnum.LastUpdatedDate,
      );
      expect(AsyncStorage.getItem).toBeCalledWith(
        AsyncStorageEnum.LongestPeriod,
      );

      const storedData = await AsyncStorage.getItem(AsyncStorageEnum.BioData);
      const startDate = await AsyncStorage.getItem(
        AsyncStorageEnum.StartingDate,
      );
      const lastUpdatedDate = await AsyncStorage.getItem(
        AsyncStorageEnum.LastUpdatedDate,
      );
      const longestPeriod = await AsyncStorage.getItem(
        AsyncStorageEnum.LongestPeriod,
      );

      expect(storedData).not.toBeNull();
      expect(startDate).not.toBeNull();
      expect(lastUpdatedDate).not.toBeNull();
      expect(longestPeriod).not.toBeNull();

      const recommendationPeriod = await AsyncStorage.getItem(
        AsyncStorageEnum.RecommendedPeriod,
      );

      expect(recommendationPeriod).toBeNull();
    });

    it('recommendation period after 3 days', async () => {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setHours(now.getHours() - 72);

      await AsyncStorage.setItem(
        AsyncStorageEnum.StartingDate,
        sevenDaysAgo.toISOString(),
      );
      await recommendationSystem(healthData, AsyncStorage);

      const recommendationPeriod = await AsyncStorage.getItem(
        AsyncStorageEnum.RecommendedPeriod,
      );

      expect(recommendationPeriod).toBeNull();
    });

    it('recommendation period after 7 days', async () => {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setHours(now.getHours() - 170);

      await AsyncStorage.setItem(
        AsyncStorageEnum.StartingDate,
        sevenDaysAgo.toISOString(),
      );
      await AsyncStorage.setItem(
        AsyncStorageEnum.LongestPeriod,
        (5 * 60).toString(),
      );

      await recommendationSystem(healthData, AsyncStorage);

      const recommendationPeriod = await AsyncStorage.getItem(
        AsyncStorageEnum.RecommendedPeriod,
      );

      expect(recommendationPeriod).toBe('6');

      // reset recommendation system
      expect(AsyncStorage.multiRemove).toBeCalledWith([
        AsyncStorageEnum.StartingDate,
        AsyncStorageEnum.BioData,
        AsyncStorageEnum.LastUpdatedDate,
        AsyncStorageEnum.LongestPeriod,
      ]);
    });
  });
});
