import {RootState} from '../store';
import {IDocuments} from './documents.slice';

export const documentsSelector = (state: RootState): IDocuments => {
  return state.documents.documents;
};
