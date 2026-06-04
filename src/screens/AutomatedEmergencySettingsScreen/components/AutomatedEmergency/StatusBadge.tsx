import React, {FC} from 'react';
import {Text, View} from 'react-native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {semanticColors} from '~/theme/tokens';
import {AlertTriangleIcon, CircleCheckIcon} from '~/assets/icons/AppIcons';
import triggerStyles from './triggerStyles';

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

/** Small on/off pill shown in the trigger panel headers. */
const StatusBadge: FC<StatusBadgeProps> = ({
  active,
  activeLabel,
  inactiveLabel,
}) => {
  const {t} = useAppTranslation();
  const color = active ? semanticColors.success : semanticColors.warningStrong;

  return (
    <View
      style={[
        triggerStyles.badge,
        active ? triggerStyles.badgeOn : triggerStyles.badgeOff,
      ]}>
      {active ? (
        <CircleCheckIcon size={13} color={color} />
      ) : (
        <AlertTriangleIcon size={13} color={color} />
      )}
      <Text style={[triggerStyles.badgeText, {color}]}>
        {active
          ? activeLabel ||
            t('emergencyContactsSettings.automatedEmergencySettings.systemOn')
          : inactiveLabel ||
            t('emergencyContactsSettings.automatedEmergencySettings.systemOff')}
      </Text>
    </View>
  );
};

export default StatusBadge;
