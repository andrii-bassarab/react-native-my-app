import "react-native-gesture-handler";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React, { useEffect } from "react";
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
import { getUserNameById } from "~/services/api/GetUserById";
import { GET_ALL_INSPECTIONS_CATEGORY } from "~/services/api/GetInspectionCategory";

const Drawer = createDrawerNavigator();

export const HomeNavigation: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const dispatch = useAppDispatch();
  const { inspectionsSync, syncError, inspections } = useAppSelector(
    (state) => state.inspections
  );
  const networkConnectivity = useAppSelector(
    (state) => state.networkConnectivity
  );

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
      // const arrayOfAssignedName = await Promise.all([getUserNameById("5b8ec7c379b0a100145a5ed0"),
      //   ...arrayOfDataInspections.map(({ node }) => getUserNameById(node.assignedTo)
      //   )]
      // );

      // console.log("arrayOfAssignedName", arrayOfAssignedName.map(item => item?.name));

      // const objectOfProperty = {};

      // for (const variable of arrayOfDataInspections) {
      //   if (objectOfProperty[variable.node.assignedTo]) {
      //     objectOfProperty[variable.node.assignedTo] += 1;
      //   } else {
      //     objectOfProperty[variable.node.assignedTo] = 1
      //   }
      // }

      // for (const key in objectOfProperty) {
      //   console.log("objectOfProperty", key)
      // }

      // console.log(objectOfProperty)

      console.log("render before")

      const responceOfHouseHoldName = await Promise.all(
        arrayOfDataInspections.map(({ node }: any) =>
          getHouseHoldNameById(node.household?.headOfHouseholdId)
        )
      );

      console.log("render after");

      const arrayOfHouseHoldName = responceOfHouseHoldName.map(
        (item) => item.data?.householdMembers?.edges[0]?.node
      );

      const getVisibleHouseHoldName = (index: number) => {
        const nameResponse = arrayOfHouseHoldName[index];

        return nameResponse
          ? `${nameResponse.firstName} ${nameResponse.middleName ?? ""} ${
              nameResponse.lastName
            }`
          : "";
      };

      const getVisibleCategories = (inspectionIdToFind: string) => {
        return inspections.find(inspection => inspection.id === inspectionIdToFind)?.visibleCategory || []
      }

      const inspectionsFromServer = arrayOfDataInspections.map(
        (item: any, index: number) => ({
          ...item.node,
          visibleStatus: getInspectionStatus(
            item.node?.status,
            item.node?.hasPassed
          ),
          visibleInspectionForm:
            arrayOfInspectionTemplates.find(
              (template) => template.node.id === item.node.templateId
            )?.node?.name || "",
          visibleHouseholdName: getVisibleHouseHoldName(index),
          visibleCategory: getVisibleCategories(item.node.id)
        })
      ) as InspectionItem[];

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
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <NavigationNotificationStructure navigationProps={navigation} />
    ),
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
