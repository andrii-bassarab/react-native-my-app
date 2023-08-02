import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryAmenityField, CategoryType } from "~/types/Category";

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
    // addCategoryAmenitieValue: (
    //   state,
    //   {
    //     payload,
    //   }: PayloadAction<{
    //     templateIdToCheck: string;
    //     categoryId: string;
    //     amenitiesValues: CategoryAmenityField[];
    //   }>
    // ) => {
    //   const { templateIdToCheck, categoryId, amenitiesValues } = payload;

    //   const fountTemplate = state[templateIdToCheck];
    //   const foundCategory = fountTemplate.find(
    //     (templateCategory) => templateCategory.id === categoryId
    //   );

    //   if (foundCategory) {
    //     amenitiesValues.forEach(amenityValue => {
    //       const foundCategoryAmenity = foundCategory.amenities.find(amenity => amenity.id === amenityValue.inspectionAmenityId);
    //       if (foundCategoryAmenity && foundCategoryAmenity.amenityValues) {
    //         foundCategoryAmenity.amenityValues[amenityValue.inspectionId] = amenityValue;
    //       }
    //     })
    //   }
    // },
  },
});

export default categoryTemplateSlice.reducer;
export const { actions: actionsCategoryTemplate } = categoryTemplateSlice;
