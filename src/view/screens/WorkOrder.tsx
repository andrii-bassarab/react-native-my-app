import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, SafeAreaView} from 'react-native';

export const WorkOrder = ({navigation}: {navigation: BottomTabNavigationProp<ParamListBase>}) => {
  return (
    <SafeAreaView>
      <Text>Work Order Screen</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
      <Text>Icon usage:</Text>
    </SafeAreaView>
  );
};