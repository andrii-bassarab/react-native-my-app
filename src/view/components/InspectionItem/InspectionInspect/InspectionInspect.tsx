import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "~/view/theme";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { Inspection } from "~/types/Inspection";
import { SearchForm } from "../../Inspections/SearchForm";
import { InspectionCategory } from "./InspectionCategory";
import { InspecitonAddCategory } from "./InspectionAddCategory";
import { ModalAddCategory } from "./ModalAddCategory";
import { Category } from "~/types/Category";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsInspectionItem } from "~/modules/inspectionItem";

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionInspect: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();

  // const addNewCategory = (newCategory: Category) => dispatch(actionsInspectionItem.addCategory(newCategory));
  const { categories } = useAppSelector((state) => state.inspectionItem);

  const [query, setQuery] = useState("");
  // const [visibleCategory, setVisibleCategory] = useState(categories);
  const [showModalAddCategory, setShowModalAddCategory] = useState(false);

  // useEffect(() => {
  //   setVisibleCategory(
  //     categories.filter((category) =>
  //       category.title.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
  //     )
  //   );
  // }, [query]);

  useEffect(() => {}, []);

  console.log(categories)

  return (
    <View style={styles.content}>
      <View style={{ padding: 2 }}>
        <SearchForm query={query} setQuery={setQuery} placeholder="Search Category" />
      </View>
      <View style={{ height: 15 }} />
      <TouchableOpacity onPress={() => setShowModalAddCategory(true)}>
        <InspecitonAddCategory />
      </TouchableOpacity>
      <View style={{ height: 15 }} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('InspectionCategory', {inspection: route.params, category})}>
            <InspectionCategory category={category} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {showModalAddCategory && (
        <ModalAddCategory
          closeModal={() => setShowModalAddCategory(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 25
  },
});
