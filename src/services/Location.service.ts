import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeoOptions,
  GeoPosition,
} from 'react-native-geolocation-service';
import i18n from '~/i18n/i18n';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {openSettings} from '~/utils';

export class PermissionAlwaysDeniedError extends Error {
  code: number = 1; // compatible with ErrorCallback from react-native-geolocation-service
  constructor(message: string = 'Location always not granted') {
    super(message);

    this.name = 'PermissionAlwaysDeniedError';
  }
}

const requestPermissionIOS = async (shouldPrompt = true) => {
  const status = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

  if (status === RESULTS.GRANTED) {
    const locationStatus =
      (await check(PERMISSIONS.IOS.LOCATION_ALWAYS)) ||
      (await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE));
    if (locationStatus === 'granted') {
      return true;
    }

    Alert.alert(i18n.t('location.notEnoughsPermissions'), '', [
      {text: i18n.t('location.goToSettings'), onPress: openSettings},
      {text: i18n.t('common.cancel'), onPress: () => {}},
    ]);
    return false;
  }

  if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
    shouldPrompt &&
      Alert.alert(i18n.t('location.turnOnLocationFromSettings'), '', [
        {text: i18n.t('location.goToSettings'), onPress: openSettings},
        {text: i18n.t('common.cancel'), onPress: () => {}},
      ]);
  }
  return false;
};

const requestPermissionAndroid = async () => {
  if (+Platform.Version < 23) {
    return true;
  }

  const requestPermission =
    (await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    )) ||
    (await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ));

  if (requestPermission) {
    return true;
  }

  const status = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);

  if (
    status[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED ||
    status[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED
  ) {
    return true;
  }

  if (
    status[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] ===
      PermissionsAndroid.RESULTS.DENIED ||
    status[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] ===
      PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
    status[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.DENIED ||
    status[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
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
