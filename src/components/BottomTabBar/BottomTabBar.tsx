import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  BioHomeNavBarEmergencyButton,
  BioHomeNavBarHome,
  BioHomeNavBarHomeActive,
  BioHomeNavBarUser,
  BioHomeNavBarUserProfile,
} from '~/assets/icons/BiostasisIcons';
import {Screens} from '~/models/Navigation.model';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {semanticColors} from '~/theme/tokens';
import {useAppSelector} from '~/redux/store/hooks';
import {selectContactsInfo} from '~/redux/emergencyContacts/selectors';
import {
  automatedEmergencySettingsSelector,
  userSelector,
} from '~/redux/user/selectors';

const ACTIVE = semanticColors.primary;
const INACTIVE = '#999999';
const BUBBLE_WIDTH = 62;
const BUBBLE_HEIGHT = 38;
const BUBBLE_TOP = 10;
const EMERGENCY_BUTTON_SIZE = 66;
const EMERGENCY_BUTTON_OFFSET_Y = -26;
const EMERGENCY_INNER_BUTTON_SIZE = 46;
const EMERGENCY_PLUS_SIZE = 20;
const EMERGENCY_PLUS_STROKE = 3;

type TabLayout = {
  x: number;
  width: number;
};

type EmergencyCenterButtonProps = {
  navigation: BottomTabBarProps['navigation'];
  onEmergencyPress?: () => void;
};

const EmergencyCenterButton: FC<EmergencyCenterButtonProps> = React.memo(
  ({navigation, onEmergencyPress}) => {
    const {t} = useAppTranslation();
    const {user} = useAppSelector(userSelector);
    const {hasContacts, areContactsEnabled} =
      useAppSelector(selectContactsInfo);
    const {automatedEmergency} = useAppSelector(
      automatedEmergencySettingsSelector,
    );

    const emergencyReadiness = useMemo(() => {
      const contactsReady = hasContacts && areContactsEnabled;
      const systemOn = !!automatedEmergency;
      const timeActive = systemOn && user.regularPushNotification === true;
      const bioActive = systemOn && user.regularPushNotification === false;
      const monitoringActive = timeActive || bioActive;

      return {
        ready: contactsReady && monitoringActive,
        missingReason: !contactsReady
          ? ('contacts' as const)
          : !monitoringActive
          ? ('monitoring' as const)
          : undefined,
      };
    }, [
      areContactsEnabled,
      automatedEmergency,
      hasContacts,
      user.regularPushNotification,
    ]);
    const emergencyReady = emergencyReadiness.ready;

    const handleActivate = useCallback(() => {
      if (emergencyReady) {
        onEmergencyPress?.();
        return;
      }

      // Go straight to the screen that closes the gap. This used to drop a
      // banner on Home instead, which was near-invisible when the user was
      // already on Home and at the top of the scroll — the button read as
      // unresponsive. Mirrors the Dashboard's own readiness routing.
      navigation.navigate(
        (emergencyReadiness.missingReason === 'monitoring'
          ? Screens.AutomatedEmergencySettings
          : Screens.EmergencyContactSettings) as never,
      );
    }, [
      emergencyReadiness.missingReason,
      emergencyReady,
      navigation,
      onEmergencyPress,
    ]);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleActivate}
        style={styles.tab}
        accessibilityRole="button"
        accessibilityLabel={
          emergencyReady
            ? t('bottomTab.activateA11y')
            : t('bottomTab.setupRequiredA11y')
        }>
        <View style={styles.iconSlot}>
          <Animated.View
            style={[
              styles.halo,
              emergencyReady ? styles.haloReady : styles.haloInactive,
              {
                transform: [
                  {translateY: EMERGENCY_BUTTON_OFFSET_Y},
                  {scale: 1},
                ],
              },
            ]}>
            {emergencyReady ? (
              <BioHomeNavBarEmergencyButton size={EMERGENCY_BUTTON_SIZE} />
            ) : (
              <View style={styles.inactiveEmergencyIcon}>
                <View style={styles.inactiveEmergencyCircle}>
                  <View style={styles.inactiveEmergencyPlus}>
                    <View style={styles.plusHorizontal} />
                    <View style={styles.plusVertical} />
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
        <View style={styles.labelSlot}>
          <Text
            style={[
              styles.tabLabel,
              styles.centerLabel,
              !emergencyReady && styles.centerLabelInactive,
            ]}
            numberOfLines={1}>
            {emergencyReady
              ? t('bottomTab.emergency')
              : t('bottomTab.setupRequired')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

/** Custom bottom tab bar — Home / Activate Emergency (center) / Profile. */
type AppBottomTabBarProps = BottomTabBarProps & {
  onEmergencyPress?: () => void;
};

const BottomTabBar: FC<AppBottomTabBarProps> = ({
  state,
  navigation,
  onEmergencyPress,
}) => {
  const insets = useSafeAreaInsets();
  const {t} = useAppTranslation();
  const [tabLayouts, setTabLayouts] = useState<Record<string, TabLayout>>({});
  const bubbleX = useRef(new Animated.Value(0)).current;
  const bubbleScaleX = useRef(new Animated.Value(1)).current;
  const bubbleScaleY = useRef(new Animated.Value(1)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const bubbleAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const currentBubble = useRef({
    x: 0,
    initialized: false,
  });

  const labels = useMemo<Record<string, string>>(
    () => ({
      [Screens.Home]: t('bottomTab.home'),
      [Screens.ProfileDefault]: t('bottomTab.profile'),
    }),
    [t],
  );

  useEffect(
    () => () => {
      bubbleAnimation.current?.stop();
    },
    [],
  );

  const activeRoute = state.routes[state.index];
  const activeLayout = activeRoute ? tabLayouts[activeRoute.key] : undefined;

  const handleTabLayout = useCallback(
    (routeKey: string) => (event: LayoutChangeEvent) => {
      const {x, width} = event.nativeEvent.layout;

      setTabLayouts(current => {
        const previous = current[routeKey];
        if (
          previous &&
          Math.abs(previous.x - x) < 0.5 &&
          Math.abs(previous.width - width) < 0.5
        ) {
          return current;
        }

        return {
          ...current,
          [routeKey]: {x, width},
        };
      });
    },
    [],
  );

  useEffect(() => {
    if (!activeLayout) {
      return;
    }

    const targetX = activeLayout.x + (activeLayout.width - BUBBLE_WIDTH) / 2;
    if (!currentBubble.current.initialized) {
      currentBubble.current = {
        x: targetX,
        initialized: true,
      };
      bubbleX.setValue(targetX);
      bubbleScaleX.setValue(1);
      bubbleScaleY.setValue(1);
      bubbleOpacity.setValue(1);
      return;
    }

    bubbleAnimation.current?.stop();

    bubbleX.stopAnimation(currentX => {
      const distance = Math.abs(targetX - currentX);
      const direction = targetX >= currentX ? 1 : -1;
      const stretchScale = Math.min(
        1.62,
        1 + Math.max(0.14, distance / BUBBLE_WIDTH) * 0.26,
      );
      const launchVelocity =
        direction * Math.min(7.2, Math.max(2.4, distance / 18));

      currentBubble.current = {
        x: currentX,
        initialized: true,
      };

      bubbleX.setValue(currentX);
      bubbleScaleX.setValue(stretchScale);
      bubbleScaleY.setValue(0.93);
      bubbleOpacity.setValue(1);

      bubbleAnimation.current = Animated.parallel([
        Animated.spring(bubbleX, {
          toValue: targetX,
          velocity: launchVelocity,
          stiffness: 240,
          damping: 18,
          mass: 0.82,
          overshootClamping: false,
          restDisplacementThreshold: 0.2,
          restSpeedThreshold: 0.2,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleScaleX, {
          toValue: 1,
          stiffness: 255,
          damping: 17,
          mass: 0.72,
          overshootClamping: false,
          restDisplacementThreshold: 0.002,
          restSpeedThreshold: 0.002,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleScaleY, {
          toValue: 1,
          stiffness: 250,
          damping: 20,
          mass: 0.76,
          overshootClamping: false,
          restDisplacementThreshold: 0.002,
          restSpeedThreshold: 0.002,
          useNativeDriver: true,
        }),
      ]);

      bubbleAnimation.current.start(({finished}) => {
        if (!finished) {
          return;
        }

        currentBubble.current = {
          x: targetX,
          initialized: true,
        };
      });
    });
  }, [activeLayout, bubbleOpacity, bubbleScaleX, bubbleScaleY, bubbleX]);

  const renderRouteTab = (
    route: BottomTabBarProps['state']['routes'][number],
  ) => {
    const routeIndex = state.routes.findIndex(item => item.key === route.key);
    const focused = state.index === routeIndex;
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
        onLayout={handleTabLayout(route.key)}
        style={styles.tab}>
        <View style={styles.iconSlot}>
          <View style={styles.iconPill}>
            {route.name === Screens.ProfileDefault ? (
              focused ? (
                <BioHomeNavBarUserProfile />
              ) : (
                <BioHomeNavBarUser />
              )
            ) : focused ? (
              <BioHomeNavBarHome />
            ) : (
              <BioHomeNavBarHomeActive />
            )}
          </View>
        </View>
        <View style={styles.labelSlot}>
          <Text style={[styles.tabLabel, {color}]} numberOfLines={1}>
            {labels[route.name] ?? route.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const homeRoute = state.routes.find(route => route.name === Screens.Home);
  const profileRoute = state.routes.find(
    route => route.name === Screens.ProfileDefault,
  );

  return (
    <View style={[styles.wrapper, {paddingBottom: insets.bottom}]}>
      <View style={styles.bar}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeBubble,
            {
              opacity: bubbleOpacity,
              transform: [
                {translateX: bubbleX},
                {scaleX: bubbleScaleX},
                {scaleY: bubbleScaleY},
              ],
            },
          ]}
        />
        {homeRoute ? renderRouteTab(homeRoute) : <View style={styles.tab} />}

        <EmergencyCenterButton
          navigation={navigation}
          onEmergencyPress={onEmergencyPress}
        />

        {profileRoute ? (
          renderRouteTab(profileRoute)
        ) : (
          <View style={styles.tab} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    overflow: 'visible',
  },
  bar: {
    flexDirection: 'row',
    height: 78,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(11, 31, 58, 0.1)',
    backgroundColor: '#FFFFFF',
    overflow: 'visible',
  },
  activeBubble: {
    position: 'absolute',
    top: BUBBLE_TOP,
    left: 0,
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT,
    borderRadius: BUBBLE_HEIGHT / 2,
    backgroundColor: 'rgba(11, 31, 58, 0.08)',
    shadowColor: semanticColors.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    zIndex: 1,
    overflow: 'visible',
  },
  iconSlot: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'visible',
  },
  iconPill: {
    width: 44,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelSlot: {
    height: 20,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tabLabel: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
  },
  halo: {
    width: EMERGENCY_BUTTON_SIZE,
    height: EMERGENCY_BUTTON_SIZE,
    borderRadius: EMERGENCY_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D6455D',
    shadowOffset: {width: 0, height: 8},
    shadowRadius: 18,
  },
  haloReady: {
    backgroundColor: 'rgba(214, 69, 93, 0.2)',
    shadowOpacity: 0.18,
  },
  haloInactive: {
    backgroundColor: 'rgba(107, 122, 142, 0.16)',
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
  inactiveEmergencyIcon: {
    width: EMERGENCY_BUTTON_SIZE,
    height: EMERGENCY_BUTTON_SIZE,
    borderRadius: EMERGENCY_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(107, 122, 142, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveEmergencyCircle: {
    width: EMERGENCY_INNER_BUTTON_SIZE,
    height: EMERGENCY_INNER_BUTTON_SIZE,
    borderRadius: EMERGENCY_INNER_BUTTON_SIZE / 2,
    backgroundColor: '#A7B0BC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveEmergencyPlus: {
    width: EMERGENCY_PLUS_SIZE,
    height: EMERGENCY_PLUS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: EMERGENCY_PLUS_SIZE,
    height: EMERGENCY_PLUS_STROKE,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  plusVertical: {
    position: 'absolute',
    width: EMERGENCY_PLUS_STROKE,
    height: EMERGENCY_PLUS_SIZE,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  centerLabel: {
    color: '#484C52',
  },
  centerLabelInactive: {
    color: '#6B7A8E',
  },
});

export default React.memo(BottomTabBar);
