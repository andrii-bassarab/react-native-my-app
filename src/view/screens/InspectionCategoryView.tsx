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
} from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { InspectionItem } from "~/types/InspectionItem";
import { Category, CategoryItemField } from "~/types/Category";
import { CharacterCard } from "../components/CategoryView/CharacterCard";
import { AmenitiesCard } from "../components/CategoryView/AmenitiesCard";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_COMMENT } from "~/services/api/GetInspectionCategory";
import { actionsCategoryTemplate } from "~/modules/categoriesTemplates";

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
  const dispatch = useAppDispatch();
  const { inspection, category, items, amenities } = route.params;
  const { categoryApplyToInspection } = useAppSelector(state => state.inspectionItem);
  const categoriesTemplates = useAppSelector(state => state.categoriesTemplates);


  const goBack = () => navigation.goBack();

  const {data} = useQuery(GET_CATEGORY_COMMENT, {
    variables: {
      ids: items.map(item => item.id)
    }
  });

  useEffect(() => {
    dispatch(actionsCategoryTemplate.addCategoryComment({
        templateId: inspection.templateId,
        itemId: items.map(item => item.id)[0],
        commentToAdd: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
    }))
    console.log("dispatch");
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
                  comment={item.comment}
                  id={item.id}
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
