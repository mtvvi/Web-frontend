import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice";
import userReducer from "./slices/userSlice";
import servicesReducer from "./slices/servicesSlice";
import licenseCalculationRequestReducer from "./slices/licenseCalculationRequestSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    user: userReducer,
    services: servicesReducer,
    licenseCalculationRequest: licenseCalculationRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
