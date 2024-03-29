import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const networkConnectivitySlice = createSlice({
  name: "inspections",
  initialState: true as boolean,
  reducers: {
    setNetworkStatus: (_state, action: PayloadAction<boolean>) => action.payload
  },
});

export default networkConnectivitySlice.reducer;
export const { actions: actionsNetworkConnectivity } = networkConnectivitySlice;