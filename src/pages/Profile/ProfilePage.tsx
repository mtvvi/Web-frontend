import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { updateProfile, clearError } from '../../store/slices/userSlice';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTE_LABELS } from '../../Routes';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { username, loading, error } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({ 
    full_name: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      dispatch(clearError());
    }
    setValidationError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }
    
    if (formData.password && formData.password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return;
    }

    const updateData: { full_name?: string; password?: string } = {};
    if (formData.full_name) updateData.full_name = formData.full_name;
    if (formData.password) updateData.password = formData.password;

    if (Object.keys(updateData).length === 0) {
      setValidationError('Заполните хотя бы одно поле');
      return;
    }

    const result = await dispatch(updateProfile(updateData));
    
    if (updateProfile.fulfilled.match(result)) {
      setSuccessMessage('Профиль успешно обновлен');
      setFormData({ full_name: '', password: '', confirmPassword: '' });
    }
  };

  return (
    <div className="profile-page">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.PROFILE }]} />
      
      <Container className="profile-container">
        <h2 className="profile-title">Личный кабинет</h2>
        
        <div className="profile-info">
          <p><strong>Логин:</strong> {username}</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {validationError && <Alert variant="danger">{validationError}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        
        <h4 className="profile-subtitle">Редактирование профиля</h4>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="full_name" className="mb-3">
            <Form.Label>Новое имя</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Введите новое имя"
            />
          </Form.Group>
          
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Новый пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Минимум 6 символов"
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mb-4">
            <Form.Label>Подтвердите новый пароль</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="profile-btn w-100"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Сохранить изменения'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ProfilePage;
