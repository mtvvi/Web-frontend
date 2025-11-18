import React from "react";
import type { LicenseService } from "../../types/ServiceTypes";
import { resolvePublicAsset } from "../../utils/assets";
import "./ServiceCard.css";

interface ServiceCardProps {
  service: LicenseService;
  onClick: () => void;
  onAddToCart?: (id: number) => void | Promise<void>;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick, onAddToCart }) => {
  const [imgError, setImgError] = React.useState(false);
  const storageBase = (import.meta.env.VITE_STORAGE_BASE_URL ?? "http://localhost:9000").replace(/\/$/, "");
  const placeholder = resolvePublicAsset("rectangle-2-6.png");
  
  const imageUrl = service.image_url
    ? service.image_url.startsWith("http")
      ? service.image_url
      : `${storageBase}/license-images/${service.image_url}`
    : placeholder;

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
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="card-icon">
        <img 
          src={imgError ? placeholder : imageUrl} 
          alt={service.name}
          onError={() => setImgError(true)}
        />
      </div>
      <div className="card-title">{service.name}</div>
      <div className="card-desc">{service.description}</div>
      <div className="card-price">от {service.base_price.toLocaleString()} ₽</div>
      
      {/* Two buttons like in backend: Подробнее (yellow) and В корзину (green) */}
      <button className="card-btn card-btn-details" onClick={(e) => { e.stopPropagation(); onClick(); }}>
        Подробнее
      </button>
      {onAddToCart && (
        <button className="card-btn card-btn-cart" onClick={handleAddToCart}>
          🛒 В корзину
        </button>
      )}
    </div>
  );
};
