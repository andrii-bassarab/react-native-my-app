import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { HomeScreen } from "../screens/Home";
import { InspectionNavigation } from "../navigation/InspectionNavigation";
import { BottomTabBar } from "../components/Navigation/BottomTabBar";
import { WorkOrder } from "../screens/WorkOrder";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsNotifications } from "../../modules/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationItem } from "~/types/NotificationItem";
import { useQuery, NetworkStatus } from "@apollo/client";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import { getPreviousValue } from "~/utils/getPreviousValue";
import { actionsToastNotification } from "~/modules/toastNotification";
import { colors } from "../theme";

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
  contentStyle: { backgroundColor: colors.layout },
};

const BottomTabs = createBottomTabNavigator();

export const MainStack: React.FC = () => {
  const dispatch = useAppDispatch();
  const { inspections, visibleLoader, inspectionsSync, syncError } = useAppSelector((state) => state.inspections);
  const { notifications } = useAppSelector((state) => state.notifications);

  const showToastNotification = () => dispatch(actionsToastNotification.showToastMessage("Success! Sync is complete."));

  const { data, networkStatus } = useQuery(GET_ALL_INSPECTIONS);

  const prevSyncStatus = getPreviousValue(visibleLoader);
  const prevNetworkStatus = getPreviousValue(networkStatus);

  const newPendingNotification: NotificationItem = useMemo(
    () => ({
      title: `${inspections.length || ""} inspections pending to be synced`,
      detail: inspections.map((inspection) => `Inspect ${inspection.unit.streetAddress}`),
      date: new Date().toJSON(),
      type: "Pending",
    }),
    [visibleLoader]
  );

  const newSyncInProgressNotification: NotificationItem = useMemo(
    () => ({
      title: "Syncing in progress",
      date: new Date().toJSON(),
      type: "InProgress",
    }),
    [visibleLoader]
  );

  const newSuccessfullyNotification: NotificationItem = {
    title: `${inspections.length || ""} inspections synced successfully`,
    date: new Date().toJSON(),
    type: "Successfully",
  };

  async function getStorageSize() {
    let keys = [];
    let size = 0;
    try {
      keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      result.forEach((item) => {
        size += item[0].length + item[1].length;
      });
    } catch (error) {
      console.log(error.message);
    }
    console.log("Total size of storage:", size, "bytes");
  }

  const filterLastFifteenDays = (items: NotificationItem[]) => {
    const today = new Date();
    const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000);
    const lastFifteenDaysItems = items?.filter((item) => {
      const itemDate = new Date(item?.date);
      return itemDate >= fifteenDaysAgo && item.type !== 'InProgress';
    });
  
    return lastFifteenDaysItems?.slice(0, 100);
  };

  useEffect(() => {
    getStorageSize();

    if (visibleLoader) {
      dispatch(
        actionsNotifications.setNotifications(
          filterLastFifteenDays(notifications).map(({ title, date, type }) => ({
            title: title.replace("pending", "waiting"),
            date,
            type,
          }))
        )
      );
      dispatch(actionsNotifications.addNotification(newPendingNotification));
      dispatch(actionsNotifications.addUnreadMessage(1));
    }
  }, [visibleLoader]);

  useEffect(() => {
    if (visibleLoader && !inspectionsSync && !syncError) {
      dispatch(actionsNotifications.addNotification(newSyncInProgressNotification));
      dispatch(actionsNotifications.addUnreadMessage(1));
    }
  }, [inspectionsSync, syncError, visibleLoader])

  useEffect(() => {
    if (
      (data && !syncError && prevSyncStatus && visibleLoader !== prevSyncStatus && !visibleLoader) ||
      (data && !syncError &&
        prevSyncStatus === false &&
        visibleLoader === false &&
        networkStatus === 7 &&
        prevNetworkStatus === 1)
    ) {
      dispatch(
        actionsNotifications.setNotifications(
          filterLastFifteenDays(notifications).map(({ title, date, type }) => ({
            title: title.replace("pending", "waiting"),
            date,
            type,
          }))
        )
      );
      dispatch(actionsNotifications.addNotification(newSuccessfullyNotification));
      showToastNotification();
    }
  }, [visibleLoader, prevSyncStatus, data, syncError]);

  return (
    <BottomTabs.Navigator
      screenOptions={screenOptions}
      initialRouteName="HomeScreen"
      tabBar={(props) => <BottomTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: colors.layout }}
    >
      <BottomTabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <BottomTabs.Screen
        name="InspectionNavigation"
        component={InspectionNavigation}
        options={{ tabBarLabel: "Inspections" }}
      />
      <BottomTabs.Screen
        name="WorkOrder"
        component={WorkOrder}
        options={{ tabBarLabel: "Work Orders" }}
      />
    </BottomTabs.Navigator>
  );
};
