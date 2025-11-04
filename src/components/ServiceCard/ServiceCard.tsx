import React from "react";
import type { LicenseService } from "../../types/ServiceTypes";
import "./ServiceCard.css";

interface ServiceCardProps {
  service: LicenseService;
  onClick: () => void;
}

const LICENSE_TYPE_LABELS: Record<string, string> = {
  per_user: "на пользователя",
  per_core: "на ядро CPU",
  subscription: "годовую подписку",
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const [imgError, setImgError] = React.useState(false);
  
  // Формируем URL для MinIO как в бэкенде
  const imageUrl = service.image_url 
    ? `http://localhost:9000/license-images/${service.image_url}`
    : "/rectangle-2-6.png";

  return (
    <div className="card" onClick={onClick}>
      <div className="card-icon">
        <img 
          src={imgError ? "/rectangle-2-6.png" : imageUrl} 
          alt={service.name}
          onError={() => setImgError(true)}
        />
      </div>
      <div className="card-title">{service.name}</div>
      <div className="card-desc">{service.description}</div>
      <div className="card-price">
        {service.base_price.toLocaleString()} ₽ / {LICENSE_TYPE_LABELS[service.license_type] || ""}
      </div>
      <button className="card-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
        →
      </button>
    </div>
  );
};
