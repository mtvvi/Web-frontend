import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { loginUser, clearError } from '../../store/slices/userSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ login: '', password: '' });
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.login && formData.password) {
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
        navigate(ROUTES.SERVICES);
      }
    }
  };

  return (
    <div className="login-page">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.LOGIN }]} />
      
      <Container className="login-container">
        <h2 className="login-title">Вход в систему</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="login" className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Введите логин"
              required
            />
          </Form.Group>
          
          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="login-btn w-100"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Войти'}
          </Button>
        </Form>
        
        <div className="login-footer">
          <p>Нет аккаунта? <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link></p>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
