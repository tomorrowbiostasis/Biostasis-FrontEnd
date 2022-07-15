import {createAsyncThunk} from '@reduxjs/toolkit';
import i18n from '~/i18n/i18n';
import API from '~/services/API.service';
import {setDocuments} from './documents.slice';

import {
  DocumentIdType,
  GetDocumentsResponseType,
  IAPISuccessfulResponse,
  IFileToUpload,
} from '~/services/API.types';
import NotificationService from '~/services/NotificationService';

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
          NotificationService.error(
            i18n.t('documents.messages.errors.fetching'),
          );
          return error;
        });

      thunkApi.dispatch(setDocuments(documents));
      const isDocumentUploaded = checkIfDocumentUploaded(document, documents);
      isDocumentUploaded
        ? NotificationService.success(
            i18n.t('documents.messages.success.upload'),
          )
        : NotificationService.error(
            i18n.t('documents.messages.errors.fileWrongType'),
          );
    };

    NotificationService.success(i18n.t('documents.messages.uploadStarted'));
    return await API.uploadDocument(document, refetchDocuments);
  },
);

export const getDocuments = createAsyncThunk(
  'user/getDocuments',
  async (): Promise<GetDocumentsResponseType> => {
    return await API.getDocuments()
      .then(data => data.data)
      .catch(error => {
        NotificationService.error(i18n.t('documents.messages.errors.fetching'));
        return error;
      });
  },
);

export const deleteDocument = createAsyncThunk(
  'user/deleteDocument',
  async (id: DocumentIdType, thunkApi): Promise<IAPISuccessfulResponse> => {
    return await API.deleteDocument(id)
      .then(data => {
        thunkApi.dispatch(getDocuments());
        NotificationService.success(
          i18n.t('documents.messages.success.remove'),
        );
        return data.data;
      })
      .catch(error => {
        NotificationService.error(i18n.t('documents.messages.errors.remove'));
        return error;
      });
  },
);
