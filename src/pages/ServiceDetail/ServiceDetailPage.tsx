import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { getServiceById } from "../../api/servicesApi";
import { getServiceMockById } from "../../mock/ServicesMock";
import type { LicenseService } from "../../types/ServiceTypes";
import { resolvePublicAsset } from "../../utils/assets";
import "./ServiceDetail.css";

const LICENSE_TYPE_LABELS: Record<string, string> = {
  per_user: "Лицензирование по пользователям",
  per_core: "Лицензирование по ядрам CPU",
  subscription: "Годовая подписка",
};

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Хук useState для управления состоянием компонента
  const [service, setService] = useState<LicenseService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Хук useEffect для загрузки данных при монтировании компонента
  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadService = async () => {
      setLoading(true);
      try {
        // Fetch запрос к API через прокси
        const data = await getServiceById(id);
        setService(data);
        setError(false);
      } catch (err) {
        console.error("Failed to load from API, trying mock", err);
        // Fallback на mock данные при ошибке API
        const mockService = getServiceMockById(id);
        if (mockService) {
          setService(mockService);
          setError(false);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  if (loading) {
    return (
      <div className="service-detail-page">
        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.SERVICES, path: ROUTES.SERVICES },
            { label: "Загрузка..." },
          ]}
        />
        <div className="service-detail-loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-detail-page">
        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.SERVICES, path: ROUTES.SERVICES },
            { label: "Услуга не найдена" },
          ]}
        />
        <div className="service-detail-error">
          <h3>Услуга не найдена</h3>
          <p>К сожалению, запрашиваемая услуга не существует или была удалена.</p>
          <button className="btn-back" onClick={() => navigate(ROUTES.SERVICES)}>
            Вернуться к списку услуг
          </button>
        </div>
      </div>
    );
  }

  const storageBase = (import.meta.env.VITE_STORAGE_BASE_URL ?? "http://localhost:9000").replace(/\/$/, "");
  const placeholder = resolvePublicAsset("rectangle-2-6.png");

  const imageUrl = service.image_url
    ? service.image_url.startsWith("http")
      ? service.image_url
      : `${storageBase}/license-images/${service.image_url}`
    : placeholder;

  return (
    <div className="service-detail-page">
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.SERVICES, path: ROUTES.SERVICES },
          { label: service.name },
        ]}
      />

      <div className="service-detail-container">
        <div className="service-detail-card">
          <div className="card-icon">
            <img 
              src={imgError ? placeholder : imageUrl}
              alt={service.name}
              onError={() => setImgError(true)}
            />
          </div>
          
          <h1 className="card-title">{service.name}</h1>
          
          <p className="card-desc">{service.description}</p>
          
          <div className="card-info">
            <div className="card-license-type">
              {LICENSE_TYPE_LABELS[service.license_type] || service.license_type}
            </div>
            
            <div className="card-price">
              Базовая цена: {service.base_price.toLocaleString()} руб.
            </div>
          </div>
          
          <button className="card-btn" onClick={() => navigate(ROUTES.SERVICES)}>
            Назад к списку
          </button>
        </div>
      </div>
    </div>
  );
};
