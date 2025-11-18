import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "../../Routes";
import { resolvePublicAsset } from "../../utils/assets";
import "./AppNavbar.css";

const navItems = [
  { label: "Главная", path: ROUTES.HOME },
  { label: "Услуги", path: ROUTES.SERVICES },
];

export const AppNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const docIconUrl = resolvePublicAsset("rectangle-2-6.png");

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`app-header ${isMenuOpen ? "open" : ""}`}>
      <Link to={ROUTES.HOME} className="brand" onClick={closeMenu}>
        <div
          className="doc-icon"
          aria-hidden="true"
          style={{ backgroundImage: `url(${docIconUrl})` }}
        ></div>
        <span>LicenseCalc</span>
      </Link>

      <nav className={`nav-links ${isMenuOpen ? "show" : ""}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className={`burger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Открыть меню"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};
