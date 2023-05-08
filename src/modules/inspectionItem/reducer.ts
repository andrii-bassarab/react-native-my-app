import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "~/types/Category";

const initialState = {
  hasUnsavedChanges: false,
  categories: [
    {
      title: "Living Room",
      status: "--",
      result: "--",
      items: 0,
      photos: "No",
    },
    {
      title: "Kitchen",
      status: "Complete",
      result: "Failed",
      items: 2,
      photos: "Yes",
    },
    {
      title: "Bathroom",
      status: "Complete",
      result: "Passed",
      items: 7,
      photos: "Yes",
    },
    {
      title: "Bedroom",
      status: "Complete",
      result: "Failed",
      items: 0,
      photos: "No",
    },
    {
      title: "Living Room (addition)",
      status: "Incomplete",
      result: "No results yet",
      items: 0,
      photos: "No",
      categoryAdded: true,
    },
  ] as Category[],
  assigned: '',
  phoneNumber: '',
  startSignature: false,
}

const inspectionItemSlice = createSlice({
  name: "inspectionItem",
  initialState: initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories = [action.payload, ...state.categories]
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload
    },
    setAssigned: (state, action: PayloadAction<string>) => {
      state.assigned = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setStartSignature: (state, action: PayloadAction<boolean>) => {
      state.startSignature = action.payload;
    },
    clearInspectionItem: () => ({
      hasUnsavedChanges: false,
      categories: [],
      assigned: '',
      phoneNumber: '',
      startSignature: false,
    }),
  },
})

export default inspectionItemSlice.reducer
export const { actions: actionsInspectionItem } = inspectionItemSlice