import "react-native-gesture-handler";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { DrawerActions, ParamListBase } from "@react-navigation/native";
import DrawerToggleIcon from "../assets/icons/drawerToggle.svg";
import NotificationIcon from '../assets/icons/notification.svg';

interface Props {
  navigationProps: DrawerNavigationProp<ParamListBase>;
}

export const NavigationDrawerStructure: React.FC<Props> = ({
  navigationProps,
}) => {
  const toggleDrawer = () => {
    navigationProps.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "200%",
        marginLeft: 10
      }}
    >
      <TouchableOpacity onPress={toggleDrawer}>
        <DrawerToggleIcon color="#fff" height="20" />
      </TouchableOpacity>
      <TouchableOpacity>
        <NotificationIcon color="#fff" height="25" />
      </TouchableOpacity>
    </View>
  );
};
