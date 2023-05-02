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
import { useQuery } from "@apollo/client";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import { getPreviousValue } from "~/utils/getPreviousValue";

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const BottomTabs = createBottomTabNavigator();

export const MainStack: React.FC = () => {
  const dispatch = useAppDispatch();
  const { inspections, inspectionsSync } = useAppSelector((state) => state.inspections);
  const { notifications } = useAppSelector((state) => state.notifications);

  const { data } = useQuery(GET_ALL_INSPECTIONS);

  const prevSyncStatus = getPreviousValue(inspectionsSync);

  const newPendingNotification: NotificationItem = useMemo(
    () => ({
      title: `${inspections.length} inspections pending to be synced`,
      detail: inspections.map((inspection) => `Inspect ${inspection.unit.streetAddress}`),
      date: new Date().toJSON(),
      type: "Pending",
    }),
    [inspectionsSync]
  );

  const newSyncInProgressNotification: NotificationItem = useMemo(
    () => ({
      title: "Syncing in progress",
      date: new Date().toJSON(),
      type: "InProgress",
    }),
    [inspectionsSync]
  );

  const newSuccessfullyNotification: NotificationItem = {
    title: `${inspections.length} inspections synced successfully`,
    date: new Date().toJSON(),
    type: "InProgress",
  };

  // async function getStorageSize() {
  //   let keys = [];
  //   let size = 0;
  //   try {
  //     keys = await AsyncStorage.getAllKeys();
  //     const result = await AsyncStorage.multiGet(keys);
  //     result.forEach((item) => {
  //       size += item[0].length + item[1].length;
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  //   console.log("Total size of storage:", size, "bytes");
  // }

  const filterLastFifteenDays = (items: NotificationItem[]) => {
    const today = new Date();
    const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000);
    const lastFifteenDaysItems = items?.filter((item) => {
      const itemDate = new Date(item?.date);
      return itemDate >= fifteenDaysAgo;
    });

    return lastFifteenDaysItems?.slice(0, 100);
  };

  useEffect(() => {
    // getStorageSize();

    if (inspectionsSync) {
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
  }, [inspectionsSync]);

  useEffect(() => {
    if (data && prevSyncStatus && inspectionsSync !== prevSyncStatus && !inspectionsSync) {
      dispatch(
        actionsNotifications.setNotifications(
          filterLastFifteenDays(notifications).map(({ title, date, type }) => ({
            title: title.replace("pending", "waiting"),
            date,
            type,
          }))
        )
      );
      dispatch(actionsNotifications.addNotification(newSyncInProgressNotification));
      dispatch(actionsNotifications.addNotification(newSuccessfullyNotification));
      dispatch(actionsNotifications.addUnreadMessage(2));
    }
  }, [inspectionsSync, prevSyncStatus, data]);

  return (
    <BottomTabs.Navigator
      screenOptions={screenOptions}
      initialRouteName="HomeScreen"
      tabBar={(props) => <BottomTabBar {...props} />}
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
