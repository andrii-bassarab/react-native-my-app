import "react-native-gesture-handler";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { Settings } from "../screens/Settings";
import { MainStack } from "./Main";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NavigationDrawerStructure } from "../components/Navigation/NavigationDrawerStructure";
import { colors } from "../theme";
import { NavigationNotificationStructure } from "../components/Navigation/NavigationNotificationStructure";
import { getHouseHoldNameById, getLandlordNameById } from "~/services/api/HouseHoldMembers";
import { getInspectionStatus } from "~/utils/getInspectionStatus";
import { actionsInspections } from "~/modules/inspections";
import { InspectionItem } from "~/types/InspectionItem";
import { GET_INSPECTION_TEMPLATES } from "~/services/api/InspectionTemplates";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import { getAvailableUsers } from "~/services/api/GetUserById";
import { GET_ALL_INSPECTIONS_CATEGORY } from "~/services/api/GetInspectionCategory";
import { setAvailableUsers } from "~/modules/user/actions";
import { getVisibleAssignedTo } from "~/utils/getVisibleAssigned";
import { actionsCategoryTemplate } from "~/modules/categoriesTemplates";
import { CategoryType } from "~/types/Category";
import { getCategoryResult } from "~/utils/storeCategoryTemplate";

const Drawer = createDrawerNavigator();

export const HomeNavigation: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();
  const { inspectionsSync, syncError, inspections, visibleLoader } = useAppSelector((state) => state.inspections);
  const networkConnectivity = useAppSelector((state) => state.networkConnectivity);
  const categoriesTemplates = useAppSelector((state) => state.categoriesTemplates);
  const { availableUsers } = useAppSelector((state) => state.user);
  const templateIds = Object.keys(categoriesTemplates);

  useEffect(() => {
    const storeAvailableUsers = async () => {
      try {
      const usersResponse = await getAvailableUsers();

      const availableUsers = usersResponse.map((user: any) => ({
        _id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
      }));

      dispatch(setAvailableUsers(availableUsers));
    } catch (e) {
      console.log("error available users", e)
    }

    };
    storeAvailableUsers()
  }, []);

  const { data } = useQuery(GET_ALL_INSPECTIONS);
  const { data: inspectionTemplateInfo } = useQuery(GET_INSPECTION_TEMPLATES);
  const { refetch } = useQuery(GET_ALL_INSPECTIONS_CATEGORY, {
    variables: {
      id: "",
    },
  });

  const handleRefetchCategories = async () => {
    const promises = templateIds.map(async (id) => {
      const result = await refetch({
        id,
      });

      const responseCategories = result?.data?.inspectionCategories?.edges.map(
        (edge: any) => edge?.node
      ) as CategoryType[];

      // if (responseCategories) {
      //   dispatch(
      //     actionsCategoryTemplate.addCategoryTemplate({
      //       templateIdToAdd: id,
      //       categories: getCategoryResult(responseCategories),
      //     })
      //   );
      // }
      return result;
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
          visibleLandlordName: inspections[index].visibleLandlordName,
          visibleInspectionForm: getVisibleInspectionForm(item.node.templateId),
          visibleHouseholdName: inspections[index].visibleHouseholdName,
          visibleAssignedTo: getVisibleAssignedTo(
            availableUsers,
            item.node.assignedTo
          ).name,
          visibleLandlordPhoneNumber: inspections[index].visibleLandlordPhoneNumber,
        })
      ) as InspectionItem[];

      dispatch(actionsInspections.setInspections(inspectionsFromServer));

      return;
    }

    try {
      console.log("render before");

      const responseLandlordName = await Promise.all(
        arrayOfDataInspections.map(({node}: any) => getLandlordNameById(node?.unit?.landlordId))
      );

      const arrayOfLandlordsNames = responseLandlordName.map(({data}) => {
        const node = data?.landlords?.edges?.[0]?.node;
        
        return {
          name: (node?.firstName || "") + " " + (node?.lastName || ""),
          phoneNumber: node?.phoneNumber
        }
      })

      const responceOfHouseHoldName = await Promise.all(
        arrayOfDataInspections.map(({ node }: any) =>
          getHouseHoldNameById(node.household?.headOfHouseholdId)
        )
      );

      console.log("render after");

      await handleRefetchCategories();

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
          visibleLandlordName: arrayOfLandlordsNames[index].name,
          visibleInspectionForm: getVisibleInspectionForm(item.node.templateId),
          visibleHouseholdName: getVisibleHouseHoldName(index),
          visibleAssignedTo: getVisibleAssignedTo(
            availableUsers,
            item.node.assignedTo
          ).name,
          visibleLandlordPhoneNumber: arrayOfLandlordsNames[index].phoneNumber,
        })
      ) as InspectionItem[];

      dispatch(actionsInspections.setInspections(inspectionsFromServer));
    } catch (error) {
      console.log("Failed to sync", error);
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
    drawerStyle: {},
  };

  if (Dimensions.get("window").width > 600) {
    screenOptions.drawerStyle = {
      width: "50%",
    };
  }

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
