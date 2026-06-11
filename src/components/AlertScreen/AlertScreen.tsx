import React, {FC, ReactNode} from 'react';
import {StatusBar, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Spinner} from 'native-base';

import IconChip from '~/components/IconChip';
import {layout, semanticColors, spacing} from '~/theme/tokens';
import styles from './styles';

export type AlertTone = 'critical' | 'warning' | 'info';

type FigmaButtonVariant = 'figmaPrimary' | 'figmaSecondary' | 'figmaEmergency';

export interface AlertScreenAction {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: FigmaButtonVariant;
}

interface AlertScreenProps {
  tone: AlertTone;
  icon: ReactNode;
  title: string;
  description: string;
  headline?: string;
  primary: AlertScreenAction;
  secondary?: AlertScreenAction;
  showStatusBar?: boolean;
  testID?: string;
}

const toneChipBg: Record<AlertTone, string> = {
  critical: semanticColors.dangerSurface,
  warning: semanticColors.warningSurface,
  info: semanticColors.infoSurface,
};

const toneDefaultPrimaryVariant: Record<AlertTone, FigmaButtonVariant> = {
  critical: 'figmaEmergency',
  warning: 'figmaPrimary',
  info: 'figmaPrimary',
};

const AlertScreen: FC<AlertScreenProps> = ({
  tone,
  icon,
  title,
  description,
  headline,
  primary,
  secondary,
  showStatusBar = true,
  testID,
}) => {
  const primaryVariant = primary.variant ?? toneDefaultPrimaryVariant[tone];
  const secondaryVariant = secondary?.variant ?? 'figmaSecondary';

  return (
    <View style={styles.root} testID={testID}>
      {showStatusBar ? (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={semanticColors.surfaceCanvas}
        />
      ) : null}
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          <IconChip
            background={toneChipBg[tone]}
            size={96}
            radius={28}
            style={styles.chip}>
            {icon}
          </IconChip>
          <Text style={styles.title}>{title}</Text>
          {headline ? <Text style={styles.headline}>{headline}</Text> : null}
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            variant={primaryVariant as never}
            isLoading={primary.isLoading}
            isDisabled={primary.isDisabled}
            spinner={<Spinner color="white" size="small" />}
            onPress={primary.onPress}
            justifyContent="center"
            style={{height: layout.ctaHeight}}>
            {primary.label}
          </Button>
          {secondary ? (
            <View style={{marginTop: spacing.md}}>
              <Button
                variant={secondaryVariant as never}
                isLoading={secondary.isLoading}
                isDisabled={secondary.isDisabled}
                spinner={
                  <Spinner
                    color={
                      secondaryVariant === 'figmaSecondary'
                        ? semanticColors.primary
                        : 'white'
                    }
                    size="small"
                  />
                }
                onPress={secondary.onPress}
                justifyContent="center"
                style={{height: layout.ctaHeight}}>
                {secondary.label}
              </Button>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AlertScreen;
