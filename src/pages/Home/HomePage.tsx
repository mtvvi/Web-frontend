import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import "./Home.css";
import backgroundVideo from "../../assets/1qJ2ZuanHooBUSImxn9R+gW22hVe5_fI.mp4";

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <video 
        className="home-background-video"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="home-video-overlay"></div>
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

        
      </div>
    </div>
  );
};
