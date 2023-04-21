import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { ActivityItem } from "../components/Inspections/ActivityItem";
import { FlatList } from "react-native-gesture-handler";
import { Notifications } from "./Notification";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";

export const mocksData = [
  {
    title: "Inspect 2062 Gimli Ct.",
    date: "Created on April 05, 2023",
    stringDate: '2023-04-05',
    location: "2062 Gimli Ct. Great River, Mirkwood 43547",
    assigned: 'Unassigned',
    status: "In Progress",
  },
  {
    title: "Inspect 6002 Ironwood Ln",
    date: "Scheduled May 02, 2023 from from 12:00pm - 1:15pm",
    stringDate: '2023-05-02',
    location: "6002 Ironwood Ln Denver, CO 80260",
    extra: "Samwise Gamgee",
    assigned: 'Me',
    status: "Passed",
  },
  {
    title: "Inspect 6002 10 Orthanc Road",
    date: "Created on April 11, 2023",
    stringDate: '2023-04-11',
    location: "10 Orthanc Road Isengard, ME 10034",
    extra: "Bruce Wayne",
    assigned: 'Me',
    status: "Failed",
  },
  {
    title: "Inspect 2062 Gimli Ct.",
    date: "Created on April 18, 2023",
    stringDate: '2023-04-18',
    location: "2062 Gimli Ct. Great River, Mirkwood 43547",
    assigned: 'Unassigned',
    status: "Passed",
  },
  {
    title: "Inspect 6002 Ironwood Ln",
    date: "Created on April 03, 2023",
    stringDate: '2023-04-03',
    location: "6002 Ironwood Ln Denver, CO 80260",
    extra: "Samwise Gamgee",
    assigned: 'Unassigned',
    status: "New",
  },
  {
    title: "Inspect 6002 10 Orthanc Road",
    date: "Scheduled May 10, 2023 from from 12:00pm - 1:15pm",
    stringDate: '2023-05-10',
    location: "10 Orthanc Road Isengard, ME 10034",
    extra: "Bruce Wayne",
    assigned: 'Me',
    status: "Scheduled",
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // const [showNotification, setShowNotification] = useState(true);

  // const goToAuth = React.useCallback(() => {
  //   navigation.navigate("Auth");
  // }, [navigation]);

  const currentUser = useAppSelector((state) => state.user);
  const notifications = useAppSelector((state) => state.notifications);

  // console.log("notifications", notifications);

  useEffect(() => {
  }, []);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={0}>
      <View style={styles.screen}>
        <View style={styles.content}>
          {/* <ScrollView
          showsVerticalScrollIndicator={false}
        > */}
          <WelcomeBox
            backgroundColor="transparant"
            textColor="rgba(127, 136, 141, 1)"
          />
          <View style={styles.activityBox}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
            <View style={{ paddingBottom: "20%" }}>
              <FlatList
                data={mocksData}
                keyExtractor={(item, index) => `key-${index}`}
                renderItem={({ item }) => <ActivityItem item={item} />}
                ListHeaderComponent={() => (
                  <Text style={styles.activityTitle}>Recent Activity</Text>
                )}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
            {/* </ScrollView> */}
          </View>
          {/* </ScrollView> */}
          {currentUser.showNotification && <Notifications />}
        </View>
      </View>
      {/* {currentUser.showSwitchSite && (
        <CustomerSite />
      )} */}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C4660",
    paddingTop: 15,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 25,
    paddingTop: 15,
  },
  activityBox: {
    marginTop: 15,
  },
  activityTitle: {
    fontSize: 16,
    color: "#7F888D",
    fontWeight: "700",
    marginBottom: 10,
  },
});
