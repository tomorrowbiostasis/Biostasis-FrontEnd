import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, InteractionManager, StyleSheet, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {documentsSelector} from '~/redux/documents/selectors';
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from '~/redux/documents/thunks';
import {
  DocumentIdType,
  IFile,
  UploadFileCategoryType,
} from '~/services/API.types';
import {regex} from '~/services/Validation.service';
import DocumentPicker from 'react-native-document-picker';
import SectionHeader from '../SectionHeader';
import DocumentItem from './components/DocumentItem';
import {getFileType, getUri} from './util';

const MAX_OTHER_DOCUMENTS = 5;

const Documents = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const documents = useAppSelector(documentsSelector);
  const [lastWill, setLastWill] = useState<IFile | null>(null);
  const [medicalDirective, setMedicalDirective] = useState<IFile | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<IFile[]>([]);
  const [documentIdToDelete, setDocumentIdToDelete] =
    useState<DocumentIdType | null>(null);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      dispatch(getDocuments());
    });

    return () => task.cancel();
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

        const filename = (file.name ?? 'document').replace(regex.fileName, '_');
        dispatch(
          uploadDocument({
            file: {
              filename,
              filepath: getUri(file.fileCopyUri ?? ''),
              filetype: file.type || getFileType(filename),
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

  const handleDeleteDocumentClick = useCallback((id: string) => {
    setDocumentIdToDelete(Number.parseInt(id, 10));
  }, []);

  useEffect(() => {
    if (!documentIdToDelete) {
      return;
    }
    Alert.alert(
      t('emergencyContactsSettings.documents.alert.title'),
      t('emergencyContactsSettings.documents.alert.description'),
      [
        {text: 'No', onPress: () => setDocumentIdToDelete(null)},
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteDocument(documentIdToDelete));
            setDocumentIdToDelete(null);
          },
        },
      ],
    );
  }, [documentIdToDelete, dispatch, t]);

  const areOtherItemsLimited = useMemo(
    () => otherDocuments.length >= MAX_OTHER_DOCUMENTS,
    [otherDocuments.length],
  );

  const otherTitle = t('emergencyContactsSettings.documents.headers.other');

  return (
    <View style={styles.section}>
      <SectionHeader
        label={t('emergencyContactsSettings.documents.title')}
        description={t('emergencyContactsSettings.documents.topInfo')}
      />
      <View style={styles.rows}>
        <DocumentItem
          id={medicalDirective?.id}
          name={medicalDirective?.name}
          title={t('emergencyContactsSettings.documents.headers.directive')}
          description={t(
            'emergencyContactsSettings.documents.descriptions.directive',
          )}
          onAdd={() => handleAddDocument('medicalDirective')}
          onDelete={handleDeleteDocumentClick}
        />
        <DocumentItem
          id={lastWill?.id}
          name={lastWill?.name}
          title={t('emergencyContactsSettings.documents.headers.lastWill')}
          description={t(
            'emergencyContactsSettings.documents.descriptions.lastWill',
          )}
          onAdd={() => handleAddDocument('lastWill')}
          onDelete={handleDeleteDocumentClick}
        />
        {otherDocuments.map(doc => (
          <DocumentItem
            key={doc.id}
            id={doc.id}
            name={doc.name}
            title={otherTitle}
            description={t(
              'emergencyContactsSettings.documents.descriptions.other',
            )}
            onAdd={() => handleAddDocument('other')}
            onDelete={handleDeleteDocumentClick}
          />
        ))}
        {!areOtherItemsLimited && (
          <DocumentItem
            title={otherTitle}
            description={t(
              'emergencyContactsSettings.documents.descriptions.other',
            )}
            onAdd={() => handleAddDocument('other')}
            onDelete={handleDeleteDocumentClick}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  rows: {
    gap: 8,
  },
});

export default Documents;
