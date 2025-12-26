import React, { useEffect, useMemo, useState } from 'react';
import { Container, Spinner, Alert, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { getLicenseCalculationRequestsList, clearError } from '../../store/slices/licenseCalculationRequestSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { LicenseCalculationRequestCard } from '../../components/LicenseCalculationRequestCard/LicenseCalculationRequestCard';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './LicenseCalculationRequestsPage.css';

export const LicenseCalculationRequestsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { licenseCalculationRequests, loading, error } = useSelector((state: RootState) => state.licenseCalculationRequest);
  const { isAuthenticated, isModerator } = useSelector((state: RootState) => state.user);

  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>(getTodayDate());
  const [dateTo, setDateTo] = useState<string>(getTodayDate());

  const buildFilters = useMemo(
    () => () => {
      const filters: { status?: string; date_from?: string; date_to?: string } = {};
      if (statusFilter) filters.status = statusFilter;
      if (dateFrom) filters.date_from = dateFrom;
      if (dateTo) filters.date_to = dateTo;
      return filters;
    },
    [statusFilter, dateFrom, dateTo]
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getLicenseCalculationRequestsList(buildFilters()));
    }
  }, [dispatch, isAuthenticated, buildFilters]);

  // Шорт-поллинг списка заявок для модератора - обновляет только данные, не перерисовывает страницу
  useEffect(() => {
    if (!isAuthenticated || !isModerator) return undefined;
    const interval = setInterval(() => {
      // Не показываем спиннер при фоновом обновлении
      dispatch(getLicenseCalculationRequestsList(buildFilters()));
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated, isModerator, buildFilters]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleCardClick = (licenseCalculationRequestId: number | undefined) => {
    if (licenseCalculationRequestId) {
      navigate(`${ROUTES.ORDER}/${licenseCalculationRequestId}`);
    }
  };

  const applyFilters = () => {
    dispatch(getLicenseCalculationRequestsList(buildFilters()));
  };

  if (loading) {
    return (
      <div className="licenseCalculationRequests-page">
        <Container className="loading-container">
          <Spinner animation="border" />
        </Container>
      </div>
    );
  }

  return (
    <div className="licenseCalculationRequests-page">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ORDERS }]} />

      <Container className="licenseCalculationRequests-container">
        <h2 className="licenseCalculationRequests-title">Мои заявки</h2>

        {error && (
          <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
            {error}
          </Alert>
        )}

        <div className="licenseCalculationRequests-filters">
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Статус</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Все</option>
                  <option value="черновик">Черновик</option>
                  <option value="сформирован">Сформирован</option>
                  <option value="завершён">Завершен</option>
                  <option value="отклонён">Отклонен</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Дата с</Form.Label>
                <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Дата по</Form.Label>
                <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button onClick={applyFilters} className="w-100">
                Применить
              </Button>
            </Col>
          </Row>
          {isModerator && <div className="text-muted small mt-2"></div>}
        </div>

        {licenseCalculationRequests.length === 0 ? (
          <div className="no-licenseCalculationRequests">
            <p>У вас пока нет заявок</p>
            <Button onClick={() => navigate(ROUTES.SERVICES)}>
              Перейти к услугам
            </Button>
          </div>
        ) : (
          <div className="licenseCalculationRequests-grid">
            {licenseCalculationRequests.map((licenseCalculationRequest) => (
              <LicenseCalculationRequestCard
                key={licenseCalculationRequest.id}
                licenseCalculationRequest={licenseCalculationRequest}
                onClick={() => handleCardClick(licenseCalculationRequest.id)}
                showReady={isModerator}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default LicenseCalculationRequestsPage;
