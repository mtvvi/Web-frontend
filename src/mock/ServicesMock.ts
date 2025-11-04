import type { LicenseService, ServiceListResponse } from "../types/ServiceTypes";

export const SERVICES_MOCK: ServiceListResponse = {
  total: 3,
  services: [
    {
      id: 1,
      name: "Лицензия базового ПО",
      description: "Базовая лицензия для малого бизнеса",
      image_url: "rectangle-2-6.png",
      base_price: 5000,
      license_type: "per_user",
    },
    {
      id: 2,
      name: "Серверная лицензия",
      description: "Лицензирование серверных решений",
      image_url: "rectangle-2-6.png",
      base_price: 15000,
      license_type: "per_core",
    },
    {
      id: 3,
      name: "Годовая подписка",
      description: "Подписка на облачные сервисы",
      image_url: "rectangle-2-6.png",
      base_price: 50000,
      license_type: "subscription",
    },
  ],
};

export const getServiceMockById = (id: number | string): LicenseService | undefined => {
  return SERVICES_MOCK.services.find((s) => s.id === Number(id));
};
