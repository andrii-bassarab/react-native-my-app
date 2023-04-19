import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { InspectionItem } from '../screens/InspectionItem';
import { Inspections } from '../screens/Inspections';

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const InspectionStack = createNativeStackNavigator();

export const InspectionNavigation: React.FC = () => {
  return (
    <InspectionStack.Navigator screenOptions={screenOptions} initialRouteName='Inspections'>
      <InspectionStack.Screen name="Inspections" component={Inspections} />
      <InspectionStack.Screen name="InspectionItem" component={InspectionItem} />
    </InspectionStack.Navigator>
  );
};