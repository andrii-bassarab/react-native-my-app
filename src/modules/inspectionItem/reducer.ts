import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryType } from "~/types/Category";
import { InspectionItem } from "~/types/InspectionItem";

const initialState = {
  hasUnsavedChanges: false,
  inspectionItem: null as null | InspectionItem,
  categories: [] as CategoryType[],
  startSignature: false,
  signatureCount: 3,
  visibleAssignedTo: null as null | string,
  visiblePhoneNumber: null as null | string,
};

const inspectionItemSlice = createSlice({
  name: "inspectionItem",
  initialState: initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<CategoryType>) => {
      state.categories.push(action.payload);
    },
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = action.payload;
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },
    setInspectionItem: (state, action: PayloadAction<InspectionItem>) => {
      state.inspectionItem = action.payload;
    },
    setInspectionStatus: (
      { inspectionItem },
      action: PayloadAction<string>
    ) => {
      if (inspectionItem) {
        inspectionItem.status = action.payload;
      }
    },
    setStartSignature: (state, action: PayloadAction<boolean>) => {
      state.startSignature = action.payload;
    },
    setVisibleAssignedTo: (state, action: PayloadAction<string>) => {
      state.visibleAssignedTo = action.payload;
    },
    setVisiblePhoneNumber: (state, action: PayloadAction<string>) => {
      state.visiblePhoneNumber = action.payload;
    },
    clearInspectionItem: () => ({
      hasUnsavedChanges: false,
      inspectionItem: null,
      categories: [],
      startSignature: false,
      signatureCount: 3,
      visibleAssignedTo: null,
      visiblePhoneNumber: null,
    }),
  },
});

export default inspectionItemSlice.reducer;
export const { actions: actionsInspectionItem } = inspectionItemSlice;
