import React from "react";
import {
  Animated,
  StyleSheet,
  Easing,
} from "react-native";
import { normalize } from "~/utils/getWindowHeight";
import { colors } from "~/view/theme";

interface Props {
  size?: 'large' | 'medium' | 'small'
}

export const ContentLoader: React.FC<Props> = ({size = 'large'}) => {
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

  const stylesSize = StyleSheet.create({
    size: {
      width: size === 'large' ? normalize(140) : size === 'medium' ? normalize(120) : normalize(100),
      height: size === 'large' ? normalize(140) : size === 'medium' ? normalize(120) : normalize(100),
      borderWidth: size === 'large' ? normalize(16) : size === 'medium' ? normalize(14) : normalize(12),
    },
  });

  return (
    <Animated.View
      style={{ ...styles.loaderContainer, ...stylesSize.size, transform: [{ rotate: spin }] }}
    ></Animated.View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: 100,
    borderWidth: normalize(15),
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderTopColor: "#2F3545",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: "10%"
  },
});
