import {Button, Text, View} from 'native-base';
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
    <View style={styles.confirmationPopupWrapper}>
      <Text
        textAlign="center"
        fontSize="lg"
        style={[styles.confirmationPopupLabel, styles.space]}
      >
        {t('emergencyContactsSettings.confirmationModal.title')}
      </Text>
      <Button style={[styles.space, styles.deleteButton]} onPress={onConfirm}>
        {t('common.delete')}
      </Button>

      <Button style={styles.space} onPress={onClose}>
        {t('common.cancel')}
      </Button>
    </View>
  );
};
