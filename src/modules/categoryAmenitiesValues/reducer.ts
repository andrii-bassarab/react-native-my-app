import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryAmenitiesResponse, CategoryAmenityField } from "~/types/Category";

type CategoryTemplate = CategoryAmenitiesResponse;

const initialState = {} as CategoryTemplate;

console.log("initialState", initialState)

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
      console.log("categotyAmenitiesValues", categotyAmenitiesValues)
      categotyAmenitiesValues.forEach(categoryAmenity => {
        state[categoryAmenity.inspectionAmenityId][categoryAmenity.inspectionId] = categoryAmenity;
      });
    },
  },
});

export default categoryAmenitiesValuesSlice.reducer;
export const { actions: actionsCategoryAmenitiesActions } = categoryAmenitiesValuesSlice;
