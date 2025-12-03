import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice";
import userReducer from "./slices/userSlice";
import servicesReducer from "./slices/servicesSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    user: userReducer,
    services: servicesReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
