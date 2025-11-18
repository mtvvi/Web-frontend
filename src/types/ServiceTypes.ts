export type LicenseTypeCode = "per_user" | "per_core" | "subscription";

export type LicenseFilterOption = LicenseTypeCode | "all";

export interface LicenseService {
  id: number;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  license_type: LicenseTypeCode;
}

export interface ServiceListResponse {
  services: LicenseService[];
  total: number;
}

export interface ServiceFilterValues {
  name: string;
  licenseType: LicenseFilterOption;
  minPrice: string;
  maxPrice: string;
}

export interface ServiceFilterPayload {
  name?: string;
  licenseType?: LicenseTypeCode;
  minPrice?: number;
  maxPrice?: number;
}
