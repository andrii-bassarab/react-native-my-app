import React from "react";
import {
  Animated,
  StyleSheet,
  Easing,
} from "react-native";
import { colors } from "~/view/theme";

export const ContentLoader: React.FC = () => {
  const spinValue = new Animated.Value(0);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  return (
    <Animated.View
      style={{ ...styles.loaderContainer, transform: [{ rotate: spin }] }}
    ></Animated.View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 12,
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderTopColor: "#2F3545",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: "10%"
  },
});
