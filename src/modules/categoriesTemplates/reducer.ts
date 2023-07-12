import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryAmenitiesResponse, CategoryType } from "~/types/Category";

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
    addCategoryAmenitieValue: (
      state,
      {
        payload,
      }: PayloadAction<{
        templateIdToCheck: string;
        categoryId: string;
        amenitiesValues: CategoryAmenitiesResponse[];
      }>
    ) => {
      const { templateIdToCheck, categoryId, amenitiesValues } = payload;

      const fountTemplate = state[templateIdToCheck];
      const foundCategory = fountTemplate.find(
        (templateCategory) => templateCategory.id === categoryId
      );

      if (foundCategory) {
        foundCategory.amenities = amenitiesValues.map((amenity) => {
          return {
            ...amenity,
            amenityValues: amenity.amenityValues?.[0] ? {
              ...amenity.amenityValues?.[0],
              comment: amenity.amenityValues?.[0]?.comment || "amenity comment",
            } : null, 
          }
        });
      }
    },
  },
});

export default categoryTemplateSlice.reducer;
export const { actions: actionsCategoryTemplate } = categoryTemplateSlice;
