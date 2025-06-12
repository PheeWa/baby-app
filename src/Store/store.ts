import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import feedSlice from "./feedSlice";
import healthSlice from "./healthSlice";
import leisureSlice from "./LeisureSlice";
import photoSlice from "./photoSlice";
import sleepSlice from "./SleepSlice";
import authSlice from "./authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "feed"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  feed: feedSlice,
  leisure: leisureSlice,
  health: healthSlice,
  photo: photoSlice,
  sleep: sleepSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
