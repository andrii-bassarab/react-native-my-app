import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InspectionItem } from "~/types/InspectionItem";

const initialState = {
  inspections: [] as InspectionItem[],
  inspectionsSync: false,
  visibleLoader: false,
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
    setVisibleHouseholdName: (state, action: PayloadAction<[string, string]>) => {
      const selectedInspection = state.inspections.find(inspection => inspection.id === action.payload[0]);

      if (selectedInspection) {
        selectedInspection.visibleHouseholdName = action.payload[1];
      }
    },
  },
})

export default inspectionsSlice.reducer;
export const { actions: actionsInspections } = inspectionsSlice;