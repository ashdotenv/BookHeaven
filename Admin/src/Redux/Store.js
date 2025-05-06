import { configureStore } from "@reduxjs/toolkit";
import { APIService } from "./APIService";
export const store = configureStore({
    reducer: {
      [APIService.reducerPath]: APIService.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        APIService.middleware
      ),
  });
  