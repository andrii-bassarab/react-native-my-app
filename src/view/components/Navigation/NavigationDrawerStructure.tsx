import "react-native-gesture-handler";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View, Text, Animated, StyleSheet, Easing } from "react-native";
import { DrawerActions, ParamListBase } from "@react-navigation/native";
import DrawerToggleIcon from "../../assets/icons/drawerToggle.svg";
import NotificationIcon from "../../assets/icons/notification.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setShowNotification, setShowSwitchSite } from "~/modules/user/actions";
import { NetworkStatus, useQuery } from "@apollo/client";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import SyncIcon from "~/view/assets/icons/sync.svg";
import { colors } from "~/view/theme";

interface Props {
  navigationProps: DrawerNavigationProp<ParamListBase>;
}

export const NavigationDrawerStructure: React.FC<Props> = ({ navigationProps }) => {
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
  const { inspectionsSync } = useAppSelector((state) => state.inspections);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { loading } = useQuery(GET_ALL_INSPECTIONS, {
    notifyOnNetworkStatusChange: true,
  });

  const spinValue = new Animated.Value(0);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
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
  }, [inspectionsSync]);

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
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {inspectionsSync && (
          <Animated.View
            style={{
              ...styles.syncContent,
              // opacity: fadeAnim,
            }}
          >
            <Animated.View style={{transform: [{rotate: spin}] }}>
              <SyncIcon color={colors.blue} height={25} width={30} />
            </Animated.View>
            <Text style={{ color: colors.blue, fontWeight: "600" }}>Syncing In Progress</Text>
          </Animated.View>
        )}
        <TouchableOpacity onPress={toggleNotifications}>
          <NotificationIcon color="#fff" height="25" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "200%",
    marginLeft: 10,
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
});
