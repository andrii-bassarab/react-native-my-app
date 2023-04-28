import "react-native-gesture-handler";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React from "react";
import { Settings } from "../screens/Settings";
import { MainStack } from "./Main";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NavigationDrawerStructure } from "../components/Navigation/NavigationDrawerStructure";
import { colors } from "../theme";

const Drawer = createDrawerNavigator();

export const HomeNavigation: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.layout,
    },
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerTitle: () => null,
    headerShadowVisible: false,
    drawerType: "front",
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Settings {...props} />}
      screenOptions={{ ...screenOptions, drawerType: "front" }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  );
};
