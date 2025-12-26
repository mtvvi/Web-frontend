import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ServiceCard } from "../../components/ServiceCard/ServiceCard";
import { FiltersPanel } from "../../components/FiltersPanel/FiltersPanel";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { getServices } from "../../api/servicesApi";
import { SERVICES_MOCK } from "../../mock/ServicesMock";
import type { LicenseService, ServiceFilterPayload } from "../../types/ServiceTypes";
import { useAppSelector } from "../../store/hooks";
import { selectAppliedFilters } from "../../features/filters/filtersSlice";
import { useDesktopBridge } from "../../hooks/useDesktopBridge";
import { resolvePublicAsset } from "../../utils/assets";
import type { AppDispatch, RootState } from "../../store";
import { addServiceToLicenseCalculationRequest, getCartInfo } from "../../store/slices/servicesSlice";
import "./ServicesPage.css";

export const ServicesPage: React.FC = () => {
  const [services, setLicenseServices] = useState<LicenseService[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const appliedFilters = useAppSelector(selectAppliedFilters);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { cartLicenseCalculationRequestId, cartCount } = useSelector((state: RootState) => state.services);

  const filterPayload = useMemo<ServiceFilterPayload>(() => {
    const payload: ServiceFilterPayload = {};

    if (appliedFilters.name.trim()) {
      payload.name = appliedFilters.name.trim();
    }

    if (appliedFilters.licenseType !== "all") {
      payload.licenseType = appliedFilters.licenseType;
    }

    const hasMin = appliedFilters.minPrice.trim() !== "";
    const hasMax = appliedFilters.maxPrice.trim() !== "";

    if (hasMin) {
      const min = Number(appliedFilters.minPrice);
      if (!Number.isNaN(min) && min >= 0) {
        payload.minPrice = min;
      }
    }

    if (hasMax) {
      const max = Number(appliedFilters.maxPrice);
      if (!Number.isNaN(max) && max >= 0) {
        payload.maxPrice = max;
      }
    }

    return payload;
  }, [appliedFilters]);

  const applyFiltersToMock = (filters: ServiceFilterPayload) => {
    return SERVICES_MOCK.services.filter((service) => {
      const matchesName = filters.name
        ? service.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchesType = filters.licenseType ? service.license_type === filters.licenseType : true;
      const matchesMin =
        typeof filters.minPrice === "number" ? service.base_price >= filters.minPrice : true;
      const matchesMax =
        typeof filters.maxPrice === "number" ? service.base_price <= filters.maxPrice : true;
      return matchesName && matchesType && matchesMin && matchesMax;
    });
  };

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServices(filterPayload);
      setLicenseServices(data.services || []);
      setDataError(null);
    } catch (error) {
      console.log("Failed to load from API, using mock data", error);
      setDataError("Сервис лицензий временно недоступен. Показаны mock-данные.");
      setLicenseServices(applyFiltersToMock(filterPayload));
    } finally {
      setLoading(false);
    }
  }, [filterPayload]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCartInfo());
    }
  }, [dispatch, isAuthenticated]);

  const goHome = useCallback(() => navigate(ROUTES.HOME), [navigate]);

  useDesktopBridge({
    onRefresh: loadServices,
    onNavigateHome: goHome,
  });

  const handleAddToCart = async (serviceId: number) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      await dispatch(addServiceToLicenseCalculationRequest(serviceId)).unwrap();
      setCartError(null);
    } catch (err) {
      console.error("addToCart error", err);
      setCartError("Не удалось добавить услугу в корзину");
    }
  };

  const handleCartClick = () => {
    if (cartLicenseCalculationRequestId) {
      navigate(`${ROUTES.ORDER}/${cartLicenseCalculationRequestId}`);
    }
  };

  return (
    <div className="services-page">
      <div className="services-shell">
        <aside className="page-cart-rail" aria-label="Корзина">
          <div 
            className={`page-cart-icon ${cartLicenseCalculationRequestId ? 'clickable' : ''}`} 
            title={cartLicenseCalculationRequestId ? "Перейти к заявке" : "Корзина пуста"}
            onClick={handleCartClick}
            style={{ cursor: cartLicenseCalculationRequestId ? 'pointer' : 'default' }}
          >
            <img src={resolvePublicAsset("cart.png")} alt="Корзина" />
            <div className="cart-counter">{isAuthenticated ? cartCount : 0}</div>
          </div>
        </aside>

        <section className="services-main">
          <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SERVICES }]} />

          <div className="content">
        <div className="top-bar">
          <h1 className="title">Модели лицензирования</h1>
        </div>

        <FiltersPanel isLoading={loading} />

        {dataError && (
          <div className="error-banner" role="alert">
            {dataError}
          </div>
        )}

        {cartError && (
          <div className="error-banner warning" role="alert">
            {cartError}
          </div>
        )}

            {loading ? (
              <div className="loading-spinner">
                <Spinner animation="border" />
              </div>
            ) : !services.length ? (
              <div className="no-services">
                <h3>Лицензии не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="cards">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={() => navigate(`${ROUTES.SERVICES}/${service.id}`)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
