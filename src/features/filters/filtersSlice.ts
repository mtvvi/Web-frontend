import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ServiceFilterValues } from "../../types/ServiceTypes";

const emptyFilters: ServiceFilterValues = {
  name: "",
  licenseType: "all",
  minPrice: "",
  maxPrice: "",
};

interface FiltersState {
  form: ServiceFilterValues;
  applied: ServiceFilterValues;
}

const initialState: FiltersState = {
  form: { ...emptyFilters },
  applied: { ...emptyFilters },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateFilters(state, action: PayloadAction<Partial<ServiceFilterValues>>) {
      state.form = { ...state.form, ...action.payload };
    },
    applyFilters(state) {
      state.applied = { ...state.form };
    },
    resetFilters() {
      return {
        form: { ...emptyFilters },
        applied: { ...emptyFilters },
      };
    },
  },
});

export const { updateFilters, applyFilters, resetFilters } = filtersSlice.actions;

export const selectFilterForm = (state: { filters: FiltersState }) => state.filters.form;
export const selectAppliedFilters = (state: { filters: FiltersState }) => state.filters.applied;

export default filtersSlice.reducer;
