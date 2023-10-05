import React, {FC, useCallback, useMemo} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {Box, Text} from 'native-base';
import DocumentIcon from '~/assets/icons/DocumentIcon';
import {TouchableOpacity} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import colors from '~/theme/colors';

export enum DocumentTypes {
  'medicalDirective',
  'lastWill',
  'other',
}

interface IDocumentItem {
  id?: string;
  name?: string;
  type?: DocumentTypes;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const DocumentItem: FC<IDocumentItem> = ({
  id,
  name,
  type = DocumentTypes.other,
  onDelete,
  onAdd,
}) => {
  const {t} = useAppTranslation();

  const uploadText = useMemo(() => {
    switch (type) {
      case DocumentTypes.medicalDirective: {
        return t('emergencyContactsSettings.documents.upload.directive');
      }
      case DocumentTypes.lastWill: {
        return t('emergencyContactsSettings.documents.upload.lastWill');
      }
      default:
        return t('emergencyContactsSettings.documents.upload.other');
    }
  }, [t, type]);

  const handlePress = useCallback(() => {
    name ? onDelete(id as string) : onAdd();
  }, [id, name, onAdd, onDelete]);

  return (
    <Box flexDirection="row" alignItems="center" mb={4}>
      <Box opacity={name ? 1 : 0.3}>
        <DocumentIcon />
      </Box>
      <Box flex={1} ml={6} opacity={name ? 1 : 0.3}>
        <Text fontSize={'sm'}>{name || uploadText}</Text>
      </Box>
      <TouchableOpacity onPress={handlePress}>
        {name ? (
          <IconEntypo name="trash" size={24} color={colors.red[600]} />
        ) : (
          <IconFeather name="plus" size={24} color={colors.gray[642]} />
        )}
      </TouchableOpacity>
    </Box>
  );
};

export default DocumentItem;
