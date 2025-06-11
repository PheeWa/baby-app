import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Leisure, LeisureType } from "../Pages/LeisurePage";
import { checkDate } from "../utils";


type Stopwatch = {
  isEdit: boolean;
  details: string;
  startDate: string;
  type: LeisureType;
  isRunning: boolean;
};

export interface LeisureState {

  stopwatch: Stopwatch;
}

const initialState: LeisureState = {

  stopwatch: {
    isEdit: false,
    details: "",
    startDate: Date(),
    type: "tummy time",
    isRunning: false,
  },
};

export const leisureSlice = createSlice({
  name: "leisure",
  initialState,
  reducers: {
    updateStopwatch: (state, action: PayloadAction<Stopwatch>) => {
      state.stopwatch = action.payload;
    },
    startStopwatch: (state, action: PayloadAction<LeisureType>) => {
      state.stopwatch = {
        isEdit: false,
        details: "",
        startDate: Date(),
        type: action.payload,
        isRunning: true,
      };
    },
    stopStopwatch: (state, action: PayloadAction) => {
      state.stopwatch.isRunning = false;
    },
  },
});

export const {
  updateStopwatch,
  startStopwatch,
  stopStopwatch,
} = leisureSlice.actions;

export default leisureSlice.reducer;
