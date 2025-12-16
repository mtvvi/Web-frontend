import { Api } from './Api';


const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const api = new Api({
  baseURL: API_BASE.replace(/\/$/, ''),
});

export * from './Api';
