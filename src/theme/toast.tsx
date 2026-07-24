import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';

import {radius, semanticColors, shadow, spacing, typography} from './tokens';
import {addOpacity} from './utils/colorOpacity';
import {
  AlertTriangleIcon,
  CheckIcon,
  LightbulbIcon,
  XIcon,
} from '~/assets/icons/AppIcons';

type ToastVariant = {
  accent: string;
  Icon: React.ComponentType<{size?: number; color?: string}>;
};

const VARIANTS: Record<'success' | 'error' | 'warning' | 'info', ToastVariant> = {
  success: {
    accent: semanticColors.success,
    Icon: CheckIcon,
  },
  error: {
    accent: semanticColors.danger,
    Icon: XIcon,
  },
  warning: {
    accent: semanticColors.warningStrong,
    Icon: AlertTriangleIcon,
  },
  info: {
    accent: semanticColors.info,
    Icon: LightbulbIcon,
  },
};

interface ToastBodyProps {
  variant: ToastVariant;
  title?: string;
  body?: string;
}

const ToastBody: React.FC<ToastBodyProps> = ({variant, title, body}) => {
  const {accent, Icon} = variant;
  // Never render an empty pill (a real toast always has text). Guards against
  // the toast provider rendering an empty frame during modal mount/unmount.
  if (!title && !body) {
    return null;
  }
  return (
    <Pressable
      onPress={() => Toast.hide()}
      accessibilityRole="button"
      accessibilityLabel="Dismiss notification"
      style={styles.container}>
      <View
        style={[
          styles.iconChip,
          {
            backgroundColor: addOpacity(accent, 14),
            borderColor: addOpacity(accent, 28),
          },
        ]}>
        <Icon size={18} color={semanticColors.textInverse} />
      </View>
      <View style={styles.textCol}>
        {title ? (
          <Text style={styles.title}>
            {title}
          </Text>
        ) : null}
        {body ? (
          <Text style={styles.body}>
            {body}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

export const toastConfig = {
  biostasis_success: ({text1, text2}: {text1?: string; text2?: string}) => (
    <ToastBody variant={VARIANTS.success} title={text1} body={text2} />
  ),
  biostasis_error: ({text1, text2}: {text1?: string; text2?: string}) => (
    <ToastBody variant={VARIANTS.error} title={text1} body={text2} />
  ),
  biostasis_warning: ({text1, text2}: {text1?: string; text2?: string}) => (
    <ToastBody variant={VARIANTS.warning} title={text1} body={text2} />
  ),
  biostasis_info: ({text1, text2}: {text1?: string; text2?: string}) => (
    <ToastBody variant={VARIANTS.info} title={text1} body={text2} />
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: semanticColors.primaryDeep,
    ...shadow.lg,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: 'Poppins-Light',
    fontSize: typography.rowTitle.fontSize,
    fontWeight: '300',
    lineHeight: typography.rowTitle.lineHeight,
    letterSpacing: 0,
    color: semanticColors.textInverse,
  },
  body: {
    fontFamily: 'Poppins-Light',
    fontSize: typography.caption.fontSize,
    fontWeight: '300',
    lineHeight: typography.caption.lineHeight,
    letterSpacing: 0,
    color: addOpacity(semanticColors.textInverse, 72),
  },
});
