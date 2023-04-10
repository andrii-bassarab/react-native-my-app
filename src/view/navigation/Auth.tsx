import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AuthScreen } from '~/view/screens/Auth';
import { ForgotPassword } from '../screens/ForgotPassword';

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const AuthStack = createNativeStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={screenOptions} initialRouteName='AuthScreen'>
      <AuthStack.Screen name="AuthScreen" component={AuthScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
};
