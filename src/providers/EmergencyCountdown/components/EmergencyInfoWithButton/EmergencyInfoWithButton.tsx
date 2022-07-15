import React, {FC} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Box, Text, Button} from 'native-base';
import styles from '../../styles';

interface IEmergencyInfoWithButton {
  title?: string;
  subtitle?: string;
  count?: string;
  buttonCaption: string;
  buttonVariant?: 'link' | 'solid' | 'outline' | 'ghost' | 'unstyled';
  onPressButton: () => void;
  loading?: boolean;
}

const EmergencyInfoWithButton: FC<IEmergencyInfoWithButton> = ({
  title,
  subtitle,
  count,
  buttonCaption,
  buttonVariant,
  onPressButton,
  loading,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Box style={{marginBottom: insets.bottom}} px={12}>
      <Text textAlign="center" fontSize="2xl" style={styles.title}>
        {title}
      </Text>
      <Text textAlign="center" fontSize="xl" style={styles.subtitle}>
        {subtitle}
      </Text>
      <Text
        mt={10}
        mb={32}
        textAlign="center"
        fontSize="6xl"
        style={styles.counter}>
        {count}
      </Text>
      <Button
        disabled={loading}
        variant={buttonVariant}
        style={buttonVariant === 'outline' ? styles.whiteButton : null}
        onPress={onPressButton}>
        {buttonCaption}
      </Button>
    </Box>
  );
};

export default EmergencyInfoWithButton;
