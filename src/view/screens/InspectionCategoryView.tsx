import React, { useEffect, useMemo, useState } from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors, layout, textStyles } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { InspectionItem } from "~/types/InspectionItem";
import {
  Category,
  CategoryItems,
  CategoryAmenities,
  CategoryAmenitiesResponse,
  CategoryItemsValues,
  CategoryItemValueField,
} from "~/types/Category";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { CategoryItemsList } from "../components/CategoryView/CategoryItemsList";
import { CategoryAmenitiesList } from "../components/CategoryView/CategoryAmenitiesList";
import { InspectionStatus } from "~/types/inspectionStatus";
import { normalize } from "~/utils/getWindowHeight";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_INSPECTIONS_CATEGORY,
  GET_CATEGORY_AMENITY_VALUE_INSPECTION,
  GET_CATEGORY_ITEM_VALUE_INSPECTION,
  UPDATE_CATEGORY_AMENITY_VALUE,
  UPDATE_CATEGORY_ITEM_VALUE,
  UPDATE_INSPECTION_CATEGORY_MUTATION,
} from "~/services/api/GetInspectionCategory";
import { ModalLoader } from "../components/Loader/ModalLoader";
import { ModalDeleteItem } from "../components/Custom/ModalDeleteItem";
import SaveIcon from "~/view/assets/icons/save.svg";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { actionsCategoryTemplate } from "~/modules/categoriesTemplates";
import { actionsCategoryAmenitiesActions } from "~/modules/categoryAmenitiesValues";
import { actionsCategoryItem } from "~/modules/categoryItem";
import { actionsCategoryItemsValuesActions } from "~/modules/categoryItemsValue";

interface Props {
  route: RouteProp<
    {
      params: {
        category: Category;
        inspection: InspectionItem;
        items: CategoryItems[];
        amenities: CategoryAmenities[];
      };
    },
    "params"
  >;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionCategoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { category, items, amenities } = route.params;
  const { categories, inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const {
    categoriesTemplates,
    categoryAmenitiesValues,
    categoryItemsValues,
    categoryItem: { amenitiesValues: dynamicAmenitiesValues, itemsValues: dynamicItemsValues },
  } = useAppSelector((state) => state);
  const { inspectionsSync } = useAppSelector((state) => state.inspections);
  const { profile } = useAppSelector((state) => state.user);
  const [updateCategoryItemValue] = useMutation(UPDATE_CATEGORY_ITEM_VALUE);
  const [updateCategoryAmenityValue] = useMutation(UPDATE_CATEGORY_AMENITY_VALUE);
  const [updateInspectionCategory] = useMutation(UPDATE_INSPECTION_CATEGORY_MUTATION);
  const {
    data: dataCategoryAmenitie,
    loading: loadingCategoryAmenitie,
    refetch: refetchCategoryAmenities,
  } = useQuery(GET_CATEGORY_AMENITY_VALUE_INSPECTION, {
    variables: {
      ids: amenities.map((amenity) => amenity.id),
      inspectionId: inspectionItem.id,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [
    getCategoryItemsValues,
    { refetch: refetchGetCategoryItemsValues, data: dataCategoryItemsValues },
  ] = useLazyQuery(GET_CATEGORY_ITEM_VALUE_INSPECTION, {
    variables: {
      ids: [] as string[],
      inspectionId: inspectionItem.id,
    },
  });

  const [loader, setLoader] = useState(false);
  const dynamycCategoryApplyToInspection = Boolean(
    categories.find((categoryToCheck) => categoryToCheck.id === category.id)?.isRequired
  );
  const [showModalUnsavedChanges, setShowModalUnsavedChanges] = useState(false);

  const { refetch } = useQuery(GET_ALL_INSPECTIONS_CATEGORY, {
    variables: {
      id: "",
    },
  });

  useEffect(() => {
    if (!dataCategoryAmenitie) {
      refetchCategoryAmenities({
        ids: amenities.map((amenity) => amenity.id),
        inspectionId: inspectionItem.id,
      })
    }
  }, [category])

  useEffect(() => {
    const currentCategoryAmenitiesValues: CategoryAmenitiesResponse = {};

    for (const amenity of amenities) {
      currentCategoryAmenitiesValues[amenity.id] = {};

      if (categoryAmenitiesValues?.[amenity.id]?.[inspectionItem.id]) {
        currentCategoryAmenitiesValues[amenity.id][inspectionItem.id] =
          categoryAmenitiesValues?.[amenity.id]?.[inspectionItem.id];
      }
    }

    dispatch(actionsCategoryItem.addCategoryAmenities(currentCategoryAmenitiesValues));
  }, [amenities, categoryAmenitiesValues]);

  useEffect(() => {
    const currentCategoryItemsValues: CategoryItemsValues = {};

    for (const categoryInspectionItem of items) {
      if (!currentCategoryItemsValues[inspectionItem.id]) {
        currentCategoryItemsValues[inspectionItem.id] = {};
      }

      if (categoryItemsValues?.[category.id]?.[inspectionItem.id]?.[categoryInspectionItem.id]) {
        currentCategoryItemsValues[inspectionItem.id][categoryInspectionItem.id] =
          categoryItemsValues?.[category.id]?.[inspectionItem.id]?.[categoryInspectionItem.id];
      }
    }

    dispatch(actionsCategoryItem.addDynamicCategoryItemsValues(currentCategoryItemsValues));
  }, [items, categoryItemsValues, category]);

  const inspectionIsCompleted = useMemo(
    () => inspectionItem?.status === InspectionStatus.COMPLETE,
    [inspectionItem]
  );

  const foundTemplateCategory = categoriesTemplates[inspectionItem.templateId]?.find(
    (categoryTemlate) => categoryTemlate.id === category.id
  );
  const foundDynamicCategory = categories.find(
    (categoryToCheck) => categoryToCheck.id === category.id
  );

  useEffect(() => {
    if (
      dataCategoryAmenitie &&
      dataCategoryAmenitie.inspectionAmenityValues &&
      dataCategoryAmenitie?.inspectionAmenityValues?.edges.map((edge: any) => edge?.node)
    ) {
      dispatch(
        actionsCategoryAmenitiesActions.addCategoryAmenitiesValues({
          categotyAmenitiesValues: dataCategoryAmenitie?.inspectionAmenityValues?.edges.map(
            (edge: any) => edge?.node
          ),
        })
      );
    }
  }, [dataCategoryAmenitie]);

  useEffect(() => {
    dispatch(
      actionsInspectionItem.setCategories(categoriesTemplates[inspectionItem.templateId] || [])
    );
  }, [categoriesTemplates[inspectionItem.templateId]]);

  useEffect(() => {
    if (
      dataCategoryItemsValues?.inspectionItemValues?.edges &&
      dataCategoryItemsValues?.inspectionItemValues?.edges?.every((edge: any) => edge?.node)
    ) {
      const categoryItemsValuesArray: any[] = [
        {
          [category.id]: dataCategoryItemsValues?.inspectionItemValues?.edges.map(
            (edge: any) => edge.node
          ),
        },
      ];

      dispatch(actionsCategoryItemsValuesActions.addCategoryItemsValues(categoryItemsValuesArray));
    }
  }, [dataCategoryItemsValues]);

  const categoryItemsValueWasChanged = useMemo(() => {
    return (
      Object.keys(dynamicItemsValues[inspectionItem.id] || {}).length > 0 &&
      Object.keys(dynamicItemsValues[inspectionItem.id] || {}).some(
        (itemId) =>
          dynamicItemsValues?.[inspectionItem.id]?.[itemId]?.value !==
            categoryItemsValues?.[category.id]?.[inspectionItem.id]?.[itemId]?.value ||
          dynamicItemsValues?.[inspectionItem.id]?.[itemId]?.comment !==
            categoryItemsValues?.[category.id]?.[inspectionItem.id]?.[itemId]?.comment
      )
    );
  }, [dynamicItemsValues, categoryItemsValues]);

  const categoryAmenitiesValueWasChanged = useMemo(() => {
    return (
      Object.keys(dynamicAmenitiesValues).length > 0 &&
      Object.keys(dynamicAmenitiesValues).some(
        (amenityId) =>
          dynamicAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.value !==
            categoryAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.value ||
          dynamicAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.comment !==
            categoryAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.comment
      )
    );
  }, [dynamicAmenitiesValues, categoryAmenitiesValues]);

  const hasUnsavedChanges = useMemo(
    () =>
      categoryItemsValueWasChanged ||
      categoryAmenitiesValueWasChanged ||
      foundTemplateCategory?.isRequired !== foundDynamicCategory?.isRequired,
    [
      foundDynamicCategory,
      foundTemplateCategory,
      categoryItemsValueWasChanged,
      categoryAmenitiesValueWasChanged,
    ]
  );

  const handleGoBackWithoutSaving = () => {
    if (hasUnsavedChanges && !inspectionIsCompleted) {
      setShowModalUnsavedChanges(true);
      return;
    }

    navigation.goBack();
  };

  const handleSaveGoBack = async () => {
    let updatePromises = [];

    Object.keys(dynamicItemsValues[inspectionItem.id] || {}).forEach((inspectionItemId) => {
      if (
        dynamicItemsValues?.[inspectionItem.id]?.[inspectionItemId]?.value !==
          categoryItemsValues?.[category.id]?.[inspectionItem.id]?.[inspectionItemId]?.value ||
        dynamicItemsValues?.[inspectionItem.id]?.[inspectionItemId]?.comment !==
          categoryItemsValues?.[category.id]?.[inspectionItem.id]?.[inspectionItemId]?.comment
      ) {
        updatePromises.push(
          updateCategoryItemValue({
            variables: {
              command: {
                customerId: "pfdylv",
                siteId: "pfdylv",
                id: dynamicItemsValues?.[inspectionItem.id]?.[inspectionItemId]?.id,
                inspectionId: inspectionItem?.id,
                inspectionItemId,
                value: dynamicItemsValues?.[inspectionItem.id]?.[inspectionItemId]?.value,
                comment: dynamicItemsValues?.[inspectionItem.id]?.[inspectionItemId]?.comment,
              },
            },
          })
        );
      }
    });

    Object.keys(dynamicAmenitiesValues).forEach((amenityId) => {
      if (
        dynamicAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.value !==
          categoryAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.value ||
        dynamicAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.comment !==
          categoryAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.comment
      ) {
        updatePromises.push(
          updateCategoryAmenityValue({
            variables: {
              command: {
                customerId: "pfdylv",
                siteId: "pfdylv",
                id: dynamicAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.id,
                inspectionId: inspectionItem?.id,
                inspectionAmenityId: amenityId,
                value: dynamicAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.value,
                comment: dynamicAmenitiesValues?.[amenityId]?.[inspectionItem.id]?.comment,
              },
            },
          })
        );
      }
    });

    if (foundTemplateCategory?.isRequired !== foundDynamicCategory?.isRequired) {
      updatePromises?.push(
        updateInspectionCategory({
          variables: {
            command: {
              customerId: "pfdylv",
              siteId: "pfdylv",
              id: category.id,
              inspectionTemplateId: inspectionItem?.templateId,
              name: category.title,
              isRequired: dynamycCategoryApplyToInspection,
              modifiedBy: profile?.email || "",
            },
          },
        })
      );
    }

    if (
      (updatePromises &&
        updatePromises.length > 0 &&
        updatePromises.filter((promise) => promise).length > 0)
    ) {
      try {
        console.log("Waiting for updates to complete...");
        setLoader(true);
        await Promise.all(updatePromises);
        if (foundTemplateCategory?.isRequired !== foundDynamicCategory?.isRequired) {
          await refetch({
            id: inspectionItem?.templateId,
          });
        }

        if (categoryItemsValueWasChanged) {
          await refetchGetCategoryItemsValues({
            ids: items.map((item) => item.id),
            inspectionId: inspectionItem.id,
          });
        }

        if (categoryAmenitiesValueWasChanged) {
          await refetchCategoryAmenities({
            ids: amenities.map((amenity) => amenity.id),
            inspectionId: inspectionItem.id,
          });
        }
        navigation.goBack();
        console.log("updates completed");
      } catch (e) {
        console.log("error in update categoryItemValue: ", e);
      } finally {
        setLoader(false);
      }
    } else {
      navigation.goBack();
    }
  };

  const handleGoBackWithoutSaved = () => {
    dispatch(
      actionsInspectionItem.setCategories(
        categoriesTemplates[inspectionItem?.templateId || ""] || []
      )
    );
    setShowModalUnsavedChanges(false);
    navigation.goBack();
  };

  return (
    <Screen backgroundColor={colors.layout} paddingTop={layout.screenPadding} borderRadius={55}>
      <View style={styles.content}>
        {showModalUnsavedChanges && (
          <ModalDeleteItem
            title={"You have unsaved changes. Unsaved changes will be lost."}
            Icon={SaveIcon}
            onContinue={handleGoBackWithoutSaved}
            onCancel={() => setShowModalUnsavedChanges(false)}
            message="Are you sure you want to leave without saving changes?"
          />
        )}
        <SelectedInspection
          item={inspectionItem}
          goBack={handleGoBackWithoutSaving}
          includeCategory
          category={category}
        />
        <View style={{ height: normalize(20) }}></View>
        <ScrollView style={{ paddingHorizontal: 5, flex: 1 }} showsVerticalScrollIndicator={false}>
          <CategoryItemsList categoryItems={items} categoryId={category.id} />
          <CategoryAmenitiesList
            categoryAmenities={amenities}
            loading={loadingCategoryAmenitie}
            categoryId={category.id}
          />
          {inspectionItem?.status !== InspectionStatus.COMPLETE && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoBack}>
              <Text style={styles.saveButtonText}>Save and Go Back</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
      {loader && <ModalLoader />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: normalize(100),
    borderTopLeftRadius: normalize(100),
    paddingHorizontal: "7%",
    paddingTop: normalize(35),
    paddingBottom: 0,
  },
  label: {
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  saveButton: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: colors.layout,
    paddingVertical: "2%",
    paddingHorizontal: "10%",
    borderRadius: 30,
    marginBottom: "5%",
    marginTop: "4%",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    ...textStyles.regular,
  },
  noItemsBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
});
