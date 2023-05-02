import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signOut } from "../user/actions";
import { NotificationItem } from "~/types/NotificationItem";

const initialState = {
  notifications: [] as NotificationItem[],
  unreadMessage: 0
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.notifications = action.payload
    },
    clearNotifications: () => ({
      notifications: [],
      unreadMessage: 0
    }),
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      state.notifications = [action.payload, ...state.notifications]
    },
    addUnreadMessage: (state, action: PayloadAction<number>) => {
      state.unreadMessage += action.payload;
    },
    resetUnreadMessage: (state) => {
      state.unreadMessage = 0 
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.type, () => {
      return {
        notifications: [],
        unreadMessage: 0
      }
    })
  }
})

export default notificationsSlice.reducer;
export const { actions: actionsNotifications } = notificationsSlice;