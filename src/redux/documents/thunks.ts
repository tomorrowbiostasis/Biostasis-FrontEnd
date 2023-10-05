import {createAsyncThunk} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import API from '~/services/API.service';
import {setDocuments} from './documents.slice';

import {
  DocumentIdType,
  GetDocumentsResponseType,
  IApiSuccessfulResponse,
  IFileToUpload,
} from '~/services/API.types';
import ToastService from '~/services/Toast.service';

const checkIfDocumentUploaded = (
  document: IFileToUpload,
  fetchedDocuments: GetDocumentsResponseType,
): boolean => {
  const {
    file: {filename},
  } = document;
  const listOfCurrentFiles: String[] = [];
  const getFetchedDocNames = (el: any) => {
    if (el.name) {
      listOfCurrentFiles.push(el.name);
      return;
    }
    if (Array.isArray(el)) {
      el.forEach(el => {
        getFetchedDocNames(el.files || el);
      });
    }
  };
  getFetchedDocNames(fetchedDocuments);
  return listOfCurrentFiles.some(el => filename === el);
};

export const uploadDocument = createAsyncThunk(
  'user/uploadDocument',
  async (document: IFileToUpload, thunkApi) => {
    const refetchDocuments = async () => {
      const documents = await API.getDocuments()
        .then(data => data.data)
        .catch(error => {
          ToastService.error(
            i18n.t(
              'emergencyContactsSettings.documents.messages.errors.fetching',
            ),
          );
          return error;
        });

      thunkApi.dispatch(setDocuments(documents));
      const isDocumentUploaded = checkIfDocumentUploaded(document, documents);
      isDocumentUploaded
        ? ToastService.success(
            i18n.t(
              'emergencyContactsSettings.documents.messages.success.upload',
            ),
          )
        : ToastService.error(
            i18n.t(
              'emergencyContactsSettings.documents.messages.errors.fileWrongType',
            ),
          );
    };

    ToastService.success(
      i18n.t('emergencyContactsSettings.documents.messages.uploadStarted'),
    );
    return await API.uploadDocument(document, refetchDocuments);
  },
);

export const getDocuments = createAsyncThunk(
  'user/getDocuments',
  async (): Promise<GetDocumentsResponseType> => {
    return await API.getDocuments()
      .then(data => data.data)
      .catch(error => {
        ToastService.error(
          i18n.t(
            'emergencyContactsSettings.documents.messages.errors.fetching',
          ),
        );
        return error;
      });
  },
);

export const deleteDocument = createAsyncThunk(
  'user/deleteDocument',
  async (id: DocumentIdType, thunkApi): Promise<IApiSuccessfulResponse> => {
    return await API.deleteDocument(id)
      .then(data => {
        thunkApi.dispatch(getDocuments());
        ToastService.success(
          i18n.t('emergencyContactsSettings.documents.messages.success.remove'),
        );
        return data.data;
      })
      .catch(error => {
        ToastService.error(
          i18n.t('emergencyContactsSettings.documents.messages.errors.remove'),
        );
        return error;
      });
  },
);
