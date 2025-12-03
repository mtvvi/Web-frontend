import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { registerUser, clearError } from '../../store/slices/userSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './RegistrationPage.css';

export const RegistrationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    login: '', 
    password: '', 
    confirmPassword: '',
    full_name: '' 
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      dispatch(clearError());
    }
    setValidationError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }
    
    if (formData.password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return;
    }

    const result = await dispatch(registerUser({
      login: formData.login,
      password: formData.password,
      full_name: formData.full_name || undefined,
    }));
    
    if (registerUser.fulfilled.match(result)) {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="registration-page">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.REGISTER }]} />
      
      <Container className="registration-container">
        <h2 className="registration-title">Регистрация</h2>
        
        {(error || validationError) && (
          <Alert variant="danger">{error || validationError}</Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="full_name" className="mb-3">
            <Form.Label>Полное имя</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Введите ваше имя"
            />
          </Form.Group>

          <Form.Group controlId="login" className="mb-3">
            <Form.Label>Логин *</Form.Label>
            <Form.Control
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Введите логин"
              required
            />
          </Form.Group>
          
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Пароль *</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Минимум 6 символов"
              required
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mb-4">
            <Form.Label>Подтвердите пароль *</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              required
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="registration-btn w-100"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Зарегистрироваться'}
          </Button>
        </Form>
        
        <div className="registration-footer">
          <p>Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link></p>
        </div>
      </Container>
    </div>
  );
};

export default RegistrationPage;
