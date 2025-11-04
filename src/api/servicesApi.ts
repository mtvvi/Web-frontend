import type { LicenseService, ServiceListResponse } from "../types/ServiceTypes";

const API_BASE = "/api";

export const getServices = async (query = ""): Promise<ServiceListResponse> => {
  const url = query ? `${API_BASE}/services?query=${encodeURIComponent(query)}` : `${API_BASE}/services`;
  
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching services:", error);
      throw error;
    });
};

export const getServiceById = async (id: number | string): Promise<LicenseService> => {
  return fetch(`${API_BASE}/services/${id}`)
    .then((response) => {
      if (!response.ok) throw new Error("Service not found");
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching service:", error);
      throw error;
    });
};
