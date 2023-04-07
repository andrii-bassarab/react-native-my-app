import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, SafeAreaView} from 'react-native';


export const Inspections = ({navigation}: {navigation: DrawerNavigationProp<ParamListBase>}) => {
  const goToHome = React.useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return (
    <SafeAreaView>
      <Text>Inspections Screen</Text>
      <TouchableOpacity onPress={goToHome}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
      <Text>Icon usage:</Text>
    </SafeAreaView>
  );
};