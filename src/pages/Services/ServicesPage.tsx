import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ServiceCard } from "../../components/ServiceCard/ServiceCard";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { getServices } from "../../api/servicesApi";
import { SERVICES_MOCK } from "../../mock/ServicesMock";
import type { LicenseService } from "../../types/ServiceTypes";
import "./ServicesPage.css";

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<LicenseService[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState("");

  const navigate = useNavigate();

  const loadServices = async (query = "") => {
    setLoading(true);
    try {
      const data = await getServices(query);
      setServices(data.services || []);
    } catch (error) {
      console.log("Failed to load from API, using mock data", error);
      // Используем mock данные при ошибке
      const filtered = SERVICES_MOCK.services.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      setServices(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSearch = () => {
    loadServices(filterName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="services-page">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SERVICES }]} />

      <div className="content">
        <div className="top-bar">
          <h1 className="title">Модели лицензирования</h1>
        </div>

        <div className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск услуг..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch} disabled={loading}>
            Найти
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <Spinner animation="border" />
          </div>
        ) : !services.length ? (
          <div className="no-services">
            <h3>Услуги не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="cards">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => navigate(`${ROUTES.SERVICES}/${service.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
