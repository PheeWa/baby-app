import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Growth } from "../Pages/GrowthPage";
import { growthData } from "./initData";

export interface GrowthState {
  growths: Growth[];
}

const initialState: GrowthState = {
  growths: growthData,
};

export const growthSlice = createSlice({
  name: "growth",
  initialState,
  reducers: {
    addGrowth: (state, action: PayloadAction<Growth>) => {
      state.growths.push(action.payload);
    },

    editGrowth: (state, action: PayloadAction<Growth>) => {
      state.growths = state.growths.map((growth: Growth, index: number) => {
        if (growth.id === action.payload.id) {
          return action.payload;
        } else {
          return growth;
        }
      });
    },

    deleteGrowth: (state, action: PayloadAction<number>) => {
      state.growths = state.growths.filter((growth: Growth) => {
        return growth.id !== action.payload;
      });
    },
  },
});

export const { addGrowth, editGrowth, deleteGrowth } = growthSlice.actions;

export default growthSlice.reducer;
