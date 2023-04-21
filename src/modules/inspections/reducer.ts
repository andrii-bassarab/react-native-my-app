import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const inspectionsSlice = createSlice({
  name: "inspections",
  initialState: [],
  reducers: {
    setInspections: (_state, action: PayloadAction<any>) => {
      return action.payload
    },
    clearInspections: () => [],
  },
})

export default inspectionsSlice.reducer
export const { actions } = inspectionsSlice