import type {
  LicenseService,
  ServiceFilterPayload,
  ServiceListResponse,
} from "../types/ServiceTypes";
import { getJson, postJson } from "./httpClient";

const normalizeBase = (base: string) => base.replace(/\/$/, "");

const API_BASE = normalizeBase(import.meta.env.VITE_API_BASE_URL || "/api");

const buildQueryString = (filters?: ServiceFilterPayload) => {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();

  if (filters.name) {
    params.append("query", filters.name);
  }

  if (filters.licenseType) {
    params.append("license_type", filters.licenseType);
  }

  if (typeof filters.minPrice === "number") {
    params.append("min_price", String(filters.minPrice));
  }

  if (typeof filters.maxPrice === "number") {
    params.append("max_price", String(filters.maxPrice));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const getServices = async (
  filters?: ServiceFilterPayload,
): Promise<ServiceListResponse> => {
  const query = buildQueryString(filters);
  return getJson<ServiceListResponse>(`${API_BASE}/services${query}`);
};

export const getServiceById = async (id: number | string): Promise<LicenseService> => {
  return getJson<LicenseService>(`${API_BASE}/services/${id}`);
};

export const addServiceToCart = async (serviceId: number): Promise<void> => {
  await postJson(`${API_BASE}/cart/add`, { service_id: serviceId });
};
