import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  PanResponder,
  Dimensions,
  FlatList
} from "react-native";
import NotificationsIcon from "../assets/icons/notifications.svg";
import SyncIcon from "../assets/icons/sync.svg";
import { colors, textStyles } from "../theme";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { getVisibleDate } from "~/utils/date/visibleDate";
import { actionsShowWindow } from "~/modules/showWindow";
import { actionsNotifications } from "~/modules/notifications";
import { normalize } from "~/utils/normalize/normalize";

export const Notifications: React.FC = () => {
  const windowHeight = Dimensions.get("window").height;
  const dispatch = useAppDispatch();
  const { notifications, unreadMessage } = useAppSelector((state) => state.notifications);
  const position = useMemo(() => new Animated.ValueXY({ x: 0, y: windowHeight * 0.4 }), []);
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = pan.y.interpolate({
    inputRange: [windowHeight * 0.2, windowHeight * 0.4],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    dispatch(actionsNotifications.resetUnreadMessage());
  }, [unreadMessage]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > windowHeight * 0.35) {
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
          toValue: { x: 0, y: normalize(0) },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    pan.y.setValue(0);

    return Animated.timing(position, {
      toValue: { x: 0, y: normalize(30) },
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
        { transform: [{ translateY: pan.y }], opacity },
      ]}
    >
      <Animated.View {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.notificationsLabelBox} activeOpacity={0.5}>
          <View style={styles.notificationsLabel} />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.notificationsTitle}>Notifications</Text>
      {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ height: normalize(30) }} />}
            ItemSeparatorComponent={() => <View style={{height: normalize(30)}}/>}
            renderItem={({item: notification, index}) => (
              <View key={index} style={styles.notificationItem}>
              <SyncIcon color={colors.layout} width={normalize(40)} height={normalize(40)} />
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
            )}
          />
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
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -10,
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: normalize(100),
    borderTopLeftRadius: normalize(100),
    paddingHorizontal: "7%",
  },
  notificationsLabel: {
    height: normalize(6),
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  notificationsLabelBox: {
    paddingVertical: "5%",
  },
  notificationsTitle: {
    alignSelf: "flex-start",
    fontWeight: "600",
    color: colors.darkGrey,
    ...textStyles.large,
    marginBottom: '5%',
  },
  noNotificationText: {
    alignSelf: "center",
    color: colors.primary,
    fontWeight: "600",
    ...textStyles.strong,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  notificationItem: {
    flexDirection: "row",
  },
  notificationItemTitle: {
    color: "#141414",
    marginBottom: 5,
    ...textStyles.medium
  },
  notificationItemDate: {
    color: colors.darkGrey,
    ...textStyles.regular,
  },
  notificationItemDetail: {
    fontWeight: "600",
    color: "#141414",
    marginBottom: 5,
    ...textStyles.small,
  },
});
