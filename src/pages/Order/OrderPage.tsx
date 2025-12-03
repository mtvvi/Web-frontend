import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import {
  getOrderDetail,
  updateOrderFields,
  deleteOrder,
  formatOrder,
  removeServiceFromOrder,
  updateServiceSupportLevel,
  setOrderFields,
  clearError,
} from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/servicesSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import { resolvePublicAsset } from '../../utils/assets';
import './OrderPage.css';

export const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentOrder, services, loading, error, isDraft, orderFields } = useSelector(
    (state: RootState) => state.order
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetail(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleFieldChange = (field: 'users' | 'cores' | 'period', value: number) => {
    dispatch(setOrderFields({ [field]: value }));
  };

  const handleSave = async () => {
    if (id && isDraft) {
      await dispatch(
        updateOrderFields({
          orderId: Number(id),
          data: {
            user_count: orderFields.users,
            core_count: orderFields.cores,
            period: orderFields.period,
          },
        })
      );
      dispatch(getOrderDetail(Number(id)));
    }
  };

  const handleDelete = async () => {
    if (id && isDraft) {
      await dispatch(deleteOrder(Number(id)));
      dispatch(clearCart());
      navigate(ROUTES.SERVICES);
    }
  };

  const handleFormat = async () => {
    if (id && isDraft) {
      await dispatch(formatOrder(Number(id)));
      dispatch(clearCart());
      navigate(ROUTES.ORDERS);
    }
  };

  const handleRemoveService = async (serviceId: number) => {
    if (id && isDraft && serviceId) {
      await dispatch(removeServiceFromOrder({ orderId: Number(id), serviceId }));
    }
  };

  const handleSupportLevelChange = async (serviceId: number, level: number) => {
    if (id && isDraft && serviceId) {
      await dispatch(
        updateServiceSupportLevel({
          orderId: Number(id),
          serviceId,
          supportLevel: level,
        })
      );
    }
  };

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

  const storageBase = (import.meta.env.VITE_STORAGE_BASE_URL ?? 'http://localhost:9000').replace(/\/$/, '');
  const placeholder = resolvePublicAsset('rectangle-2-6.png');

  if (loading) {
    return (
      <div className="order-page">
        <Container className="loading-container">
          <Spinner animation="border" />
        </Container>
      </div>
    );
  }

  return (
    <div className="order-page">
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ORDERS, path: ROUTES.ORDERS },
          { label: `Заявка #${id}` },
        ]}
      />

      <Container className="order-container">
        {error && (
          <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
            {error}
          </Alert>
        )}

        <div className="order-header">
          <h2>Заявка #{currentOrder?.id}</h2>
          <span className={`order-status status-${currentOrder?.status}`}>
            {getStatusLabel(currentOrder?.status)}
          </span>
        </div>

        <div className="order-info">
          <p>
            <strong>Создана:</strong>{' '}
            {currentOrder?.created_at
              ? new Date(currentOrder.created_at).toLocaleDateString('ru-RU')
              : '—'}
          </p>
          {currentOrder?.formatted_at && (
            <p>
              <strong>Сформирована:</strong>{' '}
              {new Date(currentOrder.formatted_at).toLocaleDateString('ru-RU')}
            </p>
          )}
          {currentOrder?.completed_at && (
            <p>
              <strong>Завершена:</strong>{' '}
              {new Date(currentOrder.completed_at).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>

        {isDraft && (
          <div className="order-fields">
            <h4>Параметры расчета</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Количество пользователей</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={orderFields.users}
                    onChange={(e) => handleFieldChange('users', Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Количество ядер</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={orderFields.cores}
                    onChange={(e) => handleFieldChange('cores', Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Период (месяцев)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={orderFields.period}
                    onChange={(e) => handleFieldChange('period', Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button className="btn-save" onClick={handleSave}>
              Сохранить параметры
            </Button>
          </div>
        )}

        {!isDraft && currentOrder && (
          <div className="order-params">
            <Row>
              <Col md={4}>
                <p>
                  <strong>Пользователей:</strong> {currentOrder.users}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Ядер:</strong> {currentOrder.cores}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Период:</strong> {currentOrder.period} мес.
                </p>
              </Col>
            </Row>
          </div>
        )}

        <div className="order-services">
          <h4>Услуги в заявке</h4>
          {services.length === 0 ? (
            <p className="no-services">Услуги не добавлены</p>
          ) : (
            <Table responsive className="services-table">
              <thead>
                <tr>
                  <th>Изображение</th>
                  <th>Название</th>
                  <th>Тип лицензии</th>
                  <th>Базовая цена</th>
                  <th>Коэф. поддержки</th>
                  <th>Подытог</th>
                  {isDraft && <th>Действия</th>}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const imageUrl = service.image_url
                    ? service.image_url.startsWith('http')
                      ? service.image_url
                      : `${storageBase}/license-images/${service.image_url}`
                    : placeholder;

                  return (
                    <tr key={service.id}>
                      <td>
                        <img
                          src={imageUrl}
                          alt={service.name}
                          className="service-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = placeholder;
                          }}
                        />
                      </td>
                      <td>{service.name}</td>
                      <td>{service.license_type}</td>
                      <td>{service.base_price?.toLocaleString()} ₽</td>
                      <td>
                        {isDraft ? (
                          <Form.Select
                            size="sm"
                            value={service.support_level || 1}
                            onChange={(e) =>
                              service.id &&
                              handleSupportLevelChange(service.id, Number(e.target.value))
                            }
                          >
                            <option value={0.7}>0.7 - Базовая</option>
                            <option value={1}>1.0 - Стандартная</option>
                            <option value={1.5}>1.5 - Расширенная</option>
                            <option value={2}>2.0 - Премиум</option>
                            <option value={3}>3.0 - Enterprise</option>
                          </Form.Select>
                        ) : (
                          service.support_level || 1
                        )}
                      </td>
                      <td>{service.subtotal?.toLocaleString()} ₽</td>
                      {isDraft && (
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => service.id && handleRemoveService(service.id)}
                          >
                            Удалить
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>

        <div className="order-total">
          <h4>Итого: {currentOrder?.total_cost?.toLocaleString() || 0} ₽</h4>
        </div>

        {isDraft && (
          <div className="order-actions">
            <Button className="btn-format" onClick={handleFormat} disabled={services.length === 0}>
              Сформировать заявку
            </Button>
            <Button className="btn-delete" onClick={handleDelete}>
              Очистить заявку
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrderPage;
