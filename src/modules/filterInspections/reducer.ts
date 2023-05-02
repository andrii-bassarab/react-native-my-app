import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  statusNewUnscheduled: true,
  statusScheduled: true,
  statusIncomplete: true,
  statusCompleted: true,
  assignedToMe: true,
  unassigned: true,
  sortBy:  "Scheduled Date/Time" as "Scheduled Date/Time" | "Status",
  selectedDayStartFrom: '',
  selectedDayBy: '',
}

const filterInspectionsSlice = createSlice({
  name: "filterInspections",
  initialState,
  reducers: {
    setStatusNewUnscheduled: (state, action: PayloadAction<boolean>) => {
      state.statusNewUnscheduled = action.payload;
    },
    setStatusScheduled: (state, action: PayloadAction<boolean>) => {
      state.statusScheduled = action.payload;
    },
    setStatusIncomplete: (state, action: PayloadAction<boolean>) => {
      state.statusIncomplete = action.payload;
    },
    setStatusCompleted: (state, action: PayloadAction<boolean>) => {
      state.statusCompleted = action.payload;
    },
    setAssignedToMe: (state, action: PayloadAction<boolean>) => {
      state.assignedToMe = action.payload;
    },
    setUnassigned: (state, action: PayloadAction<boolean>) => {
      state.unassigned = action.payload;
    },
    setSortBy: (state, action: PayloadAction<"Scheduled Date/Time" | "Status">) => {
      state.sortBy = action.payload;
    },
    setSelectedDayStartFrom: (state, action: PayloadAction<string>) => {
      state.selectedDayStartFrom = action.payload;
    },
    setSelectedDayBy: (state, action: PayloadAction<string>) => {
      state.selectedDayBy = action.payload;
    },
  },
})

export default filterInspectionsSlice.reducer
export const { actions: filterInspectionsActions } = filterInspectionsSlice