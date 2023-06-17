import "react-native-gesture-handler";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
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
import { getAvailableUsers, getUserNameById } from "~/services/api/GetUserById";
import { GET_ALL_INSPECTIONS_CATEGORY } from "~/services/api/GetInspectionCategory";
import { setAvailableUsers } from "~/modules/user/actions";
import { getVisibleAssignedTo } from "~/utils/getVisibleAssigned";

const Drawer = createDrawerNavigator();

export const HomeNavigation: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();
  const { inspectionsSync, syncError, inspections, visibleLoader } = useAppSelector((state) => state.inspections);
  const networkConnectivity = useAppSelector((state) => state.networkConnectivity);
  const categoriesTemplates = useAppSelector((state) => state.categoriesTemplates);
  const { availableUsers } = useAppSelector((state) => state.user);
  const ids = Object.keys(categoriesTemplates);

  useEffect(() => {
    getAvailableUsers().then((usersResponse) => {
      const availableUsers = usersResponse.map((user: any) => ({ _id: user._id, fullName: `${user.firstName} ${user.lastName}` }))

      dispatch(setAvailableUsers(availableUsers));
    });
  }, []);

  const { data } = useQuery(GET_ALL_INSPECTIONS);
  const { data: inspectionTemplateInfo } = useQuery(GET_INSPECTION_TEMPLATES);
  const { refetch } = useQuery(GET_ALL_INSPECTIONS_CATEGORY, {
    variables: {
      ids: [] as string[],
    },
  });

  const handleRefetchQueries = async () => {
    const promises = ids.map((id) => {
      return refetch({
        ids: [id],
      });
    });

    try {
      await Promise.all(promises);
      console.log("Refetch queries completed");
    } catch (error) {
      console.error("Error while refetching queries", error);
    }
  };

  const getArrayOfInspections = async () => {
    if (!networkConnectivity) {
      dispatch(actionsInspections.setLoading(false));
      dispatch(actionsInspections.setVisibleLoading(false));
      return;
    }

    const arrayOfDataInspections = data.inspections.edges;
    const arrayOfInspectionTemplates: any[] = inspectionTemplateInfo.inspectionTemplates.edges;

    const getVisibleInspectionForm = (templateIdToCheck: string) => {
      return (
        arrayOfInspectionTemplates.find(
          (template) => template.node.id === templateIdToCheck
        )?.node?.name || ""
      );
    };

    if (!visibleLoader) {
      const inspectionsFromServer = arrayOfDataInspections.map(
        (item: any, index: number) => ({
          ...item.node,
          visibleStatus: getInspectionStatus(
            item.node?.status,
            item.node?.hasPassed
          ),
          visibleInspectionForm: getVisibleInspectionForm(item.node.templateId),
          visibleHouseholdName: inspections[index].visibleHouseholdName,
          visibleAssignedTo: getVisibleAssignedTo(availableUsers, item.node.assignedTo).name,
        })
      ) as InspectionItem[];

      dispatch(actionsInspections.setInspections(inspectionsFromServer));

      return;
    }

    try {
      console.log("render before");

      const responceOfHouseHoldName = await Promise.all(
        arrayOfDataInspections.map(({ node }: any) =>
          getHouseHoldNameById(node.household?.headOfHouseholdId)
        )
      );

      console.log("render after");

      await handleRefetchQueries();

      console.log("refetched");

      const arrayOfHouseHoldName = responceOfHouseHoldName.map(
        (item: any) => item.data?.householdMembers?.edges[0]?.node
      );

      const getVisibleHouseHoldName = (index: number) => {
        const nameResponse = arrayOfHouseHoldName[index];

        return nameResponse
          ? `${nameResponse.firstName} ${nameResponse.middleName ?? ""} ${
              nameResponse.lastName
            }`
          : "";
      };

      const inspectionsFromServer = arrayOfDataInspections.map(
        (item: any, index: number) => ({
          ...item.node,
          visibleStatus: getInspectionStatus(
            item.node?.status,
            item.node?.hasPassed
          ),
          visibleInspectionForm: getVisibleInspectionForm(item.node.templateId),
          visibleHouseholdName: getVisibleHouseHoldName(index),
          visibleAssignedTo: getVisibleAssignedTo(availableUsers, item.node.assignedTo).name
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
      availableUsers &&
      data.inspections?.edges &&
      Array.isArray(data.inspections?.edges) &&
      Array.isArray(inspectionTemplateInfo?.inspectionTemplates?.edges) &&
      data.inspections?.edges.every(
        (edge: any) =>
          typeof edge === "object" && edge.node && typeof edge.node === "object"
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
