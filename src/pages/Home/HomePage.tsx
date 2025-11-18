import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import "./Home.css";

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-copy">
          <h1>
            Добро пожаловать в систему <br /> лицензирования ПО
          </h1>
          <p>
            Центр лицензирования LicenseCalc автоматизирует выдачу лицензий и
            помогает выбирать модели подписки под конкретные продуктовые и
            инфраструктурные сценарии.
          </p>
          
          <div className="home-cta">
            <Link to={ROUTES.SERVICES} className="home-button">
              Просмотреть лицензии
            </Link>
          </div>
        </div>

        <div className="home-stats">
          <div className="home-stat-card">
            <strong>24/7</strong>
            <span>Поддержка клиентов</span>
          </div>
          <div className="home-stat-card">
            <strong>3</strong>
            <span>Типа лицензий в каталоге</span>
          </div>
        </div>
      </div>
    </div>
  );
};
