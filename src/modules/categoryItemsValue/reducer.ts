import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryItemsValues, CategoryItemValueField } from "~/types/Category";

const initialState = {} as {
  [categoryId: string]: CategoryItemsValues
};

interface ICategoryItemsValues {
  categoryId: CategoryItemValueField[]
}

const categoryItemsValuesSlice = createSlice({
  name: "categoryItemsValues",
  initialState: initialState,
  reducers: {
    addCategoryItemsValues: (
      state,
      {
        payload,
      }: PayloadAction<ICategoryItemsValues[]>
    ) => {
      payload.forEach(categoryItemsValues => {
        const categoryId = Object.keys(categoryItemsValues)?.[0];
        const categotyItemsValuesObject: CategoryItemValueField[] =  Object.values(categoryItemsValues)?.[0];

        if (!state[categoryId]) {
          state[categoryId] = {};
        }

        categotyItemsValuesObject.forEach(categoryItemValue => {
          if (!state[categoryId]?.[categoryItemValue?.inspectionId]) {
            state[categoryId][categoryItemValue?.inspectionId] = {};
          }

          state[categoryId][categoryItemValue?.inspectionId][categoryItemValue.inspectionItemId] = categoryItemValue;
        })
      });
    },
  },
});

export default categoryItemsValuesSlice.reducer;
export const { actions: actionsCategoryItemsValuesActions } = categoryItemsValuesSlice;
