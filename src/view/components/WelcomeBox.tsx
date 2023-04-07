import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

interface Props {
  backgroundColor: string;
  textColor: string;
  padding?: number;
  height?: string;
  iconSize?: "large" | "small";
}

export const WelcomeBox: React.FC<Props> = ({
  backgroundColor,
  height,
  textColor,
  padding,
  iconSize,
}) => (
  <View
    style={{
      ...styles.headerContainer,
      backgroundColor,
      height: height ? height : "auto",
      padding: padding ?? 0,
    }}
  >
    <View style={styles.settingsIconBox}>
      <Image
        source={require("../assets/images/settings.png")}
        style={{
          ...styles.settingsIcon,
          height: iconSize === "large" ? 80 : 50,
          width: iconSize === "large" ? 80 : 50,
          marginBottom: iconSize === "large" ? 10 : 0,
        }}
      />
      <Text style={{ ...styles.welcomeText, color: textColor }}>Welcome!</Text>
      <Text style={{ ...styles.welcomeText, fontSize: 20, color: textColor }}>
        User name
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "rgba(35, 71, 99, 1)",
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  settingsIconBox: {},
  settingsIcon: {
    resizeMode: "cover",
    height: 50,
    alignSelf: "flex-start",
    width: 50,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 100,
    borderColor: "#fff",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 0,
    fontWeight: "700",
  },
});
