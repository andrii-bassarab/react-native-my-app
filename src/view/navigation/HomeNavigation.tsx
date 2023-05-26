import "react-native-gesture-handler";
import { DrawerNavigationProp, createDrawerNavigator } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { Settings } from "../screens/Settings";
import { MainStack } from "./Main";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NavigationDrawerStructure } from "../components/Navigation/NavigationDrawerStructure";
import { colors } from "../theme";
import { NavigationNotificationStructure } from "../components/Navigation/NavigationNotificationStructure";
import { getHouseHoldNameById } from "~/services/api/HouseHoldMembers";
import { getInspectionStatus } from "~/utils/getInspectionStatus";
import { actionsInspections } from "~/modules/inspections";
import { InspectionItem } from "~/types/InspectionItem";
import { GET_INSPECTION_TEMPLATES } from "~/services/api/InspectionTemplates";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";

const Drawer = createDrawerNavigator();

export const HomeNavigation: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const dispatch = useAppDispatch();
  const { inspectionsSync, syncError } = useAppSelector((state) => state.inspections);
  const networkConnectivity = useAppSelector((state) => state.networkConnectivity);

  const { data } = useQuery(GET_ALL_INSPECTIONS);
  const { data: inspectionTemplateInfo } = useQuery(GET_INSPECTION_TEMPLATES);

  const getArrayOfInspections = async () => {
    if (!networkConnectivity) {
      dispatch(actionsInspections.setLoading(false));
      dispatch(actionsInspections.setVisibleLoading(false));
      return;
    }

    const arrayOfDataInspections = data.inspections.edges;
    const arrayOfInspectionTemplates: any[] = inspectionTemplateInfo.inspectionTemplates.edges;

    try {
      const responceOfHouseHoldName = await Promise.all(
        arrayOfDataInspections.map(({ node }: any) =>
          getHouseHoldNameById(node.household?.headOfHouseholdId)
        )
      );

      const arrayOfHouseHoldName = responceOfHouseHoldName.map(
        (item) => item.data?.householdMembers?.edges[0]?.node
      );

      const getVisibleHouseHoldName = (index: number) => {
        const nameResponse = arrayOfHouseHoldName[index];

        return nameResponse
          ? `${nameResponse.firstName} ${nameResponse.middleName ?? ""} ${nameResponse.lastName}`
          : "";
      };

      const inspectionsFromServer = arrayOfDataInspections.map((item: any, index: number) => ({
        ...item.node,
        visibleStatus: getInspectionStatus(item.node?.status, item.node?.hasPassed),
        visibleInspectionForm:
          arrayOfInspectionTemplates.find((template) => template.node.id === item.node.templateId)
            ?.node?.name || "",
        visibleHouseholdName: getVisibleHouseHoldName(index),
      })) as InspectionItem[];

      dispatch(actionsInspections.setInspections(inspectionsFromServer));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(actionsInspections.setLoading(false));
      dispatch(actionsInspections.setVisibleLoading(false));
    }
  };

  useEffect(() => {
    if (
      !inspectionsSync &&
      data &&
      !syncError &&
      inspectionTemplateInfo &&
      data.inspections?.edges &&
      Array.isArray(data.inspections?.edges) &&
      Array.isArray(inspectionTemplateInfo?.inspectionTemplates?.edges) &&
      data.inspections?.edges.every(
        (edge: any) => typeof edge === "object" && edge.node && typeof edge.node === "object"
      )
    ) {
      getArrayOfInspections();
    }
  }, [data, inspectionTemplateInfo, inspectionsSync, syncError]);

  useEffect(() => {
    if (syncError) {
      dispatch(actionsInspections.setLoading(false));
      dispatch(actionsInspections.setVisibleLoading(false));
    }
  }, [syncError]);

  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.layout,
    },
    headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
    headerRight: () => <NavigationNotificationStructure navigationProps={navigation} />,
    headerTitle: () => null,
    headerShadowVisible: false,
    drawerType: "front",
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Settings {...props} />}
      screenOptions={{
        ...screenOptions,
        drawerType: "front",
        sceneContainerStyle: { backgroundColor: colors.layout },
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  );
};
