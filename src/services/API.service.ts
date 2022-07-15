import axios from 'axios';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

import {getToken} from '~/services/Amazon.service';
import EnvConfig from '~/services/Env.service';
import {timestampToISOWithOffset} from '~/services/TimeSlot.service/LocalToApi';
import NotificationService from './NotificationService';

import i18n from '~/i18n/i18n';
import {IUser} from '~/redux/user/user.slice';
import {
  IEmergencyContact,
  IEmergencyContactResponse,
} from '~/redux/emergencyContacts/emergencyContacts.slice';
import DeviceInfo from 'react-native-device-info';
import {
  DocumentIdType,
  EmergencyMessageType,
  GetDocumentsResponseType,
  IApiPatchTimeSlot,
  IApiPostTimeSlot,
  IAPISuccessfulResponse,
  IApiTimeSlot,
  IFileToUpload,
} from './API.types';

const API_VERSION = {
  V1: '/api/v1',
  V2: '/api/v2',
};

const API_URI = {
  USER: `${API_VERSION.V1}/user`,
  USER_TOKEN: `${API_VERSION.V1}/user/device`,
  EMERGENCY_CONTACTS: `${API_VERSION.V1}/contact`,
  TEST_MESSAGE: `${API_VERSION.V1}/user/message/test`,
  CANCEL_EMERGENCY: `${API_VERSION.V1}/message/cancel/emergency`,
  EMERGENCY_START: `${API_VERSION.V1}/message/send/emergency`,
  POSITIVE_INFO: `${API_VERSION.V1}/user/positive-info`,
  TIME_SLOT: `${API_VERSION.V1}/time-slot`,
  GDPR: `${API_VERSION.V1}/user/export`,
  FILES: `${API_VERSION.V1}/file`,
  LOGOUT: `${API_VERSION.V1}/auth/logout`,
};

const API_URI_V2 = {
  EMERGENCY_CONTACTS: `${API_VERSION.V2}/contact`,
  USER: `${API_VERSION.V2}/user`,
};

const getUrl: (endpoint: string, params?: string) => string = (
  endpoint,
  params,
) => (params ? `${endpoint}${params}` : endpoint);

const callApi = axios.create({
  baseURL: EnvConfig.API_URL,
  headers: {
    'X-Biostasis-App-Version': DeviceInfo.getVersion(),
    'X-Biostasis-Device-OS': Platform.OS,
  },
});

callApi.interceptors.request.use(async config => {
  const currentToken = await getToken();
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

const API = {
  getUser: () => callApi.get<IUser>(getUrl(API_URI.USER)),
  deleteUser: () => callApi.delete(getUrl(API_URI.USER)),
  logOutUser: () => callApi.post(getUrl(API_URI.LOGOUT)),
  updateUser: (data: IUser) =>
    callApi.patch<IUser>(getUrl(API_URI_V2.USER), {
      ...data,
      timezone: timestampToISOWithOffset().slice(-6),
    }),
  updateUserToken: (token: string) =>
    callApi.patch<IAPISuccessfulResponse>(getUrl(API_URI.USER_TOKEN), {
      deviceId: token,
    }),
  getEmergencyContacts: () =>
    callApi.get<IEmergencyContactResponse[]>(
      getUrl(API_URI.EMERGENCY_CONTACTS),
    ),
  addEmergencyContact: (data: IEmergencyContact) =>
    callApi.post<IEmergencyContact>(
      getUrl(API_URI_V2.EMERGENCY_CONTACTS),
      data,
    ),
  updateEmergencyContact: (id: string, data: Partial<IEmergencyContact>) =>
    callApi.patch<IEmergencyContactResponse>(
      getUrl(API_URI_V2.EMERGENCY_CONTACTS, `/${id}`),
      data,
    ),
  deleteEmergencyContact: (id: string) =>
    callApi.delete<IAPISuccessfulResponse>(
      getUrl(API_URI.EMERGENCY_CONTACTS, `/${id}`),
    ),
  sendTestMessage: () =>
    callApi.post<IAPISuccessfulResponse>(getUrl(API_URI.TEST_MESSAGE)),
  startEmergency: (data: {
    delayed?: boolean;
    messageType?: EmergencyMessageType;
  }) =>
    callApi.post<IAPISuccessfulResponse>(
      getUrl(API_URI.EMERGENCY_START),
      data,
      {
        validateStatus: () => true,
      },
    ),
  cancelEmergency: () =>
    callApi.delete<{success: boolean}>(getUrl(API_URI.CANCEL_EMERGENCY)),
  positiveInfo: (minutesToNext: number) =>
    callApi.post<IAPISuccessfulResponse>(
      getUrl(API_URI.POSITIVE_INFO),
      {
        minutesToNext,
      },
      {
        validateStatus: () => true,
      },
    ),

  getTimeSlot: () => callApi.get<IApiTimeSlot[]>(getUrl(API_URI.TIME_SLOT)),
  addTimeSlot: (data: IApiPostTimeSlot) =>
    callApi.post<IAPISuccessfulResponse>(getUrl(API_URI.TIME_SLOT), data),
  updateTimeSlot: (id: IApiTimeSlot['id'], data: IApiPatchTimeSlot) =>
    callApi.patch<IApiTimeSlot>(getUrl(API_URI.TIME_SLOT, `/${id}`), data),
  deleteTimeSlot: (id: IApiTimeSlot['id']) =>
    callApi.delete<IAPISuccessfulResponse>(getUrl(API_URI.TIME_SLOT, `/${id}`)),
  sendGDPR: (email: string) =>
    callApi.post<IAPISuccessfulResponse>(getUrl(API_URI.GDPR), {email}),
  getDocuments: () =>
    callApi.get<GetDocumentsResponseType>(getUrl(API_URI.FILES)),
  deleteDocument: (id: DocumentIdType) =>
    callApi.delete<IAPISuccessfulResponse>(getUrl(API_URI.FILES, `/${id}`)),
  uploadDocument: async (
    {file, category}: IFileToUpload,
    refetchDocuments: () => void,
  ) => {
    const token = await getToken();
    RNFS.uploadFiles({
      toUrl: `${EnvConfig.API_URL}${API_URI.FILES}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      files: [
        {
          ...file,
          name: 'file',
        },
      ],
      fields: {
        category,
      },
      begin: () => {},
      progress: () => {},
    })
      .promise.catch(e => {
        NotificationService.error(
          i18n.t('documents.messages.errors.upload', {error: e}),
        );
      })
      .finally(refetchDocuments);
  },
};

export default API;
