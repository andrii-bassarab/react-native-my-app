import 'react-native-gesture-handler';
import { DrawerNavigationProp, createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Settings } from "../screens/Settings";
import { MainStack } from "./Main";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NavigationDrawerStructure } from '../components/NavigationDrawerStructure';

const Drawer = createDrawerNavigator();

export const HomeNavigator: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const screenOptions = {
    headerStyle: {
      backgroundColor: "#2C4660",
      borderColor: 'green',
    },
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerTitle: () => null,
    headerShadowVisible: false,
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Settings {...props} />}
      screenOptions={screenOptions}
    >
      <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  );
};
