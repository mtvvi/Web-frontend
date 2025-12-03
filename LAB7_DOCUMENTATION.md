# Лабораторная работа №7: Завершение интерфейса пользователя в React

## Оглавление
1. [Теоретическая часть](#теоретическая-часть)
2. [Порядок показа работы](#порядок-показа-работы)
3. [Что было реализовано](#что-было-реализовано)
4. [Ответы на контрольные вопросы](#ответы-на-контрольные-вопросы)
5. [Activity диаграмма](#activity-диаграмма)
6. [Верстка страницы одной услуги](#верстка-страницы-одной-услуги)

---

## Теоретическая часть

### Axios

**Axios** — это популярная JavaScript/TypeScript библиотека для выполнения HTTP-запросов. Основные преимущества:

- Простой и понятный синтаксис
- Поддержка Promise API
- Автоматическое преобразование JSON
- Перехватчики запросов и ответов (interceptors)
- Отмена запросов
- Защита от XSRF

**Пример сравнения fetch и axios:**

```typescript
// Fetch API
fetch('http://localhost/api/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ firstName: 'Ivan', lastName: 'Kopeikin' })
});

// Axios - более лаконичный синтаксис
axios.post('http://localhost/api/user', {
  firstName: 'Ivan',
  lastName: 'Kopeikin'
});
```

### Redux Toolkit

**Redux Toolkit** — официальный набор инструментов для эффективной разработки с Redux. Включает:

- `configureStore()` — упрощённая настройка store
- `createSlice()` — генерация reducer и actions
- `createAsyncThunk()` — обработка асинхронных операций

### Redux Thunk Middleware

**Redux Thunk** — middleware, позволяющий action creators возвращать функции вместо объектов. Это необходимо для выполнения асинхронных операций (API запросы).

```typescript
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.services.servicesList();
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка загрузки');
    }
  }
);
```

### Кодогенерация API

Кодогенерация позволяет автоматически создавать типизированный клиент API на основе Swagger/OpenAPI спецификации бэкенда. Это обеспечивает:

- Полную типизацию запросов и ответов
- Синхронизацию с бэкендом
- Уменьшение ручного кода

### Local Storage

**localStorage** — веб-хранилище для сохранения данных в браузере без срока истечения. Используется для:

- Хранения JWT токенов авторизации
- Сохранения пользовательских настроек
- Кэширования данных

```typescript
// Сохранение токена
localStorage.setItem('token', 'jwt_token_value');

// Получение токена
const token = localStorage.getItem('token');

// Удаление токена
localStorage.removeItem('token');
```

---

## Порядок показа работы

### 1. Показать авторизацию в режиме разработчика

1. Открыть приложение по адресу `https://localhost:3000`
2. Перейти на страницу авторизации `/login`
3. Открыть **DevTools** → вкладка **Network**
4. Ввести логин и пароль, нажать "Войти"
5. Показать в Network:
   - POST запрос на `/api/auth/login`
   - Request payload с credentials
   - Response с JWT токеном

### 2. Показать добавление услуги в заявку

1. Авторизоваться в системе
2. Перейти на страницу услуг `/services`
3. Нажать кнопку "Добавить" на карточке услуги
4. Показать в Network:
   - POST запрос на `/api/services/{id}/add-to-order`
   - Обновление счётчика корзины

### 3. Показать формирование заявки

1. Нажать на иконку корзины в навигации
2. Перейти на страницу заявки `/order/{id}`
3. Показать список добавленных услуг
4. Изменить количество услуги
5. Нажать "Сформировать заявку"
6. Показать изменение статуса заявки

### 4. Показать страницу списка заявок

1. Перейти на страницу `/orders`
2. Показать таблицу со всеми заявками пользователя
3. Показать различные статусы заявок

### 5. Показать работу с localStorage в браузере

1. Открыть **DevTools** → вкладка **Application**
2. Слева выбрать **Local Storage** → `https://localhost:3000`
3. Показать сохранённый JWT токен (`token`)
4. Показать данные пользователя (если сохраняются)

### 6. Показать заявки в Postman/Insomnia

1. Скопировать JWT токен из localStorage
2. Открыть Postman/Insomnia
3. Создать GET запрос на `http://localhost:8080/api/orders`
4. Добавить заголовок: `Authorization: Bearer <token>`
5. Выполнить запрос и показать заявки текущего пользователя

### 7. Пояснить код Redux и Axios

Показать в коде:

**Файл `src/store/slices/userSlice.ts`:**
- Структуру createAsyncThunk для loginUser
- extraReducers для обработки состояний pending/fulfilled/rejected
- Сохранение токена в localStorage

**Файл `src/api/Api.ts`:**
- Сгенерированный типизированный API клиент
- Методы для работы с эндпоинтами

**Файл `src/api/index.ts`:**
- Создание инстанса API с baseURL

---

## Что было реализовано

### Страницы

| Страница | Путь | Описание |
|----------|------|----------|
| Авторизация | `/login` | Форма входа с полями логин/пароль |
| Регистрация | `/registration` | Форма регистрации нового пользователя |
| Профиль | `/profile` | Личный кабинет с возможностью редактирования |
| Заявка | `/order/:id` | Просмотр и редактирование заявки |
| Список заявок | `/orders` | Таблица всех заявок пользователя |

### Redux Slices

| Slice | Файл | Назначение |
|-------|------|------------|
| user | `userSlice.ts` | Авторизация, профиль, токен |
| services | `servicesSlice.ts` | Список услуг, корзина |
| order | `orderSlice.ts` | Заявки, CRUD операции |

### Функциональность

- ✅ Авторизация/Регистрация пользователей
- ✅ JWT токены в localStorage
- ✅ Переключение интерфейса Гость/Пользователь
- ✅ Добавление услуг в заявку
- ✅ Просмотр/редактирование заявки
- ✅ Формирование заявки
- ✅ Список заявок пользователя
- ✅ Иконка корзины со счётчиком
- ✅ Кодогенерация API из Swagger
- ✅ CORS настройка на бэкенде

---

## Ответы на контрольные вопросы

### 1. Схема Redux Toolkit (reducer, store, middleware)

```
┌─────────────────────────────────────────────────────────────────┐
│                         REDUX STORE                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     State                                │    │
│  │  { user: {...}, services: {...}, order: {...} }         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
         ▲                                           │
         │                                           │
         │ dispatch(action)                          │ useSelector()
         │                                           ▼
┌─────────────────┐                      ┌─────────────────────┐
│   Component     │◄─────────────────────│    Component        │
│  (dispatches)   │                      │    (subscribes)     │
└─────────────────┘                      └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Thunk     │→ │   Logger    │→ │   DevTools Extension    │ │
│  │ (async ops) │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REDUCERS                                  │
│  ┌────────────┐  ┌────────────────┐  ┌──────────────────────┐  │
│  │ userSlice  │  │ servicesSlice  │  │    orderSlice        │  │
│  │  reducer   │  │    reducer     │  │      reducer         │  │
│  └────────────┘  └────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Reducer** — чистая функция, принимающая текущее состояние и action, возвращающая новое состояние:

```typescript
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.username = action.payload.username;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
    }
  }
});
```

**Store** — централизованное хранилище состояния приложения:

```typescript
export const store = configureStore({
  reducer: {
    user: userReducer,
    services: servicesReducer,
    order: orderReducer,
  },
});
```

**Middleware** — функции, перехватывающие actions между dispatch и reducer:

```typescript
// Thunk middleware позволяет dispatch асинхронных функций
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    const response = await api.auth.login(credentials);
    return response.data;
  }
);
```

### 2. useContext

**useContext** — React хук для доступа к данным контекста без prop drilling.

```typescript
// Создание контекста
const ThemeContext = React.createContext('light');

// Провайдер в родительском компоненте
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// Использование в дочернем компоненте
const theme = useContext(ThemeContext); // 'dark'
```

**Отличие от Redux:**
- useContext подходит для простых данных (тема, язык, текущий пользователь)
- Redux лучше для сложного состояния с частыми обновлениями
- Redux имеет DevTools для отладки

### 3. Axios

**Axios** — HTTP-клиент для браузера и Node.js.

**Основные возможности:**

```typescript
// GET запрос
const response = await axios.get('/api/services');

// POST запрос с данными
const response = await axios.post('/api/auth/login', {
  username: 'user',
  password: 'pass'
});

// Interceptors для добавления токена
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Редирект на логин
    }
    return Promise.reject(error);
  }
);
```

### 4. Local Storage

**localStorage** — синхронное хранилище key-value в браузере.

**Характеристики:**
- Данные сохраняются после закрытия браузера
- Ограничение ~5-10 MB
- Доступен только на том же origin (домен + порт + протокол)
- Данные хранятся как строки

**Методы:**

```typescript
// Сохранение
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// Получение
const token = localStorage.getItem('token');

// Удаление одного ключа
localStorage.removeItem('token');

// Очистка всего storage
localStorage.clear();

// Сохранение объекта
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Ivan' }));

// Получение объекта
const user = JSON.parse(localStorage.getItem('user') || '{}');
```

**Использование для авторизации:**

```typescript
// При успешном логине
const loginUser = createAsyncThunk('user/login', async (credentials) => {
  const response = await api.auth.login(credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
});

// При выходе
const logoutUser = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('token');
  await api.auth.logout();
});

// При загрузке приложения - восстановление сессии
const token = localStorage.getItem('token');
if (token) {
  dispatch(restoreSession(token));
}
```

---

## Activity диаграмма

### Как построить Activity диаграмму (BPMN)

Activity диаграмма описывает бизнес-процесс системы с разделением на роли (дорожки/swimlanes).

#### Основные элементы:

| Элемент | Символ | Описание |
|---------|--------|----------|
| Начало | ● (чёрный круг) | Точка входа в процесс |
| Конец | ◉ (круг в круге) | Завершение процесса |
| Действие | ▭ (прямоугольник со скруглёнными углами) | Операция/шаг |
| Решение | ◇ (ромб) | Условный переход (да/нет) |
| Параллельность | ═ (жирная линия) | Fork/Join параллельных потоков |
| Дорожка | Вертикальная/горизонтальная полоса | Роль/актор |

#### Пример для системы лицензирования:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ACTIVITY DIAGRAM: Оформление заявки                  │
├───────────────────┬───────────────────────┬─────────────────────────────────┤
│       Гость       │   Авторизованный      │         Система/Сервис          │
│                   │     пользователь      │                                 │
├───────────────────┼───────────────────────┼─────────────────────────────────┤
│                   │                       │                                 │
│        ●          │                       │                                 │
│        │          │                       │                                 │
│        ▼          │                       │                                 │
│  ┌───────────┐    │                       │                                 │
│  │ Просмотр  │    │                       │                                 │
│  │  услуг    │    │                       │                                 │
│  └─────┬─────┘    │                       │                                 │
│        │          │                       │                                 │
│        ▼          │                       │                                 │
│      ◇────────────┼───────────────────────┼──────────────────────┐          │
│  Авторизован?     │                       │                      │          │
│   Нет │           │                       │                      │          │
│       ▼           │                       │                      ▼          │
│  ┌───────────┐    │                       │              ┌──────────────┐   │
│  │   Вход/   │    │                       │              │  Проверка    │   │
│  │Регистрация│────┼───────────────────────┼──────────────│  credentials │   │
│  └───────────┘    │                       │              └──────┬───────┘   │
│                   │                       │                     │           │
│                   │   Да                  │                     ▼           │
│      ◇────────────┼───────────────────────┼──────────────── ◇               │
│                   │                       │            Валидны?             │
│                   │                       │         Нет │     │ Да          │
│                   │                       │             ▼     │             │
│                   │                       │      ┌──────────┐ │             │
│                   │                       │      │  Ошибка  │ │             │
│                   │                       │      │  входа   │ │             │
│                   │                       │      └──────────┘ │             │
│                   │       ◄───────────────┼───────────────────┘             │
│                   │       │               │                                 │
│                   │       ▼               │                                 │
│                   │  ┌───────────┐        │                                 │
│                   │  │ Добавить  │        │                                 │
│                   │  │ услугу в  │────────┼────────────────────┐            │
│                   │  │  заявку   │        │                    ▼            │
│                   │  └───────────┘        │           ┌──────────────┐      │
│                   │       │               │           │   Создать/   │      │
│                   │       │               │           │   обновить   │      │
│                   │       │               │           │   черновик   │      │
│                   │       │               │           └──────┬───────┘      │
│                   │       ◄───────────────┼──────────────────┘              │
│                   │       │               │                                 │
│                   │       ▼               │                                 │
│                   │  ┌───────────┐        │                                 │
│                   │  │ Просмотр  │        │                                 │
│                   │  │  заявки   │        │                                 │
│                   │  └─────┬─────┘        │                                 │
│                   │        │              │                                 │
│                   │        ▼              │                                 │
│                   │      ◇               │                                 │
│                   │  Сформировать?        │                                 │
│                   │   Да │     │ Нет      │                                 │
│                   │      ▼     └─────────►│ (продолжить покупки)            │
│                   │  ┌───────────┐        │                                 │
│                   │  │Сформировать│───────┼───────────────────┐             │
│                   │  │  заявку   │        │                   ▼             │
│                   │  └───────────┘        │          ┌──────────────┐       │
│                   │       │               │          │   Изменить   │       │
│                   │       │               │          │   статус на  │       │
│                   │       │               │          │ "Сформирован"│       │
│                   │       │               │          └──────┬───────┘       │
│                   │       ◄───────────────┼─────────────────┘               │
│                   │       │               │                                 │
│                   │       ▼               │                                 │
│                   │      ◉               │                                 │
│                   │                       │                                 │
└───────────────────┴───────────────────────┴─────────────────────────────────┘
```

#### Инструменты для создания:

1. **draw.io (diagrams.net)** — бесплатный онлайн-редактор
2. **StarUML** — профессиональный UML редактор
3. **PlantUML** — текстовое описание диаграмм
4. **Lucidchart** — онлайн-инструмент для диаграмм

#### Шаги создания:

1. Определить роли (Гость, Пользователь, Система/Модератор)
2. Создать 3 вертикальные дорожки (swimlanes)
3. Добавить начальную точку в первой роли
4. Последовательно добавить действия (прямоугольники)
5. Добавить точки принятия решений (ромбы)
6. Соединить элементы стрелками
7. Добавить конечную точку

---

## Верстка страницы одной услуги

### Текущая реализация (React + TypeScript)

**Файл: `src/pages/ServiceDetail/ServiceDetailPage.tsx`**

```tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { getServiceById } from "../../api/servicesApi";
import type { LicenseService } from "../../types/ServiceTypes";
import "./ServiceDetail.css";

const LICENSE_TYPE_LABELS: Record<string, string> = {
  per_user: "Лицензирование по пользователям",
  per_core: "Лицензирование по ядрам CPU",
  subscription: "Годовая подписка",
};

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [service, setService] = useState<LicenseService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getServiceById(id);
        setService(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !service) return <ErrorState />;

  return (
    <div className="service-detail-page">
      <BreadCrumbs crumbs={[
        { label: ROUTE_LABELS.SERVICES, path: ROUTES.SERVICES },
        { label: service.name },
      ]} />

      <div className="service-detail-container">
        <div className="service-detail-card">
          <div className="card-icon">
            <img src={imageUrl} alt={service.name} />
          </div>
          
          <h1 className="card-title">{service.name}</h1>
          <p className="card-desc">{service.description}</p>
          
          <div className="card-info">
            <div className="card-license-type">
              {LICENSE_TYPE_LABELS[service.license_type]}
            </div>
            <div className="card-price">
              Базовая цена: {service.base_price.toLocaleString()} руб.
            </div>
          </div>
          
          <button className="card-btn" onClick={() => navigate(ROUTES.SERVICES)}>
            Назад к списку
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Файл: `src/pages/ServiceDetail/ServiceDetail.css`**

```css
.service-detail-page {
  padding: 40px 20px 80px;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.service-detail-container {
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.service-detail-card {
  background: white;
  border-radius: 32px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.card-icon {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-title {
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 700;
  color: #333;
}

.card-desc {
  color: #5c5c5c;
  font-size: 16px;
  line-height: 1.8;
  text-align: left;
  width: 100%;
}

.card-info {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card-license-type {
  font-size: 16px;
  color: #505050;
  padding: 16px;
  background: #f4f6fb;
  border-radius: 16px;
}

.card-price {
  font-size: 20px;
  font-weight: 700;
  color: #1b1b1b;
  padding: 16px;
  background: #fff5d9;
  border-radius: 16px;
}

.card-btn {
  padding: 0 40px;
  height: 60px;
  border-radius: 25px;
  font-size: 24px;
  font-weight: 500;
  background: #FFCD00;
  border: none;
  cursor: pointer;
}
```

---

### React Native версия

**Файл: `ServiceDetailScreen.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getServiceById } from '../api/servicesApi';
import type { LicenseService } from '../types/ServiceTypes';

// Типы для навигации
type RootStackParamList = {
  Services: undefined;
  ServiceDetail: { id: string };
};

type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServiceDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const LICENSE_TYPE_LABELS: Record<string, string> = {
  per_user: 'Лицензирование по пользователям',
  per_core: 'Лицензирование по ядрам CPU',
  subscription: 'Годовая подписка',
};

export const ServiceDetailScreen: React.FC = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;

  const [service, setService] = useState<LicenseService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getServiceById(id);
        setService(data);
        setError(false);
      } catch (err) {
        console.error('Failed to load service:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  // Состояние загрузки
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFCD00" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  // Состояние ошибки
  if (error || !service) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Услуга не найдена</Text>
        <Text style={styles.errorText}>
          К сожалению, запрашиваемая услуга не существует или была удалена.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Вернуться к списку услуг</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const STORAGE_BASE = 'http://localhost:9000';
  const placeholder = require('../assets/placeholder.png');

  const imageSource = service.image_url
    ? { uri: service.image_url.startsWith('http')
        ? service.image_url
        : `${STORAGE_BASE}/license-images/${service.image_url}` }
    : placeholder;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Хлебные крошки */}
      <View style={styles.breadcrumbs}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.breadcrumbLink}>Услуги</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumbSeparator}> / </Text>
        <Text style={styles.breadcrumbCurrent}>{service.name}</Text>
      </View>

      {/* Карточка услуги */}
      <View style={styles.card}>
        {/* Изображение */}
        <View style={styles.imageContainer}>
          <Image
            source={imgError ? placeholder : imageSource}
            style={styles.image}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        </View>

        {/* Название */}
        <Text style={styles.title}>{service.name}</Text>

        {/* Описание */}
        <Text style={styles.description}>{service.description}</Text>

        {/* Информационные блоки */}
        <View style={styles.infoContainer}>
          {/* Тип лицензии */}
          <View style={styles.licenseTypeBlock}>
            <Text style={styles.licenseTypeText}>
              {LICENSE_TYPE_LABELS[service.license_type] || service.license_type}
            </Text>
          </View>

          {/* Цена */}
          <View style={styles.priceBlock}>
            <Text style={styles.priceText}>
              Базовая цена: {service.base_price.toLocaleString('ru-RU')} руб.
            </Text>
          </View>
        </View>

        {/* Кнопка возврата */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Назад к списку</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  // Хлебные крошки
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  breadcrumbLink: {
    fontSize: 14,
    color: '#FFCD00',
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 8,
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },

  // Карточка
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
  },

  // Изображение
  imageContainer: {
    width: 180,
    height: 180,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Заголовок
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Описание
  description: {
    fontSize: 16,
    color: '#5c5c5c',
    lineHeight: 26,
    textAlign: 'left',
    width: '100%',
    marginBottom: 20,
  },

  // Информационные блоки
  infoContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  licenseTypeBlock: {
    backgroundColor: '#f4f6fb',
    borderRadius: 16,
    padding: 16,
  },
  licenseTypeText: {
    fontSize: 16,
    color: '#505050',
    textAlign: 'center',
  },
  priceBlock: {
    backgroundColor: '#fff5d9',
    borderRadius: 16,
    padding: 16,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b1b1b',
    textAlign: 'center',
  },

  // Кнопка
  backButton: {
    backgroundColor: '#FFCD00',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 200,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },

  // Загрузка
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },

  // Ошибка
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});

export default ServiceDetailScreen;
```

---

### Swift (SwiftUI) версия

**Файл: `ServiceDetailView.swift`**

```swift
import SwiftUI

// MARK: - Модель данных
struct LicenseService: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String
    let imageUrl: String?
    let basePrice: Int
    let licenseType: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case description
        case imageUrl = "image_url"
        case basePrice = "base_price"
        case licenseType = "license_type"
    }
}

// MARK: - ViewModel
class ServiceDetailViewModel: ObservableObject {
    @Published var service: LicenseService?
    @Published var isLoading = true
    @Published var error: String?
    
    private let storageBase = "http://localhost:9000"
    
    func loadService(id: Int) async {
        await MainActor.run {
            isLoading = true
            error = nil
        }
        
        do {
            let url = URL(string: "http://localhost:8080/api/services/\(id)")!
            let (data, _) = try await URLSession.shared.data(from: url)
            let service = try JSONDecoder().decode(LicenseService.self, from: data)
            
            await MainActor.run {
                self.service = service
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.error = "Не удалось загрузить услугу"
                self.isLoading = false
            }
        }
    }
    
    func imageURL(for service: LicenseService) -> URL? {
        guard let imageUrl = service.imageUrl else { return nil }
        if imageUrl.hasPrefix("http") {
            return URL(string: imageUrl)
        }
        return URL(string: "\(storageBase)/license-images/\(imageUrl)")
    }
    
    func licenseTypeLabel(for type: String) -> String {
        switch type {
        case "per_user": return "Лицензирование по пользователям"
        case "per_core": return "Лицензирование по ядрам CPU"
        case "subscription": return "Годовая подписка"
        default: return type
        }
    }
    
    func formattedPrice(_ price: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.groupingSeparator = " "
        return formatter.string(from: NSNumber(value: price)) ?? "\(price)"
    }
}

// MARK: - View
struct ServiceDetailView: View {
    let serviceId: Int
    
    @StateObject private var viewModel = ServiceDetailViewModel()
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Хлебные крошки
                breadcrumbs
                
                // Контент
                if viewModel.isLoading {
                    loadingView
                } else if let error = viewModel.error {
                    errorView(message: error)
                } else if let service = viewModel.service {
                    serviceCard(service)
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 40)
        }
        .background(Color(UIColor.systemGroupedBackground))
        .navigationBarHidden(true)
        .task {
            await viewModel.loadService(id: serviceId)
        }
    }
    
    // MARK: - Хлебные крошки
    private var breadcrumbs: some View {
        HStack(spacing: 8) {
            Button(action: { dismiss() }) {
                Text("Услуги")
                    .font(.subheadline)
                    .foregroundColor(Color("AccentYellow"))
            }
            
            Text("/")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            Text(viewModel.service?.name ?? "Загрузка...")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .lineLimit(1)
            
            Spacer()
        }
        .padding(.vertical, 16)
    }
    
    // MARK: - Загрузка
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.5)
                .tint(Color("AccentYellow"))
            
            Text("Загрузка...")
                .font(.body)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 400)
    }
    
    // MARK: - Ошибка
    private func errorView(message: String) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundColor(.orange)
            
            Text("Услуга не найдена")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("К сожалению, запрашиваемая услуга не существует или была удалена.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Button(action: { dismiss() }) {
                Text("Вернуться к списку услуг")
                    .font(.headline)
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(Color("AccentYellow"))
                    .cornerRadius(28)
            }
            .padding(.top, 8)
        }
        .padding(32)
    }
    
    // MARK: - Карточка услуги
    private func serviceCard(_ service: LicenseService) -> some View {
        VStack(spacing: 20) {
            // Изображение
            serviceImage(service)
            
            // Название
            Text(service.name)
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(.primary)
                .multilineTextAlignment(.center)
            
            // Описание
            Text(service.description)
                .font(.body)
                .foregroundColor(.secondary)
                .lineSpacing(6)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            // Информационные блоки
            infoBlocks(service)
            
            // Кнопка назад
            Button(action: { dismiss() }) {
                Text("Назад к списку")
                    .font(.headline)
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .frame(height: 60)
                    .background(Color("AccentYellow"))
                    .cornerRadius(30)
            }
        }
        .padding(24)
        .background(Color.white)
        .cornerRadius(32)
        .shadow(color: .black.opacity(0.08), radius: 30, x: 0, y: 10)
    }
    
    // MARK: - Изображение услуги
    private func serviceImage(_ service: LicenseService) -> some View {
        Group {
            if let url = viewModel.imageURL(for: service) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .empty:
                        ProgressView()
                            .frame(width: 180, height: 180)
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 180, height: 180)
                    case .failure:
                        placeholderImage
                    @unknown default:
                        placeholderImage
                    }
                }
            } else {
                placeholderImage
            }
        }
    }
    
    private var placeholderImage: some View {
        Image("placeholder")
            .resizable()
            .aspectRatio(contentMode: .fit)
            .frame(width: 180, height: 180)
    }
    
    // MARK: - Информационные блоки
    private func infoBlocks(_ service: LicenseService) -> some View {
        VStack(spacing: 12) {
            // Тип лицензии
            Text(viewModel.licenseTypeLabel(for: service.licenseType))
                .font(.body)
                .foregroundColor(Color(UIColor.darkGray))
                .frame(maxWidth: .infinity)
                .padding(16)
                .background(Color(UIColor.systemGray6))
                .cornerRadius(16)
            
            // Цена
            Text("Базовая цена: \(viewModel.formattedPrice(service.basePrice)) руб.")
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.primary)
                .frame(maxWidth: .infinity)
                .padding(16)
                .background(Color("PriceBackground")) // #fff5d9
                .cornerRadius(16)
        }
    }
}

// MARK: - Preview
struct ServiceDetailView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            ServiceDetailView(serviceId: 1)
        }
    }
}

// MARK: - Цвета (добавить в Assets.xcassets)
/*
 AccentYellow: #FFCD00
 PriceBackground: #FFF5D9
*/
```

---

## Сравнение подходов

| Аспект | React Web | React Native | SwiftUI |
|--------|-----------|--------------|---------|
| Стилизация | CSS файлы | StyleSheet.create | ViewModifiers |
| Навигация | react-router-dom | @react-navigation | NavigationStack |
| Изображения | `<img>` + CSS | `<Image>` + resizeMode | AsyncImage |
| Состояние | useState/Redux | useState/Redux | @State/@StateObject |
| Загрузка | CSS spinner | ActivityIndicator | ProgressView |
| Скругления | border-radius | borderRadius | .cornerRadius() |
| Тени | box-shadow | shadow* props | .shadow() |

---

## Заключение

В рамках лабораторной работы №7 были реализованы:

1. **Авторизация и регистрация** с использованием JWT токенов
2. **Redux Toolkit** для управления состоянием приложения
3. **Кодогенерация API** из Swagger спецификации
4. **Страницы заявок** с возможностью добавления/удаления услуг
5. **Переключение интерфейсов** Гость/Авторизованный пользователь
6. **CORS** настройка на бэкенде для работы с фронтендом

Приложение демонстрирует полный цикл работы с заявками: от просмотра каталога услуг до формирования и отслеживания заявок пользователем.

---

## Activity диаграмма (Ура-сценарий)

### Бизнес-процесс: Покупка лицензии на ПО

**3 дорожки:**
1. **Создатель заявки** (Пользователь) — оформляет заказ на лицензии
2. **Модератор** — проверяет и подтверждает заявку
3. **Сервис оплаты** — обрабатывает платёж

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│          ACTIVITY DIAGRAM: Покупка лицензии (Ура-сценарий)                       │
├─────────────────────┬─────────────────────┬──────────────────────────────────────┤
│  СОЗДАТЕЛЬ ЗАЯВКИ   │     МОДЕРАТОР       │         СЕРВИС ОПЛАТЫ                │
│    (Пользователь)   │                     │                                      │
├─────────────────────┼─────────────────────┼──────────────────────────────────────┤
│                     │                     │                                      │
│         ●           │                     │                                      │
│         │           │                     │                                      │
│         ▼           │                     │                                      │
│   ┌───────────┐     │                     │                                      │
│   │  Выбрать  │     │                     │                                      │
│   │  лицензии │     │                     │                                      │
│   └─────┬─────┘     │                     │                                      │
│         │           │                     │                                      │
│         ▼           │                     │                                      │
│   ┌───────────┐     │                     │                                      │
│   │ Добавить  │     │                     │                                      │
│   │ в корзину │     │                     │                                      │
│   └─────┬─────┘     │                     │                                      │
│         │           │                     │                                      │
│         ▼           │                     │                                      │
│   ┌───────────┐     │                     │                                      │
│   │Сформировать│    │                     │                                      │
│   │  заявку   │─────┼──────►              │                                      │
│   └───────────┘     │      │              │                                      │
│         │           │      ▼              │                                      │
│         │           │ ┌───────────┐       │                                      │
│         │           │ │ Проверить │       │                                      │
│         │           │ │  заявку   │       │                                      │
│         │           │ └─────┬─────┘       │                                      │
│         │           │       │             │                                      │
│         │           │       ▼             │                                      │
│         │           │ ┌───────────┐       │                                      │
│         │           │ │Подтвердить│───────┼────────────►                         │
│         │           │ │  заявку   │       │            │                         │
│         │           │ └───────────┘       │            ▼                         │
│         │           │       │             │     ┌─────────────┐                  │
│         │           │       │             │     │  Создать    │                  │
│         │           │       │             │     │   счёт      │                  │
│         │           │       │             │     └──────┬──────┘                  │
│         │           │       │             │            │                         │
│         ◄───────────┼───────┼─────────────┼────────────┘                         │
│         │           │       │             │                                      │
│         ▼           │       │             │                                      │
│   ┌───────────┐     │       │             │                                      │
│   │  Оплатить │─────┼───────┼─────────────┼────────────►                         │
│   │   счёт    │     │       │             │            │                         │
│   └───────────┘     │       │             │            ▼                         │
│         │           │       │             │     ┌─────────────┐                  │
│         │           │       │             │     │  Принять    │                  │
│         │           │       │             │     │   оплату    │                  │
│         │           │       │             │     └──────┬──────┘                  │
│         │           │       │             │            │                         │
│         │           │       ◄─────────────┼────────────┘                         │
│         │           │       │             │                                      │
│         │           │       ▼             │                                      │
│         │           │ ┌───────────┐       │                                      │
│         │           │ │ Выдать    │       │                                      │
│         │           │ │ лицензии  │       │                                      │
│         │           │ └─────┬─────┘       │                                      │
│         │           │       │             │                                      │
│         ◄───────────┼───────┘             │                                      │
│         │           │                     │                                      │
│         ▼           │                     │                                      │
│   ┌───────────┐     │                     │                                      │
│   │ Получить  │     │                     │                                      │
│   │ лицензии  │     │                     │                                      │
│   └─────┬─────┘     │                     │                                      │
│         │           │                     │                                      │
│         ▼           │                     │                                      │
│         ◉           │                     │                                      │
│                     │                     │                                      │
└─────────────────────┴─────────────────────┴──────────────────────────────────────┘
```

### Описание ура-сценария

| Шаг | Роль | Действие |
|-----|------|----------|
| 1 | Пользователь | Выбирает лицензии из каталога |
| 2 | Пользователь | Добавляет в корзину |
| 3 | Пользователь | Формирует заявку |
| 4 | Модератор | Проверяет корректность заявки |
| 5 | Модератор | Подтверждает заявку |
| 6 | Сервис оплаты | Создаёт счёт на оплату |
| 7 | Пользователь | Оплачивает счёт |
| 8 | Сервис оплаты | Принимает и подтверждает оплату |
| 9 | Модератор | Выдаёт лицензионные ключи |
| 10 | Пользователь | Получает лицензии |

---

## React Native: Страница услуги (краткая версия для конспекта)

### Минимальный код

```tsx
// ServiceDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, 
         TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ServiceDetailScreen() {
  const { id } = useRoute().params;
  const nav = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/services/${id}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={s.center} />;
  if (!data) return <Text style={s.error}>Не найдено</Text>;

  return (
    <ScrollView style={s.container}>
      <Image source={{ uri: data.image_url }} style={s.img} />
      <Text style={s.title}>{data.name}</Text>
      <Text style={s.desc}>{data.description}</Text>
      <Text style={s.price}>{data.base_price} ₽</Text>
      <TouchableOpacity style={s.btn} onPress={() => nav.goBack()}>
        <Text style={s.btnText}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center' },
  img: { width: '100%', height: 200, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  desc: { fontSize: 16, color: '#666', marginBottom: 10 },
  price: { fontSize: 20, fontWeight: '600', color: '#000' },
  btn: { backgroundColor: '#FFCD00', padding: 16, borderRadius: 25, marginTop: 20 },
  btnText: { textAlign: 'center', fontSize: 18, fontWeight: '600' },
  error: { fontSize: 18, textAlign: 'center', marginTop: 50 },
});
```

### Ключевые отличия от React Web

| React Web | React Native |
|-----------|--------------|
| `<div>` | `<View>` |
| `<p>`, `<span>` | `<Text>` |
| `<img>` | `<Image>` |
| `<button>` | `<TouchableOpacity>` |
| CSS файлы | `StyleSheet.create()` |
| `className` | `style` |
| `onClick` | `onPress` |
| `react-router` | `@react-navigation` |
| `useParams()` | `useRoute().params` |
| `useNavigate()` | `useNavigation()` |

### Минимальные стили (для конспекта)

```tsx
const styles = StyleSheet.create({
  // Контейнеры
  container: { flex: 1, padding: 20 },
  row: { flexDirection: 'row' },
  center: { justifyContent: 'center', alignItems: 'center' },
  
  // Текст
  title: { fontSize: 24, fontWeight: 'bold' },
  text: { fontSize: 16, color: '#666' },
  
  // Изображение
  img: { width: 100, height: 100, resizeMode: 'contain' },
  
  // Кнопка
  btn: { backgroundColor: '#FFCD00', padding: 16, borderRadius: 25 },
  btnText: { textAlign: 'center', fontWeight: '600' },
  
  // Карточка
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16,
          shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
});
```

### Хуки навигации

```tsx
import { useRoute, useNavigation } from '@react-navigation/native';

// Получить параметры
const { id } = useRoute().params;

// Навигация
const nav = useNavigation();
nav.navigate('Screen', { id: 1 });  // переход
nav.goBack();                        // назад
nav.reset({ routes: [{ name: 'Home' }] }); // сброс стека
```

### Загрузка данных

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(URL)
    .then(r => r.json())
    .then(setData)
    .finally(() => setLoading(false));
}, []);
```
