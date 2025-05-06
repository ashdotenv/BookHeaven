import { configureStore } from "@reduxjs/toolkit";
import { APIService } from "./APIService";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [APIService.reducerPath]: APIService.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      APIService.middleware
    ),
});
