import React, {FC, ReactNode} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from '~/assets/icons/AppIcons';
import {semanticColors} from '~/theme/tokens';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  /** Extra content rendered inside the dark header area, below the title row. */
  children?: ReactNode;
}

/**
 * Shared dark header for redesigned screens. Renders the OS status bar in
 * light content while mounted.
 */
const ScreenHeader: FC<ScreenHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  children,
}) => {
  const navigation = useNavigation();
  const handleBack = onBack ?? (() => navigation.goBack());

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={semanticColors.primary} />
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack ? (
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={12}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back">
              <ArrowLeftIcon size={20} color="#BFC2C5" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.side} />
      </View>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColors.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 34,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 16,
  },
  side: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 1,
    borderColor: '#BFC2C5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    letterSpacing: -0.36,
    color: '#F1F3F6',
  },
});

export default ScreenHeader;
