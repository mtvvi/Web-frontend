import React, { useEffect } from 'react';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
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
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getOrdersList());
    }
  }, [dispatch, isAuthenticated]);

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
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
