import React, { useState } from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TopTabBar } from "../components/Navigation/TopTabBar";
import { InspectionStatus } from "~/types/inspectionStatus";
import { InspectionDetails } from "../components/InspectionItem/InspectionDetail/InspectionDetail";
import { InspectionInspect } from "../components/InspectionItem/InspectionInspect/InspectionInspect";
import { ModalDeleteItem } from "../components/Custom/ModalDeleteItem";
import SaveIcon from "~/view/assets/icons/save.svg";
import { useAppSelector } from "~/store/hooks";
import { InspectionComments } from "../components/InspectionItem/InspectionComments/InspectionComments";

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

function FilesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Files!</Text>
    </View>
  );
}

export const InspectionItem: React.FC<Props> = ({ navigation, route }) => {
  const inspection = route.params;
  const [showModalUnsavedChanges, setShowModalUnsavedChanges] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const currentInspection = useAppSelector((state) => state?.inspectionItem);

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
          <View style={{ paddingHorizontal: 25 }}>
            <SelectedInspection item={inspection} goBack={() => setShowModalUnsavedChanges(true)} />
          </View>
          {showModalUnsavedChanges && (
            <ModalDeleteItem
              title={"You have unsaved changes. Unsaved changes will be lost."}
              Icon={SaveIcon}
              onContinue={() => {
                setShowModalUnsavedChanges(false);
                goBack();
              }}
              onCancel={() => setShowModalUnsavedChanges(false)}
              message="Are you sure you want to leave without saving changes?"
            />
          )}
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
            <Tab.Screen name="Comments" component={InspectionComments} initialParams={inspection} />
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
    // paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 0,
  },
});
