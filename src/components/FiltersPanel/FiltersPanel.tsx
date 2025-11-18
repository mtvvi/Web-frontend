import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  applyFilters,
  resetFilters,
  selectFilterForm,
  updateFilters,
} from "../../features/filters/filtersSlice";
import type { LicenseFilterOption } from "../../types/ServiceTypes";
import "./FiltersPanel.css";

interface FiltersPanelProps {
  isLoading?: boolean;
}

const licenseTypeOptions: { value: LicenseFilterOption; label: string }[] = [
  { value: "all", label: "Все типы" },
  { value: "per_user", label: "По пользователям" },
  { value: "per_core", label: "По ядрам" },
  { value: "subscription", label: "Подписка" },
];

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ isLoading }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilterForm);

  const triggerApply = () => {
    dispatch(applyFilters());
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <section className="filters-panel" aria-label="Фильтры подборки услуг">
      <div className="filter-field full-width">
        <label htmlFor="name-filter">Название услуги</label>
        <input
          id="name-filter"
          type="text"
          placeholder="Поиск по названию"
          value={filters.name}
          onChange={(e) => dispatch(updateFilters({ name: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && triggerApply()}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="min-price">Цена от (₽)</label>
        <input
          id="min-price"
          type="number"
          min={0}
          inputMode="numeric"
          value={filters.minPrice}
          onChange={(e) => dispatch(updateFilters({ minPrice: e.target.value }))}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="max-price">Цена до (₽)</label>
        <input
          id="max-price"
          type="number"
          min={0}
          inputMode="numeric"
          value={filters.maxPrice}
          onChange={(e) => dispatch(updateFilters({ maxPrice: e.target.value }))}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="license-type">Тип лицензии</label>
        <select
          id="license-type"
          value={filters.licenseType}
          onChange={(e) =>
            dispatch(updateFilters({ licenseType: e.target.value as LicenseFilterOption }))
          }
        >
          {licenseTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button type="button" className="btn primary" onClick={triggerApply} disabled={isLoading}>
          {isLoading ? "Поиск..." : "Применить"}
        </button>
        <button type="button" className="btn secondary" onClick={handleReset} disabled={isLoading}>
          Сбросить
        </button>
      </div>
    </section>
  );
};
