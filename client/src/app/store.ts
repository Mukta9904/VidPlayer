// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import videoReducer from "./slices/videoSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
