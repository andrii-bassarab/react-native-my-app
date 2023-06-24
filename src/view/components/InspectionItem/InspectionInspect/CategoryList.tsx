import React from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { InspectionCategory } from "./InspectionCategory";
import { CategoryType } from "~/types/Category";
import { InspectionItem } from "~/types/InspectionItem";

interface Props {
  visibleCategories: CategoryType[];
  navigation: NavigationProp<ParamListBase>;
  inspection: InspectionItem;
}

export const CategoryList: React.FC<Props> = ({
  visibleCategories,
  navigation,
  inspection,
}) => {
  const detectCategoryResult = (category: CategoryType) => {
    switch (true) {
      case category.items.length === 0:
        return "No result yet";
      case category.items.some((item) => item.result === undefined):
        return "--";
      case category.items.every((item) => item.result):
        return "Passed";
      case category.items.some((item) => item.result === false):
        return "Failed";
      default:
        return "--";
    }
  };

  const renderCategoryItem = (category: CategoryType) => ({
    id: category.id,
    title: category.name,
    status: category.items.length > 0 ? "Complete" : "Incomplete",
    result: detectCategoryResult(category),
    items: category.items?.length,
    photos: "No",
    categoryApplyToInspection: category.isRequired,
  })

  const handleNavigate = (category: CategoryType) => {
    navigation.navigate("InspectionCategory", {
      inspection,
      category: renderCategoryItem(category),
      items: category.items,
      amenities: category.amenities,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={visibleCategories}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item: category }) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleNavigate(category)}
          >
            <InspectionCategory
              category={renderCategoryItem(category)}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
