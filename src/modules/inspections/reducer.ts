import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InspectionType } from "~/models/InspectionItem";

const initialState = {
  inspections: [] as InspectionType[],
  inspectionsSync: false,
  visibleLoader: false,
  syncError: false,
};

const inspectionsSlice = createSlice({
  name: "inspections",
  initialState,
  reducers: {
    setInspections: (state, action: PayloadAction<InspectionType[]>) => {
      state.inspections = action.payload
    },
    pushInspection: (state, action: PayloadAction<InspectionType>) => {
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