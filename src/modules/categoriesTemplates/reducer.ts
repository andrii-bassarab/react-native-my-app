import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CategoryAmenityValue,
  CategoryItemValue,
  CategoryType,
} from "~/types/Category";

interface CategoryTemplate {
  [templateId: string]: CategoryType[];
}

const initialState: CategoryTemplate = {};

const categoryTemplateSlice = createSlice({
  name: "categoryTemplate",
  initialState: initialState,
  reducers: {
    addCategoryTemplate: (
      state,
      {
        payload,
      }: PayloadAction<{
        templateIdToAdd: string;
        categories: CategoryType[];
      }>
    ) => {
      const { templateIdToAdd, categories } = payload;
      state[templateIdToAdd] = categories;
    },
    addCategoryItemValue: (
      state,
      {
        payload,
      }: PayloadAction<{
        templateId: string;
        categoryId: string;
        itemsValues: CategoryItemValue[];
      }>
    ) => {
      const { templateId, categoryId, itemsValues } = payload;
      const categories = state[templateId];
      const foundCategory = categories.find(
        (category) => category.id === categoryId
      );

      if (foundCategory) {
        itemsValues.forEach((itemValue) => {
          const item = foundCategory?.items?.find(
            (item) => item.id === itemValue.inspectionItemId
          );
          if (item) {
            item.inspectionItemId = itemValue.inspectionItemId;
            item.comment = {
              createdBy: itemValue.inspectedBy || "User not regognized",
              createdOn: itemValue.inspectedOn || "Created time not regognized",
              commentBody: itemValue.comment || "Item comment",
            };
            item.result = itemValue.itemOptionId === null;
          }
        });

        foundCategory.result = foundCategory.items.every(item => item.result === true) ? "Passed" : "Failed"
      }
    },
    addCategoryAmenitieValue: (
      state,
      {
        payload,
      }: PayloadAction<{
        templateId: string;
        categoryId: string;
        amenitiesValues: CategoryAmenityValue[];
      }>
    ) => {
      const { templateId, categoryId, amenitiesValues } = payload;
      const categories = state[templateId];
      const foundCategory = categories.find(
        (category) => category.id === categoryId
      );

      amenitiesValues.forEach((amenitieValue) => {
        const amenity = foundCategory?.amenities?.find(
          (amenity) => amenity.id === amenitieValue.inspectionAmenityId
        );
        if (amenity) {
          amenity.comment = {
            createdBy: amenitieValue.inspectedBy || "User not regognized",
            createdOn:
              amenitieValue.inspectedOn || "Created time not regognized",
            commentBody: amenitieValue.comment || "Amenitie comment",
          };
          amenity.result = amenitieValue.value === "true";
        }
      });
    },
  },
});

export default categoryTemplateSlice.reducer;
export const { actions: actionsCategoryTemplate } = categoryTemplateSlice;
