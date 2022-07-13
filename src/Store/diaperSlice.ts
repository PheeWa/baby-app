import { ActionTypes } from "@mui/base";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Diaper } from "../Pages/DiapersPage";
import { diaperData } from "./initData";

export interface DiaperState {
  diapers: Diaper[];
}

const initialState: DiaperState = {
  diapers: [],
};

export const diaperSlice = createSlice({
  name: "diaper",
  initialState,
  reducers: {
    addDiaper: (state, action: PayloadAction<Diaper>) => {
      state.diapers.push(action.payload);
    },
    editDiaper: (state, action: PayloadAction<Diaper>) => {
      state.diapers = state.diapers.map((diaper, index) => {
        if (diaper.id === action.payload.id) {
          return action.payload;
        }
        return diaper;
      });
    },
    recordDiaper: (state, action: PayloadAction<Diaper>) => {
      state.diapers.push(action.payload);
    },
    deleteDiaper: (state, action: PayloadAction<number>) => {
      state.diapers = state.diapers.filter((diaper: Diaper) => {
        return diaper.id !== action.payload;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { addDiaper, editDiaper, recordDiaper, deleteDiaper } =
  diaperSlice.actions;

export default diaperSlice.reducer;
