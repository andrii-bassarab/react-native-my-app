import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const eventsSlice = createSlice({
  name: "events",
  initialState: [],
  reducers: {
    setEvents: (_state, action: PayloadAction<any>) => {
      return action.payload
    },
    clearEvents: () => [],
  },
})

export default eventsSlice.reducer
export const { actions } = eventsSlice