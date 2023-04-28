import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ParamListBase } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, View, Animated } from "react-native";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { colors } from "../theme";
import BuilderIncon from "../assets/icons/build.svg";
import SettingsDetail from "../assets/icons/settings.svg";
import { Screen } from "../components/Screen/Screen";

interface Props {
  navigation: BottomTabNavigationProp<ParamListBase>;
}

export const WorkOrder: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={0}>
      <View style={styles.screenContainer}>
        <View style={styles.content}>
          <WelcomeBox
            backgroundColor="transparant"
            textColor={colors.primary}
          />
          <Text style={styles.title}>Work Orders</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BuilderIncon color={colors.blue} height="100%" width="60%" />
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
    paddingTop: 15,
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 25,
    paddingTop: 15,
  },
  title: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
    marginTop: "10%",
    marginBottom: "15%",
  },
  alert: {
    position: "absolute",
    top: "50%",
    left: "50%",
    padding: 35,
    transform: [{ translateX: -60 }, { translateY: -40 }],
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  modalText: {
    color: colors.primary,
    fontWeight: "500",
    fontSize: 16,
  },
});
