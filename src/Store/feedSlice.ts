import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { differenceInSeconds } from "date-fns";

import { Feeding, FeedingType } from "../Pages/FeedPage";
import { store } from "./store";
type FeedingStopwatch = {
  time: number;
  isEdit: boolean;
  details: string;
  startDate: string;
  type: FeedingType;
  isRunning: boolean;
};

export interface FeedState {
  feedings: Feeding[];
  stopwatch: FeedingStopwatch;
}

const initialState: FeedState = {
  feedings: [],
  stopwatch: {
    time: 0,
    isEdit: false,
    details: "",
    startDate: Date(),
    type: "left breast",
    isRunning: false,
  },
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeed: (state, action: PayloadAction<Feeding>) => {
      state.feedings.push(action.payload);
    },
    editFeed: (state, action: PayloadAction<Feeding>) => {
      state.feedings = state.feedings.map((feeding: Feeding, index: number) => {
        if (feeding.id === action.payload.id) {
          return action.payload;
        } else {
          return feeding;
        }
      });
    },
    deleteFeed: (state, action: PayloadAction<number>) => {
      state.feedings = state.feedings.filter((feeding: Feeding) => {
        return feeding.id !== action.payload;
      });
    },
    updateStopwatch: (state, action: PayloadAction<FeedingStopwatch>) => {
      state.stopwatch = action.payload;
    },

    startStopwatch: (state, action: PayloadAction<FeedingType>) => {
      state.stopwatch = {
        time: 0,
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

// Action creators are generated for each case reducer function
export const {
  updateStopwatch,
  addFeed,
  editFeed,
  deleteFeed,
  startStopwatch,
  stopStopwatch,
} = feedSlice.actions;

export default feedSlice.reducer;
