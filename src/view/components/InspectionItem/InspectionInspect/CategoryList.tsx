import React from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { InspectionCategory } from "./InspectionCategory";
import { CategoryType } from "~/types/Category";
import { InspectionItem } from "~/types/InspectionItem";
import { normalize } from "~/utils/getWindowHeight";

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
  const renderCategoryItem = (category: CategoryType) => ({
    id: category.id,
    title: category.name,
    status: category.status || "Incomplete",
    result: category.result || "No results yet",
    items: category.items?.length,
    photos: "No",
    categoryApplyToInspection: category.isRequired,
    categoryAdded: true,
  });

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
        ItemSeparatorComponent={() => <View style={{ height: normalize(10) }} />}
        ListFooterComponent={() => <View style={{ height: normalize(10) }} />}
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
