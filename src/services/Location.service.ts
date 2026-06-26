import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeoOptions,
  GeoPosition,
} from 'react-native-geolocation-service';
import i18n from '~/i18n/i18n';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {openSettings} from '~/utils';
import EnvConfig from './Env.service';

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

const showLocationDeniedAlert = () => {
  Alert.alert(
    i18n.t('location.locationPermissionDenied'),
    i18n.t('location.turnOnLocationFromSettings'),
    [
      {text: i18n.t('location.goToSettings'), onPress: openSettings},
      {text: i18n.t('common.cancel'), onPress: () => {}},
    ],
  );
};

/**
 * Requests foreground (fine) location only. Google requires foreground
 * location to be granted before background location can be requested, and the
 * two must NOT be requested together. Returns true if fine location is (or
 * becomes) granted.
 */
export const requestForegroundLocationAndroid = async (
  shouldShowDeniedAlert = true,
) => {
  if (+Platform.Version < 23) {
    return true;
  }

  const fineGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (fineGranted) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (
    shouldShowDeniedAlert &&
    (status === PermissionsAndroid.RESULTS.DENIED ||
      status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
  ) {
    showLocationDeniedAlert();
  }

  return false;
};

/**
 * Requests background ("Allow all the time") location. MUST only be called
 * after foreground location is granted AND after the user has accepted the
 * in-app prominent disclosure for background location. On Android 11+ the OS
 * routes the user to Settings to choose "Allow all the time".
 */
export const requestBackgroundLocationAndroid = async (
  shouldShowDeniedAlert = true,
) => {
  if (+Platform.Version < 23) {
    return true;
  }

  const backgroundGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
  if (backgroundGranted) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (
    shouldShowDeniedAlert &&
    (status === PermissionsAndroid.RESULTS.DENIED ||
      status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
  ) {
    showLocationDeniedAlert();
  }

  return false;
};

/**
 * Default Android location request used outside the guided setup flow (e.g.
 * during an active emergency). Only requests foreground location — background
 * location is requested separately and only after the prominent disclosure
 * modal in the setup sheet. Returns true if any location permission
 * (foreground or background) is already available.
 */
const requestPermissionAndroid = async (shouldShowDeniedAlert = true) => {
  if (+Platform.Version < 23) {
    return true;
  }

  const backgroundGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
  if (backgroundGranted) {
    return true;
  }

  return requestForegroundLocationAndroid(shouldShowDeniedAlert);
};

export const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const alwaysStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    const whenInUseStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    return alwaysStatus === RESULTS.GRANTED || whenInUseStatus === RESULTS.GRANTED;
  }

  if (+Platform.Version < 23) {
    return true;
  }

  const backgroundGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
  const fineGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return backgroundGranted || fineGranted;
};

export const requestLocationPermission = async (
  shouldShowPermissionPopup?: boolean,
) => {
  if (Platform.OS === 'ios') {
    return requestPermissionIOS(shouldShowPermissionPopup);
  }
  return requestPermissionAndroid(shouldShowPermissionPopup);
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

export const getGoogleStaticMapUrl = (
  latitude: number,
  longitude: number,
  width = 640,
  height = 280,
) => {
  const key = EnvConfig.GOOGLE_MAPS_API_KEY;

  if (!key) {
    return null;
  }

  return (
    'https://maps.googleapis.com/maps/api/staticmap' +
    `?center=${latitude},${longitude}` +
    '&zoom=15' +
    `&size=${width}x${height}` +
    '&scale=2' +
    '&maptype=roadmap' +
    `&key=${encodeURIComponent(key)}`
  );
};
