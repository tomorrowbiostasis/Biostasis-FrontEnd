import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {store} from '~/redux/store/index';
import {logOutUser} from '~/redux/user/thunks';

import {signOut as cognitoSignOut} from '~/services/Amazon.service';
import {stopBackgroundFetch} from '~/services/Background.service';
import {ClearDataTypes} from '~/services/ClearData.types';
import {isAndroid, updateDataCollectionStatus} from '~/utils';

export const clearEncryptedStorage = async () => {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    console.log(error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error);
  }
};

export const clearDataAndSignOut = async (type: ClearDataTypes) => {
  if (type === ClearDataTypes.LOGOUT) {
    Alert.alert(
      i18n.t('signOut.disabledAutomatedEmergencyContinue'),
      i18n.t('signOut.disabledAutomatedEmergency'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.ok'),
          onPress: async () => {
            store.dispatch(logOutUser());
            await signOutCallback();
          },
        },
      ],
    );
  } else {
    await signOutCallback();
  }
};

const signOutCallback = async () => {
  await cognitoSignOut();
  await clearEncryptedStorage();
  await clearStorage();
  isAndroid ? await stopBackgroundFetch() : updateDataCollectionStatus();
};
