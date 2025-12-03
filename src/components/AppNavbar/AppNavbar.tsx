import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../../Routes";
import { resolvePublicAsset } from "../../utils/assets";
import type { AppDispatch, RootState } from "../../store";
import { logoutUser, checkAuth } from "../../store/slices/userSlice";
import { getCartInfo, clearCart } from "../../store/slices/servicesSlice";
import { resetFilters } from "../../features/filters/filtersSlice";
import "./AppNavbar.css";

export const AppNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const docIconUrl = resolvePublicAsset("rectangle-2-6.png");
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isAuthenticated, username } = useSelector((state: RootState) => state.user);
  const { cartOrderId, cartCount } = useSelector((state: RootState) => state.services);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCartInfo());
    }
  }, [dispatch, isAuthenticated]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(resetFilters());
    closeMenu();
    navigate(ROUTES.SERVICES);
  };

  const handleCartClick = () => {
    if (cartOrderId) {
      navigate(`${ROUTES.ORDER}/${cartOrderId}`);
    }
    closeMenu();
  };

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
        <NavLink
          to={ROUTES.HOME}
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Главная
        </NavLink>
        <NavLink
          to={ROUTES.SERVICES}
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Услуги
        </NavLink>
        
        {isAuthenticated && (
          <NavLink
            to={ROUTES.ORDERS}
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Мои заявки
          </NavLink>
        )}
      </nav>

      <div className="nav-actions">
        

        {isAuthenticated ? (
          <div className="user-menu">
            <NavLink
              to={ROUTES.PROFILE}
              onClick={closeMenu}
              className="username-link"
            >
              {username}
            </NavLink>
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to={ROUTES.LOGIN} className="login-link" onClick={closeMenu}>
              Войти
            </Link>
            <Link to={ROUTES.REGISTER} className="register-link" onClick={closeMenu}>
              Регистрация
            </Link>
          </div>
        )}
      </div>

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
