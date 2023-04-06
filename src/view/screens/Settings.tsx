import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Screen } from "../components/Screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import DocumentIcon from "../assets/icons/document.svg";
import WorkIcon from "../assets/icons/work.svg";
import SwitchIcon from "../assets/icons/switch.svg";
import LogOutIcon from "../assets/icons/logout.svg";
import HeaderBackground from "../assets/icons/settingsHeader.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { signOut } from "~/modules/user/actions";

interface Props extends DrawerContentComponentProps {
}

export const Settings: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const selectedFilter = useAppSelector((state) => state.user);

  const logOut = () => dispatch(signOut());

  console.log('selectedFilter', selectedFilter)

  return (
    <Screen backgroundColor="rgba(35, 71, 99, 1)">
      <View style={{ flex: 1, backgroundColor: "#fff", paddingBottom: "10%" }}>
        <View style={styles.headerContainer}>
          <View style={styles.settingsIconBox}>
            <Image
              source={require("../assets/images/settings.png")}
              style={styles.settingsIcon}
            />
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={{ ...styles.welcomeText, fontSize: 22, marginTop: 5 }}>
              User name
            </Text>
          </View>
        </View>
        <Image
          source={require("../assets/images/settingsHeader.png")}
          style={{
            position: "absolute",
            height: "30%",
            width: "100%",
            zIndex: -1,
          }}
        />
        <View style={styles.contentContainer}>
          <View>
            <TouchableOpacity style={styles.settingsItem}>
              <DocumentIcon color="#7F878B" height="100%" />
              <Text style={styles.itemsText}>Inspections</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem}>
              <WorkIcon color="#7F878B" height="100%" />
              <Text style={styles.itemsText}>Work Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem}>
              <SwitchIcon color="#7F878B" height="100%" />
              <Text style={styles.itemsText}>Switch Customer Site</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ ...styles.settingsItem, borderBottomWidth: 0 }}
            onPress={logOut}
          >
            <LogOutIcon color="#7F878B" height="100%" />
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
    paddingBottom: "10%" 
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
    padding: 10,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#7F878B",
  },
  itemsText: {
    fontSize: 18,
    color: "#7F878B",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 55,
    justifyContent: "space-between",
  },
  settingsIconBox: {},
  settingsIcon: {
    resizeMode: "cover",
    height: 80,
    alignSelf: "flex-start",
    width: 80,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 100,
    borderColor: "#fff",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "700",
  },
});
