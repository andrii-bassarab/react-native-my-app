import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { AuthScreen } from '~/view/screens/Auth';
import { HomeScreen } from '../screens/Home';
import { Inspections } from '../screens/Inspections';

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const BottomTabs = createBottomTabNavigator();

export const MainStack: React.FC = () => {
  return (
    <BottomTabs.Navigator screenOptions={screenOptions} initialRouteName="HomeScreen">
      <BottomTabs.Screen name="HomeScreen" component={HomeScreen} />
      <BottomTabs.Screen name="Inspections" component={Inspections} /> 
    </BottomTabs.Navigator>
  );
};