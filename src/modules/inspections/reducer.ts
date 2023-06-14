import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "~/types/Category";
import { InspectionItem } from "~/types/InspectionItem";

const initialState = {
  inspections: [] as InspectionItem[],
  inspectionsSync: false,
  visibleLoader: false,
  syncError: false,
};

const inspectionsSlice = createSlice({
  name: "inspections",
  initialState,
  reducers: {
    setInspections: (state, action: PayloadAction<InspectionItem[]>) => {
      state.inspections = action.payload
    },
    pushInspection: (state, action: PayloadAction<InspectionItem>) => {
      state.inspections = [...state.inspections, action.payload]
    },
    clearInspections: (state) => {
      state.inspections = []
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.inspectionsSync = action.payload
    },
    setVisibleLoading: (state, action: PayloadAction<boolean>) => {
      state.visibleLoader = action.payload
    },
    setSyncError: (state, action: PayloadAction<boolean>) => {
      state.syncError = action.payload
    },
  },
})

export default inspectionsSlice.reducer;
export const { actions: actionsInspections } = inspectionsSlice;