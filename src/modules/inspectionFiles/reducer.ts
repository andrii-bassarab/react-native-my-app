import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getInspectionFiles } from '~/services/api/getInspectionFiles';


interface InspectionFilesState {
  [inspectionId: string]: {
    files: InspectionFile[];
    loading: boolean;
    error: string;
  };
}

const initialState: InspectionFilesState = {};

const inspectionFilesSlice = createSlice({
  name: 'inspectionFiles',
  initialState,
  reducers: {
    fetchInspectionFilesStart(state, action: PayloadAction<string>) {
      const inspectionId = action.payload;
      state[inspectionId] = {
        files: [],
        loading: true,
        error: '',
      };
    },
    fetchInspectionFilesSuccess(state, action: PayloadAction<{ inspectionId: string; files: InspectionFile[] }>) {
      const { inspectionId, files } = action.payload;
      state[inspectionId] = {
        files,
        loading: false,
        error: '',
      };
    },
    fetchInspectionFilesFailure(state, action: PayloadAction<{ inspectionId: string; error: string }>) {
      const { inspectionId, error } = action.payload;
      state[inspectionId] = {
        files: [],
        loading: false,
        error,
      };
    },
  },
});

export const {
  fetchInspectionFilesStart,
  fetchInspectionFilesSuccess,
  fetchInspectionFilesFailure,
} = inspectionFilesSlice.actions;

export const fetchInspectionFiles = (inspectionId: string) => async (dispatch: any) => {
  try {
    dispatch(fetchInspectionFilesStart(inspectionId));
    const response = await getInspectionFiles(inspectionId);
    dispatch(fetchInspectionFilesSuccess({ inspectionId, files: response }));
  } catch (error) {
    dispatch(fetchInspectionFilesFailure({ inspectionId, error: "failed to fetch inspection files" }));
  }
};

export default inspectionFilesSlice.reducer;
