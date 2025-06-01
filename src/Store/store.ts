import { configureStore } from "@reduxjs/toolkit";
import diaperSlice from "./diaperSlice";
import feedSlice from "./feedSlice";
import growthSlice from "./growthSlice";
import healthSlice from "./healthSlice";
import leisureSlice from "./LeisureSlice";
import photoSlice from "./photoSlice";
import sleepSlice from "./SleepSlice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
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
