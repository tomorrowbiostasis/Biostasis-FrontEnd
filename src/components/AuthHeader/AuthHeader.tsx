import React, {FC} from 'react';
import {Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
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
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.inner}>
        <View style={[styles.topRow, !showBack && styles.topRowEnd]}>
          {showBack && (
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Back">
              <Text style={styles.backGlyph}>{'←'}</Text>
            </Pressable>
          )}
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

export default AuthHeader;
