import React from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { InspectionCategory } from "./InspectionCategory";
import { CategoryType } from "~/models/category";
import { InspectionType } from "~/models/InspectionItem";
import { normalize } from "~/utils/normalize/normalize";

interface Props {
  visibleCategories: CategoryType[];
  navigation: NavigationProp<ParamListBase>;
  inspection: InspectionType;
}

export const CategoryList: React.FC<Props> = ({
  visibleCategories,
  navigation,
  inspection,
}) => {
  const renderCategoryItem = (category: CategoryType) => ({
    id: category.id,
    title: category.name,
    status: category.status || {},
    result: category.result || {},
    items: category.items?.length,
    photos: "No",
    categoryApplyToInspection: category.isRequired,
    categoryAdded: true,
    isRequired: category.isRequired,
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
