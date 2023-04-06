import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Settings } from '../screens/Settings';
import { MainStack } from './Main';

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const Drawer = createDrawerNavigator();

export const HomeNavigator: React.FC = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <Settings {...props} />} screenOptions={{}}>
      <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  );
};
