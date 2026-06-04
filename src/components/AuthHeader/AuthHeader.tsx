import React, {FC} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from '~/assets/icons/AppIcons';
import AnimatedHeaderSurface from '~/components/AnimatedHeaderSurface';
import styles from './styles';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  showBack?: boolean;
}

const AuthHeader: FC<AuthHeaderProps> = ({
  title,
  subtitle,
  eyebrow = 'BIOSTASIS',
  onBack,
  showBack = true,
}) => {
  const navigation = useNavigation();
  const handleBack = onBack ?? (() => navigation.goBack());

  return (
    <AnimatedHeaderSurface style={styles.container}>
      <View style={styles.inner}>
        <View style={[styles.topRow, !showBack && styles.topRowEnd]}>
          {showBack && (
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Back">
              <ArrowLeftIcon size={20} color="#BFC2C5" />
            </Pressable>
          )}
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </AnimatedHeaderSurface>
  );
};

export default AuthHeader;
