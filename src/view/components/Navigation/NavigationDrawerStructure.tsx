import "react-native-gesture-handler";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { DrawerActions, ParamListBase } from "@react-navigation/native";
import DrawerToggleIcon from "../../assets/icons/drawerToggle.svg";
import NotificationIcon from "../../assets/icons/notification.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setShowNotification, setShowSwitchSite } from "~/modules/user/actions";

interface Props {
  navigationProps: DrawerNavigationProp<ParamListBase>;
}

export const NavigationDrawerStructure: React.FC<Props> = ({
  navigationProps,
}) => {
  const dispatch = useAppDispatch();
  const toggleDrawer = () => {
    dispatch(setShowSwitchSite(false));
    navigationProps.dispatch(DrawerActions.openDrawer());
  };
  const toggleNotifications = () => {
    navigationProps.navigate("HomeScreen");
    dispatch(setShowSwitchSite(false));
    dispatch(setShowNotification(!currentUser.showNotification));
  };
  const currentUser = useAppSelector((state) => state.user);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "200%",
        marginLeft: 10,
      }}
    >
      <TouchableOpacity
        onPress={toggleDrawer}
        disabled={
          !currentUser.selectedSite && currentUser.availableSites?.length > 1
        }
      >
        <DrawerToggleIcon color="#fff" height="20" />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={
          !currentUser.selectedSite && currentUser.availableSites?.length > 1
        }
        onPress={toggleNotifications}
      >
        <NotificationIcon color="#fff" height="25" />
      </TouchableOpacity>
    </View>
  );
};
