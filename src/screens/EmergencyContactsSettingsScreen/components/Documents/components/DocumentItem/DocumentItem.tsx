import React, {FC, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {ChevronRightIcon, FileIcon, TrashIcon} from '~/assets/icons/AppIcons';
import {semanticColors, typography} from '~/theme/tokens';

interface IDocumentItem {
  id?: string;
  name?: string;
  /** Category label shown as the row title (e.g. "Medical directive"). */
  title: string;
  description: string;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

/** Document upload row — tap an empty row to upload, tap the trash to remove. */
const DocumentItem: FC<IDocumentItem> = ({
  id,
  name,
  title,
  description,
  onDelete,
  onAdd,
}) => {
  const {t} = useAppTranslation();

  const handleDelete = useCallback(() => {
    if (id) {
      onDelete(id);
    }
  }, [id, onDelete]);

  const statusLabel = name
    ? t('emergencyContactsSettings.documents.status.uploaded')
    : t('emergencyContactsSettings.documents.status.acceptedFormats');

  const actionLabel = name
    ? t('emergencyContactsSettings.documents.actions.remove')
    : t('emergencyContactsSettings.documents.actions.upload');

  const body = (
    <>
      <View style={styles.headerRow}>
        <View style={styles.docIcon}>
          <FileIcon size={20} color="#E0392C" />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.state} numberOfLines={2}>
            {name
              ? t('emergencyContactsSettings.documents.uploadedFile', {
                  fileName: name,
                })
              : description}
          </Text>
        </View>
        {name ? (
          <TouchableOpacity
            style={styles.iconAction}
            hitSlop={8}
            onPress={handleDelete}>
            <TrashIcon size={16} color={semanticColors.danger} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconAction}>
            <Text style={styles.plus}>+</Text>
          </View>
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.footerRow}>
        <View style={[styles.statusPill, name && styles.statusPillSuccess]}>
          <Text
            style={[styles.statusText, name && styles.statusTextSuccess]}
            numberOfLines={1}>
            {statusLabel}
          </Text>
        </View>
        {name ? (
          <TouchableOpacity
            style={styles.footerAction}
            activeOpacity={0.7}
            onPress={handleDelete}>
            <Text style={styles.footerActionLabel}>{actionLabel}</Text>
            <TrashIcon size={16} color="#3D5470" />
          </TouchableOpacity>
        ) : (
          <View style={styles.footerAction}>
            <Text style={styles.footerActionLabel}>{actionLabel}</Text>
            <ChevronRightIcon size={16} color="#3D5470" />
          </View>
        )}
      </View>
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
    gap: 13,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: '#E2E9F0',
    borderRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FEF0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...typography.rowTitle,
    color: semanticColors.primary,
    fontSize: 16,
    lineHeight: 22,
  },
  state: {
    ...typography.rowDescriptionMedium,
    color: '#53677F',
    lineHeight: 22,
  },
  iconAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F6F9',
    borderWidth: 1,
    borderColor: '#E2E9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    ...typography.buttonLabel,
    fontSize: 20,
    lineHeight: 24,
    color: '#7A94AB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E7EDF4',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusPill: {
    flexShrink: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#EEF3F8',
  },
  statusPillSuccess: {
    backgroundColor: '#DDF5E9',
  },
  statusText: {
    ...typography.captionMedium,
    color: '#53677F',
  },
  statusTextSuccess: {
    color: '#238B5D',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerActionLabel: {
    ...typography.body,
    color: '#21344D',
  },
});

export default DocumentItem;
