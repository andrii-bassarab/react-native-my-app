import "react-native-gesture-handler";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React from "react";
import { Settings } from "../screens/Settings";
import { MainStack } from "./Main";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NavigationDrawerStructure } from "../components/NavigationDrawerStructure";
import { useAppSelector } from "~/store/hooks";
import { colors } from "../theme";

const Drawer = createDrawerNavigator();

export const HomeNavigator: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const currentUser = useAppSelector((state) => state.user);

  const screenOptions = {
    headerStyle: {
      backgroundColor: currentUser.showSwitchSite ? "#1B2C3C" : colors.layout,
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
