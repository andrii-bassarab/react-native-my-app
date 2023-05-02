import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signOut } from "../user/actions";

const initialState = {
  showSwitchSite: false,
  showNotification: false,
  showInspectionsFilter: false,
}

const showWindowSlice = createSlice({
  name: "showWindow",
  initialState,
  reducers: {
    setShowSwitchSite: (state, action: PayloadAction<boolean>) => {
      state.showSwitchSite = action.payload;
    },
    setShowNotification: (state, action: PayloadAction<boolean>) => {
      state.showNotification = action.payload;
    },
    setShowInspectionsFilter: (state, action: PayloadAction<boolean>) => {
      state.showInspectionsFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.type, () => {
      return {
        showSwitchSite: false,
        showNotification: false,
        showInspectionsFilter: false,
      }
    })
  }
})

export default showWindowSlice.reducer;
export const { actions: actionsShowWindow } = showWindowSlice;