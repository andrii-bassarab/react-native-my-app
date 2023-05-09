import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { colors } from "~/view/theme";
import { actionsToastNotification } from "../../../modules/toastNotification";
import CompletedIcon from "~/view/assets/icons/completed.svg";
import SyncIcon from "~/view/assets/icons/sync.svg";

export const Toast = () => {
  const dispatch = useAppDispatch();
  const toastNotification = useAppSelector((state) => state.toastNotification);
  const hideToastNotification = () => dispatch(actionsToastNotification.hideToastMessage());

  const { showToast, toastMessage } = toastNotification;

  const [fadeAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (showToast) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          hideToast();
        }, 1500);
      });
    }
  }, [showToast]);

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      hideToastNotification();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.toast, { opacity: fadeAnim, paddingTop: insets.top }]}>
        {toastMessage === "Success! Sync is complete." ? (
          <SyncIcon width={30} height={30} color={"#fff"} style={{ marginRight: "10%" }} />
        ) : (
          <CompletedIcon width={30} height={30} color={"#fff"} style={{ marginRight: "10%" }} />
        )}
        <Text style={styles.text}>{toastMessage}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    width: "100%",
  },
  toast: {
    backgroundColor: colors.green,
    borderRadius: 5,
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "10%",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
