import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SleepStopwatch } from "../Types/sleep";



export interface SleepState {
  sleepStopwatch: SleepStopwatch;
}

const initialState: SleepState = {
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

  updateSleepStopwatch,
  startSleepWatch,
  stopSleepWatch,
} = sleepSlice.actions;

export default sleepSlice.reducer;
