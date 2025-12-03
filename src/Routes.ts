export const ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  ORDERS: "/orders",
  ORDER: "/order",
}

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  SERVICES: "Услуги лицензирования",
  LOGIN: "Вход",
  REGISTER: "Регистрация",
  PROFILE: "Личный кабинет",
  ORDERS: "Мои заявки",
  ORDER: "Заявка",
};
