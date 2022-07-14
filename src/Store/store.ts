import { configureStore } from "@reduxjs/toolkit";
import { differenceInSeconds } from "date-fns";
import diaperSlice from "./diaperSlice";
import feedSlice, { updateStopwatch } from "./feedSlice";
import growthSlice from "./growthSlice";
import healthSlice from "./healthSlice";
import leisureSlice, {
  updateStopwatch as updateLeisureStopwatch,
} from "./LeisureSlice";
import photoSlice from "./photoSlice";
import sleepSlice, { updateSleepStopwatch } from "./SleepSlice";

export const store = configureStore({
  reducer: {
    feed: feedSlice,
    diaper: diaperSlice,
    leisure: leisureSlice,
    growth: growthSlice,
    health: healthSlice,
    photo: photoSlice,
    sleep: sleepSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
