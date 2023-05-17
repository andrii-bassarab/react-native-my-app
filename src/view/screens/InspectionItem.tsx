import React, { useEffect, useState } from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { InspectionComments } from "../components/InspectionItem/InspectionComments/InspectionComments";
import { InspectionItem as Inspection } from "~/types/InspectionItem";
import { SignatureView } from "../components/Signature/SignatureView";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { InspectionFilesView } from "../components/InspectionItem/InspectionFiles/InspectionFilesView";

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

const Tab = createMaterialTopTabNavigator();

export const InspectionItem: React.FC<Props> = ({ navigation, route }) => {
  const inspection = route.params;
  const dispatch = useAppDispatch();
  const { startSignature } = useAppSelector((state) => state.inspectionItem);

  const [showModalUnsavedChanges, setShowModalUnsavedChanges] = useState(false);
  // const [startSignature, setStartSignature] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const currentInspection = useAppSelector((state) => state?.inspectionItem);

  const goBack = () => navigation.navigate("Inspections");

  const inspectOptions = {
    tabBarLabel:
      inspection.visibleStatus === InspectionStatus.PASSED ||
      inspection.status === InspectionStatus.FAILED
        ? "Results"
        : "Inspect",
  };

  useEffect(() => {
    return () => {
      dispatch(actionsInspectionItem.setStartSignature(false));
    };
  }, []);

  // console.log("inspection", inspection);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={5} borderRadius={55}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
          <View style={styles.content}>
            <View style={{ paddingHorizontal: 25 }}>
              <SelectedInspection item={inspection} goBack={() => goBack()} />
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
            {!startSignature && (
              <Tab.Navigator
                tabBar={(props) => <TopTabBar {...props} />}
                initialRouteName="HomeScreen"
              >
                {inspection.status !== InspectionStatus.NEW &&
                  inspection.status !== InspectionStatus.SCHEDULED && (
                    <Tab.Screen
                      name="Inspect"
                      component={InspectionInspect}
                      options={inspectOptions}
                      initialParams={inspection}
                    />
                  )}
                <Tab.Screen
                  name="Details"
                  component={InspectionDetails}
                  initialParams={inspection}
                />
                <Tab.Screen
                  name="Comments"
                  component={InspectionComments}
                  initialParams={inspection}
                />
                <Tab.Screen name="Files" component={InspectionFilesView} initialParams={inspection} />
              </Tab.Navigator>
            )}
            {startSignature && <SignatureView inspection={inspection} />}
          </View>
        {/* </TouchableWithoutFeedback>
      </KeyboardAvoidingView> */}
    </Screen>
  );
};

const styles = StyleSheet.create({
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
