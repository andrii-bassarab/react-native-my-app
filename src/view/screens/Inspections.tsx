import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, SafeAreaView} from 'react-native';

export const Inspections = ({navigation}: {navigation: any}) => {
  // const navigation = useNavigation();

  const goToHome = React.useCallback(() => {
    navigation.navigate('HomeScreen');
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