export interface LicenseService {
  id: number;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  license_type: string; // "per_user", "per_core", "subscription"
}

export interface ServiceListResponse {
  services: LicenseService[];
  total: number;
}
