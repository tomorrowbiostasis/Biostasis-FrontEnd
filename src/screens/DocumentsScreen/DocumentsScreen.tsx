import React, {useCallback, FC, useEffect, useState, useMemo} from 'react';
import {Text, Box, ScrollView} from 'native-base';
import DocumentPicker from 'react-native-document-picker';

import Container from '~/components/Container';
import BottomButton from '~/components/BottomButton';
import DocumentItem, {DocumentTypes} from './components/DocumentItem';
import DocumentsHeader from './components/DocumentsHeader';
import PlusIcon from '~/assets/icons/PlusIcon';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from '~/redux/documents/thunks';
import {documentsSelector} from '~/redux/documents/selectors';
import {getFileType, getUri} from './util';
import {
  DocumentIdType,
  IFile,
  UploadFileCategoryType,
} from '~/services/API.types';
import {ConfirmationPopup} from '../AddNewEmergencyContactScreen/components/ConfirmationPopup/ConfirmationPopup';
import {regex} from '~/services/Validation.service';

const maxNumberOfOtherDocuments = 5;

const DocumentsScreen: FC = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const documents = useAppSelector(documentsSelector);
  const [lastWill, setLastWill] = useState<IFile | null>(null);
  const [medicalDirective, setMedicalDirective] = useState<IFile | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<IFile[]>([]);
  const [documentIdToDelete, setDocumentIdToDelete] =
    useState<DocumentIdType | null>(null);

  useEffect(() => {
    dispatch(getDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (documents?.length) {
      setLastWill(documents.find(i => i.code === 'lastWill')?.files[0] || null);
      setMedicalDirective(
        documents.find(i => i.code === 'medicalDirective')?.files[0] || null,
      );
      setOtherDocuments(documents.find(i => i.code === 'other')?.files || []);
    }
  }, [documents]);

  const handleAddDocument = useCallback(
    async (category: UploadFileCategoryType) => {
      try {
        const file = await DocumentPicker.pickSingle({
          type: [
            DocumentPicker.types.doc,
            DocumentPicker.types.images,
            DocumentPicker.types.docx,
            DocumentPicker.types.pdf,
          ],
          copyTo: 'cachesDirectory',
        });

        dispatch(
          uploadDocument({
            file: {
              filename: file.name.replace(regex.fileName, '_'),
              filepath: getUri(file.fileCopyUri),
              filetype:
                file.type ||
                getFileType(file.name.replace(regex.fileName, '_')),
            },
            category,
          }),
        );
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('cancelled by user');
        } else {
          console.log('error while uploading file', err);
        }
      }
    },
    [dispatch],
  );

  const handleDeleteDocument = useCallback(async () => {
    if (documentIdToDelete) {
      dispatch(deleteDocument(documentIdToDelete));
      setDocumentIdToDelete(null);
    }
  }, [dispatch, documentIdToDelete]);

  const handleDeleteDocumentClick = useCallback((id: string) => {
    setDocumentIdToDelete(Number.parseInt(id, 10));
  }, []);

  const areOtherItemsLimited = useMemo(
    () => otherDocuments.length >= maxNumberOfOtherDocuments,
    [otherDocuments.length],
  );

  return (
    <Container
      type="static"
      title={t('documents.title')}
      contentContainerStyle={styles.contentContainer}>
      <ScrollView style={styles.topContainer}>
        <Text fontSize={'sm'} mb={4} style={styles.topText}>
          {t('documents.topInfo')}
        </Text>
        <Box flex={1}>
          <DocumentsHeader caption={t('documents.headers.directive')} />
          <DocumentItem
            id={medicalDirective?.id}
            name={medicalDirective?.name}
            type={DocumentTypes.medicalDirective}
            onAdd={() => handleAddDocument('medicalDirective')}
            onDelete={handleDeleteDocumentClick}
          />
          <DocumentsHeader caption={t('documents.headers.lastWill')} />
          <DocumentItem
            id={lastWill?.id}
            name={lastWill?.name}
            type={DocumentTypes.lastWill}
            onAdd={() => handleAddDocument('lastWill')}
            onDelete={handleDeleteDocumentClick}
          />
          <DocumentsHeader caption={t('documents.headers.other')} />
          {otherDocuments?.length
            ? otherDocuments.map(doc => (
                <DocumentItem
                  key={doc.id}
                  name={doc.name}
                  id={doc.id}
                  onAdd={() => handleAddDocument('other')}
                  onDelete={handleDeleteDocumentClick}
                />
              ))
            : null}
          {!areOtherItemsLimited && (
            <DocumentItem
              onAdd={() => handleAddDocument('other')}
              onDelete={handleDeleteDocumentClick}
            />
          )}
        </Box>
      </ScrollView>
      <BottomButton
        leftIcon={<PlusIcon />}
        title={t('documents.addDocument')}
        onPress={() => handleAddDocument('other')}
        disabled={areOtherItemsLimited}
        withBottomBorder
      />
      {!!documentIdToDelete && (
        <ConfirmationPopup
          onClose={() => setDocumentIdToDelete(null)}
          onConfirm={handleDeleteDocument}
        />
      )}
    </Container>
  );
};

export default DocumentsScreen;
