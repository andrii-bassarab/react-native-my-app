import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WelcomeBox } from "../components/WelcomeBox";
import { ActivityItem } from "../components/ActivityItem";
import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen";
import { colors } from "../theme";

export const mocksData = [
  {
    title: "Inspect 2062 Gimli Ct.",
    date: "Created on January 20, 2022",
    location: "2062 Gimli Ct. Great River, Mirkwood 43547",
    status: "In Progress",
  },
  {
    title: "Inspect 6002 Ironwood Ln",
    date: "Scheduled January 20, 2022 from 12:00pm - 1:15pm",
    location: "6002 Ironwood Ln Denver, CO 80260",
    extra: "Samwise Gamgee",
    status: "Passed",
  },
  {
    title: "Inspect 6002 10 Orthanc Road",
    date: "Created on January 20, 2022",
    location: "10 Orthanc Road Isengard, ME 10034",
    extra: "Bruce Wayne",
    status: "Failed",
  },
  {
    title: "Inspect 2062 Gimli Ct.",
    date: "Created on January 20, 2022",
    location: "2062 Gimli Ct. Great River, Mirkwood 43547",
    status: "Passed",
  },
  {
    title: "Inspect 6002 Ironwood Ln",
    date: "Created on January 20, 2022",
    location: "6002 Ironwood Ln Denver, CO 80260",
    extra: "Samwise Gamgee",
    status: "Failed",
  },
  {
    title: "Inspect 6002 10 Orthanc Road",
    date: "Scheduled January 15, 2022 from 12:00pm - 1:15pm",
    location: "10 Orthanc Road Isengard, ME 10034",
    extra: "Bruce Wayne",
    status: "Scheduled",
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const goToAuth = React.useCallback(() => {
    navigation.navigate("Auth");
  }, [navigation]);

  const currentUser = useAppSelector((state) => state.user);

  console.log("userHome", currentUser.permissions);

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
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "flex-end",
          alignItems: "stretch",
          backgroundColor: "rgba(0, 0, 0, 0.33)",
          opacity: 1,
        }}
    
      >
        <View
          style={{
            height: "50%",
            backgroundColor: "#fff",
            borderTopRightRadius: 55,
            borderTopLeftRadius: 55,
            padding: 25,
            paddingTop: 20,
            alignItems: 'stretch'
          }}
        >
          <View style={{height: 5, backgroundColor: 'rgba(193, 188, 185, 1)', alignSelf: 'center', width: '60%', borderRadius: 20}}/>
          <Text>Choose Your Customer Site</Text>
        </View>
      </View>
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
