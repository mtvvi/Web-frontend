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
  const [services, setLicenseServices] = useState<LicenseService[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [cartCount, setCartCount] = useState<number>(0);

  const navigate = useNavigate();

  const loadServices = async (query = "") => {
    setLoading(true);
    try {
      const data = await getServices(query);
      setLicenseServices(data.services || []);
    } catch (error) {
      console.log("Failed to load from API, using mock data", error);
      // Используем mock данные при ошибке
      const filtered = SERVICES_MOCK.services.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      setLicenseServices(filtered);
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

  // Метод добавления в корзину — по заданию возвращает 0 при успехе и -1 при ошибке.
  const addToCart = async (serviceId: number): Promise<number> => {
    try {
      const res = await fetch(`/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_id: serviceId }),
      });

      if (!res.ok) {
        // Возвращаем -1 при любом не-OK статусе 
        return -1;
      }

      // Если сервер ответил OK — считаем, что добавление успешно и возвращаем 0
      setCartCount((c) => c + 1);
      return 0;
    } catch (err) {
      console.error("addToCart error:", err);
      return -1;
    }
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
          <>
      {/* Cart icon on page */}
      <div className="page-cart-icon" title="Корзина">
        <img src="http://localhost:9000/img/cart.png" alt="Корзина" />
        <div className="cart-counter">{cartCount}</div>
      </div>
            <div className="cards">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => navigate(`${ROUTES.SERVICES}/${service.id}`)}
                  onAddToCart={async (id: number) => {
                    const r = await addToCart(id);
                    if (r === 0) {
                      console.log(`service ${id} added to cart`);
                    } else {
                      console.log(`service ${id} add failed`);
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
