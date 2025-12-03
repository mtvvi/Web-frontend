import React from 'react';
import type { DtoOrderResponse } from '../../api';
import './OrderCard.css';

interface OrderCardProps {
  order: DtoOrderResponse;
  onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
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
        return status || 'Неизвестно';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'черновик':
        return '📝';
      case 'сформирован':
        return '📋';
      case 'завершён':
        return '✅';
      case 'отклонён':
        return '❌';
      default:
        return '📄';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      className="order-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="order-card-header">
        <span className="order-card-number">Заявка #{order.id}</span>
        <span className={`order-card-status status-${order.status}`}>
          {getStatusIcon(order.status)} {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="order-card-info">
        <div className="order-card-row">
          <span className="order-card-label">Создана:</span>
          <span className="order-card-value">{formatDate(order.created_at)}</span>
        </div>
        {order.formatted_at && (
          <div className="order-card-row">
            <span className="order-card-label">Сформирована:</span>
            <span className="order-card-value">{formatDate(order.formatted_at)}</span>
          </div>
        )}
        {order.completed_at && (
          <div className="order-card-row">
            <span className="order-card-label">Завершена:</span>
            <span className="order-card-value">{formatDate(order.completed_at)}</span>
          </div>
        )}
      </div>

      <div className="order-card-params">
        <div className="order-card-param">
          <span className="param-icon">👤</span>
          <span className="param-value">{order.users || 0}</span>
          <span className="param-label">польз.</span>
        </div>
        <div className="order-card-param">
          <span className="param-icon">💻</span>
          <span className="param-value">{order.cores || 0}</span>
          <span className="param-label">ядер</span>
        </div>
        <div className="order-card-param">
          <span className="param-icon">📅</span>
          <span className="param-value">{order.period || 0}</span>
          <span className="param-label">мес.</span>
        </div>
      </div>

      <div className="order-card-footer">
        <div className="order-card-total">
          {(order.total_cost || 0).toLocaleString()} ₽
        </div>
        <button className="order-card-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
