import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sleep } from "../Pages/SleepPage";
import { checkDate } from "../utils";
import { sleepData } from "./initData";
type SleepStopwatch = {
  isEdit: boolean;
  details: string;
  startDate: string;
  isRunning: boolean;
};

export interface SleepState {
  sleeps: Sleep[];
  sleepStopwatch: SleepStopwatch;
}

const initialState: SleepState = {
  sleeps: checkDate(sleepData),
  sleepStopwatch: {
    isEdit: false,
    details: "",
    startDate: Date(),
    isRunning: false,
  },
};

export const sleepSlice = createSlice({
  name: "sleep",
  initialState,
  reducers: {
    addSleep: (state, action: PayloadAction<Sleep>) => {
      state.sleeps.push(action.payload);
    },
    editSleep: (state, action: PayloadAction<Sleep>) => {
      state.sleeps = state.sleeps.map((sleep: Sleep, index: number) => {
        if (sleep.id === action.payload.id) {
          return action.payload;
        } else {
          return sleep;
        }
      });
    },
    deleteSleep: (state, action: PayloadAction<number>) => {
      state.sleeps = state.sleeps.filter((sleep: Sleep) => {
        return sleep.id !== action.payload;
      });
    },
    updateSleepStopwatch: (state, action: PayloadAction<SleepStopwatch>) => {
      state.sleepStopwatch = action.payload;
    },
    startSleepWatch: (state, action: PayloadAction) => {
      state.sleepStopwatch = {
        isEdit: false,
        details: "",
        startDate: Date(),
        isRunning: true,
      };
    },

    stopSleepWatch: (state, action: PayloadAction) => {
      state.sleepStopwatch.isRunning = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addSleep,
  editSleep,
  deleteSleep,
  updateSleepStopwatch,
  startSleepWatch,
  stopSleepWatch,
} = sleepSlice.actions;

export default sleepSlice.reducer;
