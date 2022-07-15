import {AnyAction, configureStore, ThunkDispatch} from '@reduxjs/toolkit';
import userReducer, {IUserState} from '~/redux/user/user.slice';
import configReducer from '~/redux/config/config.slice';
import authReducer, {IAuthState} from '~/redux/auth/auth.slice';
import emergencyContactsReducer, {
  IEmergencyContactsState,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import automatedEmergencyReducer, {
  IAutomatedEmergencyState,
} from '~/redux/automatedEmergency/automatedEmergency.slice';
import gdprReducer from '~/redux/gdpr/gdpr.slice';
import documentsReducer from '~/redux/documents/documents.slice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from 'redux-persist';

import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearEncryptedStorage, clearStorage} from './utils';

let reduxMiddleware: any;
if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  reduxMiddleware = createDebugger();
} else {
  reduxMiddleware = [];
}

const authPersistConfig: PersistConfig<IAuthState> = {
  key: 'auth',
  version: 1,
  storage: EncryptedStorage,
  whitelist: ['accessToken', 'refreshToken'],
};

const authPersistedReducer = persistReducer(authPersistConfig, authReducer);

const userPersistConfig: PersistConfig<IUserState> = {
  key: 'user',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['user'],
};

const userPersistedReducer = persistReducer(userPersistConfig, userReducer);

const automatedEmergencyPersistConfig: PersistConfig<IAutomatedEmergencyState> =
  {
    key: 'automatedEmergency',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['smartDevice', 'pausedDate', 'specificPausedTimes'],
  };

const automatedEmergencyPersistedReducer = persistReducer(
  automatedEmergencyPersistConfig,
  automatedEmergencyReducer,
);

const emergencyContactsPersistConfig: PersistConfig<IEmergencyContactsState> = {
  key: 'emergencyContacts',
  version: 1,
  storage: EncryptedStorage,
  whitelist: ['emergencyContacts'],
};

const emergencyContactsPersistedReducer = persistReducer(
  emergencyContactsPersistConfig,
  emergencyContactsReducer,
);

export const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    config: configReducer,
    auth: authPersistedReducer,
    emergencyContacts: emergencyContactsPersistedReducer,
    automatedEmergency: automatedEmergencyPersistedReducer,
    gdpr: gdprReducer,
    documents: documentsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128,
      },
    }).concat(reduxMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, null, AnyAction>;

export const clearPersistedState = async () => {
  clearEncryptedStorage();
  clearStorage();
};
