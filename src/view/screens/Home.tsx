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
import { GET_INSPECTION_TEMPLATES } from "~/services/api/InspectionTemplates";

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
    data: inspectionTemplateInfo,
    loading: loadingInspectionTemplateInfo,
    error: errorInspectionTemplateInfo,
  } = useQuery(GET_INSPECTION_TEMPLATES);
  // const {
  //   data: dataHouseHold,
  //   error: errorHouseHold,
  //   loading: loadingHouseHold,
  // } = useQuery(GET_HOUSEHOLD_NAME, {
  //   variables: {
  //     householdId: "6157769d2dc0505b2c7259c8",
  //   },
  // });

  // console.log("---------------------");
  // console.log("dataInspections", data);
  // console.log("errorInspections", error);
  // console.log("loadingInspections", loading);
  // console.log("---------------------");

  // console.log("headOfHouseholdId", "headOfHouseholdId");
  // console.log("errorHouseholdId", errorHouseHold);
  // console.log("loadingHouseholdId", loadingHouseHold);
  // console.log("dataHouseholdId", dataHouseHold?.householdMembers?.edges[0]?.node);

  useEffect(() => {
    dispatch(actionsInspections.setLoading(loading));

    if (
      data &&
      inspectionTemplateInfo &&
      data.inspections?.edges &&
      Array.isArray(data.inspections?.edges) &&
      Array.isArray(inspectionTemplateInfo?.inspectionTemplates?.edges) &&
      data.inspections?.edges.every(
        (edge: any) => typeof edge === "object" && edge.node && typeof edge.node === "object"
      )
    ) {
      const arrayOfInspectionTemplates: any[] = inspectionTemplateInfo.inspectionTemplates.edges;
      const inspectionsFromServer = data.inspections.edges.map((item: any) => ({
        ...item.node,
        visibleStatus: getInspectionStatus(item.node?.status, item.node?.hasPassed),
        visibleHouseholdName: "",
        visibleInspectionForm: arrayOfInspectionTemplates.find(template => template.node.id === item.node.templateId)?.node?.name || ""
      })) as InspectionItem[];
  
      dispatch(actionsInspections.setInspections(inspectionsFromServer));
    }
  }, [data, loading, inspectionTemplateInfo]);

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
                        item,
                      })
                    }
                    inspection={item}
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
