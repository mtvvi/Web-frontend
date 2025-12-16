import React, { useEffect, useMemo, useState } from 'react';
import { Container, Spinner, Alert, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { getOrdersList, clearError } from '../../store/slices/orderSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { OrderCard } from '../../components/OrderCard/OrderCard';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './OrdersPage.css';

export const OrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state: RootState) => state.order);
  const { isAuthenticated, isModerator } = useSelector((state: RootState) => state.user);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

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
      dispatch(getOrdersList(buildFilters()));
    }
  }, [dispatch, isAuthenticated, buildFilters]);

  // Шорт-поллинг списка заявок для модератора - обновляет только данные, не перерисовывает страницу
  useEffect(() => {
    if (!isAuthenticated || !isModerator) return undefined;
    const interval = setInterval(() => {
      // Не показываем спиннер при фоновом обновлении
      dispatch(getOrdersList(buildFilters()));
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated, isModerator, buildFilters]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleCardClick = (orderId: number | undefined) => {
    if (orderId) {
      navigate(`${ROUTES.ORDER}/${orderId}`);
    }
  };

  const applyFilters = () => {
    dispatch(getOrdersList(buildFilters()));
  };

  if (loading) {
    return (
      <div className="orders-page">
        <Container className="loading-container">
          <Spinner animation="border" />
        </Container>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ORDERS }]} />

      <Container className="orders-container">
        <h2 className="orders-title">Мои заявки</h2>

        {error && (
          <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
            {error}
          </Alert>
        )}

        <div className="orders-filters">
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

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>У вас пока нет заявок</p>
            <Button onClick={() => navigate(ROUTES.SERVICES)}>
              Перейти к услугам
            </Button>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleCardClick(order.id)}
                showReady={isModerator}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
