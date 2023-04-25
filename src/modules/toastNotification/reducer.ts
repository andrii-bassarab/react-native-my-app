import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  showToast: false,
  toastMessage: ''
};

const toastNotificationSlice = createSlice({
  name: "toastNotification",
  initialState,
  reducers: {
    showToastMessage: (_state, action: PayloadAction<string>) => {
      return {
        showToast: true,
        toastMessage: action.payload
      }
    },
    hideToastMessage: () => ({
      showToast: false,
      toastMessage: '',
    }),
  },
})

export default toastNotificationSlice.reducer;
export const { actions: actionsToastNotification } = toastNotificationSlice;