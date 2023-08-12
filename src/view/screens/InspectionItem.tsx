import React, { useEffect, useMemo, useState } from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors, layout } from "../theme";
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
import { InspectionType as Inspection } from "~/models/InspectionItem";
import { SignatureView } from "../components/Signature/SignatureView";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { InspectionFilesView } from "../components/InspectionItem/InspectionFiles/InspectionFilesView";
import { KeyboardAvoidingDisplayComponent } from "../hoc/KeyboardAvoidingDisplayComponent";
import { normalize } from "~/utils/normalize/normalize";
import { openFile } from "~/services/api/files/readDocument";

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

const Tab = createMaterialTopTabNavigator();

export const InspectionItem: React.FC<Props> = ({ navigation, route }) => {
  const inspection = route.params;
  const dispatch = useAppDispatch();
  const { startSignature, visiblePhoneNumber, inspectionItem, assignedOption } = useAppSelector(
    (state) => state.inspectionItem
  );

  const [showModalUnsavedChanges, setShowModalUnsavedChanges] = useState(false);
  const categoriesTemplates = useAppSelector((state) => state.categoriesTemplates);

  const goBack = () => {
    // setTimeout(() => {
    // navigation.goBack();
    // }, 0);
    navigation.navigate("Inspections");
  };

  const inspectOptions = {
    tabBarLabel: inspectionItem?.status === InspectionStatus.COMPLETE ? "Results" : "Inspect",
  };

  const hasUnsavedChanges = useMemo(
    () => inspectionItem?.assignedTo !== assignedOption.value,
    [assignedOption, visiblePhoneNumber, inspectionItem]
  );

  useEffect(() => {
    dispatch(actionsInspectionItem.setInspectionItem(inspection));
    dispatch(actionsInspectionItem.setCategories(categoriesTemplates[inspection.templateId] || []));
    dispatch(actionsInspectionItem.setInspectionAssigned(inspection.assignedTo));
    dispatch(
      actionsInspectionItem.setVisiblePhoneNumber(inspection.visibleLandlordPhoneNumber || "")
    );

    return () => {
      dispatch(actionsInspectionItem.clearInspectionItem());
    };
  }, [inspection]);

  const handleGoBack = () => {
    if (startSignature) {
      dispatch(actionsInspectionItem.setStartSignature(false));
      return;
    }

    if (hasUnsavedChanges) {
      setShowModalUnsavedChanges(true);
      return;
    }

    goBack();
  };

  useEffect(() => {
    dispatch(actionsInspectionItem.setCategories(categoriesTemplates[inspection.templateId] || []));
  }, [categoriesTemplates[inspection.templateId]]);

  return (
    <KeyboardAvoidingDisplayComponent>
      <Screen backgroundColor={colors.layout} paddingTop={layout.screenPadding} borderRadius={55}>
        <View style={styles.content}>
          <View style={{ paddingHorizontal: "5%" }}>
            <SelectedInspection item={inspection} goBack={handleGoBack} />
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
              <Tab.Screen
                name="Inspect"
                component={InspectionInspect}
                options={inspectOptions}
                initialParams={inspection}
              />
              <Tab.Screen name="Details" component={InspectionDetails} initialParams={inspection} />
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
      </Screen>
    </KeyboardAvoidingDisplayComponent>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: normalize(100),
    borderTopLeftRadius: normalize(100),
    paddingTop: normalize(35),
    paddingBottom: 0,
  },
});
