import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { InspectionItem } from "~/types/InspectionItem"

const inspectionsSlice = createSlice({
  name: "inspections",
  initialState: [] as InspectionItem[],
  reducers: {
    setInspections: (_state, action: PayloadAction<InspectionItem[]>) => {
      return action.payload
    },
    clearInspections: () => [],
  },
})

export default inspectionsSlice.reducer
export const { actions: actionsInspections } = inspectionsSlice