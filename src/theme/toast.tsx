import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';

import {semanticColors, shadow} from './tokens';
import {
  AlertTriangleIcon,
  CheckIcon,
  LightbulbIcon,
  XIcon,
} from '~/assets/icons/AppIcons';

type ToastVariant = {
  bg: string;
  accent: string;
  border: string;
  Icon: React.ComponentType<{size?: number; color?: string}>;
};

const VARIANTS: Record<'success' | 'error' | 'warning' | 'info', ToastVariant> = {
  success: {
    bg: '#F4FBF8',
    accent: semanticColors.success,
    border: 'rgba(30, 155, 107, 0.18)',
    Icon: CheckIcon,
  },
  error: {
    bg: '#FFF7F7',
    accent: semanticColors.danger,
    border: 'rgba(229, 55, 58, 0.18)',
    Icon: XIcon,
  },
  warning: {
    bg: '#FFFBF4',
    accent: semanticColors.warningStrong,
    border: 'rgba(212, 130, 10, 0.18)',
    Icon: AlertTriangleIcon,
  },
  info: {
    bg: '#F6F9FD',
    accent: semanticColors.info,
    border: 'rgba(45, 107, 228, 0.16)',
    Icon: LightbulbIcon,
  },
};

interface ToastBodyProps {
  variant: ToastVariant;
  title?: string;
  body?: string;
}

const ToastBody: React.FC<ToastBodyProps> = ({variant, title, body}) => {
  const {bg, accent, border, Icon} = variant;
  return (
    <Pressable
      onPress={() => Toast.hide()}
      accessibilityRole="button"
      accessibilityLabel="Dismiss notification"
      style={[styles.container, {backgroundColor: bg, borderColor: border}]}>
      <View style={[styles.accentBar, {backgroundColor: accent}]} />
      <View style={styles.iconChip}>
        <Icon size={20} color={accent} />
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
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
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
