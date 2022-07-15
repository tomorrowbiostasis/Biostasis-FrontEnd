import {Box, Button, Text} from 'native-base';
import React, {FC} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import styles from './styles';

interface IConfirmationPopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationPopup: FC<IConfirmationPopupProps> = ({
  onClose,
  onConfirm,
}) => {
  const {t} = useAppTranslation();
  return (
    <Box style={styles.confirmationPopupWrapper}>
      <Text
        textAlign="center"
        fontSize="lg"
        style={[styles.confirmationPopupLabel, styles.space]}>
        {t('emergencyContacts.confirmationModal.title')}
      </Text>
      <Button
        variant={'outline'}
        style={[styles.space, styles.deleteButton]}
        onPress={onConfirm}>
        {t('common.delete')}
      </Button>

      <Button variant={'solid'} style={styles.space} onPress={onClose}>
        {t('common.cancel')}
      </Button>
    </Box>
  );
};
