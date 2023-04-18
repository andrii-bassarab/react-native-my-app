import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signOut } from "../user/actions";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [] as ({
    title: string;
    detail: string[];
    date: string;
} | {
    title: string;
    date: string;
    detail?: undefined;
})[],
  reducers: {
    setNotifications: (_state, action: PayloadAction<({
      title: string;
      detail: string[];
      date: string;
  } | {
      title: string;
      date: string;
      detail?: undefined;
  })[]>) => {
      return action.payload
    },
    clearNotifications: () => [],
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.type, () => {
      return [] 
    })
  }
})

export default notificationsSlice.reducer;
export const { actions } = notificationsSlice;