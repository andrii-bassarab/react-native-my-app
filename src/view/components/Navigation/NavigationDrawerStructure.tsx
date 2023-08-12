import "react-native-gesture-handler";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View, Text, Animated, StyleSheet, Easing, Platform } from "react-native";
import { DrawerActions, ParamListBase } from "@react-navigation/native";
import DrawerToggleIcon from "../../assets/icons/drawerToggle.svg";
import NotificationIcon from "../../assets/icons/notification.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useQuery } from "@apollo/client";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections/inspections";
import SyncIcon from "~/view/assets/icons/sync.svg";
import { colors } from "~/view/theme";
import { actionsShowWindow } from "~/modules/showWindow";
import { normalize } from "~/utils/normalize/normalize";

interface Props {
  navigationProps: DrawerNavigationProp<ParamListBase>;
}

export const NavigationDrawerStructure: React.FC<Props> = ({ navigationProps }) => {
  const dispatch = useAppDispatch();

  const { inspectionsSync } = useAppSelector((state) => state.inspections);
  const showWindow = useAppSelector((state) => state.showWindow);

  const toggleDrawer = () => {
    dispatch(actionsShowWindow.setShowSwitchSite(false));
    navigationProps.dispatch(DrawerActions.openDrawer());
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { loading } = useQuery(GET_ALL_INSPECTIONS, {
    notifyOnNetworkStatusChange: true,
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
    <View style={styles.container} onLayout={(event) => {
      const {x, y, width, height} = event.nativeEvent.layout;
      dispatch(actionsShowWindow.setTopNavigationHeight(height))
    }}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.drawerButton}>
        <DrawerToggleIcon color="#fff" height={normalize(40)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  drawerButton: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
  }
});
