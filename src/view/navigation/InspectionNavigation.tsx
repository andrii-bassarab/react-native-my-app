import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";

import { InspectionItem } from "../screens/InspectionItem";
import { Inspections } from "../screens/Inspections";
import { InspectionCategoryScreen } from "../screens/InspectionCategoryView";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { Inspection } from "~/types/Inspection";

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const InspectionStack = createNativeStackNavigator();

interface Props {
  route: RouteProp<{ params?: { navigate?: string; item: Inspection } }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionNavigation: React.FC<Props> = ({ navigation, route }) => {
  useEffect(() => {
    if (route.params?.item && route.params?.navigate) {
      const { navigate, item } = route.params;
        navigation.navigate(navigate, item);
    }
  }, [route.params]);

  return (
    <InspectionStack.Navigator screenOptions={screenOptions} initialRouteName="Inspections">
      <InspectionStack.Screen name="Inspections" component={Inspections} />
      <InspectionStack.Screen name="InspectionItem" component={InspectionItem} />
      <InspectionStack.Screen name="InspectionCategory" component={InspectionCategoryScreen} />
    </InspectionStack.Navigator>
  );
};
