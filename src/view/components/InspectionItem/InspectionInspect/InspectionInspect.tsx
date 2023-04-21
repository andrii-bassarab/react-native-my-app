import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { colors } from "~/view/theme";
import { RouteProp } from "@react-navigation/native";
import { Inspection } from "~/types/Inspection";
import { SearchForm } from "../../Inspections/SearchForm";
import { InspectionCategory } from "./InspectionCategory";

const mocksCategory = [
  {
    title: "Living Room",
    status: "Icnomplete",
    result: "No results yet",
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
    status: "Icnomplete",
    result: "No results yet",
    items: 0,
    photos: "No",
  },
];

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
}

export const InspectionInspect: React.FC<Props> = ({ route }) => {
  const [query, setQuery] = useState("");
  const [visibleCategory, setVisibleCategory] = useState(mocksCategory);

  console.log(route, "route.params");

  useEffect(() => {
    setVisibleCategory(
      mocksCategory.filter((category) =>
        category.title.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query]);

  return (
    <View style={styles.content}>
      <View style={{ padding: 2 }}>
        <SearchForm query={query} setQuery={setQuery} placeholder="Search Category" />
      </View>
      <View style={{ height: 10 }} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {visibleCategory.map((category) => (
          <InspectionCategory category={category} />
        ))}
      </ScrollView>
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
