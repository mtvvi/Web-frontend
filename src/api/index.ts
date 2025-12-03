import { Api } from './Api';

// In development, paths like /api/services are proxied by Vite to localhost:8080
// In production (GH Pages), VITE_API_BASE_URL should point to the backend server
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const api = new Api({
  baseURL: API_BASE.replace(/\/$/, ''),
});

export * from './Api';
