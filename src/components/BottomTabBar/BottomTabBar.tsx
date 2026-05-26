import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {HomeIcon, UserIcon} from '~/assets/icons/AppIcons';
import PlusIcon from '~/assets/icons/PlusIcon';
import {Screens} from '~/models/Navigation.model';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {semanticColors} from '~/theme/tokens';

const ACTIVE = semanticColors.primary;
const INACTIVE = '#999999';

const ICONS: Record<string, typeof HomeIcon> = {
  [Screens.Home]: HomeIcon,
  [Screens.ProfileDefault]: UserIcon,
};

/** Custom bottom tab bar — Home / Activate Emergency (center) / Profile. */
const BottomTabBar: FC<BottomTabBarProps> = ({state, navigation}) => {
  const insets = useSafeAreaInsets();
  const {t} = useAppTranslation();

  const labels: Record<string, string> = {
    [Screens.Home]: t('bottomTab.home'),
    [Screens.ProfileDefault]: t('bottomTab.profile'),
  };

  const handleActivate = () => {
    navigation.navigate(Screens.EmergencyConfirmation as never);
  };

  return (
    <View style={[styles.wrapper, {paddingBottom: insets.bottom}]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const Icon = ICONS[route.name] ?? HomeIcon;
          const color = focused ? ACTIVE : INACTIVE;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? {selected: true} : {}}
              onPress={onPress}
              style={styles.tab}>
              <Icon size={24} color={color} />
              <Text style={[styles.tabLabel, {color}]}>
                {labels[route.name] ?? route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleActivate}
        style={[styles.centerButton, {bottom: insets.bottom + 5}]}
        accessibilityRole="button"
        accessibilityLabel={t('bottomTab.activateA11y')}>
        <View style={styles.halo}>
          <View style={styles.circle}>
            <PlusIcon width={14} height={14} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.centerLabel}>
          {t('bottomTab.activate')}
          {'\n'}
          {t('bottomTab.emergency')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
  },
  bar: {
    flexDirection: 'row',
    height: 64,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(11, 31, 58, 0.1)',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontFamily: 'DMSans-Medium',
    fontSize: 12,
  },
  centerButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    width: 90,
  },
  halo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(214, 69, 93, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D6455D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    marginTop: 2,
    fontFamily: 'DMSans-Bold',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    color: '#484C52',
  },
});

export default BottomTabBar;
