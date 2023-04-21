import React from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TopTabBar } from "../components/Navigation/TopTabBar";
import { InspectionStatus } from "~/types/inspectionStatus";
import { InspectionDetails } from "../components/InspectionItem/InspectionDetail/InspectionDetail";
import { InspectionInspect } from "../components/InspectionItem/InspectionInspect/InspectionInspect";

interface Inspection {
  title: string;
  date: string;
  stringDate: string;
  location: string;
  assigned: string;
  status: string;
  extra?: string;
}

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

const Tab = createMaterialTopTabNavigator();

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details!</Text>
    </View>
  );
}

function CommentsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Comments!</Text>
    </View>
  );
}

function FilesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Files!</Text>
    </View>
  );
}

function ResultsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Results!</Text>
    </View>
  );
}

export const InspectionItem: React.FC<Props> = ({ navigation, route }) => {
  const inspection = route.params;

  const goBack = () => navigation.navigate("Inspections");

  const inspectOptions = {
    tabBarLabel:
      inspection.status === InspectionStatus.PASSED || inspection.status === InspectionStatus.FAILED
        ? "Results"
        : "Inspect",
  };

  return (
    <Screen backgroundColor={colors.layout} paddingTop={0}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <SelectedInspection item={inspection} goBack={goBack} />
          <Tab.Navigator tabBar={(props) => <TopTabBar {...props} />} initialRouteName="HomeScreen">
            {inspection.status !== InspectionStatus.NEW &&
              inspection.status !== InspectionStatus.SCHEDULED && (
                <Tab.Screen
                  name="Inspect"
                  component={InspectionInspect}
                  options={inspectOptions}
                  initialParams={inspection}
                />
              )}
            <Tab.Screen name="Details" component={InspectionDetails} initialParams={inspection} />
            <Tab.Screen name="Comments" component={CommentsScreen} initialParams={inspection} />
            <Tab.Screen name="Files" component={FilesScreen} initialParams={inspection} />
          </Tab.Navigator>
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
    paddingTop: 25,
    paddingBottom: 0,
  },
});
