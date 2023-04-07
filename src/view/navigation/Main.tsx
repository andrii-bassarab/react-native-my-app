import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { HomeScreen } from '../screens/Home';
import { Inspections } from '../screens/Inspections';
import { BottomTabBar } from '../components/BottomTabBar';
import { WorkOrder } from '../screens/WorkOrder';

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const BottomTabs = createBottomTabNavigator();

export const MainStack: React.FC = () => {
  return (
    <BottomTabs.Navigator screenOptions={screenOptions} initialRouteName="HomeScreen" tabBar={(props) => <BottomTabBar {...props} />}>
      <BottomTabs.Screen name="HomeScreen" component={HomeScreen} options={{tabBarLabel: 'Home'}} />
      <BottomTabs.Screen name="Inspections" component={Inspections} /> 
      <BottomTabs.Screen name="WorkOrder" component={WorkOrder} options={{tabBarLabel: 'Work Orders'}}/> 
    </BottomTabs.Navigator>
  );
};