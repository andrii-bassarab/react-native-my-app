import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const eventsSlice = createSlice({
  name: "events",
  initialState: [],
  reducers: {
    setTodo: (_state, action: PayloadAction<any>) => {
      return action.payload
    },
    removeTodo: () => [],
  },
})

export default eventsSlice.reducer
export const { actions } = eventsSlice