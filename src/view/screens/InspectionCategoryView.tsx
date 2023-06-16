import React, { useEffect, useState } from "react";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { InspectionItem } from "~/types/InspectionItem";
import { Category, CategoryItemField } from "~/types/Category";
import { CharacterCard } from "../components/CategoryView/CharacterCard";
import { AmenitiesCard } from "../components/CategoryView/AmenitiesCard";
import { makeRequestPDF } from "~/utils/fetch";
import { useAppSelector } from "~/store/hooks";

interface Props {
  route: RouteProp<
    {
      params: {
        category: Category;
        inspection: InspectionItem;
        items: CategoryItemField[];
        amenities: any[];
      };
    },
    "params"
  >;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionCategoryScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { inspection, category, items, amenities } = route.params;
  const { categoryApplyToInspection } = useAppSelector(state => state.inspectionItem);

  const goBack = () => navigation.goBack();

  useEffect(() => {
    makeRequestPDF().then((res) => console.log("res res res res", res.blob()));
  }, []);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={5} borderRadius={55}>
      <View style={styles.content}>
        <SelectedInspection
          item={inspection}
          goBack={goBack}
          includeCategory
          category={category}
        />
        <View style={{ height: 15 }}></View>
        <ScrollView
          style={{ paddingHorizontal: 5, flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {items.length > 0 ? (
            <>
              {items.map((item) => (
                <CharacterCard
                  key={item.id}
                  title={item.name}
                  message={item.description}
                  result={"Passed"}
                  categoryApplyToInspection={categoryApplyToInspection}
                />
              ))}
            </>
          ) : (
            <View style={styles.noItemsBox}>
              <Text style={styles.noItemsText}>No category items</Text>
            </View>
          )}
          {amenities.length > 0 ? (
            <>
              <Text style={styles.amenitiesTitle}>Amenities</Text>
              {amenities.map((amenity) => (
                <AmenitiesCard
                  key={amenity.id}
                  title={amenity.name}
                  message={amenity.name}
                  result="Yes"
                  categoryApplyToInspection={categoryApplyToInspection}
                />
              ))}
            </>
          ) : (
            <View style={styles.noItemsBox}>
              <Text style={styles.noItemsText}>No category amenities</Text>
            </View>
          )}
          {(items.length > 0 || amenities.length > 0) && (
            <TouchableOpacity style={styles.saveButton} onPress={goBack}>
              <Text style={styles.saveButtonText}>Save and Go Back</Text>
            </TouchableOpacity>
          )}
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
  noItemsBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  noItemsText: {
    fontSize: 20,
    color: colors.textGrey,
    fontWeight: "700",
  },
});
