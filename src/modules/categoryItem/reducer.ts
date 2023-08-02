import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryAmenitiesResponse } from "~/types/Category";

const initialState = {} as CategoryAmenitiesResponse;

const categoryItemSlice = createSlice({
  name: "categoryItem",
  initialState: initialState,
  reducers: {
    addCategoryAmenities: (
      state,
      action: PayloadAction<CategoryAmenitiesResponse>
    ) => {
      for (const amenityId in action.payload) {
        state[amenityId] = action.payload[amenityId]
      }
    },
    setCategoryAmenitiesValues: (
      state,
      action: PayloadAction<{
        amenityId: string;
        inspectionId: string;
        amenitieComment: string;
        amenitieResult: boolean;
      }>
    ) => {
      const { amenityId, inspectionId, amenitieComment, amenitieResult } = action.payload;

      if (state?.[amenityId]?.[inspectionId]) {
        state[amenityId][inspectionId].comment = amenitieComment;
        state[amenityId][inspectionId].value = amenitieResult ? "true" : "false";
      }
    },
  },
});

export default categoryItemSlice.reducer;
export const { actions: actionsCategoryItem } = categoryItemSlice;
