import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryItemValue, CategoryType } from "~/types/Category";

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
      const foundCategory = categories.find(category => category.id === categoryId);

      itemsValues.forEach(itemValue => {        
          const item = foundCategory?.items?.find((item) => item.id === itemValue.inspectionItemId);
          if (item) {
            item.comment = {
              createdBy: itemValue.inspectedBy || "User not regognized",
              createdOn: itemValue.inspectedOn || "Created time not regognized",
              commentBody: itemValue.comment,
            };
            item.result = itemValue.itemOptionId === null
          }
      });
    },
  },
});

export default categoryTemplateSlice.reducer;
export const { actions: actionsCategoryTemplate } = categoryTemplateSlice;
