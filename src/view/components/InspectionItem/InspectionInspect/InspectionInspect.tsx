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
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  GET_ALL_INSPECTIONS_CATEGORY,
  GET_CATEGORY_ITEM_VALUE,
} from "~/services/api/GetInspectionCategory";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ContentLoader } from "../../Loader/Loader";
import { CategoryList } from "./CategoryList";
import { actionsCategoryTemplate } from "~/modules/categoriesTemplates";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { InspectionStatus } from "~/types/inspectionStatus";

interface Props {
  route: RouteProp<{ params: InspectionItem }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionInspect: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const inspection = route.params;

  const { inspectionItem, categories } = useAppSelector(
    (state) => state.inspectionItem
  );
  const [query, setQuery] = useState("");
  const [visibleCategories, setVisibleCategory] = useState(categories);
  const [showModalAddCategory, setShowModalAddCategory] = useState(false);

  const { data, loading } = useQuery(GET_ALL_INSPECTIONS_CATEGORY, {
    variables: {
      ids: [route.params.templateId],
    },
  });

  const [
    getCategoryItemsValues,
    {
      data: dataCategoryItems,
      loading: loadingCategoryItems,
      error: errorCategoryItems,
    },
  ] = useLazyQuery(GET_CATEGORY_ITEM_VALUE);

  useEffect(() => {
    if (categories.length > 0 && data) {
      getCategoryItemsValues({
        variables: {
          ids: categories
            .flatMap((category) => category.items.map((item) => item.id))
            .filter((itemId) => itemId.length > 0)
            .flat(),
        },
      });
    }
  }, [categories, data]);

  useEffect(() => {
    if (
      dataCategoryItems &&
      dataCategoryItems?.inspectionItemValues?.edges &&
      Array.isArray(dataCategoryItems?.inspectionItemValues?.edges) &&
      dataCategoryItems?.inspectionItemValues?.edges.every(
        (edge: any) =>
          typeof edge === "object" && edge.node && typeof edge.node === "object"
      )
    ) {
      dataCategoryItems?.inspectionItemValues?.edges.forEach((edge: any) => {
        const foundCategory = categories.find((category) =>
          category.items.find((item) => item.id === edge.node.inspectionItemId)
        );

        if (foundCategory) {
          dispatch(
            actionsCategoryTemplate.addCategoryItemValue({
              templateId: inspection.templateId,
              categoryId: foundCategory?.id || "",
              itemsValues: [edge.node],
            })
          );
        }
      });
    }
  }, [dataCategoryItems, loadingCategoryItems, errorCategoryItems]);

  useEffect(() => {
    setVisibleCategory(
      categories.filter((category) =>
        category.name
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query, inspectionItem, categories]);

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

      console.log("data was updated");

      dispatch(
        actionsCategoryTemplate.addCategoryTemplate({
          templateIdToAdd: route.params.templateId,
          categories: responseCategories,
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
      {inspectionItem?.status !== InspectionStatus.COMPLETE && (
        <TouchableOpacity onPress={() => setShowModalAddCategory(true)}>
          <InspecitonAddCategory />
        </TouchableOpacity>
      )}
      <View style={{ height: 15 }} />
      {(loadingCategoryItems || loading) && categories.length === 0 && !data ? (
        <View style={styles.loaderBox}>
          <ContentLoader />
        </View>
      ) : (
        <CategoryList
          visibleCategories={visibleCategories || []}
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
