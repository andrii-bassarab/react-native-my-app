import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { colors, textStyles } from "../../theme";
import { useAppSelector } from "~/store/hooks";
import { normalize } from "~/utils/getWindowHeight";

interface Props {
  backgroundColor: string;
  textColor: string;
  padding?: number;
  height?: string;
  iconSize?: "large" | "small";
  showText?: boolean;
}

export const WelcomeBox: React.FC<Props> = ({
  backgroundColor,
  height,
  textColor,
  padding,
  iconSize,
  showText = false,
}) => {
  const { profile } = useAppSelector((state) => state.user);

  return (
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
          source={require("~/view/assets/images/settings.png")}
          style={{
            ...styles.settingsIcon,
            height: iconSize === "large" ? normalize(130) : normalize(100),
            width: iconSize === "large" ? normalize(130) : normalize(100),
            marginBottom: iconSize === "large" ? normalize(10) : 0,
          }}
        />
        {showText && (
          <>
            <Text style={{ ...styles.welcomeText, color: textColor }}>
              Welcome!
            </Text>
            <Text
              style={{
                ...styles.welcomeText,
                ...textStyles.large,
                color: textColor,
              }}
            >
              {profile?.userName}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.layout,
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
    ...textStyles.medium,
    marginTop: "0.5%",
    fontWeight: "700",
  },
});
