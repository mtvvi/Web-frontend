import React from "react";
import type { LicenseService } from "../../types/ServiceTypes";
import "./ServiceCard.css";

interface ServiceCardProps {
  service: LicenseService;
  onClick: () => void;
  onAddToCart?: (id: number) => void | Promise<void>;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick, onAddToCart }) => {
  const [imgError, setImgError] = React.useState(false);
  
  // Формируем URL для MinIO как в бэкенде
  const imageUrl = service.image_url 
    ? `http://localhost:9000/license-images/${service.image_url}`
    : "/rectangle-2-6.png";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      try {
        await onAddToCart(service.id);
      } catch (err) {
        console.error("onAddToCart handler error", err);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-icon">
        <img 
          src={imgError ? "/rectangle-2-6.png" : imageUrl} 
          alt={service.name}
          onError={() => setImgError(true)}
        />
      </div>
      <div className="card-title">{service.name}</div>
      <div className="card-desc">{service.description}</div>
      
      {/* Two buttons like in backend: Подробнее (yellow) and В корзину (green) */}
      <button className="card-btn card-btn-details" onClick={(e) => { e.stopPropagation(); onClick(); }}>
        Подробнее
      </button>
      {/* <button className="card-btn card-btn-cart" onClick={handleAddToCart}>
        🛒 В корзину
      </button> */}
    </div>
  );
};
