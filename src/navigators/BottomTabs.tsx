import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Screens} from '~/models/Navigation.model';
import Dashboard from '~/screens/Dashboard/Dashboard';
import ProfileDefaultScreen from '~/screens/ProfileDefaultScreen';
import BottomTabBar from '~/components/BottomTabBar';

const Tab = createBottomTabNavigator();

/** Home + Profile tabs. The center "Activate Emergency" button lives in the custom tab bar. */
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name={Screens.Home} component={Dashboard} />
      <Tab.Screen name={Screens.ProfileDefault} component={ProfileDefaultScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
