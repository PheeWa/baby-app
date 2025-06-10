import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedingStopwatch, FeedingType } from "../Types/feeding";

export interface FeedState {
  stopwatch: FeedingStopwatch;
}

const initialState: FeedState = {
  stopwatch: {
    isEdit: false,
    details: "",
    startDate: Date(),
    type: "left breast",
    isRunning: false,
    contents: "",
    amount: 0,
  },
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    updateStopwatch: (state, action: PayloadAction<FeedingStopwatch>) => {
      state.stopwatch = action.payload;
    },

    startStopwatch: (state, action: PayloadAction<FeedingType>) => {
      state.stopwatch = {
        isEdit: false,
        details: "",
        startDate: Date(),
        type: action.payload,
        isRunning: true,
        contents: "formula",
        amount: 0,
      };
    },
    stopStopwatch: (state, action: PayloadAction) => {
      state.stopwatch.isRunning = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateStopwatch,
  startStopwatch,
  stopStopwatch,
} = feedSlice.actions;

export default feedSlice.reducer;
