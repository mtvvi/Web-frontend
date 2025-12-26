import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import {
  getLicenseCalculationRequestDetail,
  updateLicenseCalculationRequestFields,
  deleteLicenseCalculationRequest,
  formatLicenseCalculationRequest,
  removeServiceFromLicenseCalculationRequest,
  completeLicenseCalculationRequest,
  rejectLicenseCalculationRequest,
  setLicenseCalculationRequestFields,
  clearError,
  updateServiceSupportLevel,
} from '../../store/slices/licenseCalculationRequestSlice';
import { clearCart } from '../../store/slices/servicesSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import { resolvePublicAsset } from '../../utils/assets';
import './LicenseCalculationRequestPage.css';

export const LicenseCalculationRequestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentLicenseCalculationRequest, services, loading, error, isDraft, licenseCalculationRequestFields } = useSelector(
    (state: RootState) => state.licenseCalculationRequest
  );
  const { isAuthenticated, isModerator } = useSelector((state: RootState) => state.user);

  // Локальное состояние для строковых значений полей ввода
  const [localFields, setLocalFields] = useState({
    users: '',
    cores: '',
    period: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(getLicenseCalculationRequestDetail(Number(id)));
    }
  }, [dispatch, id]);

  // Синхронизируем локальные поля с Redux при загрузке заказа
  useEffect(() => {
    setLocalFields({
      users: String(licenseCalculationRequestFields.users),
      cores: String(licenseCalculationRequestFields.cores),
      period: String(licenseCalculationRequestFields.period),
    });
  }, [licenseCalculationRequestFields.users, licenseCalculationRequestFields.cores, licenseCalculationRequestFields.period]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  // Шорт-поллинг деталки после завершения для подтяжки async sub_total
  useEffect(() => {
    if (!id || !currentLicenseCalculationRequest) return undefined;
    if (currentLicenseCalculationRequest.status !== 'завершён') return undefined;

    const interval = setInterval(() => {
      dispatch(getLicenseCalculationRequestDetail(Number(id)));
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, id, currentLicenseCalculationRequest]);

  const handleFieldChange = (field: 'users' | 'cores' | 'period', value: string) => {
    // Убираем ведущие нули (например, "01" -> "1", но "0" остается "0")
    let cleanValue = value;
    if (value.length > 1 && value.startsWith('0')) {
      cleanValue = value.replace(/^0+/, '') || '0';
    }
    // Обновляем только локальное состояние при вводе
    setLocalFields((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const handleFieldBlur = (field: 'users' | 'cores' | 'period') => {
    // При потере фокуса конвертируем в число и обновляем Redux
    const numValue = localFields[field] === '' ? 0 : Number(localFields[field]);
    dispatch(setLicenseCalculationRequestFields({ [field]: numValue }));
    setLocalFields((prev) => ({ ...prev, [field]: String(numValue) }));
    
    // Автосохранение при потере фокуса - только если значения валидны
    if (id && isDraft) {
      const updatedFields = {
        user_count: field === 'users' ? numValue : licenseCalculationRequestFields.users,
        core_count: field === 'cores' ? numValue : licenseCalculationRequestFields.cores,
        period: field === 'period' ? numValue : licenseCalculationRequestFields.period,
      };
      
      // Не отправляем если period < 1 (валидация на бэкенде требует >= 1)
      if (updatedFields.period < 1) {
        return;
      }
      
      dispatch(
        updateLicenseCalculationRequestFields({
          licenseCalculationRequestId: Number(id),
          data: updatedFields,
        })
      );
    }
  };

  const handleFieldKeyPress = (field: 'users' | 'cores' | 'period', e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFieldBlur(field);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleDelete = async () => {
    if (id && isDraft) {
      await dispatch(deleteLicenseCalculationRequest(Number(id)));
      dispatch(clearCart());
      navigate(ROUTES.SERVICES);
    }
  };

  const handleFormat = async () => {
    if (id && isDraft) {
      await dispatch(formatLicenseCalculationRequest(Number(id)));
      dispatch(clearCart());
      navigate(ROUTES.ORDERS);
    }
  };

  const handleComplete = async () => {
    if (id && currentLicenseCalculationRequest?.status === 'сформирован') {
      await dispatch(completeLicenseCalculationRequest(Number(id)));
      dispatch(getLicenseCalculationRequestDetail(Number(id)));
    }
  };

  const handleReject = async () => {
    if (id && currentLicenseCalculationRequest?.status === 'сформирован') {
      await dispatch(rejectLicenseCalculationRequest(Number(id)));
      dispatch(getLicenseCalculationRequestDetail(Number(id)));
    }
  };

  const handleRemoveService = async (serviceId: number) => {
    if (id && isDraft && serviceId) {
      await dispatch(removeServiceFromLicenseCalculationRequest({ licenseCalculationRequestId: Number(id), serviceId }));
    }
  };

  const handleSupportLevelChange = async (serviceId: number, delta: number) => {
    if (!id || !isDraft || !serviceId) return;
    
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    const currentLevel = service.support_level ?? 1;
    const newLevel = Math.max(0.1, Math.round((currentLevel + delta) * 10) / 10);
    
    await dispatch(updateServiceSupportLevel({
      licenseCalculationRequestId: Number(id),
      serviceId,
      supportLevel: newLevel,
    }));
    
    dispatch(getLicenseCalculationRequestDetail(Number(id)));
  };

  const handleSaveFields = async () => {
    if (id && isDraft) {
      await dispatch(
        updateLicenseCalculationRequestFields({
          licenseCalculationRequestId: Number(id),
          data: {
            user_count: licenseCalculationRequestFields.users,
            core_count: licenseCalculationRequestFields.cores,
            period: licenseCalculationRequestFields.period,
          },
        })
      );
      dispatch(getLicenseCalculationRequestDetail(Number(id)));
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'черновик':
        return 'Черновик';
      case 'сформирован':
        return 'Сформирован';
      case 'завершён':
        return 'Завершен';
      case 'отклонён':
        return 'Отклонен';
      default:
        return status;
    }
  };

  const storageBase = (import.meta.env.VITE_STORAGE_BASE_URL ?? 'http://localhost:9000').replace(/\/$/, '');
  const placeholder = resolvePublicAsset('rectangle-2-6.png');

  if (loading) {
    return (
      <div className="licenseCalculationRequest-page">
        <Container className="loading-container">
          <Spinner animation="border" />
        </Container>
      </div>
    );
  }

  return (
    <div className="licenseCalculationRequest-page">
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ORDERS, path: ROUTES.ORDERS },
          { label: `Заявка #${id}` },
        ]}
      />

      <Container className="licenseCalculationRequest-container">
        {error && (
          <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
            {error}
          </Alert>
        )}

        <div className="licenseCalculationRequest-header">
          <h2>Заявка #{currentLicenseCalculationRequest?.id}</h2>
          <span className={`licenseCalculationRequest-status status-${currentLicenseCalculationRequest?.status}`}>
            {getStatusLabel(currentLicenseCalculationRequest?.status)}
          </span>
        </div>

        {typeof currentLicenseCalculationRequest?.ready_services === 'number' && (
          <div className="licenseCalculationRequest-ready">
            Рассчитано услуг: {currentLicenseCalculationRequest.ready_services}
          </div>
        )}

        <div className="licenseCalculationRequest-info">
          <p>
            <strong>Создана:</strong>{' '}
            {currentLicenseCalculationRequest?.created_at
              ? new Date(currentLicenseCalculationRequest.created_at).toLocaleDateString('ru-RU')
              : '—'}
          </p>
          {currentLicenseCalculationRequest?.formatted_at && (
            <p>
              <strong>Сформирована:</strong>{' '}
              {new Date(currentLicenseCalculationRequest.formatted_at).toLocaleDateString('ru-RU')}
            </p>
          )}
          {currentLicenseCalculationRequest?.completed_at && (
            <p>
              <strong>Завершена:</strong>{' '}
              {new Date(currentLicenseCalculationRequest.completed_at).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>

        {isDraft && (
          <div className="licenseCalculationRequest-fields">
            <h4>Параметры расчета</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Количество пользователей</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={localFields.users}
                    onChange={(e) => handleFieldChange('users', e.target.value)}
                    onBlur={() => handleFieldBlur('users')}
                    onKeyPress={(e) => handleFieldKeyPress('users', e)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Количество ядер</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={localFields.cores}
                    onChange={(e) => handleFieldChange('cores', e.target.value)}
                    onBlur={() => handleFieldBlur('cores')}
                    onKeyPress={(e) => handleFieldKeyPress('cores', e)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Период (месяцев) *</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={localFields.period}
                    onChange={(e) => handleFieldChange('period', e.target.value)}
                    onBlur={() => handleFieldBlur('period')}
                    onKeyPress={(e) => handleFieldKeyPress('period', e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button className="btn-save" onClick={handleSaveFields}>
              Сохранить поля заявки
            </Button>
          </div>
        )}

        {!isDraft && currentLicenseCalculationRequest && (
          <div className="licenseCalculationRequest-params">
            <Row>
              <Col md={4}>
                <p>
                  <strong>Пользователей:</strong> {currentLicenseCalculationRequest.users}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Ядер:</strong> {currentLicenseCalculationRequest.cores}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Период:</strong> {currentLicenseCalculationRequest.period} мес.
                </p>
              </Col>
            </Row>
          </div>
        )}

        <div className="licenseCalculationRequest-services">
          <h4>Лицензии в заявке</h4>
          {services.length === 0 ? (
            <p className="no-services">Лицензии не добавлены</p>
          ) : (
            <Table responsive className="services-table">
              <thead>
                <tr>
                  <th>Изображение</th>
                  <th>Название</th>
                  <th>Тип лицензии</th>
                  <th>Коэф. поддержки</th>
                  {(!isDraft || isModerator) && <th>Подытог</th>}
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
                      {/* {(!isDraft || isModerator) && <td>{service.base_price?.toLocaleString()} ₽</td>} */}
                      <td>
                        {isDraft ? (
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => service.id && handleSupportLevelChange(service.id, -0.1)}
                            >
                              −
                            </Button>
                            <span className="fw-bold">{(service.support_level ?? 1).toFixed(1)}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => service.id && handleSupportLevelChange(service.id, 0.1)}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <span>{service.support_level ?? 1}</span>
                        )}
                      </td>
                      {/* {(!isDraft || isModerator) && <td>{service.base_price?.toLocaleString()} ₽</td>} */}
                      {/* {(!isDraft || isModerator) && <td>{service.support_level ?? 1}</td>} */}
                      {(!isDraft || isModerator) && <td>{service.subtotal?.toLocaleString()} ₽</td>}
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

        {(!isDraft || isModerator) && (
          <div className="licenseCalculationRequest-total">
            <h4>Итого: {currentLicenseCalculationRequest?.total_cost?.toLocaleString() || 0} ₽</h4>
          </div>
        )}

        {isDraft && (
          <div className="licenseCalculationRequest-actions">
            <Button className="btn-format" onClick={handleFormat} disabled={services.length === 0}>
              Сформировать заявку
            </Button>
            <Button className="btn-delete" onClick={handleDelete}>
              Очистить заявку
            </Button>
          </div>
        )}

        {isModerator && currentLicenseCalculationRequest?.status === 'сформирован' && (
          <div className="licenseCalculationRequest-actions moderator-actions">
            <Button className="btn-format" onClick={handleComplete}>
              Завершить заявку
            </Button>
            <Button variant="outline-danger" className="btn-delete" onClick={handleReject}>
              Отклонить заявку
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default LicenseCalculationRequestPage;
