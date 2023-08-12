import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "~/models/category";
import { CategoryTemplate } from "./types";

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
  },
});

export default categoryTemplateSlice.reducer;
export const { actions: actionsCategoryTemplate } = categoryTemplateSlice;
