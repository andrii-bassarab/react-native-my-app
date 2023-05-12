import "react-native-gesture-handler";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View, Text, Animated, StyleSheet, Easing, Platform } from "react-native";
import { DrawerActions, ParamListBase } from "@react-navigation/native";
import DrawerToggleIcon from "../../assets/icons/drawerToggle.svg";
import NotificationIcon from "../../assets/icons/notification.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useQuery } from "@apollo/client";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import SyncIcon from "~/view/assets/icons/sync.svg";
import { colors } from "~/view/theme";
import { actionsShowWindow } from "~/modules/showWindow";

interface Props {
  navigationProps: DrawerNavigationProp<ParamListBase>;
}

export const NavigationDrawerStructure: React.FC<Props> = ({ navigationProps }) => {
  const dispatch = useAppDispatch();

  const { inspectionsSync } = useAppSelector((state) => state.inspections);
  const showWindow = useAppSelector((state) => state.showWindow);
  const { unreadMessage } = useAppSelector((state) => state.notifications);

  const toggleDrawer = () => {
    dispatch(actionsShowWindow.setShowSwitchSite(false));
    navigationProps.dispatch(DrawerActions.openDrawer());
  };

  const toggleNotifications = () => {
    navigationProps.navigate("HomeScreen");
    dispatch(actionsShowWindow.setShowSwitchSite(false));
    dispatch(actionsShowWindow.setShowNotification(!showWindow.showNotification));
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { loading } = useQuery(GET_ALL_INSPECTIONS, {
    notifyOnNetworkStatusChange: true,
  });

  const spinValue = new Animated.Value(0);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-360deg"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  });

  useEffect(() => {
    if (loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDrawer}>
        <DrawerToggleIcon color="#fff" height="20" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 10,
    paddingVertical: 5,
  },
  syncContent: {
    height: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 20,
  },
  unreadMessageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: '700'
  },
  unreadIcon: {
    height: 16,
    width: 16,
    backgroundColor: "#FEBB11",
    position: "absolute",
    left: "50%",
    top: 0,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
