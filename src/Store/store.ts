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

const interval = setInterval(() => {
  const diff = differenceInSeconds(
    new Date(),
    new Date(store.getState().feed.stopwatch.startDate)
  );
  store.dispatch(
    updateStopwatch({ ...store.getState().feed.stopwatch, time: diff })
  );
}, 1000);
const SleepInterval = setInterval(() => {
  // setTime((time) => time + 1);
  const diff = differenceInSeconds(
    new Date(),
    new Date(store.getState().sleep.sleepStopwatch.startDate)
  );
  store.dispatch(
    updateSleepStopwatch({
      ...store.getState().sleep.sleepStopwatch,
      time: diff,
    })
  );
}, 1000);

const leisureInterval = setInterval(() => {
  // setTime((time) => time + 1);
  const diff = differenceInSeconds(
    new Date(),
    new Date(store.getState().leisure.stopwatch.startDate)
  );
  store.dispatch(
    updateLeisureStopwatch({
      ...store.getState().leisure.stopwatch,
      time: diff,
    })
  );
}, 1000);
