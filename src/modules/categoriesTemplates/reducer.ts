import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "~/types/Category";

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
      { payload }: PayloadAction<{
        templateIdToAdd: string;
        categories: CategoryType[];
      }>
    ) => {
      const { templateIdToAdd, categories } = payload;
      state[templateIdToAdd] = categories;
    },
    addCategoryComment: (
      state,
      { payload }: PayloadAction<{
        templateId: string;
        itemId: string;
        commentToAdd: string;
      }>
    ) => {
      const { templateId, commentToAdd, itemId } = payload;
      const categories = state[templateId];

      const mocksComments = {
        createdBy: "heather@hdslabs.com",
        createdOn: "2020-04-13T19:19:31.460Z",
        commentBody: commentToAdd,
      };

      categories.forEach((category) => {
        const item = category.items.find((item) => item.id === itemId);
        if (item) {
          item.comment = mocksComments;
        }
      });    
    },
  },
});

export default categoryTemplateSlice.reducer;
export const { actions: actionsCategoryTemplate } = categoryTemplateSlice;
