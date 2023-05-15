import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  PanResponder,
  Dimensions,
  ScrollView
} from "react-native";
import NotificationsIcon from "../assets/icons/notifications.svg";
import SyncIcon from "../assets/icons/sync.svg";
import { colors } from "../theme";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { getVisibleDate } from "~/utils/visibleDate";
import { actionsShowWindow } from "~/modules/showWindow";
import { actionsNotifications } from "~/modules/notifications";

export const Notifications: React.FC = () => {
  const windowHeight = Dimensions.get("window").height;
  const dispatch = useAppDispatch();
  const { notifications, unreadMessage } = useAppSelector((state) => state.notifications);
  const position = useMemo(() => new Animated.ValueXY({ x: 0, y: windowHeight * 0.4 }), []);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    dispatch(actionsNotifications.resetUnreadMessage());
  }, [unreadMessage]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > windowHeight * 0.4) {
          pan.extractOffset();
          dispatch(actionsShowWindow.setShowNotification(false));
        }
        if (gestureState.dy > 0) {
          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })(event, gestureState);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    pan.y.setValue(0);

    return Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [position]);

  return (
    <Animated.View
      style={[
        styles.shadowProp,
        styles.content,
        position.getLayout(),
        { transform: [{ translateY: pan.y }] },
      ]}
    >
      <Animated.View {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.notificationsLabelBox} activeOpacity={0.5}>
          <View style={styles.notificationsLabel} />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.notificationsTitle}>Notifications</Text>
      {notifications.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((notification, index) => (
            <View key={index} style={styles.notificationItem}>
              <SyncIcon color={colors.layout} width={40} height={40} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.notificationItemTitle}>{notification.title}</Text>
                <View>
                  {notification.detail &&
                    notification.detail.map((item, index) => (
                      <Text key={index} style={styles.notificationItemDetail}>
                        {item}
                      </Text>
                    ))}
                </View>
                <Text style={styles.notificationItemDate}>
                  {getVisibleDate(new Date(notification.date))}
                </Text>
              </View>
            </View>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      ) : (
        <>
          <NotificationsIcon
            width="50%"
            height="50%"
            color={colors.primary}
            style={{ alignSelf: "center", marginTop: "20%" }}
          />
          <Text style={styles.noNotificationText}>No Notifications</Text>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.33)",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -10,
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  notificationsLabel: {
    height: 5,
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  notificationsLabelBox: {
    paddingVertical: 10,
  },
  notificationsTitle: {
    alignSelf: "flex-start",
    marginTop: 10,
    fontSize: 22,
    fontWeight: "600",
    color: colors.darkGrey,
  },
  noNotificationText: {
    alignSelf: "center",
    fontSize: 20,
    color: colors.primary,
    fontWeight: "600",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  notificationItem: {
    marginTop: 20,
    flexDirection: "row",
  },
  notificationItemTitle: {
    color: "#141414",
    fontSize: 16,
    marginBottom: 5,
  },
  notificationItemDate: {
    color: colors.darkGrey,
    fontSize: 16,
  },
  notificationItemDetail: {
    fontWeight: "600",
    color: "#141414",
    marginBottom: 5,
  },
});
