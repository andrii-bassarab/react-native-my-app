import React, { useEffect, useMemo } from "react";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { InspectionItem } from "~/types/InspectionItem";
import { Category, CategoryItemField } from "~/types/Category";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_ITEM_VALUE } from "~/services/api/GetInspectionCategory";
import { actionsCategoryTemplate } from "~/modules/categoriesTemplates";
import { ContentLoader } from "../components/Loader/Loader";
import { CategoryItemsList } from "../components/CategoryView/CategoryItemsList";
import { CategoryAmenitiesList } from "../components/CategoryView/CategoryAmenitiesList";

interface Props {
  route: RouteProp<
    {
      params: {
        category: Category;
        inspection: InspectionItem;
        items: CategoryItemField[];
        amenities: any[];
      };
    },
    "params"
  >;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionCategoryScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { inspection, category, items, amenities } = route.params;
  const { categoryApplyToInspection, categories } = useAppSelector(
    (state) => state.inspectionItem
  );

  const goBack = () => navigation.goBack();

  const categoryItemsValues = useMemo(
    () =>
      categories.find((categoryTemplate) => categoryTemplate.id === category.id)
        ?.items || [],
    [categories, category]
  );

  const { data, loading, error } = useQuery(GET_CATEGORY_ITEM_VALUE, {
    variables: {
      ids: items.map((item) => item.id),
    },
    skip: items.length === 0,
  });

  useEffect(() => {
    if (
      data &&
      data?.inspectionItemValues?.edges &&
      Array.isArray(data?.inspectionItemValues?.edges) &&
      data?.inspectionItemValues?.edges.every(
        (edge: any) =>
          typeof edge === "object" && edge.node && typeof edge.node === "object"
      )
    ) {
      dispatch(
        actionsCategoryTemplate.addCategoryItemValue({
          templateId: inspection.templateId,
          categoryId: category.id,
          itemsValues: data?.inspectionItemValues?.edges.map(
            (edge: any) => edge.node
          ),
        })
      );
    }
  }, [data, loading, error]);

  console.log(loading, "loading");
  console.log(data, "data");
  console.log(error, "error");
  console.log(items, "items");

  return (
    <Screen backgroundColor={colors.layout} paddingTop={5} borderRadius={55}>
      <View style={styles.content}>
        <SelectedInspection
          item={inspection}
          goBack={goBack}
          includeCategory
          category={category}
        />
        <View style={{ height: 15 }}></View>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ContentLoader />
          </View>
        ) : (
          <ScrollView
            style={{ paddingHorizontal: 5, flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <CategoryItemsList
              categoryItemsValues={categoryItemsValues}
              loading={loading}
              categoryApplyToInspection={categoryApplyToInspection}
            />
            <CategoryAmenitiesList
              categoryItemsValues={amenities}
              loading={false}
              categoryApplyToInspection={categoryApplyToInspection}
            />
            {(items.length > 0 || amenities.length > 0) && (
              <TouchableOpacity style={styles.saveButton} onPress={goBack}>
                <Text style={styles.saveButtonText}>Save and Go Back</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 0,
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.5,
    fontSize: 13,
  },
  label: {
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
    textAlign: "left",
    flex: 1,
    fontSize: 13,
  },
  amenitiesTitle: {
    color: colors.textGrey,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: "3%",
  },
  saveButton: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: colors.layout,
    paddingVertical: "3%",
    paddingHorizontal: "10%",
    borderRadius: 30,
    marginBottom: "5%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noItemsBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  noItemsText: {
    fontSize: 20,
    color: colors.textGrey,
    fontWeight: "700",
  },
});
