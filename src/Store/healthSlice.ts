import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Health } from "../Pages/HealthPage";

export interface HealthState {
  healths: Health[];
}

const initialState: HealthState = {
  healths: [],
};

export const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    addHealth: (state, action: PayloadAction<Health>) => {
      state.healths.push(action.payload);
    },
    editHealth: (state, action: PayloadAction<Health>) => {
      state.healths = state.healths.map((health: Health, index: number) => {
        if (health.id === action.payload.id) {
          return action.payload;
        } else {
          return health;
        }
      });
    },
    deleteHealth: (state, action: PayloadAction<number>) => {
      state.healths = state.healths.filter((health: Health) => {
        return health.id !== action.payload;
      });
    },
  },
});

export const { addHealth, editHealth, deleteHealth } = healthSlice.actions;

export default healthSlice.reducer;
