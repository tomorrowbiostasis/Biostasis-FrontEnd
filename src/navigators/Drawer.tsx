import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import React, {ReactNode, useEffect} from 'react';
import {Screens} from '~/models/Navigation.model';
import {listenForPushTokenAndUpdate} from '~/services/Push.service';
import MainStack from './MainStack';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import DrawerContent from '~/components/DrawerContent';

const DrawerNavigation = createDrawerNavigator();

const Drawer = () => {
  const {type, isConnected} = useNetInfo();
  const navigation = useNavigation();
  useEffect(() => {
    listenForPushTokenAndUpdate();
  }, []);

  useEffect(() => {
    if (type !== 'unknown') {
      !isConnected && navigation.navigate(Screens.LostConnection as never);
    }
  }, [navigation, type, isConnected]);
  return (
    <DrawerNavigation.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerType: 'front',
      }}
      drawerContent={
        DrawerContent as (props: DrawerContentComponentProps) => ReactNode
      }>
      <DrawerNavigation.Screen name="Drawer" component={MainStack} />
    </DrawerNavigation.Navigator>
  );
};

export default Drawer;
