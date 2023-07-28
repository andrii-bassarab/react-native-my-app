import React, { useEffect, useMemo, useState } from "react";
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
import { colors, layout, textStyles } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { InspectionItem } from "~/types/InspectionItem";
import { Category, CategoryItems, CategoryAmenities } from "~/types/Category";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { CategoryItemsList } from "../components/CategoryView/CategoryItemsList";
import { CategoryAmenitiesList } from "../components/CategoryView/CategoryAmenitiesList";
import { InspectionStatus } from "~/types/inspectionStatus";
import { normalize } from "~/utils/getWindowHeight";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_INSPECTIONS_CATEGORY,
  GET_CATEGORY_AMENITY_VALUE,
  GET_CATEGORY_AMENITY_VALUE_INSPECTION,
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

export const InspectionCategoryScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { category, items, amenities } = route.params;
  const { categories, inspectionItem } = useAppSelector(
    (state) => state.inspectionItem
  );
  const { categoriesTemplates } = useAppSelector((state) => state);
  const { inspectionsSync } = useAppSelector((state) => state.inspections);
  const { profile } = useAppSelector((state) => state.user);
  const [updateCategoryItemValue] = useMutation(UPDATE_CATEGORY_ITEM_VALUE);
  const [updateCategoryAmenityValue] = useMutation(
    UPDATE_CATEGORY_AMENITY_VALUE
  );
  const [updateInspectionCategory] = useMutation(
    UPDATE_INSPECTION_CATEGORY_MUTATION
  );
  const { data: dataCategoryAmenitie, loading: loadingCategoryAmenitie } = useQuery(
    GET_CATEGORY_AMENITY_VALUE_INSPECTION,
    {
      variables: {
        ids: amenities.map((amenity) => amenity.id),
        inspectionId: inspectionItem.id,
      },
    }
  );
  const [loader, setLoader] = useState(false);
  const dynamycCategoryApplyToInspection = Boolean(
    categories.find((categoryToCheck) => categoryToCheck.id === category.id)
      ?.isRequired
  );
  const [showModalUnsavedChanges, setShowModalUnsavedChanges] = useState(false);
  const visibleAmenities =
    categories.find((categoryToCheck) => categoryToCheck.id === category.id)
      ?.amenities || [];

  const { refetch } = useQuery(GET_ALL_INSPECTIONS_CATEGORY, {
    variables: {
      id: "",
    },
  });
  const inspectionIsCompleted = useMemo(
    () => inspectionItem?.status === InspectionStatus.COMPLETE,
    [inspectionItem]
  );

  const foundTemplateCategory = categoriesTemplates[inspectionItem.templateId]?.find((categoryTemlate) => categoryTemlate.id === category.id);
  const foundDynamicCategory = categories.find(
    (categoryToCheck) => categoryToCheck.id === category.id
  );

  useEffect(() => {
    // if (inspectionsSync) {
    //   refetchCategoryAmenities({
    //     id: category.id,
    //   });
    // }
  }, [inspectionsSync]);

  useEffect(() => {
    if (
      dataCategoryAmenitie &&
      dataCategoryAmenitie.inspectionAmenityValues &&
      dataCategoryAmenitie?.inspectionAmenityValues?.edges.map(
        (edge: any) => edge?.node
      )
    ) {

      console.log("amenities", dataCategoryAmenitie?.inspectionAmenityValues?.edges.map(
        (edge: any) => edge?.node
      ),)
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
      actionsInspectionItem.setCategories(
        categoriesTemplates[inspectionItem.templateId] || []
      )
    );
  }, [categoriesTemplates[inspectionItem.templateId]]);

  const hasUnsavedChanges = useMemo(
    () =>
      (Number(foundDynamicCategory?.items?.length) > 0 &&
        foundDynamicCategory?.items.some(
          (item, index) =>
            item?.itemsValues[0]?.value !==
              foundTemplateCategory?.items[index]?.itemsValues[0]?.value ||
            item?.itemsValues[0]?.comment !==
              foundTemplateCategory?.items[index]?.itemsValues[0]?.comment
        )) ||
      (Number(foundDynamicCategory?.amenities?.length) > 0 &&
        foundDynamicCategory?.amenities.some(
          (amenity, index) =>
            amenity?.amenityValues?.value !==
              foundTemplateCategory?.amenities[index]?.amenityValues?.value ||
            amenity?.amenityValues?.comment !==
              foundTemplateCategory?.amenities[index]?.amenityValues?.comment
        )) ||
      foundTemplateCategory?.isRequired !== foundDynamicCategory?.isRequired,
    [foundDynamicCategory, foundTemplateCategory]
  );

  const handleGoBackWithoutSaving = () => {
    if (hasUnsavedChanges && !inspectionIsCompleted) {
      setShowModalUnsavedChanges(true);
      return;
    }

    navigation.goBack();
  };

  const handleSaveGoBack = async () => {
    let updatePromises = foundDynamicCategory?.items?.map((item, index) => {
      if (
        item?.itemsValues[0]?.value !==
          foundTemplateCategory?.items[index]?.itemsValues[0]?.value ||
        item?.itemsValues[0]?.comment !==
          foundTemplateCategory?.items[index]?.itemsValues[0]?.comment
      ) {
        return updateCategoryItemValue({
          variables: {
            command: {
              customerId: "pfdylv",
              siteId: "pfdylv",
              id: item?.itemsValues[0]?.id,
              inspectionId: inspectionItem?.id,
              inspectionItemId: item.id,
              value: item?.itemsValues[0]?.value,
              comment: item?.itemsValues[0]?.comment,
            },
          },
        });
      }
    });

    foundDynamicCategory?.amenities?.forEach((amenity, index) => {
      if (
        amenity?.amenityValues?.value !==
          foundTemplateCategory?.amenities[index]?.amenityValues?.value ||
        amenity?.amenityValues?.comment !==
          foundTemplateCategory?.amenities[index]?.amenityValues?.comment
      ) {
        updatePromises?.push(
          updateCategoryAmenityValue({
            variables: {
              command: {
                customerId: "pfdylv",
                siteId: "pfdylv",
                id: amenity?.amenityValues?.id,
                inspectionId: inspectionItem?.id,
                inspectionAmenityId: amenity.id,
                value: amenity?.amenityValues?.value,
                comment: amenity?.amenityValues?.comment,
              },
            },
          })
        );
      }
    });

    if (
      foundTemplateCategory?.isRequired !== foundDynamicCategory?.isRequired
    ) {
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
              modifiedBy: profile?.email || "test",
            },
          },
        })
      );
    }

    if (
      updatePromises &&
      updatePromises.length > 0 &&
      updatePromises.filter((promise) => promise).length > 0
    ) {
      try {
        console.log("Waiting for updates to complete...");
        setLoader(true);
        await Promise.all(updatePromises);
        await refetch({
          id: inspectionItem?.templateId,
        });
        // await refetchCategoryAmenities({
        //   id: category.id,
        // });
        navigation.goBack();
      } catch (e) {
        console.log("error in update categoryItemValue: ", e);
      } finally {
        setLoader(false);
        console.log("updates completed");
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
    <Screen
      backgroundColor={colors.layout}
      paddingTop={layout.screenPadding}
      borderRadius={55}
    >
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
        <ScrollView
          style={{ paddingHorizontal: 5, flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <CategoryItemsList
            categoryItemsValues={items}
            categoryId={category.id}
          />
          <CategoryAmenitiesList
            categoryAmenitiesValues={visibleAmenities}
            loading={loadingCategoryAmenitie}
            categoryId={category.id}
          />
          {inspectionItem?.status !== InspectionStatus.COMPLETE && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveGoBack}
            >
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
