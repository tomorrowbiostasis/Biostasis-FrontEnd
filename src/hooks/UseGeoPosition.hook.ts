import {useCallback} from 'react';
import {GeoPosition} from 'react-native-geolocation-service';
import {useAppSelector} from '~/redux/store/hooks';
import {selectEmergencyButtonSettings} from '~/redux/user/selectors';
import {getLocation} from '~/services/Location.service';

interface IUseGeoPositionReturn {
  getGeoPosition: () => Promise<GeoPosition | null>;
}

export const useGeoPosition = (): IUseGeoPositionReturn => {
  const emergencyButtonSettings = useAppSelector(selectEmergencyButtonSettings);
  const getGeoPosition = useCallback(async () => {
    let geoPosition: GeoPosition | null = null;
    try {
      if (emergencyButtonSettings.locationAccess) {
        geoPosition = await getLocation(5000, false);
      }
    } catch (error) {
      console.log(
        'Could not get location, sending emergency without it',
        error.message,
      );
    }
    return geoPosition;
  }, [emergencyButtonSettings.locationAccess]);

  return {
    getGeoPosition,
  };
};
