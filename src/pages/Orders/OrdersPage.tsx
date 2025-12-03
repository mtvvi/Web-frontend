import React, { useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { getOrdersList, clearError } from '../../store/slices/orderSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
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

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'draft':
        return 'Черновик';
      case 'formatted':
        return 'Сформирован';
      case 'completed':
        return 'Завершен';
      case 'rejected':
        return 'Отклонен';
      default:
        return status;
    }
  };

  const handleRowClick = (orderId: number | undefined) => {
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
          <Table responsive hover className="orders-table">
            <thead>
              <tr>
                <th>№ заявки</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Дата формирования</th>
                <th>Дата завершения</th>
                <th>Итого</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => handleRowClick(order.id)}
                  className="order-row"
                >
                  <td>#{order.id}</td>
                  <td>
                    <span className={`order-status status-${order.status}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('ru-RU')
                      : '—'}
                  </td>
                  <td>
                    {order.formatted_at
                      ? new Date(order.formatted_at).toLocaleDateString('ru-RU')
                      : '—'}
                  </td>
                  <td>
                    {order.completed_at
                      ? new Date(order.completed_at).toLocaleDateString('ru-RU')
                      : '—'}
                  </td>
                  <td className="order-total">
                    {order.total_cost?.toLocaleString() || 0} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
