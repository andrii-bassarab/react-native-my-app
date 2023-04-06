import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View, SafeAreaView} from 'react-native';

import ExampleIcon from '~/view/assets/icons/example.svg';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const goToAuth = React.useCallback(() => {
    navigation.navigate('Auth');
  }, [navigation]);

  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={goToAuth}>
        <Text>Go to auth</Text>
      </TouchableOpacity>
      <Text>Icon usage:</Text>
      <ExampleIcon width={50} height={50} color="red" />
    </SafeAreaView>
  );
};
