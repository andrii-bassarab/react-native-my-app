import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "~/types/Category";
import { InspectionItem } from "~/types/InspectionItem";
import { getInspectionStatus } from "~/utils/getInspectionStatus";

const initialState = {
  inspectionItem: null as null | InspectionItem,
  categories: [] as CategoryType[],
  startSignature: false,
  signatureCount: 3,
  visibleAssignedTo: null as null | string,
  visiblePhoneNumber: null as null | string,
  assignedOption: {
    name: '',
    value: ''
  } as { name: string; value: string; },
  categoryApplyToInspection: true,
};

const inspectionItemSlice = createSlice({
  name: "inspectionItem",
  initialState: initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<CategoryType>) => {
      state.categories.push(action.payload);
    },
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = action.payload;
    },
    setCategoryApplyToInspection: (state, action: PayloadAction<boolean>) => {
      state.categoryApplyToInspection = action.payload;
    },
    setInspectionItem: (state, action: PayloadAction<InspectionItem>) => {
      state.inspectionItem = action.payload;
      state.assignedOption = {
        value: action.payload.assignedTo,
        name: action.payload.visibleAssignedTo,
      }
    },
    setInspectionStatus: (
      state,
      action: PayloadAction<string>
    ) => {
      if (state.inspectionItem) {
        state.inspectionItem.status = action.payload;
        state.inspectionItem.visibleStatus = getInspectionStatus(
          action.payload,
          state.inspectionItem.hasPassed
        )
      }
    },
    setInspectionAssigned: (
      state,
      action: PayloadAction<string>
    ) => {
      if (state.inspectionItem) {
        state.inspectionItem.assignedTo = action.payload;
      }
    },
    setStartSignature: (state, action: PayloadAction<boolean>) => {
      state.startSignature = action.payload;
    },
    setVisibleAssignedTo: (state, action: PayloadAction<string>) => {
    },
    setAssignedOption: (state, action: PayloadAction<{ name: string; value: string; }>) => {
      state.assignedOption = action.payload;
    },
    setVisiblePhoneNumber: (state, action: PayloadAction<string>) => {
      state.visiblePhoneNumber = action.payload;
    },
    clearInspectionItem: () => ({
      inspectionItem: null,
      categories: [],
      startSignature: false,
      signatureCount: 3,
      visibleAssignedTo: null,
      visiblePhoneNumber: null,
      assignedOption: {
        name: '',
        value: ''
      },
      categoryApplyToInspection: true,
    }),
  },
});

export default inspectionItemSlice.reducer;
export const { actions: actionsInspectionItem } = inspectionItemSlice;
