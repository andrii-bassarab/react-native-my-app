import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Screen } from "../components/Screen/Screen";
import DocumentIcon from "../assets/icons/document.svg";
import WorkIcon from "../assets/icons/work.svg";
import SwitchIcon from "../assets/icons/switch.svg";
import LogOutIcon from "../assets/icons/logout.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { signOut } from "~/modules/user/actions";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { colors, textStyles } from "../theme";
import { actionsShowWindow } from "~/modules/showWindow";
import { normalize } from "~/utils/normalize/normalize";
import { CUSTOMER_NAME } from "~/constants/env";

interface Props extends DrawerContentComponentProps {}

export const Settings: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);

  const logOut = () => dispatch(signOut());
  const openSwitchSite = () => {
    navigation.closeDrawer();
    dispatch(actionsShowWindow.setShowNotification(false));
    setTimeout(() => {
      dispatch(actionsShowWindow.setShowSwitchSite(true));
    }, 100);
  };

  return (
    <Screen backgroundColor={colors.layout} showNotificationScreen={false}>
      <View style={{ flex: 1, backgroundColor: "#fff", paddingBottom: "10%" }}>
        <ImageBackground
          source={require("../assets/images/settingsHeader.png")}
          resizeMode="cover"
        >
          <View style={{ marginTop: normalize(30), marginLeft: normalize(10) }}>
            <WelcomeBox
              backgroundColor="transparant"
              textColor="#fff"
              height="15%"
              padding={normalize(38)}
              iconSize="large"
            />
            <View style={{ paddingTop: "25%", paddingLeft: "10%" }}>
              <Text style={{ ...styles.welcomeText, color: "#fff" }}>
                Welcome!
              </Text>
              <Text
                style={{
                  ...styles.welcomeText,
                  color: "#fff",
                }}
              >
                {CUSTOMER_NAME}
              </Text>
            </View>
          </View>
        </ImageBackground>
        {/* <Image
          source={require("../assets/images/settingsHeader.png")}
          style={{
            position: "absolute",
            height: "32%",
            width: "100%",
            zIndex: -1,
          }}
        /> */}
        <View style={styles.contentContainer}>
          <View>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate("InspectionNavigation")}
            >
              <DocumentIcon color={colors.primary} height="100%" />
              <Text style={styles.itemsText}>Inspections</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate("WorkOrder")}
            >
              <WorkIcon color={colors.primary} height="100%" />
              <Text style={styles.itemsText}>Work Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={openSwitchSite}
            >
              <SwitchIcon color={colors.primary} height="100%" />
              <Text style={styles.itemsText}>Switch Customer Site</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ ...styles.settingsItem, borderBottomWidth: 0 }}
            onPress={logOut}
          >
            <LogOutIcon color={colors.primary} height="100%" />
            <Text style={styles.itemsText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: "10%",
  },
  headerContainer: {
    backgroundColor: "rgba(35, 71, 99, 1)",
    height: "25%",
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    padding: 25,
  },
  icon: {
    color: "#7F878B",
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingVertical: normalize(40),
    borderBottomWidth: 1,
    borderBottomColor: "#7F878B",
  },
  itemsText: {
    color: "#7F878B",
    ...textStyles.regular,
    marginLeft: "3%",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    marginTop: '3%'
  },
  welcomeText: {
    color: "#fff",
    marginTop: 10,
    fontWeight: "700",
    ...textStyles.large,
  },
});
