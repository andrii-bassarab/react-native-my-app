import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { InspectionItem } from "~/types/InspectionItem";
import { SearchForm } from "../../Inspections/SearchForm";
import { InspecitonAddCategory } from "./InspectionAddCategory";
import { ModalAddCategory } from "./ModalAddCategory";
import { useAppDispatch } from "~/store/hooks";
import { GET_ALL_INSPECTIONS_CATEGORY } from "~/services/api/GetInspectionCategory";
import { useQuery } from "@apollo/client";
import { actionsInspections } from "~/modules/inspections";
import { ContentLoader } from "../../Loader/Loader";
import { CategoryList } from "./CategoryList";

interface Props {
  route: RouteProp<{ params: InspectionItem }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionInspect: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const inspection = route.params;

  const { data, loading } = useQuery(GET_ALL_INSPECTIONS_CATEGORY, {
    variables: {
      ids: [route.params.templateId],
    },
  });

  const [query, setQuery] = useState("");
  const [inspectionCategories, setInspectionCategories] = useState(
    inspection.visibleCategory
  );
  const [visibleCategory, setVisibleCategory] = useState(inspectionCategories);
  const [showModalAddCategory, setShowModalAddCategory] = useState(false);

  useEffect(() => {
    setVisibleCategory(
      inspectionCategories.filter((category) =>
        category.name
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query, inspectionCategories]);

  useEffect(() => {
    if (
      data &&
      data.inspectionCategories?.edges &&
      Array.isArray(data.inspectionCategories?.edges) &&
      data.inspectionCategories?.edges.every(
        (edge: any) =>
          typeof edge === "object" && edge.node && typeof edge.node === "object"
      )
    ) {
      const responseCategories = data.inspectionCategories.edges.map(
        (edge: any) => edge.node
      );
      setInspectionCategories(responseCategories);
      dispatch(
        actionsInspections.setInspectionCategories({
          templateId: inspection.templateId || "",
          cagegoriesToAdd: responseCategories,
        })
      );
    }
  }, [data]);

  return (
    <View style={styles.content}>
      <View style={{ padding: 2 }}>
        <SearchForm
          query={query}
          setQuery={setQuery}
          placeholder="Search Category"
        />
      </View>
      <View style={{ height: 15 }} />
      {inspection.status !== "complete" && (
        <TouchableOpacity onPress={() => setShowModalAddCategory(true)}>
          <InspecitonAddCategory />
        </TouchableOpacity>
      )}
      <View style={{ height: 15 }} />
      {loading && inspectionCategories.length === 0 && !data ? (
        <View style={styles.loaderBox}>
          <ContentLoader />
        </View>
      ) : (
        <CategoryList
          visibleCategory={visibleCategory}
          inspection={inspection}
          navigation={navigation}
        />
      )}
      {showModalAddCategory && (
        <ModalAddCategory closeModal={() => setShowModalAddCategory(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 25,
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
