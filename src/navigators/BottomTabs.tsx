import React, {useCallback, useMemo, useState} from 'react';
import {Easing, useWindowDimensions} from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Screens} from '~/models/Navigation.model';
import Dashboard from '~/screens/Dashboard/Dashboard';
import ProfileDefaultScreen from '~/screens/ProfileDefaultScreen';
import BottomTabBar from '~/components/BottomTabBar';
import {semanticColors} from '~/theme/tokens';
import EmergencyConfirmationScreen from '~/screens/EmergencyConfirmationScreen';

const Tab = createBottomTabNavigator();

/** Home + Profile tabs. The center "Activate Emergency" button lives in the custom tab bar. */
const BottomTabs = () => {
  const {width: screenWidth} = useWindowDimensions();
  const [emergencySheetVisible, setEmergencySheetVisible] = useState(false);

  const openEmergencySheet = useCallback(() => {
    setEmergencySheetVisible(true);
  }, []);

  const closeEmergencySheet = useCallback(() => {
    setEmergencySheetVisible(false);
  }, []);

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => (
      <BottomTabBar {...props} onEmergencyPress={openEmergencySheet} />
    ),
    [openEmergencySheet],
  );
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      freezeOnBlur: true,
      sceneStyle: {
        backgroundColor: semanticColors.primary,
        overflow: 'hidden' as const,
      },
      sceneStyleInterpolator: ({current}: {current: {progress: any}}) => ({
        sceneStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [
                  -(screenWidth * 0.28) - 2,
                  0,
                  Math.max(screenWidth, 1) + 2,
                ],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      }),
      transitionSpec: {
        animation: 'timing' as const,
        config: {
          duration: 260,
          easing: Easing.out(Easing.cubic),
        },
      },
    }),
    [screenWidth],
  );

  return (
    <>
      <Tab.Navigator
        detachInactiveScreens
        screenOptions={screenOptions}
        tabBar={renderTabBar}>
        <Tab.Screen name={Screens.Home} component={Dashboard} />
        <Tab.Screen
          name={Screens.ProfileDefault}
          component={ProfileDefaultScreen}
        />
      </Tab.Navigator>
      <EmergencyConfirmationScreen
        visible={emergencySheetVisible}
        onDismiss={closeEmergencySheet}
      />
    </>
  );
};

export default React.memo(BottomTabs);
