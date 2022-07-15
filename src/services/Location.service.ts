import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeoOptions,
  GeoPosition,
} from 'react-native-geolocation-service';
import i18n from '~/i18n/i18n';

import {check, PERMISSIONS} from 'react-native-permissions';
import {openSettings} from '~/utils';

class PermissionAlwaysDeniedError extends Error {
  code: number = 1; // compatible with ErrorCallback from react-native-geolocation-service
  constructor(message: string = 'Location always not granted') {
    super(message);

    this.name = 'PermissionAlwaysDeniedError';
  }
}

const requestPermissionIOS = async (shouldPrompt = true) => {
  const status = await Geolocation.requestAuthorization('always');

  if (status === 'granted') {
    const checkedAlwaysStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    if (checkedAlwaysStatus === 'granted') {
      return true;
    }

    Alert.alert(i18n.t('location.notEnoughsPermissions'), '', [
      {text: i18n.t('location.goToSettings'), onPress: openSettings},
      {text: i18n.t('common.cancel'), onPress: () => {}},
    ]);
    return false;
  }

  if (status === 'disabled' || status === 'denied') {
    shouldPrompt &&
      Alert.alert(i18n.t('location.turnOnLocationFromSettings'), '', [
        {text: i18n.t('location.goToSettings'), onPress: openSettings},
        {text: i18n.t('common.cancel'), onPress: () => {}},
      ]);
  }
  return false;
};

const requestPermissionAndroid = async () => {
  if (Platform.Version < 23) {
    return true;
  }

  const requestPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (requestPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (
    status === PermissionsAndroid.RESULTS.DENIED ||
    status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
  ) {
    Alert.alert(
      i18n.t('location.locationPermissionDenied'),
      i18n.t('location.turnOnLocationFromSettings'),
      [
        {text: i18n.t('location.goToSettings'), onPress: openSettings},
        {text: i18n.t('common.cancel'), onPress: () => {}},
      ],
    );
  }

  return false;
};

export const requestLocationPermission = async (
  shouldShowPermissionPopup?: boolean,
) => {
  if (Platform.OS === 'ios') {
    return requestPermissionIOS(shouldShowPermissionPopup);
  }
  return requestPermissionAndroid();
};

export const getLocation = async (
  timeout = 15000,
  shouldShowPermissionPopup?: boolean,
): Promise<Geolocation.GeoPosition> => {
  const hasPermission = await requestLocationPermission(
    shouldShowPermissionPopup,
  );
  if (!hasPermission) {
    throw new PermissionAlwaysDeniedError();
  }

  return new Promise((resolve, reject) => {
    const geoPositionSettings: GeoOptions = {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: true,
      timeout,
      maximumAge: 10000,
      distanceFilter: 0,
      forceRequestLocation: true,
      showLocationDialog: true,
    };

    Geolocation.getCurrentPosition(resolve, reject, geoPositionSettings);
  });
};

export const getGoogleMapsUrl = (geoPosition: GeoPosition) => {
  return `https://www.google.com/maps/search/?api=1&query=${geoPosition?.coords.latitude}%2C${geoPosition?.coords.longitude}`;
};
