import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HomeScreen } from '~/view/screens/Home';

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const HomeStack = createNativeStackNavigator();

export const HomeNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};
