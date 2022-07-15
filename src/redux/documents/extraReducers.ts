import {ActionReducerMapBuilder, PayloadAction} from '@reduxjs/toolkit';
import {IDocuments, IDocumentsState} from './documents.slice';
import {deleteDocument, getDocuments, uploadDocument} from './thunks';

const pendingGetDocuments = (state: IDocumentsState) => {
  state.pending = true;
};

const fulfilledGetDocuments = (
  state: IDocumentsState,
  {payload}: PayloadAction<IDocuments>,
) => {
  state.pending = false;
  state.documents = payload;
};

const rejectedGetDocuments = (state: IDocumentsState) => {
  state.pending = false;
};

const pendingSaveDocument = (state: IDocumentsState) => {
  state.pending = true;
};

const fulfilledSaveDocument = (state: IDocumentsState) => {
  state.pending = false;
};

const rejectedSaveDocument = (state: IDocumentsState) => {
  state.pending = false;
};

const pendingDeleteDocument = (state: IDocumentsState) => {
  state.pending = true;
};

const fulfilledDeleteDocument = (state: IDocumentsState) => {
  state.pending = false;
};

const rejectedDeleteDocument = (state: IDocumentsState) => {
  state.pending = false;
};

export const extraReducersBuilder = (
  builder: ActionReducerMapBuilder<IDocumentsState>,
) => {
  builder.addCase(getDocuments.pending, pendingGetDocuments);
  builder.addCase(getDocuments.fulfilled, fulfilledGetDocuments);
  builder.addCase(getDocuments.rejected, rejectedGetDocuments);

  builder.addCase(uploadDocument.pending, pendingSaveDocument);
  builder.addCase(uploadDocument.fulfilled, fulfilledSaveDocument);
  builder.addCase(uploadDocument.rejected, rejectedSaveDocument);

  builder.addCase(deleteDocument.pending, pendingDeleteDocument);
  builder.addCase(deleteDocument.fulfilled, fulfilledDeleteDocument);
  builder.addCase(deleteDocument.rejected, rejectedDeleteDocument);
};

export default extraReducersBuilder;
