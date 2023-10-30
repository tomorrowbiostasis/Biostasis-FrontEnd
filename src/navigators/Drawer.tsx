import React, {ReactNode} from 'react';
import MainStack from './MainStack';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import DrawerContent from '~/components/DrawerContent';

// import {listenForPushTokenAndUpdate} from '~/services/Push.service';

const DrawerNavigation = createDrawerNavigator();

const Drawer = () => {
  return (
    <DrawerNavigation.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerType: 'slide',
      }}
      drawerContent={
        DrawerContent as (props: DrawerContentComponentProps) => ReactNode
      }>
      <DrawerNavigation.Screen name="Drawer" component={MainStack} />
    </DrawerNavigation.Navigator>
  );
};

export default Drawer;
