import React, {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {MapPinIcon} from '~/assets/icons/AppIcons';
import NativeBottomSheet from '~/components/NativeBottomSheet';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {semanticColors} from '~/theme/tokens';

import styles from './styles';

interface ILocationDisclosureModalProps {
  visible: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

/**
 * Prominent in-app disclosure shown BEFORE the OS background-location prompt,
 * as required by Google Play. The caller (setup sheet) requests background
 * location only after the user taps "Allow" here.
 */
const LocationDisclosureModal: FC<ILocationDisclosureModalProps> = ({
  visible,
  onAllow,
  onDismiss,
}) => {
  const {t} = useAppTranslation();

  return (
    <NativeBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      contentStyle={styles.content}>
      <View style={styles.iconWrap}>
        <MapPinIcon size={24} color={semanticColors.primary} />
      </View>
      <Text style={styles.title}>{t('locationDisclosure.title')}</Text>
      <Text style={styles.body}>{t('locationDisclosure.body')}</Text>

      <TouchableOpacity
        style={styles.allowButton}
        activeOpacity={0.85}
        onPress={onAllow}>
        <Text style={styles.allowLabel}>{t('locationDisclosure.allow')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dismissButton}
        activeOpacity={0.7}
        onPress={onDismiss}>
        <Text style={styles.dismissLabel}>
          {t('locationDisclosure.notNow')}
        </Text>
      </TouchableOpacity>
    </NativeBottomSheet>
  );
};

export default LocationDisclosureModal;
