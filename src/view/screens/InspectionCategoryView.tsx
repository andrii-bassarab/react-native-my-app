import React from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { InspectionItem } from "~/types/InspectionItem";
import { Category } from "~/types/Category";
import { СharacterCard } from "../components/CategoryView/СharacterCard";
import { AmenitiesCard } from "../components/CategoryView/AmenitiesCard";
import { useAppSelector } from "~/store/hooks";

interface Props {
  route: RouteProp<{ params: { category: Category; inspection: InspectionItem } }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionCategoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { inspection, category } = route.params;

  const { categories } = useAppSelector((state) => state.inspectionItem);

  const foundCategory = categories.find((item) => item.title === category.title);

  const goBack = () => navigation.goBack();

  return (
    <Screen backgroundColor={colors.layout} paddingTop={5} borderRadius={55}>
      <View style={styles.content}>
        <SelectedInspection item={inspection} goBack={goBack} includeCategory category={category} />
        <View style={{ height: 15 }}></View>
        <ScrollView style={{ paddingHorizontal: 5 }} showsVerticalScrollIndicator={false}>
          <СharacterCard
            title="Electricity"
            message="Are there at least two working outlets or one working outlet and one working light fixture?"
            result="Passed"
            categoryApplyToInspection={foundCategory?.categoryApplyToInspection}
          />
          <СharacterCard
            title="Window Condition"
            message="Are there at least two working outlets or one working outlet and one working light fixture?"
            result="Passed"
            categoryApplyToInspection={foundCategory?.categoryApplyToInspection}
          />
          <СharacterCard
            title="Security"
            message="Are there at least two working outlets or one working outlet and one working light fixture?"
            result="Passed"
            categoryApplyToInspection={foundCategory?.categoryApplyToInspection}
          />
          <Text style={styles.amenitiesTitle}>Amenities</Text>
          <AmenitiesCard
            title="The living room has high quality floors or wall coverings"
            message="Are there at least two working outlets or one working outlet and one working light fixture?"
            result="Yes"
            categoryApplyToInspection={foundCategory?.categoryApplyToInspection}
          />
          <AmenitiesCard
            title="The living room has high quality floors or wall coverings"
            result="Yes"
            categoryApplyToInspection={foundCategory?.categoryApplyToInspection}
          />
          <TouchableOpacity style={styles.saveButton} onPress={goBack}>
            <Text style={styles.saveButtonText}>Save and Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 0,
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.5,
    fontSize: 13,
  },
  label: {
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
    textAlign: "left",
    flex: 1,
    fontSize: 13,
  },
  amenitiesTitle: {
    color: colors.textGrey,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: "3%",
  },
  saveButton: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: colors.layout,
    paddingVertical: "3%",
    paddingHorizontal: "10%",
    borderRadius: 30,
    marginBottom: "5%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
