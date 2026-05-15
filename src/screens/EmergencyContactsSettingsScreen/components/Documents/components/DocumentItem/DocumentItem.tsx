import React, {FC, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {FileIcon, TrashIcon} from '~/assets/icons/AppIcons';
import {semanticColors} from '~/theme/tokens';

interface IDocumentItem {
  id?: string;
  name?: string;
  /** Category label shown as the row title (e.g. "Medical directive"). */
  title: string;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

/** Document upload row — tap an empty row to upload, tap the trash to remove. */
const DocumentItem: FC<IDocumentItem> = ({id, name, title, onDelete, onAdd}) => {
  const {t} = useAppTranslation();

  const handleDelete = useCallback(() => {
    if (id) {
      onDelete(id);
    }
  }, [id, onDelete]);

  const body = (
    <>
      <View style={styles.docIcon}>
        <FileIcon size={16} color="#E0392C" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.state} numberOfLines={1}>
          {name || t('emergencyContactsSettings.documents.tapToUpload')}
        </Text>
      </View>
      {name ? (
        <TouchableOpacity style={styles.action} hitSlop={8} onPress={handleDelete}>
          <TrashIcon size={14} color={semanticColors.danger} />
        </TouchableOpacity>
      ) : (
        <View style={styles.action}>
          <Text style={styles.plus}>+</Text>
        </View>
      )}
    </>
  );

  if (name) {
    return <View style={styles.card}>{body}</View>;
  }

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onAdd}>
      {body}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 8,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 14,
  },
  docIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    color: semanticColors.primary,
  },
  state: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    color: '#3D5470',
  },
  action: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F4F6F9',
    borderWidth: 1,
    borderColor: '#E2E9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    lineHeight: 20,
    color: '#7A94AB',
  },
});

export default DocumentItem;
