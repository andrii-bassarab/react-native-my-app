import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ParamListBase, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import { Text, StyleSheet, View, Animated } from "react-native";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { colors, layout, textStyles } from "../theme";
import BuilderIncon from "../assets/icons/build.svg";
import SettingsDetail from "../assets/icons/settings.svg";
import { Screen } from "../components/Screen/Screen";
import { normalize } from "~/utils/normalize/normalize";

interface Props {
  navigation: BottomTabNavigationProp<ParamListBase>;
}

export const WorkOrder: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return () => {
        fadeAnim.setValue(0);
        fadeAnim.setOffset(0);
      };
    }, [fadeAnim])
  );

  return (
    <Screen backgroundColor={colors.layout} paddingTop={layout.screenPadding}>
      <View style={styles.screenContainer}>
        <View style={styles.content}>
          <WelcomeBox
            backgroundColor="transparant"
            textColor={colors.primary}
            showText
          />
          <Text style={styles.title}>Work Orders</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flex: 1,
            }}
          >
            <BuilderIncon color={colors.blue} height="80%" width="60%" />
            <SettingsDetail width="50%" color={colors.blue} />
          </View>
          <Animated.View
            style={[styles.alert, styles.shadowProp, { opacity: fadeAnim }]}
          >
            <Text style={styles.modalText}>Coming soon!</Text>
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C4660",
  },
  screenContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: normalize(100),
    borderTopLeftRadius: normalize(100),
    padding: 25,
    paddingHorizontal: "7%",
  },
  title: {
    color: colors.primary,
    fontWeight: "700",
    marginTop: "4%",
    marginBottom: "15%",
    ...textStyles.medium,
  },
  alert: {
    position: "absolute",
    top: "50%",
    left: "50%",
    padding: normalize(50),
    transform: [{ translateX: -60 }, { translateY: -40 }],
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  modalText: {
    color: colors.primary,
    fontWeight: "500",
    ...textStyles.regular,
  },
});
