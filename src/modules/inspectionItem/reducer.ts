import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "~/types/Category";
import { InspectionItem } from "~/types/InspectionItem";
import { InspectionVisibleStatus } from "~/types/inspectionStatus";
import { getInspectionStatus } from "~/utils/getInspectionStatus";

const initialInspectionItem: InspectionItem = {
  id: "",
  scheduledOn: null,
  visitationRange: null,
  assignedTo: null,
  status: "",
  inspectionType: "",
  propertyType: "",
  templateId: "",
  hasPassed: false,
  createdOn: "",
  createdBy: "",
  completedOn: null,
  completedBy: null,
  hasPermissionToEnter: false,
  householdPhone: null,
  visibleStatus: InspectionVisibleStatus.UNSCHEDULED,
  visibleHouseholdName: "",
  visibleInspectionForm: "",
  visibleAssignedTo: "",
  visibleLandlordName: "",
  inspectionComments: [],
  isReinspection: false,
  unit: {
    id: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: 0,
    numberOfBedrooms: 0,
    numberOfBathrooms: 0,
    squareFootage: null,
    isHandicapAccessible: false,
    yearConstructed: null,
  },
  household: {
    lastActionName: "",
    headOfHouseholdId: "",
  },
  visibleLandlordPhoneNumber: ""
}

const initialState = {
  inspectionItem: initialInspectionItem as InspectionItem,
  categories: [] as CategoryType[],
  startSignature: false,
  signatureCount: 0,
  visibleAssignedTo: null as null | string,
  visiblePhoneNumber: null as null | string,
  assignedOption: {
    name: "",
    value: "",
  } as { name: string; value: string | null },
  categoryApplyToInspection: true,
  startUpdateInspectionCategoryView: false,
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
    setCategoryApplyToInspection: (
      state,
      action: PayloadAction<{
        categoryId: string;
        value: boolean;
      }>
    ) => {
      const { categoryId, value } = action.payload;
      const foundCategory = state.categories.find(
        (category) => category.id === categoryId
      );

      if (foundCategory) {
        foundCategory.isRequired = value;
        foundCategory.status = !value ? "--" : foundCategory.items.length > 0 ? "Complete" : "Incomplete";
        foundCategory.result = !value ? "--" : (foundCategory.items.length > 0) ? foundCategory.items.every(({itemsValues}) => itemsValues[0]?.value === "true") ? "Passed" : "Failed" : "No results yet";
      }
    },
    setInspectionItem: (state, action: PayloadAction<InspectionItem>) => {
      state.inspectionItem = action.payload;
      state.assignedOption = {
        value: action.payload.assignedTo,
        name: action.payload.visibleAssignedTo,
      };
    },
    setInspectionStatus: (state, action: PayloadAction<string>) => {
      if (state.inspectionItem) {
        state.inspectionItem.status = action.payload;
        state.inspectionItem.visibleStatus = getInspectionStatus(
          action.payload,
          state.inspectionItem.hasPassed
        );
      }
    },
    setInspectionAssigned: (state, action: PayloadAction<string | null>) => {
      if (state.inspectionItem) {
        state.inspectionItem.assignedTo = action.payload;
      }
    },
    setStartSignature: (state, action: PayloadAction<boolean>) => {
      state.startSignature = action.payload;
    },
    setVisibleAssignedTo: (state, action: PayloadAction<string>) => {},
    setAssignedOption: (
      state,
      action: PayloadAction<{ name: string; value: string | null }>
    ) => {
      state.assignedOption = action.payload;
    },
    setVisiblePhoneNumber: (state, action: PayloadAction<string>) => {
      state.visiblePhoneNumber = action.payload;
    },
    setSignatureCount: (state, action: PayloadAction<number>) => {
      state.signatureCount = action.payload;
    },
    setStartUpdateInspectionCategoryView: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.startUpdateInspectionCategoryView = action.payload;
    },
    setResultItem: (
      state,
      {
        payload,
      }: PayloadAction<{
        categoryId: string;
        itemsValue: {
          id: string;
          comment: string;
          result: boolean;
        };
      }>
    ) => {
      const { categoryId, itemsValue } = payload;
      const foundCategory = state.categories.find(
        (category) => category.id === categoryId
      );

      if (foundCategory) {
        const item = foundCategory?.items?.find(
          (item) => item.id === itemsValue.id
        );

        if (item && item.itemsValues[0]) {
          item.itemsValues[0].value = itemsValue.result ? "true" : "false";
          item.itemsValues[0].comment = itemsValue.comment;

          (foundCategory.result =
            foundCategory.items.length > 0
              ? foundCategory.items.every(
                  ({ itemsValues }) => itemsValues[0]?.value === "true"
                )
                ? "Passed"
                : "Failed"
              : "No results yet")
        }
      }
    },
    setResultAmenitie: (
      state,
      {
        payload,
      }: PayloadAction<{
        categoryId: string;
        amenitieValue: {
          id: string;
          comment: string;
          result: boolean;
        };
      }>
    ) => {
      const { categoryId, amenitieValue } = payload;
      const foundCategory = state.categories.find(
        (category) => category.id === categoryId
      );

      if (foundCategory) {
        const amenitie = foundCategory?.amenities?.find(
          (item) => item.id === amenitieValue.id
        );

        if (amenitie && amenitie.amenityValues && amenitie.amenityValues) {
          amenitie.amenityValues.value = amenitieValue.result ? "true" : "false";
          amenitie.amenityValues.comment = amenitieValue.comment;
        }
      }
    },
    clearInspectionItem: () => ({
      inspectionItem: initialInspectionItem,
      categories: [],
      startSignature: false,
      signatureCount: 3,
      visibleAssignedTo: null,
      visiblePhoneNumber: null,
      assignedOption: {
        name: "",
        value: "",
      },
      categoryApplyToInspection: true,
      startUpdateInspectionCategoryView: false,
    }),
  },
});

export default inspectionItemSlice.reducer;
export const { actions: actionsInspectionItem } = inspectionItemSlice;
