import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signOut } from "../user/actions";
import { NotificationItem } from "~/types/NotificationItem";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [] as NotificationItem[],
  reducers: {
    setNotifications: (_state, action: PayloadAction<NotificationItem[]>) => {
      return action.payload
    },
    clearNotifications: () => [],
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      return [action.payload, ...state]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.type, () => {
      return []
    })
  }
})

export default notificationsSlice.reducer;
export const { actions: actionsNotifications } = notificationsSlice;