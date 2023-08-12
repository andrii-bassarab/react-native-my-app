import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { InspectionType } from "~/models/InspectionItem";
import { SearchForm } from "../../Inspections/SearchForm";
import { InspecitonAddCategory } from "./InspectionAddCategory";
import { ModalAddCategory } from "./ModalAddCategory";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  GET_ALL_INSPECTIONS_CATEGORY,
  GET_CATEGORY_ITEM_VALUE_INSPECTION,
} from "~/services/api/category/GetInspectionCategory";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ContentLoader } from "../../Loader/Loader";
import { CategoryList } from "./CategoryList";
import { actionsCategoryTemplate } from "~/modules/categoriesTemplates";
import { InspectionStatus } from "~/types/inspectionStatus";
import { CategoryItemValueField, CategoryType } from "~/models/category";
import { normalize } from "~/utils/normalize/normalize";
import { getCategoryResult } from "~/utils/category.ts/storeCategoryTemplate";
import { actionsCategoryItemsValuesActions } from "~/modules/categoryItemsValue";

interface Props {
  route: RouteProp<{ params: InspectionType }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionInspect: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const inspection = route.params;

  const { inspectionItem, categories } = useAppSelector((state) => state.inspectionItem);
  const { categoryItemsValues, categoriesTemplates } = useAppSelector((state) => state);
  const { inspections } = useAppSelector((state) => state.inspections);
  const [loader, setLoader] = useState(false);

  const [query, setQuery] = useState("");
  const [visibleCategories, setVisibleCategory] = useState(categories);
  const [showModalAddCategory, setShowModalAddCategory] = useState(false);

  const { data, loading, error } = useQuery(GET_ALL_INSPECTIONS_CATEGORY, {
    variables: {
      id: route.params.templateId,
    },
  });

  const [getCategoryItemsValues, { loading: loadingCategoryItems, data: resultData }] =
    useLazyQuery(GET_CATEGORY_ITEM_VALUE_INSPECTION, {
      variables: {
        ids: [] as string[],
        inspectionId: inspectionItem.id,
      },
    });
  
  useEffect(() => {
    const fetchCategoryItemsValues = async () => {
      try {
        setLoader(true);
        const responseCategories: CategoryType[] = data.inspectionCategories.edges.map(
          (edge: any) => edge.node
        );
      
        const responseCategoryItemsValues = await Promise.all(
          (categories.length > 0 ? categories : responseCategories).map((category) =>
            getCategoryItemsValues({
              variables: {
                ids: category?.items?.map((item) => item?.id) || [],
                inspectionId: inspectionItem.id,
              },
            })
          )
        );

        const categoryItemsValuesArray = responseCategoryItemsValues.flatMap((item, index) => {
            const categoryId = (categories.length > 0 ? categories : responseCategories)?.[index]?.id;
            return {
              [categoryId]: item.data?.inspectionItemValues?.edges?.map((edge: any) => edge?.node),
            };
          });

        dispatch(actionsCategoryItemsValuesActions.addCategoryItemsValues(categoryItemsValuesArray));
        setLoader(false);
      } catch (error) {
        console.error("Error fetching category items values:", error);
      } finally {
        setLoader(false);
      }
    };

    if (data && data?.inspectionCategories?.edges) {
      fetchCategoryItemsValues();
    }
  }, [inspectionItem, data]);

  useEffect(() => {
    setVisibleCategory(
      categories.filter((category) =>
        category.name.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
      )
    );
  }, [query, inspectionItem, categories]);

  useEffect(() => {
    if (
      data &&
      data.inspectionCategories?.edges &&
      Array.isArray(data.inspectionCategories?.edges) &&
      data.inspectionCategories?.edges.every(
        (edge: any) => typeof edge === "object" && edge.node && typeof edge.node === "object"
      )
    ) {
      const responseCategories: CategoryType[] = data.inspectionCategories.edges.map(
        (edge: any) => edge.node
      );

      dispatch(
        actionsCategoryTemplate.addCategoryTemplate({
          templateIdToAdd: route.params.templateId,
          categories: getCategoryResult(
            responseCategories,
            categoryItemsValues,
          ),
        })
      );
    }
  }, [data, resultData, categoryItemsValues]);

  return (
    <View style={styles.content}>
      <View>
        <SearchForm query={query} setQuery={setQuery} placeholder="Search Category" />
      </View>
      <View style={{ height: 15 }} />
      {inspectionItem?.status !== InspectionStatus.COMPLETE && (
        <TouchableOpacity onPress={() => setShowModalAddCategory(true)}>
          <InspecitonAddCategory />
        </TouchableOpacity>
      )}
      <View style={{ height: normalize(15) }} />
      {(loading || loader) && (!data || !resultData)? (
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
    paddingTop: normalize(10),
    paddingHorizontal: "7%",
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
