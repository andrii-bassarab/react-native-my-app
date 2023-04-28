import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InspectionItem } from "~/types/InspectionItem";

const initialState = {
  inspections: [] as InspectionItem[],
  inspectionsSync: false,
};

const inspectionsSlice = createSlice({
  name: "inspections",
  initialState,
  reducers: {
    setInspections: (state, action: PayloadAction<InspectionItem[]>) => {
      state.inspections = action.payload
    },
    clearInspections: (state) => {
      state.inspections = []
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.inspectionsSync = action.payload
    }
  },
})

export default inspectionsSlice.reducer;
export const { actions: actionsInspections } = inspectionsSlice;