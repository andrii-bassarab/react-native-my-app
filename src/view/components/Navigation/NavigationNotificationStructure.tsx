import React, { useEffect, useRef } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet, Platform, Easing } from "react-native";
import NotificationIcon from "../../assets/icons/notification.svg";
import SyncIcon from "~/view/assets/icons/sync.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsShowWindow } from "~/modules/showWindow";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/native";
import { colors } from "~/view/theme";

interface Props {
  navigationProps: DrawerNavigationProp<ParamListBase>;
}

export const NavigationNotificationStructure: React.FC<Props> = ({ navigationProps }) => {
  const dispatch = useAppDispatch();

  const { inspectionsSync } = useAppSelector((state) => state.inspections);
  const showWindow = useAppSelector((state) => state.showWindow);
  const { unreadMessage } = useAppSelector((state) => state.notifications);

  const toggleNotifications = () => {
    navigationProps.navigate("HomeScreen");
    dispatch(actionsShowWindow.setShowSwitchSite(false));
    dispatch(actionsShowWindow.setShowNotification(!showWindow.showNotification));
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
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
    if (inspectionsSync) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [inspectionsSync]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {inspectionsSync && (
          <Animated.View
            style={{
              ...styles.syncContent,
              // opacity: fadeAnim,
            }}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <SyncIcon color={colors.blue} height={25} width={30} />
            </Animated.View>
            <Text style={{ color: colors.blue, fontWeight: "600" }}>Syncing In Progress</Text>
          </Animated.View>
        )}
        <TouchableOpacity onPress={toggleNotifications}>
          <NotificationIcon color="#fff" height="30" />
          {unreadMessage > 0 && (
            <View style={styles.unreadIcon}>
              <Text style={styles.unreadMessageText}>{unreadMessage}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 15,
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
    fontWeight: "700",
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
