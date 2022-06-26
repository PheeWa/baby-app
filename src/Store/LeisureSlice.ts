import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Leisure, LeisureType } from "../Pages/LeisurePage";
import { leisureData } from "./initData";

type Stopwatch = {
  time: number;
  isEdit: boolean;
  details: string;
  startDate: string;
  type: LeisureType;
  isRunning: boolean;
};

export interface LeisureState {
  leisures: Leisure[];
  stopwatch: Stopwatch;
}

const initialState: LeisureState = {
  leisures: leisureData,
  stopwatch: {
    time: 0,
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
    addLeisure: (state, action: PayloadAction<Leisure>) => {
      state.leisures.push(action.payload);
    },
    editLeisure: (state, action: PayloadAction<Leisure>) => {
      state.leisures = state.leisures.map((leisure: Leisure, index: number) => {
        if (leisure.id === action.payload.id) {
          return action.payload;
        } else {
          return leisure;
        }
      });
    },

    deleteLeisure: (state, action: PayloadAction<number>) => {
      state.leisures = state.leisures.filter((leisure: Leisure) => {
        return leisure.id !== action.payload;
      });
    },

    updateStopwatch: (state, action: PayloadAction<Stopwatch>) => {
      state.stopwatch = action.payload;
    },
    startStopwatch: (state, action: PayloadAction<LeisureType>) => {
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

export const {
  addLeisure,
  editLeisure,
  deleteLeisure,
  updateStopwatch,
  startStopwatch,
  stopStopwatch,
} = leisureSlice.actions;

export default leisureSlice.reducer;
