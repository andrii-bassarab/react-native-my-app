import React, { useEffect, useRef } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet, Easing } from "react-native";
import NotificationIcon from "../../assets/icons/notification.svg";
import SyncIcon from "~/view/assets/icons/sync.svg";
import NoInternetIcon from "~/view/assets/icons/noInternetConnection.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsShowWindow } from "~/modules/showWindow";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/native";
import { colors, textStyles } from "~/view/theme";
import NetInfo from "@react-native-community/netinfo";
import { actionsNetworkConnectivity } from "~/modules/networkConnectivity";
import { normalize } from "~/utils/normalize/normalize";

interface Props {
  navigationProps: DrawerNavigationProp<ParamListBase>;
}

export const NavigationNotificationStructure: React.FC<Props> = ({ navigationProps }) => {
  const dispatch = useAppDispatch();

  const { visibleLoader } = useAppSelector((state) => state.inspections);
  const showWindow = useAppSelector((state) => state.showWindow);
  const { unreadMessage } = useAppSelector((state) => state.notifications);
  const networkConnectivity = useAppSelector((state) => state.networkConnectivity);

  const toggleNotifications = () => {
    // navigationProps.navigate("HomeScreen");
    dispatch(actionsShowWindow.setShowSwitchSite(false));
    dispatch(actionsShowWindow.setShowNotification(!showWindow.showNotification));
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (typeof state.isConnected === 'boolean') {
        dispatch(actionsNetworkConnectivity.setNetworkStatus(state.isConnected))
      }
    });

    return () => {
      unsubscribe();
    };
  }, [NetInfo]);

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
    if (visibleLoader) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visibleLoader]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {networkConnectivity && visibleLoader && (
          <Animated.View
            style={{
              ...styles.syncContent,
              // opacity: fadeAnim,
            }}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <SyncIcon color={colors.blue} height={normalize(30)} width={normalize(30)} />
            </Animated.View>
            <Text style={{ color: colors.blue, fontWeight: "600", ...textStyles.little }}>Syncing In Progress</Text>
          </Animated.View>
        )}
        {!networkConnectivity && (
          <View style={styles.syncContent}>
            <View>
              <NoInternetIcon color={colors.darkGrey} height={normalize(30)} width={normalize(30)} />
            </View>
            <Text style={styles.noInternetText}>No Network Connectivity</Text>
          </View>
        )}
        <TouchableOpacity onPress={toggleNotifications} style={{marginLeft: normalize(5)}}>
          <NotificationIcon color="#fff" height={normalize(45)} />
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
    marginRight: normalize(20),
    paddingVertical: normalize(10),
    marginTop: normalize(20),
  },
  syncContent: {
    height: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: normalize(10),
    borderRadius: normalize(30),
  },
  unreadMessageText: {
    color: "#fff",
    ...textStyles.mini,
    fontWeight: "700",
    textAlignVertical: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  unreadIcon: {
    height: normalize(24),
    width: normalize(24),
    backgroundColor: "#FEBB11",
    position: "absolute",
    left: "50%",
    top: 0,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noInternetText: {
    color: colors.darkGrey,
    fontWeight: "600",
    marginLeft: "2%",
    ...textStyles.little,
  },
});
