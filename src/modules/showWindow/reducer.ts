import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signOut } from "../user/actions";

const initialState = {
  showSwitchSite: false,
  showNotification: false,
  showInspectionsFilter: false,
  topNavigationHeight: 0,
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
    },
    setTopNavigationHeight: (state, action: PayloadAction<number>) => {
      state.topNavigationHeight = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.type, () => {
      return {
        showSwitchSite: false,
        showNotification: false,
        showInspectionsFilter: false,
        topNavigationHeight: 0,
      }
    })
  }
})

export default showWindowSlice.reducer;
export const { actions: actionsShowWindow } = showWindowSlice;