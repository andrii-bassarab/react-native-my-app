import "react-native-gesture-handler";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { FlatList } from "react-native-gesture-handler";
import { Notifications } from "./Notification";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { useQuery } from "@apollo/client";
import { actionsInspections } from "../../modules/inspections";
import { InspectionItem } from "~/types/InspectionItem";
import { getInspectionStatus } from "~/utils/getInspectionStatus";
import { InspectionCard } from "../components/Inspections/InspectionCard";
import { GET_HOUSEHOLD_NAME, getHouseHoldNameById } from "~/services/api/HouseHoldMembers";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import { InspectionStatus } from "~/types/inspectionStatus";

export const mocksData = [
  {
    title: "Inspect 2062 Gimli Ct.",
    date: "Created on April 05, 2023",
    stringDate: "2023-04-05",
    location: "2062 Gimli Ct. Great River, Mirkwood 43547",
    assigned: "Unassigned",
    status: "In Progress",
  },
  {
    title: "Inspect 6002 Ironwood Ln",
    date: "Scheduled May 02, 2023 from from 12:00pm - 1:15pm",
    stringDate: "2023-05-02",
    location: "6002 Ironwood Ln Denver, CO 80260",
    extra: "Samwise Gamgee",
    assigned: "Me",
    status: "Passed",
  },
  {
    title: "Inspect 6002 10 Orthanc Road",
    date: "Created on April 11, 2023",
    stringDate: "2023-04-11",
    location: "10 Orthanc Road Isengard, ME 10034",
    extra: "Bruce Wayne",
    assigned: "Me",
    status: "Failed",
  },
  {
    title: "Inspect 2062 Gimli Ct.",
    date: "Created on April 18, 2023",
    stringDate: "2023-04-18",
    location: "2062 Gimli Ct. Great River, Mirkwood 43547",
    assigned: "Unassigned",
    status: "Passed",
  },
  {
    title: "Inspect 6002 Ironwood Ln",
    date: "Created on April 03, 2023",
    stringDate: "2023-04-03",
    location: "6002 Ironwood Ln Denver, CO 80260",
    extra: "Samwise Gamgee",
    assigned: "Unassigned",
    status: "New",
  },
  {
    title: "Inspect 6002 10 Orthanc Road",
    date: "Scheduled May 10, 2023 from from 12:00pm - 1:15pm",
    stringDate: "2023-05-10",
    location: "10 Orthanc Road Isengard, ME 10034",
    extra: "Bruce Wayne",
    assigned: "Me",
    status: "Scheduled",
  },
];

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user);
  const { notifications } = useAppSelector((state) => state.notifications);
  const { inspections } = useAppSelector((state) => state.inspections);
  const showWindow = useAppSelector((state) => state.showWindow);

  const { loading, error, data } = useQuery(GET_ALL_INSPECTIONS);
  const {
    data: dataHouseHold,
    error: errorHouseHold,
    loading: loadingHouseHold,
  } = useQuery(GET_HOUSEHOLD_NAME, {
    variables: {
      householdId: "6157769d2dc0505b2c7259c8",
    },
  });

  console.log("---------------------");
  console.log("dataInspections", data);
  console.log("errorInspections", error);
  console.log("loadingInspections", loading);
  console.log("---------------------");

  console.log("headOfHouseholdId", "headOfHouseholdId");
  console.log("errorHouseholdId", errorHouseHold);
  console.log("loadingHouseholdId", loadingHouseHold);
  console.log("dataHouseholdId", dataHouseHold?.householdMembers?.edges[0]?.node);

  useEffect(() => {
    dispatch(actionsInspections.setLoading(loading));

    if (
      data &&
      data.inspections?.edges &&
      Array.isArray(data.inspections?.edges) &&
      data.inspections?.edges.every(
        (edge: any) => typeof edge === "object" && edge.node && typeof edge.node === "object"
      )
    ) {
      const inspectionsFromServer = data.inspections.edges.map((item: any) => ({
        ...item.node,
        visibleStatus: getInspectionStatus(item.node?.status, item.node?.hasPassed),
        visibleHouseholdName: "",
      })) as InspectionItem[];

      dispatch(actionsInspections.setInspections(inspectionsFromServer));
    }
  }, [data, loading]);

  // useEffect(() => {
  //   dispatch(actionsInspections.pushInspection({
  //     id: "5e94bb43fa86cf0016c4d9fe",
  //     scheduledOn: "2020-04-21T06:00:00.000Z", //appointment time
  //     visitationRange: null,
  //     assignedTo: "5e94b7f0fa86cf0016c4d92c",
  //     status: "complete",
  //     inspectionType: "Initial", //how often should i do inspection
  //     propertyType: "unit", //openspace | unit
  //     hasPassed: true,
  //     createdOn: "2020-04-13T19:19:31.525Z",
  //     createdBy: "heather@hdslabs.com",
  //     completedOn: "",
  //     hasPermissionToEnter: true, //permission to enter
  //     unit: {
  //       id: "5dec0c8accba88001629g756a",
  //       streetAddress: "2889 Bagshot Row",
  //       city: "Hobbiton",
  //       state: "The Shire",
  //       postalCode: 33111,
  //     },
  //     visibleStatus: InspectionStatus.PASSED,
  //     visibleHouseholdName: '',
  //     household: {
  //       lastActionName: "Interim Recertification",
  //       headOfHouseholdId: "6157769d2dc0505b2c7259c8", //tenant
  //     },
  //   }))
  // }, [])

  return (
    <Screen backgroundColor={colors.layout} paddingTop={0}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <WelcomeBox backgroundColor="transparant" textColor={colors.darkGrey} />
          <View style={styles.activityBox}>
            <View style={{ paddingBottom: "20%" }}>
              <FlatList
                data={inspections}
                keyExtractor={(item, index) => `key-${index}`}
                renderItem={({ item }) => (
                  <InspectionCard
                    onPress={() =>
                      navigation.navigate("InspectionNavigation", {
                        navigate: "InspectionItem",
                        item: {
                          assigned: "Unassigned",
                          date: "Created on April 05, 2023",
                          location: "2062 Gimli Ct. Great River, Mirkwood 43547",
                          status: "In Progress",
                          stringDate: "2023-04-05",
                          title: "Inspect 2062 Gimli Ct.",
                        },
                      })
                    }
                    item={item}
                  />
                )}
                ListHeaderComponent={() => (
                  <Text style={styles.activityTitle}>Recent Activity</Text>
                )}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
          {showWindow.showNotification && <Notifications />}
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.layout,
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
