import React from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { InspectionCategory } from "./InspectionCategory";
import { CategoryType } from "~/types/Category";
import { InspectionItem } from "~/types/InspectionItem";

interface Props {
  visibleCategory: CategoryType[];
  navigation: NavigationProp<ParamListBase>;
  inspection: InspectionItem;
}

export const CategoryList: React.FC<Props> = ({
  visibleCategory,
  navigation,
  inspection,
}) => {
  const handleNavigate = (category: CategoryType) => {
    navigation.navigate("InspectionCategory", {
      inspection,
      category: {
        title: category.name,
        status: "Incomplete",
        result: "--",
        items: category.items?.length,
        photos: "No",
        categoryApplyToInspection: category.isRequired,
      },
      items: category.items,
      amenities: category.amenities,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={visibleCategory}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item: category }) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleNavigate(category)}
          >
            <InspectionCategory
              category={{
                title: category.name,
                status: "Incomplete",
                result: "--",
                items: category.items?.length,
                photos: "No",
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
