import {View, Text} from 'native-base';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from '../../styles';
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
import DocumentsHeader from './components/DocumentsHeader';
import DocumentItem, {DocumentTypes} from './components/DocumentItem';
import {regex} from '~/services/Validation.service';
import DocumentPicker from 'react-native-document-picker';
import {getFileType, getUri} from './util';

const Documents = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const documents = useAppSelector(documentsSelector);
  const [lastWill, setLastWill] = useState<IFile | null>(null);
  const [medicalDirective, setMedicalDirective] = useState<IFile | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<IFile[]>([]);
  const [documentIdToDelete, setDocumentIdToDelete] =
    useState<DocumentIdType | null>(null);

  const maxNumberOfOtherDocuments = 5;

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
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <IconIonicons
          name={'documents-outline'}
          size={26}
          style={styles.icon}
        />
        <Text fontSize={'md'} fontWeight={700}>
          {t('emergencyContactsSettings.documents.title')}
        </Text>
      </View>
      <View style={styles.lineStyle} />
      <View style={styles.panelBody}>
        <Text fontSize={'sm'} mb={4}>
          {t('emergencyContactsSettings.documents.topInfo')}
        </Text>
        <View flex={1}>
          <DocumentsHeader
            caption={t('emergencyContactsSettings.documents.headers.directive')}
          />
          <DocumentItem
            id={medicalDirective?.id}
            name={medicalDirective?.name}
            type={DocumentTypes.medicalDirective}
            onAdd={() => handleAddDocument('medicalDirective')}
            onDelete={handleDeleteDocumentClick}
          />
          <DocumentsHeader
            caption={t('emergencyContactsSettings.documents.headers.lastWill')}
          />
          <DocumentItem
            id={lastWill?.id}
            name={lastWill?.name}
            type={DocumentTypes.lastWill}
            onAdd={() => handleAddDocument('lastWill')}
            onDelete={handleDeleteDocumentClick}
          />
          {otherDocuments?.length ? (
            <>
              <DocumentsHeader
                caption={t('emergencyContactsSettings.documents.headers.other')}
              />
              {otherDocuments.map(doc => (
                <DocumentItem
                  key={doc.id}
                  name={doc.name}
                  id={doc.id}
                  onAdd={() => handleAddDocument('other')}
                  onDelete={handleDeleteDocumentClick}
                />
              ))}
            </>
          ) : null}
        </View>
        {!!documentIdToDelete &&
          Alert.alert(
            t('emergencyContactsSettings.documents.alert.title'),
            t('emergencyContactsSettings.documents.alert.description'),
            [
              {
                text: 'No',
              },
              {
                text: 'Yes',
                onPress: () => {
                  setDocumentIdToDelete(null);
                  handleDeleteDocument();
                },
              },
            ],
          )}
      </View>
      <View style={styles.lineStyle} />
      <View style={styles.panelFooter}>
        {!areOtherItemsLimited && (
          <DocumentItem
            onAdd={() => handleAddDocument('other')}
            onDelete={handleDeleteDocumentClick}
          />
        )}
      </View>
    </View>
  );
};

export default Documents;
