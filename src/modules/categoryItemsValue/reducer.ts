import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryItemsValues, CategoryItemValueField } from "~/types/Category";

const initialState = {} as CategoryItemsValues;

const categoryItemsValuesSlice = createSlice({
  name: "categoryItemsValues",
  initialState: initialState,
  reducers: {
    addCategoryItemsValues: (
      state,
      {
        payload,
      }: PayloadAction< CategoryItemValueField[]>
    ) => {
      payload.forEach(categoryItemValue => {
        if (!state[categoryItemValue.inspectionId] || typeof state[categoryItemValue.inspectionId] !== 'object') {
          state[categoryItemValue.inspectionId] = {};
        }

        state[categoryItemValue.inspectionId][categoryItemValue.inspectionItemId] = categoryItemValue;
      });
    },
  },
});

export default categoryItemsValuesSlice.reducer;
export const { actions: actionsCategoryItemsValuesActions } = categoryItemsValuesSlice;
