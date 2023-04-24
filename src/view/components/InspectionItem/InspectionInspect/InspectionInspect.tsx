import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "~/view/theme";
import { RouteProp } from "@react-navigation/native";
import { Inspection } from "~/types/Inspection";
import { SearchForm } from "../../Inspections/SearchForm";
import { InspectionCategory } from "./InspectionCategory";
import { InspecitonAddCategory } from "./InspectionAddCategory";
import { ModalAddCategory } from "./ModalAddCategory";
import { Category } from "~/types/Category";

const mocksCategory = [
  {
    title: "Living Room",
    status: "--",
    result: "--",
    items: 0,
    photos: "No",
  },
  {
    title: "Kitchen",
    status: "Complete",
    result: "Failed",
    items: 2,
    photos: "Yes",
  },
  {
    title: "Bathroom",
    status: "Complete",
    result: "Passed",
    items: 7,
    photos: "Yes",
  },
  {
    title: "Bedroom",
    status: "Complete",
    result: "Failed",
    items: 0,
    photos: "No",
  },
  {
    title: "Living Room (addition)",
    status: "Incomplete",
    result: "No results yet",
    items: 0,
    photos: "No",
    categoryAdded: true,
  },
];

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
}

export const InspectionInspect: React.FC<Props> = ({ route }) => {
  const [query, setQuery] = useState("");
  const [visibleCategory, setVisibleCategory] = useState(mocksCategory);
  const [showModalAddCategory, setShowModalAddCategory] = useState(false);

  const addNewCategory = (newCategory: Category) => {
    setVisibleCategory((prev) => [...prev, newCategory]);
  };

  useEffect(() => {
    setVisibleCategory(
      mocksCategory.filter((category) =>
        category.title.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query]);

  useEffect(() => {}, []);

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
        {visibleCategory.map((category, index) => (
          <InspectionCategory key={index} category={category} />
        ))}
      </ScrollView>
      {showModalAddCategory && (
        <ModalAddCategory
          closeModal={() => setShowModalAddCategory(false)}
          addNewCategory={addNewCategory}
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
  },
});
