import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';

import {semanticColors, shadow} from './tokens';
import {
  AlertTriangleIcon,
  CheckIcon,
  XIcon,
} from '~/assets/icons/AppIcons';

type ToastVariant = {
  bg: string;
  accent: string;
  Icon: React.ComponentType<{size?: number; color?: string}>;
};

const VARIANTS: Record<'success' | 'error' | 'warning', ToastVariant> = {
  success: {
    bg: semanticColors.successSurface,
    accent: semanticColors.success,
    Icon: CheckIcon,
  },
  error: {
    bg: semanticColors.dangerSurface,
    accent: semanticColors.danger,
    Icon: XIcon,
  },
  warning: {
    bg: semanticColors.warningSurface,
    accent: semanticColors.warningStrong,
    Icon: AlertTriangleIcon,
  },
};

interface ToastBodyProps {
  variant: ToastVariant;
  title?: string;
  body?: string;
}

const ToastBody: React.FC<ToastBodyProps> = ({variant, title, body}) => {
  const {bg, accent, Icon} = variant;
  return (
    <Pressable
      onPress={() => Toast.hide()}
      accessibilityRole="button"
      accessibilityLabel="Dismiss notification"
      style={[styles.container, {backgroundColor: bg}]}>
      <View style={[styles.accentBar, {backgroundColor: accent}]} />
      <View style={styles.iconChip}>
        <Icon size={20} color={accent} />
      </View>
      <View style={styles.textCol}>
        {title ? (
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        ) : null}
        {body ? (
          <Text style={styles.body} numberOfLines={4}>
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
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    ...shadow.md,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: semanticColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    color: semanticColors.textPrimary,
  },
  body: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: semanticColors.textSecondary,
  },
});
