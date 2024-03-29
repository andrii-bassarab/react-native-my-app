import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryAmenitiesResponse, CategoryItemsValues } from "~/models/category";

const initialState = {
  itemsValues: {},
  amenitiesValues: {}
} as {
  itemsValues: CategoryItemsValues,
  amenitiesValues: CategoryAmenitiesResponse
};

const categoryItemSlice = createSlice({
  name: "categoryItem",
  initialState: initialState,
  reducers: {
    addCategoryAmenities: (
      state,
      action: PayloadAction<CategoryAmenitiesResponse>
    ) => {
      state.amenitiesValues = {};
      for (const amenityId in action.payload) {
        state.amenitiesValues[amenityId] = action.payload[amenityId]
      }
    },
    addDynamicCategoryItemsValues: (
      state,
      action: PayloadAction<CategoryItemsValues>
    ) => {
      state.itemsValues = {};
      for (const inspectionId in action.payload) {
        state.itemsValues[inspectionId] = action.payload[inspectionId]
      }
    },
    setChangeCategoryAmenitiesValues: (
      state,
      action: PayloadAction<{
        amenityId: string;
        inspectionId: string;
        amenitieComment: string;
        amenitieResult: boolean;
      }>
    ) => {
      const { amenityId, inspectionId, amenitieComment, amenitieResult } = action.payload;

      if (state.amenitiesValues?.[amenityId]?.[inspectionId]) {
        state.amenitiesValues[amenityId][inspectionId].comment = amenitieComment;
        state.amenitiesValues[amenityId][inspectionId].value = amenitieResult ? "true" : "false";
      }
    },
    setChangeCategoryItemsValues: (
      state,
      action: PayloadAction<{
        inspectionItemId: string;
        inspectionId: string;
        itemComment: string;
        itemResult: boolean;
      }>
    ) => {
      const { inspectionItemId, inspectionId, itemComment, itemResult } = action.payload;

      if (state.itemsValues?.[inspectionId]?.[inspectionItemId]) {
        state.itemsValues[inspectionId][inspectionItemId].comment = itemComment;
        state.itemsValues[inspectionId][inspectionItemId].value = itemResult ? "true" : "false";
      }
    },
  },
});

export default categoryItemSlice.reducer;
export const { actions: actionsCategoryItem } = categoryItemSlice;
