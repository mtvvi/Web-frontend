import React from 'react';
import type { DtoLicenseCalculationRequestResponse } from '../../api';
import './LicenseCalculationRequestCard.css';

interface LicenseCalculationRequestCardProps {
  licenseCalculationRequest: DtoLicenseCalculationRequestResponse;
  onClick: () => void;
  showReady?: boolean;
}

export const LicenseCalculationRequestCard: React.FC<LicenseCalculationRequestCardProps> = ({ licenseCalculationRequest, onClick, showReady }) => {
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
      className="licenseCalculationRequest-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="licenseCalculationRequest-card-header">
        <span className="licenseCalculationRequest-card-number">Заявка #{licenseCalculationRequest.id}</span>
        <span className={`licenseCalculationRequest-card-status status-${licenseCalculationRequest.status}`}>
          {getStatusIcon(licenseCalculationRequest.status)} {getStatusLabel(licenseCalculationRequest.status)}
        </span>
      </div>

      <div className="licenseCalculationRequest-card-info">
        <div className="licenseCalculationRequest-card-row">
          <span className="licenseCalculationRequest-card-label">Создана:</span>
          <span className="licenseCalculationRequest-card-value">{formatDate(licenseCalculationRequest.created_at)}</span>
        </div>
        {licenseCalculationRequest.formatted_at && (
          <div className="licenseCalculationRequest-card-row">
            <span className="licenseCalculationRequest-card-label">Сформирована:</span>
            <span className="licenseCalculationRequest-card-value">{formatDate(licenseCalculationRequest.formatted_at)}</span>
          </div>
        )}
        {licenseCalculationRequest.completed_at && (
          <div className="licenseCalculationRequest-card-row">
            <span className="licenseCalculationRequest-card-label">Завершена:</span>
            <span className="licenseCalculationRequest-card-value">{formatDate(licenseCalculationRequest.completed_at)}</span>
          </div>
        )}
      </div>

      <div className="licenseCalculationRequest-card-params">
        <div className="licenseCalculationRequest-card-param">
          <span className="param-icon">👤</span>
          <span className="param-value">{licenseCalculationRequest.users || 0}</span>
          <span className="param-label">польз.</span>
        </div>
        <div className="licenseCalculationRequest-card-param">
          <span className="param-icon">💻</span>
          <span className="param-value">{licenseCalculationRequest.cores || 0}</span>
          <span className="param-label">ядер</span>
        </div>
        <div className="licenseCalculationRequest-card-param">
          <span className="param-icon">📅</span>
          <span className="param-value">{licenseCalculationRequest.period || 0}</span>
          <span className="param-label">мес.</span>
        </div>
      </div>

      {showReady && typeof licenseCalculationRequest.ready_services === 'number' && (
        <div className="licenseCalculationRequest-card-ready">
          Готово: {licenseCalculationRequest.ready_services}
        </div>
      )}

      <div className="licenseCalculationRequest-card-footer">
        <div className="licenseCalculationRequest-card-total">
          {(licenseCalculationRequest.total_cost || 0).toLocaleString()} ₽
        </div>
        <button className="licenseCalculationRequest-card-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default LicenseCalculationRequestCard;
