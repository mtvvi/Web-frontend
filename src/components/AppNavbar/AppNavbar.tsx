import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import "./AppNavbar.css";

export const AppNavbar: React.FC = () => {
  return (
    <div className="header">
      <Link to={ROUTES.HOME}>
        <div className="doc-icon"></div>
      </Link>
    </div>
  );
};
