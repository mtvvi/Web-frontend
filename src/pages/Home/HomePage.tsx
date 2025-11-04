import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import "./Home.css";

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Добро пожаловать в систему<br/>лицензирования ПО</h1>
        <p>
          Наша компания предоставляет широкий спектр решений для лицензирования
          программного обеспечения. Выберите подходящую модель лицензирования
          в зависимости от ваших потребностей: по количеству пользователей,
          процессорных ядер или на основе подписки.
        </p>
        <p>
          Мы предлагаем гибкие условия, индивидуальный подход к каждому клиенту
          и техническую поддержку на всех этапах использования нашего ПО.
        </p>
        <Link to={ROUTES.SERVICES} className="home-button">
          Просмотреть услуги
        </Link>
      </div>
    </div>
  );
};
