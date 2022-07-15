import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {extraReducersBuilder} from '~/redux/documents/extraReducers';
import {GetDocumentsResponseType} from '~/services/API.types';

export type IDocuments = GetDocumentsResponseType;

export interface IDocumentsState {
  pending: boolean | null;
  documents: IDocuments;
}

export const initialState: IDocumentsState = {
  pending: null,
  documents: [],
};

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearPending: (state: IDocumentsState) => {
      state.pending = null;
    },
    setDocuments: (
      state: IDocumentsState,
      {payload}: PayloadAction<IDocumentsState['documents']>,
    ) => {
      state.documents = payload;
    },
  },
  extraReducers: extraReducersBuilder,
});

export const {clearPending, setDocuments} = documentsSlice.actions;

export default documentsSlice.reducer;
