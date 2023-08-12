import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryAmenitiesResponse, CategoryAmenityField } from "~/models/category";

const initialState = {} as CategoryAmenitiesResponse;

const categoryAmenitiesValuesSlice = createSlice({
  name: "categoryAmenitiesValues",
  initialState: initialState,
  reducers: {
    addCategoryAmenitiesValues: (
      state,
      {
        payload,
      }: PayloadAction<{
        categotyAmenitiesValues: CategoryAmenityField[];
      }>
    ) => {
      const { categotyAmenitiesValues } = payload;
      categotyAmenitiesValues.forEach(categoryAmenity => {
        if (!state[categoryAmenity.inspectionAmenityId] || typeof state[categoryAmenity.inspectionAmenityId] !== 'object') {
          state[categoryAmenity.inspectionAmenityId] = {};
        }

        state[categoryAmenity.inspectionAmenityId][categoryAmenity.inspectionId] = categoryAmenity;
      });
    },
  },
});

export default categoryAmenitiesValuesSlice.reducer;
export const { actions: actionsCategoryAmenitiesActions } = categoryAmenitiesValuesSlice;
