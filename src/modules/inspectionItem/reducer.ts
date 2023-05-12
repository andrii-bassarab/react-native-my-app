import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "~/types/Category";

const initialState = {
  hasUnsavedChanges: false,
  categories: [
    {
      title: "Living Room",
      status: "--",
      result: "--",
      items: 0,
      photos: "No",
      categoryApplyToInspection: true,
    },
    {
      title: "Kitchen",
      status: "Complete",
      result: "Failed",
      items: 2,
      photos: "Yes",
      categoryApplyToInspection: false,
    },
    {
      title: "Bathroom",
      status: "Complete",
      result: "Passed",
      items: 7,
      photos: "Yes",
      categoryApplyToInspection: true,
    },
    {
      title: "Bedroom",
      status: "Complete",
      result: "Failed",
      items: 0,
      photos: "No",
      categoryApplyToInspection: false,
    },
    {
      title: "Living Room (addition)",
      status: "Incomplete",
      result: "No results yet",
      items: 0,
      photos: "No",
      categoryAdded: true,
      categoryApplyToInspection: true,
    },
  ] as Category[],
  startSignature: false,
  signatureCount: 3,
};

const inspectionItemSlice = createSlice({
  name: "inspectionItem",
  initialState: initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories = [action.payload, ...state.categories]
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload
    },
    setStartSignature: (state, action: PayloadAction<boolean>) => {
      state.startSignature = action.payload;
    },
    clearInspectionItem: () => ({
      hasUnsavedChanges: false,
      categories: [],
      startSignature: false,
      signatureCount: 0,
    }),
    setToggleCategoryApplyToInspection: (state, { payload }: PayloadAction<Category>) => {
      const foundCategory = state.categories.find(category => category.title === payload.title);

      if (foundCategory) {
        foundCategory.categoryApplyToInspection = !foundCategory.categoryApplyToInspection;
      }
    }
  },
})

export default inspectionItemSlice.reducer
export const { actions: actionsInspectionItem } = inspectionItemSlice